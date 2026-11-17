// PanCookie.js v5 - 抓取各网盘 Cookie，存入 BoxJs（$persistentStore），在 boxjs.com 里直接复制
// 配合模块 PanCookie.sgmodule 使用；BoxJs 订阅见 PanCookie.boxjs.json
// 支持：夸克 / 百度 / UC / 123 / 天翼 / 移动 / 115 / 迅雷
// v5：彻底去掉通知，只静默保存。百度 App 停在页面上每秒发请求，通知在旧脚本缓存没清掉时一定会刷屏；
//     要确认抓到了没有，直接打开 boxjs.com 看对应键有没有值，不靠通知判断
// v3：只在 Cookie 含登录字段时才保存（未登录的游客 Cookie 不存）
// 注意：HTTPS 请求必须 MITM 才能看到 Cookie；App 若有证书锁定抓不到时，改用 Safari 打开对应网盘网页版登录后刷新

(function () {
  // 网盘列表：host 正则 -> BoxJs 键名 -> 登录字段（Cookie 里必须含这些才算已登录）
  // 123 与迅雷的登录字段暂未核实（为空，先按原样保存）
  var PANS = [
    { re: /^(pan|uop|drive-pc|drive-m)\.quark\.cn$/i, key: 'PanCookie_Quark', need: ['__pus='] },
    { re: /^(pan|pcs|d\.pcs)\.baidu\.com$/i, key: 'PanCookie_Baidu', need: ['BDUSS='] },
    { re: /^drive\.uc\.cn$/i, key: 'PanCookie_UC', need: ['__puus='] },
    { re: /^(yun|www)\.123pan\.(cn|com)$/i, key: 'PanCookie_123', need: [] },
    { re: /^(cloud|api\.cloud)\.189\.cn$/i, key: 'PanCookie_189', need: ['SSON='] },
    { re: /^(yun|caiyun)\.139\.com$/i, key: 'PanCookie_139', need: ['Authorization='] },
    { re: /^([^.]+\.)*115\.com$/i, key: 'PanCookie_115', need: ['UID=', 'SEID='] },
    { re: /^pan\.xunlei\.com$/i, key: 'PanCookie_Xunlei', need: [] }
  ];

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

  // 变了就静默更新（让 MorePlay 拿到的总是最新的），不弹任何通知
  try {
    if ($persistentStore.read(pan.key) !== cookie) {
      $persistentStore.write(cookie, pan.key);
    }
  } catch (e) {
    // 存失败也不影响原请求
  }
  $done({});
})();
