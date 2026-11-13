import { fetch } from "scripting"
import { APP_ICONS } from "../constants/appIcons"

export type IconKey = "surge"

const ICON_DIR = `${FileManager.appGroupDocumentsDirectory}/icons`

const cache = new Map<IconKey, string>()

/** 图标缓存目录里的文件路径 */
export function iconFilePath(id: IconKey): string {
  return `${ICON_DIR}/${id}.png`
}

/** 已下载的图标路径；未就绪时返回 null */
export function cachedIconPath(id: IconKey): string | null {
  return cache.get(id) ?? null
}

/** 同步读取已有缓存，首帧就能显示出图标 */
export function initialIconPaths(): Record<IconKey, string | null> {
  const result = {} as Record<IconKey, string | null>
  const path = iconFilePath("surge")
  if (FileManager.existsSync(path)) {
    cache.set("surge", path)
    result.surge = path
  } else {
    result.surge = null
  }
  return result
}

async function ensureDir(): Promise<void> {
  if (!FileManager.existsSync(ICON_DIR)) {
    await FileManager.createDirectory(ICON_DIR, true)
  }
}

async function ensureIcon(id: IconKey): Promise<string> {
  const path = iconFilePath(id)
  if (FileManager.existsSync(path)) {
    cache.set(id, path)
    return path
  }
  const response = await fetch(APP_ICONS[id], {
    method: "GET",
    timeout: 15,
    headers: { "Cache-Control": "no-cache" },
  })
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }
  const bytes = await response.bytes()
  await FileManager.writeAsBytes(path, bytes)
  cache.set(id, path)
  return path
}

/** 把 Surge 图标下载到本地缓存，列表滚动时直接读本地文件，避免每行发起网络请求 */
export async function loadIcons(): Promise<Record<IconKey, string | null>> {
  const result = {} as Record<IconKey, string | null>
  try {
    await ensureDir()
  } catch (error) {
    console.log("创建图标目录失败", error)
  }
  try {
    result.surge = await ensureIcon("surge")
  } catch (error) {
    console.log("加载 Surge 图标失败", error)
    result.surge = null
  }
  return result
}
