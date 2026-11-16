import { Button, CaptureVideoPreviewView, Dialog, HStack, Image, Navigation, NavigationStack, Rectangle, ScrollView, Script, Spacer, Text, Toolbar, ToolbarItem, VStack, ZStack, useEffect, useState } from "scripting"

/**
 * 二维码解码 v0.3
 * 两个按钮，点了直接干活：
 * ① 相册选图：从相册选一张带二维码的图片，用 jsQR 在手机本地解出文字。
 * ② 相机扫码：打开后置摄像头实时扫码，扫到自动停下并显示结果；再点一次停止。
 * 全程不上传图片，一次只解一个二维码。
 * 左上角有关闭按钮（×），点它退出（退出前会先停掉相机）。
 */

/** jsQR 解码库的下载地址（GitHub 官方仓库的成品文件） */
const JSQR_URL = "https://raw.githubusercontent.com/cozmo/jsQR/master/dist/jsQR.js"

/** 解出来的结果长这样：{ data: "二维码里的文字" }，解不出来就是 null */
type JsQRResult = { data: string } | null
type JsQRFn = (data: Uint8ClampedArray, width: number, height: number, options?: { inversionAttempts?: string }) => JsQRResult

/** 状态行的颜色：info=灰，working=蓝，ok=绿，error=红 */
type StatusKind = "info" | "working" | "ok" | "error"

/* ---------- 界面样式（照着模块坞那套玻璃卡片风格，简化后放在这一个文件里） ---------- */

const palette = {
  accent: "#0A84FF",
  success: "systemGreen",
  danger: "systemRed",
  secondaryLabel: "secondaryLabel",
  tertiaryLabel: "tertiaryLabel",
}

const cardShape: any = { type: "rect", cornerRadius: 22 }
const cardInsets: any = { horizontal: 16, vertical: 12 }
const leadingFillFrame: any = { minWidth: 0, idealWidth: "infinity", maxWidth: "infinity", alignment: "leading" }
const fullFillFrame: any = { minWidth: 0, idealWidth: "infinity", maxWidth: "infinity", minHeight: 0, idealHeight: "infinity", maxHeight: "infinity", alignment: "topLeading" }
const pageGradient: any = {
  colors: ["rgba(10,132,255,0.22)", "rgba(120,90,255,0.16)", "rgba(48,209,88,0.10)"],
  startPoint: "topLeading",
  endPoint: "bottomTrailing",
}
const cardGlass: any = { glass: UIGlass.regular().interactive(false), shape: cardShape }

function statusColor(kind: StatusKind): string {
  if (kind === "ok") return palette.success
  if (kind === "error") return palette.danger
  if (kind === "working") return palette.accent
  return palette.secondaryLabel
}

/* ---------- jsQR 加载与相册解码（v0.1 已验证能用，原样保留） ---------- */

/** 已经下载好的 jsQR 函数，存下来只下载一次 */
let cachedJsQR: JsQRFn | null = null

/** 下载 jsQR 并拿到解码函数 */
async function loadJsQR(): Promise<JsQRFn> {
  if (cachedJsQR) return cachedJsQR
  const res = await fetch(JSQR_URL)
  if (!res.ok) throw new Error("下载解码库失败，HTTP " + res.status + "（检查网络或 Surge 是否开着）")
  const code = await res.text()
  if (!code.includes("jsQR")) throw new Error("下载到的不是 jsQR 代码")
  // jsQR 是 UMD 格式：给它假的 module / exports，让它把函数挂到 module.exports 上
  try {
    const moduleObj: any = { exports: {} }
    const factory = new Function("module", "exports", "define", "self", code + "\n;return module.exports;") as (...args: any[]) => any
    const lib = factory(moduleObj, moduleObj.exports, undefined, undefined)
    if (typeof lib === "function") {
      cachedJsQR = lib as JsQRFn
      return cachedJsQR
    }
  } catch (e) {
    // new Function 被禁用的话，走下面的全局 eval 兜底
  }
  try {
    ;(globalThis as any).eval(code)
    const lib = (globalThis as any).jsQR
    if (typeof lib === "function") {
      cachedJsQR = lib as JsQRFn
      return cachedJsQR
    }
  } catch (e) {
    // 兜底也失败，下面统一报错
  }
  throw new Error("解码库加载失败：两种加载方式都没拿到 jsQR 函数")
}

/** 用 jsQR 解一张图。先拿原图直接解，解不出来再缩到最长边 1000 解一次。 */
async function decodeImage(jsQR: JsQRFn, image: any): Promise<string | null> {
  // getPixelData：把图片变成像素数组（红、绿、蓝、透明四个值一组，从左到右、从上到下排好）
  const px = image.getPixelData()
  if (!px) throw new Error("读不到图片像素（getPixelData 返回空）")
  const rgba = new Uint8ClampedArray(px.data.toUint8Array())
  // inversionAttempts: "attemptBoth" = 黑底白码和白底黑码都试一遍
  const first = jsQR(rgba, px.width, px.height, { inversionAttempts: "attemptBoth" })
  if (first) return first.data
  // 原图没解出来：缩到最长边 1000 再试一次，大图缩小后有时反而好解
  const maxSide = Math.max(px.width, px.height)
  if (maxSide > 1000) {
    const scale = 1000 / maxSide
    const small = image.preparingThumbnail({ width: Math.round(px.width * scale), height: Math.round(px.height * scale) })
    if (small) {
      const px2 = small.getPixelData()
      if (px2) {
        const second = jsQR(new Uint8ClampedArray(px2.data.toUint8Array()), px2.width, px2.height, { inversionAttempts: "attemptBoth" })
        if (second) return second.data
      }
    }
  }
  return null
}

/* ---------- 相机扫码（Scripting 3.1 的 AVCaptureSession，系统原生扫码） ---------- */

/** 扫码会话存在模块级，界面重渲染也不会丢 */
let scanSession: any | null = null
let scanCamera: any | null = null
/** 已经扫到一次就不再重复处理 */
let scanHandled = false

/** 建好会话、挂上二维码监听，但先不启动（启动由 startScan 做） */
function buildScanSession(onResult: (text: string) => void, onError: (msg: string) => void): { session: any; camera: any } {
  const camera = AVCaptureDevice.default("video")
  if (!camera) throw new Error("找不到后置摄像头")
  const session = new AVCaptureSession()
  const input = new AVCaptureDeviceInput(camera)
  const metaOutput = new AVCaptureMetadataOutput()
  session.configure(() => {
    session.sessionPreset = "photo"
    if (session.canAddInput(input)) session.addInput(input)
    if (session.canAddOutput(metaOutput)) session.addOutput(metaOutput)
  })
  // 注意：类型必须在 output 加进会话之后再设，顺序不能反
  metaOutput.metadataObjectTypes = ["qr"]
  metaOutput.setMetadataObjectsListener((objects: any[]) => {
    if (scanHandled) return
    for (const o of objects) {
      if (o.stringValue) {
        scanHandled = true
        onResult(o.stringValue)
        return
      }
    }
  })
  session.addRuntimeErrorListener((msg: string) => {
    onError("相机出错：" + msg)
  })
  return { session, camera }
}

/** 启动扫码：建会话 → 开始跑。首次会弹相机权限，拒绝会报错。
 * 建会话和启动分开报错：建失败一般是设备问题，启动失败一般是权限问题。 */
async function startScan(onResult: (text: string) => void, onError: (msg: string) => void): Promise<{ session: any; camera: any }> {
  if (scanSession) return { session: scanSession, camera: scanCamera }
  scanHandled = false
  let built: { session: any; camera: any }
  try {
    built = buildScanSession(onResult, onError)
  } catch (e) {
    throw new Error("建相机失败：" + (e instanceof Error ? e.message : String(e)))
  }
  scanSession = built.session
  scanCamera = built.camera
  try {
    await built.session.startRunning()
  } catch (e) {
    throw new Error("启动相机失败：" + (e instanceof Error ? e.message : String(e)))
  }
  return built
}

/** 停止并销毁扫码会话（把相机停掉） */
async function stopScan(): Promise<void> {
  const s = scanSession
  scanSession = null
  scanCamera = null
  if (s) {
    try { await s.stopRunning() } catch (e) { /* 已经停了就不用管 */ }
    s.dispose()
  }
}

/* ---------- 主界面 ---------- */

export function App() {
  const dismiss = Navigation.useDismiss()
  const [message, setMessage] = useState("点上面两个按钮，相册选图或相机扫码。")
  const [statusKind, setStatusKind] = useState<StatusKind>("info")
  const [result, setResult] = useState<string | null>(null)
  const [preview, setPreview] = useState<any | null>(null)
  const [copied, setCopied] = useState(false)
  const [scanning, setScanning] = useState(false)
  const [scanSessionObj, setScanSessionObj] = useState<any | null>(null)
  const [scanCameraObj, setScanCameraObj] = useState<any | null>(null)

  /** 退出页面时一定把相机停掉 */
  useEffect(() => {
    return () => { void stopScan() }
  }, [])

  /** 点左上角 × 关闭：先停相机，再关页面 */
  async function closeApp(): Promise<void> {
    await stopScan()
    dismiss()
  }

  /** 点右上角 ↻ 刷新：停相机、清空结果和预览，回到刚打开的样子 */
  async function refreshAll(): Promise<void> {
    await stopScan()
    setScanSessionObj(null)
    setScanCameraObj(null)
    setScanning(false)
    setResult(null)
    setPreview(null)
    setCopied(false)
    setStatusKind("info")
    setMessage("点上面两个按钮，相册选图或相机扫码。")
  }

  /** 扫到码之后：停相机、显示结果 */
  async function handleScanResult(text: string): Promise<void> {
    await stopScan()
    setScanSessionObj(null)
    setScanCameraObj(null)
    setScanning(false)
    setResult(text)
    setCopied(false)
    setStatusKind("ok")
    setMessage("扫到了，结果在下面。")
  }

  function handleScanError(msg: string): void {
    setStatusKind("error")
    setMessage(msg)
  }

  /** 开始 / 停止扫码 */
  async function toggleScan(): Promise<void> {
    if (scanning) {
      await stopScan()
      setScanSessionObj(null)
      setScanCameraObj(null)
      setScanning(false)
      setStatusKind("info")
      setMessage("已停止扫码。")
      return
    }
    setResult(null)
    setCopied(false)
    setPreview(null)
    setStatusKind("working")
    setMessage("正在打开相机…")
    try {
      const { session, camera } = await startScan(
        (text) => void handleScanResult(text),
        (msg) => handleScanError(msg),
      )
      setScanSessionObj(session)
      setScanCameraObj(camera)
      setScanning(true)
      setStatusKind("working")
      setMessage("把二维码放进画面，扫到会自动停下。")
    } catch (error) {
      await stopScan()
      setScanSessionObj(null)
      setScanCameraObj(null)
      setScanning(false)
      setStatusKind("error")
      // iOS 的相机权限只弹一次：如果以前点过“不允许”，之后再也不会弹窗，
      // 只能去“设置 → Scripting → 相机”里手动打开。所以这里直接告诉用户去设置里看。
      setMessage("相机打不开：" + (error instanceof Error ? error.message : String(error)) + "。先去“设置 → Scripting → 相机”确认开关是打开的；如果已经是打开的，把上面这行报错原文发我。")
    }
  }

  /** 相册选图 → 解码，全程 try/catch，出错直接显示在屏幕上 */
  async function pickAndDecode(): Promise<void> {
    // 正在扫码时先停相机，再开相册
    if (scanning) {
      await stopScan()
      setScanSessionObj(null)
      setScanCameraObj(null)
      setScanning(false)
    }
    setCopied(false)
    setResult(null)
    setPreview(null)
    try {
      setStatusKind("working")
      setMessage("正在打开相册…")
      const picked = await Photos.pick({ filter: PHPickerFilter.images(), limit: 1 })
      if (!picked || picked.length === 0) {
        setStatusKind("info")
        setMessage("你没选图，点按钮重新选。")
        return
      }
      setMessage("正在读图片…")
      const uiImage = await picked[0].uiImage()
      if (!uiImage) throw new Error("这张图读不出来，换一张试试")
      // 预览缩略图（宽 300，等比缩放），原图照原样拿去解码
      const thumb = uiImage.preparingThumbnail({ width: 300, height: Math.max(1, Math.round((300 * uiImage.height) / uiImage.width)) })
      setPreview(thumb ?? uiImage)
      setMessage("正在解码…")
      const jsQR = await loadJsQR()
      const text = await decodeImage(jsQR, uiImage)
      if (text) {
        setResult(text)
        setStatusKind("ok")
        setMessage("解出来了，结果在下面。")
      } else {
        setStatusKind("error")
        setMessage("没解出来：图里可能没有二维码，或者码太小、太模糊。换张清晰点的图试试。")
      }
    } catch (error) {
      setStatusKind("error")
      setMessage("出错了：" + (error instanceof Error ? error.message : String(error)))
    }
  }

  /** 把结果复制到剪贴板 */
  async function copyResult(): Promise<void> {
    if (!result) return
    await Pasteboard.setString(result)
    setCopied(true)
  }

  return (
    <NavigationStack>
      <ZStack>
        <Rectangle fill={pageGradient} ignoresSafeArea />
        <ScrollView
          navigationTitle="二维码解码"
          navigationBarTitleDisplayMode="inline"
          toolbarBackgroundVisibility="hidden"
          toolbar={
            <Toolbar>
              <ToolbarItem placement="topBarLeading">
                <Button title="" systemImage="xmark" role="close" action={() => void closeApp()} buttonStyle="plain" />
              </ToolbarItem>
              <ToolbarItem placement="topBarTrailing">
                <Button title="" systemImage="arrow.clockwise" action={() => void refreshAll()} buttonStyle="plain" />
              </ToolbarItem>
            </Toolbar>
          }
          frame={fullFillFrame}
        >
          <VStack spacing={16} padding={{ horizontal: 16, vertical: 12 }}>
            <Text font="subheadline" foregroundStyle={palette.secondaryLabel}>相册选图或相机扫码，全部在手机本地解码，不上传图片。</Text>

            <HStack spacing={8}>
              <Button title="相册选图" systemImage="photo" buttonStyle="glassProminent" frame={leadingFillFrame} action={() => void pickAndDecode()} />
              <Button title={scanning ? "停止扫码" : "相机扫码"} systemImage={scanning ? "stop.circle" : "camera.viewfinder"} buttonStyle={scanning ? "glass" : "glassProminent"} frame={leadingFillFrame} action={() => void toggleScan()} />
            </HStack>

            {scanSessionObj ? (
              <VStack spacing={12}>
                <CaptureVideoPreviewView session={scanSessionObj} videoDevice={scanCameraObj} videoGravity="resizeAspectFill" cornerRadius={16} masksToBounds frame={{ minWidth: 0, idealWidth: "infinity", maxWidth: "infinity", minHeight: 320, idealHeight: 320, maxHeight: 320 }} />
                <Text font="caption" foregroundStyle={palette.tertiaryLabel}>把二维码放进画面，扫到会自动停下并显示结果。光线太暗或码太小可能扫不到。</Text>
              </VStack>
            ) : null}

            {preview ? (
              <VStack alignment="center" spacing={0} padding={cardInsets} frame={leadingFillFrame} glassEffect={cardGlass}>
                <Image image={preview} />
              </VStack>
            ) : null}

            <Text font="subheadline" foregroundStyle={statusColor(statusKind)}>{message}</Text>

            {result ? (
              <VStack alignment="leading" spacing={10} padding={cardInsets} frame={leadingFillFrame} glassEffect={cardGlass}>
                <Text font="caption" foregroundStyle={palette.tertiaryLabel}>解出的内容</Text>
                <Text font="body">{result}</Text>
                <Button title={copied ? "已复制 ✓" : "复制结果"} systemImage="doc.on.doc" buttonStyle="glass" action={() => void copyResult()} />
              </VStack>
            ) : null}

            <Text font="caption2" foregroundStyle={palette.tertiaryLabel}>一次只解一个二维码。相册解码时，太模糊、太小的码可能解不出来，换张清晰的原图试试。</Text>
            <Spacer />
          </VStack>
        </ScrollView>
      </ZStack>
    </NavigationStack>
  )
}

/** 入口 */
async function run(): Promise<void> {
  try {
    await Navigation.present({
      element: <App />,
      modalPresentationStyle: "pageSheet",
    })
  } catch (error) {
    console.error("二维码解码运行失败", error)
    await Dialog.alert({
      title: "运行失败",
      message: error instanceof Error ? error.message : String(error),
    })
  } finally {
    Script.exit()
  }
}

void run()
