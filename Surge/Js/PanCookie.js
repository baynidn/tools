// PanCookie.js v4 - 抓取各网盘 Cookie，存入 BoxJs（$persistentStore），在 boxjs.com 里直接复制
// 配合模块 PanCookie.sgmodule 使用；BoxJs 订阅见 PanCookie.boxjs.json
// 支持：夸克 / 百度 / UC / 123 / 天翼 / 移动 / 115 / 迅雷
// v3：只在 Cookie 含登录字段时才保存（未登录的游客 Cookie 不存）
// v4：通知不再比整条 Cookie（百度等网盘的 Cookie 里有每次都变的字段，整条比对会一直弹通知）；
//     只比登录字段（换号/重新登录才通知），其余变化静默更新；再加每家 10 分钟最多弹一次的限流
// 注意：HTTPS 请求必须 MITM 才能看到 Cookie；App 若有证书锁定抓不到时，改用 Safari 打开对应网盘网页版登录后刷新

(function () {
  // 网盘列表：host 正则 -> BoxJs 键名 -> 显示名 -> 登录字段（Cookie 里必须含这些才算已登录）
  // login：决定“是不是新登录”的字段，只比这些；123 与迅雷的登录字段暂未核实（为空，先按整条比对 + 限流）
  var PANS = [
    { re: /^(pan|uop|drive-pc|drive-m)\.quark\.cn$/i, key: 'PanCookie_Quark', name: '夸克网盘', need: ['__pus='], login: ['__pus'] },
    { re: /^(pan|pcs|d\.pcs)\.baidu\.com$/i, key: 'PanCookie_Baidu', name: '百度网盘', need: ['BDUSS='], login: ['BDUSS'] },
    { re: /^drive\.uc\.cn$/i, key: 'PanCookie_UC', name: 'UC网盘', need: ['__puus='], login: ['__puus'] },
    { re: /^(yun|www)\.123pan\.(cn|com)$/i, key: 'PanCookie_123', name: '123云盘', need: [], login: [] },
    { re: /^(cloud|api\.cloud)\.189\.cn$/i, key: 'PanCookie_189', name: '天翼云盘', need: ['SSON='], login: ['SSON'] },
    { re: /^(yun|caiyun)\.139\.com$/i, key: 'PanCookie_139', name: '移动云盘', need: ['Authorization='], login: ['Authorization'] },
    { re: /^([^.]+\.)*115\.com$/i, key: 'PanCookie_115', name: '115网盘', need: ['UID=', 'SEID='], login: ['UID', 'SEID'] },
    { re: /^pan\.xunlei\.com$/i, key: 'PanCookie_Xunlei', name: '迅雷云盘', need: [], login: [] }
  ];
  var NOTIFY_INTERVAL = 10 * 60 * 1000; // 同一家 10 分钟内最多弹一次通知

  // 从 Cookie 字符串里取某个字段的值
  function fieldValue(cookie, name) {
    var m = cookie.match(new RegExp('(?:^|;\\s*)' + name + '=([^;]*)'));
    return m ? m[1] : '';
  }

  var url = ($request && $request.url) || '';
  var headers = ($request && $request.headers) || {};

  // 取 host（不依赖 URL 对象，老版本 JS 也能跑）
  var host = url.replace(/^https?:\/\//i, '').split('/')[0].split(':')[0];

  // 找到是哪个网盘；不在列表里就原样放行
  var pan = null;
  for (var i = 0; i < PANS.length; i++) {
    if (PANS[i].re.test(host)) { pan = PANS[i]; break; }
  }
  if (!pan) { $done({}); return; }

  // 取 Cookie 请求头（兼容对象与数组两种形式）
  var cookie = '';
  if (headers && typeof headers === 'object' && !Array.isArray(headers)) {
    cookie = headers['Cookie'] || headers['cookie'] || '';
  } else if (Array.isArray(headers)) {
    for (var j = 0; j < headers.length; j++) {
      var h = headers[j] || {};
      if (/^cookie$/i.test(h.field || '')) { cookie = h.value || ''; break; }
    }
  }

  // 没有 Cookie 就原样放行
  if (!cookie) { $done({}); return; }

  // 必须含登录字段才算已登录，否则是游客 Cookie，不存、不通知
  for (var k = 0; k < pan.need.length; k++) {
    if (cookie.indexOf(pan.need[k]) === -1) { $done({}); return; }
  }

  // “是不是新登录”：只比登录字段（123/迅雷未核实字段，退回整条比对）
  var loginKey = cookie;
  if (pan.login.length) {
    var parts = [];
    for (var m = 0; m < pan.login.length; m++) parts.push(fieldValue(cookie, pan.login[m]));
    loginKey = parts.join('|');
  }

  try {
    // 整条 Cookie 变了就静默更新（让 MorePlay 拿到的总是最新的），不弹通知
    if ($persistentStore.read(pan.key) !== cookie) {
      $persistentStore.write(cookie, pan.key);
    }
    // 只有登录字段变了（首次保存/换号/重新登录）才弹通知，且 10 分钟内最多一次
    var oldLogin = $persistentStore.read(pan.key + '_Login');
    if (oldLogin !== loginKey) {
      $persistentStore.write(loginKey, pan.key + '_Login');
      var lastNotify = parseInt($persistentStore.read(pan.key + '_NotifyAt') || '0', 10);
      var now = Date.now();
      if (now - lastNotify > NOTIFY_INTERVAL) {
        $persistentStore.write(String(now), pan.key + '_NotifyAt');
        $notification.post('网盘 Cookie 已保存', pan.name, '已存入 BoxJs，打开 boxjs.com 复制');
      }
    }
  } catch (e) {
    // 存失败也不影响原请求
  }
  $done({});
})();
