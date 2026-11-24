#!/usr/bin/env python3
"""微信视频号下载服务 - 路由器版
粘贴 weixin.qq.com/sph/... 链接，两种保存方式：
  1. 下载到路由器：解析 -> 下载 MP4 -> 存到 /data
  2. 下载到手机/本地：解析 -> 流式转发给浏览器，存到手机，不存路由器
解析走 CukeDown 公开解析接口，无需登录、无需 Cookie。
"""
import json
import os
import re
import threading
import time
import urllib.parse
import urllib.request
from datetime import datetime
from pathlib import Path

from flask import Flask, Response, jsonify, request, send_from_directory, stream_with_context

DATA_DIR = Path(os.environ.get("WXDL_DATA", "/data"))
DATA_DIR.mkdir(parents=True, exist_ok=True)
PASSWORD = os.environ.get("WXDL_PASSWORD", "")
PORT = int(os.environ.get("PORT", "5000"))

PARSE_API = "https://cuke.io/api/omni/parse/stream"
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"

app = Flask(__name__)
jobs = {}  # job_id -> {status, title, author, filename, size, error, progress}
job_lock = threading.Lock()

SPH_RE = re.compile(r"https?://weixin\.qq\.com/sph/[A-Za-z0-9]+", re.I)
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


def parse_sph(share_url):
    """调用 CukeDown 解析接口，返回 {video_url, title, author}。"""
    q = urllib.parse.quote(share_url, safe="")
    url = f"{PARSE_API}?url={q}"
    req = urllib.request.Request(
        url,
        headers={
            "Accept": "text/event-stream",
            "Referer": "https://cuke.io/",
            "User-Agent": UA,
        },
    )
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


def download_file(url, dest, job_id):
    req = urllib.request.Request(
        url,
        headers={
            "Referer": "https://channels.weixin.qq.com/",
            "User-Agent": UA,
        },
    )
    with urllib.request.urlopen(req, timeout=120) as resp, open(dest, "wb") as f:
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


def run_job(job_id, share_url):
    try:
        with job_lock:
            jobs[job_id]["status"] = "解析中"
        info = parse_sph(share_url)
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
        download_file(info["video_url"], dest, job_id)
        # 校验是有效 MP4
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


def authed():
    if not PASSWORD:
        return True
    return request.cookies.get("wxdl_auth") == PASSWORD


@app.before_request
def _auth():
    if request.path in ("/login", "/api/login"):
        return None
    if not authed():
        if request.path.startswith("/api/"):
            return jsonify({"ok": False, "error": "未登录"}), 401
        return LOGIN_HTML, 401


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
<title>视频号下载</title><style>
body{font-family:-apple-system,system-ui,sans-serif;max-width:640px;margin:0 auto;padding:16px}
input,button{font-size:17px;padding:12px;width:100%;box-sizing:border-box}
button{background:#07c160;color:#fff;border:0;border-radius:8px;margin-top:10px}
#status{margin-top:12px;color:#333;white-space:pre-wrap}
.item{border-top:1px solid #eee;padding:10px 0}
.item a{color:#07c160;text-decoration:none}
.muted{color:#888;font-size:13px}
</style></head><body>
<h2>视频号下载</h2>
<p class="muted">粘贴微信视频号分享链接（weixin.qq.com/sph/...），选存在路由器还是存到手机。</p>
<input id="url" placeholder="粘贴视频号链接">
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


@app.route("/")
def index():
    return PAGE


@app.route("/api/login", methods=["POST"])
def login():
    pw = request.form.get("pw") or (request.get_json(silent=True) or {}).get("pw")
    if PASSWORD and pw == PASSWORD:
        r = jsonify({"ok": True})
        r.set_cookie("wxdl_auth", PASSWORD, max_age=30 * 86400, httponly=True)
        return r
    return jsonify({"ok": False, "error": "密码不对"}), 401


@app.route("/api/local")
def local_download():
    """解析后把视频流式转发给浏览器，存到手机/本地（不存路由器）。"""
    text = request.args.get("url", "")
    m = SPH_RE.search(text)
    if not m:
        return jsonify({"ok": False, "error": "没找到视频号链接（weixin.qq.com/sph/...）"}), 400
    try:
        info = parse_sph(m.group(0))
    except Exception as e:
        return jsonify({"ok": False, "error": str(e)}), 502
    filename = safe_filename(info["author"], info["title"])
    quoted = urllib.parse.quote(filename)

    def generate():
        req = urllib.request.Request(
            info["video_url"],
            headers={"Referer": "https://channels.weixin.qq.com/", "User-Agent": UA},
        )
        with urllib.request.urlopen(req, timeout=180) as resp:
            while True:
                chunk = resp.read(1024 * 256)
                if not chunk:
                    break
                yield chunk

    return Response(
        stream_with_context(generate()),
        mimetype="video/mp4",
        headers={
            "Content-Disposition": f"attachment; filename*=UTF-8''{quoted}",
        },
    )


@app.route("/api/download", methods=["POST"])
def download():
    data = request.get_json(silent=True) or {}
    text = data.get("url", "")
    m = SPH_RE.search(text)
    if not m:
        return jsonify({"ok": False, "error": "没找到视频号链接（weixin.qq.com/sph/...）"})
    job_id = f"{int(time.time()*1000)}"
    with job_lock:
        jobs[job_id] = {"status": "等待", "progress": 0}
    threading.Thread(target=run_job, args=(job_id, m.group(0)), daemon=True).start()
    return jsonify({"ok": True, "job_id": job_id})


@app.route("/api/job/<job_id>")
def job(job_id):
    with job_lock:
        j = jobs.get(job_id)
    if not j:
        return jsonify({"ok": False, "error": "任务不存在"}), 404
    return jsonify({"ok": True, **j})


@app.route("/api/list")
def list_files():
    files = []
    for p in sorted(DATA_DIR.glob("*.mp4"), key=lambda x: x.stat().st_mtime, reverse=True):
        st = p.stat()
        files.append(
            {
                "name": p.name,
                "size": st.st_size,
                "mtime": datetime.fromtimestamp(st.st_mtime).strftime("%Y-%m-%d %H:%M"),
            }
        )
    return jsonify({"ok": True, "files": files})


@app.route("/videos/<path:name>")
def serve_video(name):
    return send_from_directory(DATA_DIR, name, as_attachment=False)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=PORT)
