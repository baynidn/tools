#!/usr/bin/env python3
"""微信视频号 / Bilibili / 抖音下载服务 - 路由器版（纯标准库，无需 Flask/pip）
粘贴分享链接，两种保存方式：
  1. 下载到路由器：解析 -> 下载 MP4 -> 存到 /data
  2. 下载到手机/本地：解析 -> 流式转发给浏览器，存到手机，不存路由器
支持：微信视频号（weixin.qq.com/sph/...）、Bilibili（bilibili.com/video/BV... / b23.tv/...）、抖音（douyin.com/video/... / v.douyin.com/... / jingxuan?modal_id=...）。
解析走 CukeDown 公开解析接口，无需登录、无需 Cookie。个别抖音视频若作者限制分享或仅登录可见会解析失败。
启动：python3 app.py   环境变量：WXDL_DATA（默认 /data）、WXDL_PASSWORD（空=不设密码）、PORT（默认 5000）
"""
import json
import os
import re
import threading
import time
import urllib.parse
import urllib.request
from datetime import datetime
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

DATA_DIR = Path(os.environ.get("WXDL_DATA", "/data"))
DATA_DIR.mkdir(parents=True, exist_ok=True)
PASSWORD = os.environ.get("WXDL_PASSWORD", "")
PORT = int(os.environ.get("PORT", "5000"))

PARSE_API = "https://cuke.io/api/omni/parse/stream"
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"

jobs = {}  # job_id -> {status, title, author, filename, size, error, progress}
job_lock = threading.Lock()

URL_RES = [
    (re.compile(r"https?://weixin\.qq\.com/sph/[A-Za-z0-9]+", re.I), "https://channels.weixin.qq.com/"),
    (re.compile(r"https?://(?:www\.)?bilibili\.com/video/(?:BV[A-Za-z0-9]+|av\d+)", re.I), "https://www.bilibili.com/"),
    (re.compile(r"https?://b23\.tv/[A-Za-z0-9]+", re.I), "https://www.bilibili.com/"),
    (re.compile(r"https?://(?:www\.)?douyin\.com/video/\d+", re.I), "https://www.douyin.com/"),
    (re.compile(r"https?://v\.douyin\.com/[A-Za-z0-9]+", re.I), "https://www.douyin.com/"),
    (re.compile(r"https?://(?:www\.)?douyin\.com/jingxuan\?modal_id=\d+", re.I), "https://www.douyin.com/"),
    (re.compile(r"https?://(?:www\.)?iesdouyin\.com/share/video/\d+", re.I), "https://www.douyin.com/"),
]


def extract_link(text):
    """从粘贴的文本里找出支持的视频链接，返回 (url, referer)，找不到返回 (None, None)。"""
    for pat, ref in URL_RES:
        m = pat.search(text)
        if m:
            return m.group(0), ref
    return None, None
UNSAFE = re.compile(r'[<>:"/\\|?*\x00-\x1f]+')
EMOJI = re.compile(
    "[\U0001F300-\U0001F9FF\U00002600-\U000027BF\U0000FE00-\U0000FE0F\U0001F1E0-\U0001F1FF]+",
    flags=re.UNICODE,
)


def safe_filename(author, title):
    author = EMOJI.sub("", (author or "未知作者").strip())[:20] or "未知作者"
    desc = EMOJI.sub("", (title or "").strip().split("\n")[0])[:30]
    desc = UNSAFE.sub("_", desc).strip("._# ") or "视频"
    return f"{author}_{desc}.mp4"


def get_parse_token():
    """先调 /api/omni/me 拿 parse_token 和 omni_vid cookie。
    CukeDown 2026-11-25 起加了页面校验：解析接口必须带 pt 参数，否则 403
    "页面校验已过期或非法调用"。token 12 小时过期，每次下载前现取。"""
    req = urllib.request.Request(
        "https://cuke.io/api/omni/me",
        headers={"Referer": "https://cuke.io/", "User-Agent": UA},
    )
    with urllib.request.urlopen(req, timeout=30) as resp:
        cookie = (resp.headers.get("Set-Cookie") or "").split(";")[0]
        data = json.loads(resp.read().decode("utf-8"))
    token = data.get("parse_token") or ""
    if not token:
        raise RuntimeError("没拿到解析凭证")
    return token, cookie


def parse_link(share_url):
    """调用 CukeDown 解析接口，返回 {video_url, title, author}。通用，支持视频号/B站/抖音。"""
    token, cookie = get_parse_token()
    q = urllib.parse.quote(share_url, safe="")
    pt = urllib.parse.quote(token, safe="")
    url = f"{PARSE_API}?url={q}&pt={pt}"
    headers = {
        "Accept": "text/event-stream",
        "Referer": "https://cuke.io/",
        "User-Agent": UA,
    }
    if cookie:
        headers["Cookie"] = cookie
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, timeout=90) as resp:
        for raw in resp:
            line = raw.decode("utf-8", errors="replace").strip()
            if not line.startswith("data: "):
                continue
            try:
                msg = json.loads(line[6:])
            except json.JSONDecodeError:
                continue
            if msg.get("type") != "result":
                continue
            data = (msg.get("result") or {}).get("data") or {}
            video_url = data.get("video_url") or ""
            if not video_url:
                fmts = data.get("formats") or []
                for f in fmts:
                    if f.get("url"):
                        video_url = f["url"]
                        break
            if not video_url:
                raise RuntimeError("解析结果里没有视频地址，链接可能失效")
            author = (data.get("author") or {}).get("name") or ""
            return {
                "video_url": video_url,
                "title": data.get("title") or "",
                "author": author,
            }
    raise RuntimeError("解析超时或无结果")


def download_file(url, dest, job_id, referer):
    req = urllib.request.Request(
        url,
        headers={
            "Referer": referer,
            "User-Agent": UA,
        },
    )
    with urllib.request.urlopen(req, timeout=180) as resp, open(dest, "wb") as f:
        total = int(resp.headers.get("Content-Length") or 0)
        done = 0
        while True:
            chunk = resp.read(1024 * 256)
            if not chunk:
                break
            f.write(chunk)
            done += len(chunk)
            if total:
                with job_lock:
                    jobs[job_id]["progress"] = round(done / total * 100, 1)
    return dest


def run_job(job_id, share_url, referer):
    try:
        with job_lock:
            jobs[job_id]["status"] = "解析中"
        info = parse_link(share_url)
        with job_lock:
            jobs[job_id].update(
                {"status": "下载中", "title": info["title"], "author": info["author"]}
            )
        name = safe_filename(info["author"], info["title"])
        dest = DATA_DIR / name
        n = 1
        while dest.exists():
            stem = dest.stem
            dest = DATA_DIR / f"{stem}_{n}.mp4"
            n += 1
        download_file(info["video_url"], dest, job_id, referer)
        with open(dest, "rb") as f:
            head = f.read(16)
        if b"ftyp" not in head and b"mp4" not in head.lower():
            dest.unlink(missing_ok=True)
            raise RuntimeError("下载的文件不是有效 MP4")
        with job_lock:
            jobs[job_id].update(
                {
                    "status": "完成",
                    "filename": dest.name,
                    "size": dest.stat().st_size,
                    "progress": 100,
                }
            )
    except Exception as e:
        with job_lock:
            jobs[job_id].update({"status": "失败", "error": str(e)})


LOGIN_HTML = """<!DOCTYPE html><html lang="zh-CN"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>视频下载 - 登录</title><style>
body{font-family:-apple-system,system-ui,sans-serif;max-width:480px;margin:60px auto;padding:0 16px}
input,button{font-size:17px;padding:12px;width:100%;box-sizing:border-box;margin-top:10px}
button{background:#07c160;color:#fff;border:0;border-radius:8px}
</style></head><body><h2>视频下载</h2>
<form method="post" action="/api/login"><input type="password" name="pw" placeholder="输入密码" required>
<button>登录</button></form></body></html>"""

PAGE = """<!DOCTYPE html><html lang="zh-CN"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>视频下载</title><style>
body{font-family:-apple-system,system-ui,sans-serif;max-width:640px;margin:0 auto;padding:16px}
input,button{font-size:17px;padding:12px;width:100%;box-sizing:border-box}
button{background:#07c160;color:#fff;border:0;border-radius:8px;margin-top:10px}
#status{margin-top:12px;color:#333;white-space:pre-wrap}
.item{border-top:1px solid #eee;padding:10px 0}
.item a{color:#07c160;text-decoration:none}
.muted{color:#888;font-size:13px}
</style></head><body>
<h2>视频下载</h2>
<p class="muted">粘贴分享链接，选存在路由器还是存到手机。支持微信视频号、B站、抖音。</p>
<input id="url" placeholder="粘贴视频号 / B站 / 抖音链接">
<button onclick="dl()">下载到路由器</button>
<button onclick="localDl()" style="background:#57606a">下载到手机（不存路由器）</button>
<div id="status"></div>
<h3>已下载（路由器上）</h3><div id="list">加载中…</div>
<script>
function localDl(){
  const url=document.getElementById('url').value.trim();
  if(!url){document.getElementById('status').textContent='先粘贴链接';return;}
  document.getElementById('status').textContent='正在解析，解析完开始下载到手机…';
  window.location.href='/api/local?url='+encodeURIComponent(url);
}
async function dl(){
  const url=document.getElementById('url').value.trim();
  if(!url){document.getElementById('status').textContent='先粘贴链接';return;}
  document.getElementById('status').textContent='解析下载中，请稍等…';
  const r=await fetch('/api/download',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({url})});
  const j=await r.json();
  if(!j.ok){document.getElementById('status').textContent='失败：'+(j.error||'未知错误');return;}
  poll(j.job_id);
}
async function poll(id){
  const r=await fetch('/api/job/'+id); const j=await r.json();
  let t='状态：'+j.status;
  if(j.title) t+='\\n'+(j.author||'')+' '+j.title;
  if(j.progress!=null) t+='\\n进度：'+j.progress+'%';
  if(j.status==='完成') t+='\\n已保存：'+j.filename+'（'+(j.size/1048576).toFixed(1)+' MB）';
  if(j.status==='失败') t+='\\n原因：'+(j.error||'');
  document.getElementById('status').textContent=t;
  if(j.status==='解析中'||j.status==='下载中') setTimeout(()=>poll(id),1500);
  else load();
}
async function load(){
  const r=await fetch('/api/list'); const j=await r.json();
  const el=document.getElementById('list');
  if(!j.files.length){el.textContent='还没有下载的视频';return;}
  el.innerHTML=j.files.map(f=>'<div class="item"><a href="/videos/'+encodeURIComponent(f.name)+'">'+f.name+'</a><div class="muted">'+(f.size/1048576).toFixed(1)+' MB · '+f.mtime+'</div></div>').join('');
}
load();
</script></body></html>"""


class Handler(BaseHTTPRequestHandler):
    def log_message(self, fmt, *args):
        pass

    def _cookies(self):
        raw = self.headers.get("Cookie", "")
        out = {}
        for part in raw.split(";"):
            if "=" in part:
                k, v = part.strip().split("=", 1)
                out[k] = v
        return out

    def _authed(self):
        if not PASSWORD:
            return True
        return self._cookies().get("wxdl_auth") == PASSWORD

    def _send_json(self, obj, status=200, extra_headers=None):
        body = json.dumps(obj, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        if extra_headers:
            for k, v in extra_headers.items():
                self.send_header(k, v)
        self.end_headers()
        self.wfile.write(body)

    def _send_html(self, html, status=200):
        body = html.encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _need_auth(self):
        if self._authed():
            return False
        if self.path.startswith("/api/"):
            self._send_json({"ok": False, "error": "未登录"}, 401)
        else:
            self._send_html(LOGIN_HTML, 401)
        return True

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        if path == "/":
            if self._need_auth():
                return
            self._send_html(PAGE)
            return
        if path == "/api/list":
            if self._need_auth():
                return
            files = []
            for p in sorted(
                DATA_DIR.glob("*.mp4"), key=lambda x: x.stat().st_mtime, reverse=True
            ):
                st = p.stat()
                files.append(
                    {
                        "name": p.name,
                        "size": st.st_size,
                        "mtime": datetime.fromtimestamp(st.st_mtime).strftime(
                            "%Y-%m-%d %H:%M"
                        ),
                    }
                )
            self._send_json({"ok": True, "files": files})
            return
        if path.startswith("/api/job/"):
            if self._need_auth():
                return
            job_id = path[len("/api/job/"):]
            with job_lock:
                j = jobs.get(job_id)
            if not j:
                self._send_json({"ok": False, "error": "任务不存在"}, 404)
                return
            self._send_json({"ok": True, **j})
            return
        if path == "/api/local":
            if self._need_auth():
                return
            qs = urllib.parse.parse_qs(parsed.query)
            text = (qs.get("url") or [""])[0]
            link, referer = extract_link(text)
            if not link:
                self._send_json(
                    {"ok": False, "error": "没找到支持的视频链接（视频号 / B站 / 抖音）"},
                    400,
                )
                return
            try:
                info = parse_link(link)
            except Exception as e:
                self._send_json({"ok": False, "error": str(e)}, 502)
                return
            filename = safe_filename(info["author"], info["title"])
            quoted = urllib.parse.quote(filename)
            req = urllib.request.Request(
                info["video_url"],
                headers={"Referer": referer, "User-Agent": UA},
            )
            try:
                resp = urllib.request.urlopen(req, timeout=180)
            except Exception as e:
                self._send_json({"ok": False, "error": str(e)}, 502)
                return
            self.send_response(200)
            self.send_header("Content-Type", "video/mp4")
            self.send_header(
                "Content-Disposition", f"attachment; filename*=UTF-8''{quoted}"
            )
            length = resp.headers.get("Content-Length")
            if length:
                self.send_header("Content-Length", length)
            self.end_headers()
            try:
                while True:
                    chunk = resp.read(1024 * 256)
                    if not chunk:
                        break
                    self.wfile.write(chunk)
            finally:
                resp.close()
            return
        if path.startswith("/videos/"):
            if self._need_auth():
                return
            name = urllib.parse.unquote(path[len("/videos/"):])
            fp = DATA_DIR / name
            if not fp.is_file() or fp.suffix.lower() != ".mp4":
                self._send_json({"ok": False, "error": "文件不存在"}, 404)
                return
            size = fp.stat().st_size
            self.send_response(200)
            self.send_header("Content-Type", "video/mp4")
            self.send_header("Content-Length", str(size))
            self.send_header(
                "Content-Disposition",
                f"inline; filename*=UTF-8''{urllib.parse.quote(name)}",
            )
            self.end_headers()
            with open(fp, "rb") as f:
                while True:
                    chunk = f.read(1024 * 256)
                    if not chunk:
                        break
                    self.wfile.write(chunk)
            return
        self._send_json({"ok": False, "error": "not found"}, 404)

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        length = int(self.headers.get("Content-Length") or 0)
        raw = self.rfile.read(length) if length else b""
        if path == "/api/login":
            try:
                data = json.loads(raw.decode("utf-8") or "{}")
                pw = data.get("pw")
            except Exception:
                pw = None
            if pw is None:
                form = urllib.parse.parse_qs(raw.decode("utf-8", errors="replace"))
                pw = (form.get("pw") or [""])[0]
            if PASSWORD and pw == PASSWORD:
                self._send_json(
                    {"ok": True},
                    extra_headers={
                        "Set-Cookie": f"wxdl_auth={PASSWORD}; Max-Age={30*86400}; HttpOnly; Path=/"
                    },
                )
            else:
                self._send_json({"ok": False, "error": "密码不对"}, 401)
            return
        if path == "/api/download":
            if self._need_auth():
                return
            try:
                data = json.loads(raw.decode("utf-8") or "{}")
            except Exception:
                data = {}
            text = data.get("url", "")
            link, referer = extract_link(text)
            if not link:
                self._send_json(
                    {"ok": False, "error": "没找到支持的视频链接（视频号 / B站 / 抖音）"}
                )
                return
            job_id = f"{int(time.time()*1000)}"
            with job_lock:
                jobs[job_id] = {"status": "等待", "progress": 0}
            threading.Thread(
                target=run_job, args=(job_id, link, referer), daemon=True
            ).start()
            self._send_json({"ok": True, "job_id": job_id})
            return
        self._send_json({"ok": False, "error": "not found"}, 404)


if __name__ == "__main__":
    server = ThreadingHTTPServer(("0.0.0.0", PORT), Handler)
    print(f"wxdl listening on 0.0.0.0:{PORT}, data={DATA_DIR}", flush=True)
    server.serve_forever()
