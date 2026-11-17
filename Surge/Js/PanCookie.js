// PanCookie.js - 抓取夸克 / 百度网盘 Cookie，存入 BoxJs（$persistentStore），在 boxjs.com 里直接复制
// 配合模块 PanCookie.sgmodule 使用；BoxJs 订阅见 PanCookie.boxjs.json
// 注意：HTTPS 请求必须 MITM 才能看到 Cookie；App 若有证书锁定抓不到时，改用 Safari 打开 pan.quark.cn / pan.baidu.com 登录后刷新

(function () {
  var url = ($request && $request.url) || '';
  var headers = ($request && $request.headers) || {};

  // 取 Cookie 请求头（兼容对象与数组两种形式）
  var cookie = '';
  if (headers && typeof headers === 'object' && !Array.isArray(headers)) {
    cookie = headers['Cookie'] || headers['cookie'] || '';
  } else if (Array.isArray(headers)) {
    for (var i = 0; i < headers.length; i++) {
      var h = headers[i] || {};
      if (/^cookie$/i.test(h.field || '')) { cookie = h.value || ''; break; }
    }
  }

  // 没有 Cookie 就原样放行
  if (!cookie) { $done({}); return; }

  var key = '';
  var name = '';
  if (/quark\.cn/i.test(url)) { key = 'PanCookie_Quark'; name = '夸克网盘'; }
  else if (/baidu\.com/i.test(url)) { key = 'PanCookie_Baidu'; name = '百度网盘'; }
  else { $done({}); return; }

  try {
    // 只有变化时才写并通知，避免每次请求都弹通知
    if ($persistentStore.read(key) !== cookie) {
      $persistentStore.write(cookie, key);
      $notification.post('网盘 Cookie 已保存', name, '已存入 BoxJs，打开 boxjs.com 复制');
    }
  } catch (e) {
    // 存失败也不影响原请求
  }
  $done({});
})();
