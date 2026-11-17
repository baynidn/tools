// PanCookie.js v2 - 抓取各网盘 Cookie，存入 BoxJs（$persistentStore），在 boxjs.com 里直接复制
// 配合模块 PanCookie.sgmodule 使用；BoxJs 订阅见 PanCookie.boxjs.json
// 支持：夸克 / 百度 / UC / 123 / 天翼 / 移动 / 115 / 迅雷
// 注意：HTTPS 请求必须 MITM 才能看到 Cookie；App 若有证书锁定抓不到时，改用 Safari 打开对应网盘网页版登录后刷新

(function () {
  // 网盘列表：host 正则 -> BoxJs 键名 -> 显示名
  var PANS = [
    { re: /^(pan|uop|drive-pc|drive-m)\.quark\.cn$/i, key: 'PanCookie_Quark', name: '夸克网盘' },
    { re: /^(pan|pcs|d\.pcs)\.baidu\.com$/i, key: 'PanCookie_Baidu', name: '百度网盘' },
    { re: /^drive\.uc\.cn$/i, key: 'PanCookie_UC', name: 'UC网盘' },
    { re: /^(yun|www)\.123pan\.(cn|com)$/i, key: 'PanCookie_123', name: '123云盘' },
    { re: /^(cloud|api\.cloud)\.189\.cn$/i, key: 'PanCookie_189', name: '天翼云盘' },
    { re: /^(yun|caiyun)\.139\.com$/i, key: 'PanCookie_139', name: '移动云盘' },
    { re: /^([^.]+\.)*115\.com$/i, key: 'PanCookie_115', name: '115网盘' },
    { re: /^pan\.xunlei\.com$/i, key: 'PanCookie_Xunlei', name: '迅雷云盘' }
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

  try {
    // 只有变化时才写并通知，避免每次请求都弹通知
    if ($persistentStore.read(pan.key) !== cookie) {
      $persistentStore.write(cookie, pan.key);
      $notification.post('网盘 Cookie 已保存', pan.name, '已存入 BoxJs，打开 boxjs.com 复制');
    }
  } catch (e) {
    // 存失败也不影响原请求
  }
  $done({});
})();
