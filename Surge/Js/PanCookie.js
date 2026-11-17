// PanCookie.js v6 - 抓取各网盘 Cookie，存入 BoxJs（$persistentStore），在 boxjs.com 里直接复制
// 配合模块 PanCookie.sgmodule 使用；BoxJs 订阅见 PanCookie.boxjs.json
// 支持：夸克 / 百度 / UC / 123 / 天翼 / 移动 / 115 / 迅雷
// v6：性能修好。之前每次请求都把整条 Cookie 写入存储（百度每秒发请求，单次写入 200-450ms），手机才卡。
//     现在每次请求只做一次小比对就退出：登录字段没变就不读写整条 Cookie，只在首次保存/换号/重新登录时写一次。
//     百度在模块里已收窄到 4 个会话接口（启动/查登录状态/会员信息/文件列表），平时不触发；其余各家仍按域名触发，但同样只比登录字段。
// v5：彻底去掉通知，只静默保存；要确认抓到了没有，直接打开 boxjs.com 看对应键有没有值
// v3：只在 Cookie 含登录字段时才保存（未登录的游客 Cookie 不存）
// 注意：HTTPS 请求必须 MITM 才能看到 Cookie；App 若有证书锁定抓不到时，改用 Safari 打开对应网盘网页版登录后刷新

(function () {
  // 网盘列表：host 正则 -> BoxJs 键名 -> 登录字段（Cookie 里必须含这些才算已登录；也是“写不写”的比对依据）
  // 123 与迅雷的登录字段暂未核实（为空，退回整条哈希比对）
  var PANS = [
    { re: /^(pan|uop|drive-pc|drive-m)\.quark\.cn$/i, key: 'PanCookie_Quark', need: ['__pus='], login: ['__pus'] },
    { re: /^(pan|pcs|d\.pcs)\.baidu\.com$/i, key: 'PanCookie_Baidu', need: ['BDUSS='], login: ['BDUSS'] },
    { re: /^drive\.uc\.cn$/i, key: 'PanCookie_UC', need: ['__puus='], login: ['__puus'] },
    { re: /^(yun|www)\.123pan\.(cn|com)$/i, key: 'PanCookie_123', need: [], login: [] },
    { re: /^(cloud|api\.cloud)\.189\.cn$/i, key: 'PanCookie_189', need: ['SSON='], login: ['SSON'] },
    { re: /^(yun|caiyun)\.139\.com$/i, key: 'PanCookie_139', need: ['Authorization='], login: ['Authorization'] },
    { re: /^([^.]+\.)*115\.com$/i, key: 'PanCookie_115', need: ['UID=', 'SEID='], login: ['UID', 'SEID'] },
    { re: /^pan\.xunlei\.com$/i, key: 'PanCookie_Xunlei', need: [], login: [] }
  ];

  // 从 Cookie 字符串里取某个字段的值
  function fieldValue(cookie, name) {
    var m = cookie.match(new RegExp('(?:^|;\\s*)' + name + '=([^;]*)'));
    return m ? m[1] : '';
  }

  // 简单哈希（djb2）：只用来比对整条 Cookie 变没变，不存原文
  function hash(s) {
    var h = 5381;
    for (var i = 0; i < s.length; i++) { h = ((h << 5) + h + s.charCodeAt(i)) | 0; }
    return String(h);
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

  // 必须含登录字段才算已登录，否则是游客 Cookie，不存
  for (var k = 0; k < pan.need.length; k++) {
    if (cookie.indexOf(pan.need[k]) === -1) { $done({}); return; }
  }

  // “写不写”的比对键：有登录字段就只比登录字段（稳定，几乎不变）；没有就比整条哈希
  var key = '';
  if (pan.login.length) {
    var parts = [];
    for (var m = 0; m < pan.login.length; m++) parts.push(fieldValue(cookie, pan.login[m]));
    key = parts.join('|');
  } else {
    key = hash(cookie);
  }

  try {
    // 比对键没变 = 还是同一个登录，直接退出，不读写整条 Cookie
    if ($persistentStore.read(pan.key + '_Login') === key) { $done({}); return; }
    // 变了（首次保存/换号/重新登录）才写一次整条 Cookie + 新的比对键
    $persistentStore.write(cookie, pan.key);
    $persistentStore.write(key, pan.key + '_Login');
  } catch (e) {
    // 存失败也不影响原请求
  }
  $done({});
})();
