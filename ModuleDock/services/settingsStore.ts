import { DEFAULT_SETTINGS, MODULE_FOLDER_NAME, SETTINGS_FILE_NAME } from "../constants"
import { TARGET_ORDER } from "../constants/targets"
import type { Settings, TargetId } from "../types"

/** 设置文件路径 */
export function settingsPath(): string {
  return `${FileManager.appGroupDocumentsDirectory}/${SETTINGS_FILE_NAME}`
}

/** 读取设置，解析失败时回退默认值 */
export function loadSettings(): Settings {
  const path = settingsPath()
  try {
    if (!FileManager.existsSync(path)) {
      return { ...DEFAULT_SETTINGS }
    }
    const raw = FileManager.readAsStringSync(path)
    const parsed = JSON.parse(raw) as Partial<Settings>
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
    }
  } catch (error) {
    console.log("读取设置失败", error)
    return { ...DEFAULT_SETTINGS }
  }
}

/** 保存设置 */
export async function saveSettings(settings: Settings): Promise<void> {
  const dir = FileManager.appGroupDocumentsDirectory
  if (!FileManager.existsSync(dir)) {
    await FileManager.createDirectory(dir, true)
  }
  await FileManager.writeAsString(settingsPath(), JSON.stringify(settings, null, 2))
}

/** 默认模块目录 */
export function defaultModuleFolder(): string {
  try {
    if (FileManager.isiCloudEnabled) {
      return `${FileManager.iCloudDocumentsDirectory}/${MODULE_FOLDER_NAME}`
    }
  } catch (error) {
    console.log("iCloud 不可用，使用本地 Documents", error)
  }
  return `${FileManager.documentsDirectory}/${MODULE_FOLDER_NAME}`
}

/** 确保目录存在 */
export async function ensureFolder(path: string): Promise<void> {
  if (!FileManager.existsSync(path)) {
    await FileManager.createDirectory(path, true)
  }
}

/**
 * 解析当前可用的模块目录：
 * 1. 优先使用选择的目录书签
 * 2. 其次使用上次记录的路径（仍然存在时）
 * 3. 最后回退默认目录
 */
export async function resolveModuleFolder(settings: Settings): Promise<string> {
  if (settings.folderBookmark && FileManager.bookmarkExists(settings.folderBookmark)) {
    const bookmarked = FileManager.bookmarkedPath(settings.folderBookmark)
    if (bookmarked) {
      await ensureFolder(bookmarked)
      return bookmarked
    }
  }
  if (settings.folderPath && FileManager.existsSync(settings.folderPath)) {
    await ensureFolder(settings.folderPath)
    return settings.folderPath
  }
  const fallback = defaultModuleFolder()
  await ensureFolder(fallback)
  return fallback
}

/** 选择一个目录并保存书签，返回新的设置 */
export async function pickModuleFolder(settings: Settings): Promise<Settings | null> {
  const result = await DocumentPicker.pickDirectoryBookmark({
    preferredName: "surge-module-folder",
    initialDirectory: settings.folderPath ?? undefined,
  })
  if (!result) {
    return null
  }
  return {
    ...settings,
    folderBookmark: result.bookmarkName,
    folderPath: result.path,
  }
}

/** 取某目标的专属文件夹路径（只读，不解析书签以外的东西、不创建目录）；未设返回 null */
export function targetFolderPath(settings: Settings, target: TargetId): string | null {
  const override = settings.targetFolders?.[target]
  if (!override) {
    return null
  }
  if (override.bookmark && FileManager.bookmarkExists(override.bookmark)) {
    return FileManager.bookmarkedPath(override.bookmark)
  }
  return override.path
}

/**
 * 解析某目标 App 的存放目录：
 * 专属文件夹（书签 > 保存的路径）> 传入的回落目录 > 主文件夹。
 * 未设专属文件夹时与原来完全一致。
 */
export async function resolveTargetFolder(
  settings: Settings,
  target: TargetId,
  fallback?: string
): Promise<string> {
  const override = settings.targetFolders?.[target]
  if (override?.bookmark && FileManager.bookmarkExists(override.bookmark)) {
    const bookmarked = FileManager.bookmarkedPath(override.bookmark)
    if (bookmarked) {
      await ensureFolder(bookmarked)
      return bookmarked
    }
  }
  if (override?.path && FileManager.existsSync(override.path)) {
    await ensureFolder(override.path)
    return override.path
  }
  if (fallback) {
    await ensureFolder(fallback)
    return fallback
  }
  return resolveModuleFolder(settings)
}

/** 解析全部模块目录（主文件夹 + 各目标专属文件夹，去重，主文件夹在第一位） */
export async function resolveAllModuleFolders(settings: Settings): Promise<string[]> {
  const main = await resolveModuleFolder(settings)
  const folders = [main]
  for (const target of TARGET_ORDER) {
    const folder = await resolveTargetFolder(settings, target, main)
    if (!folders.includes(folder)) {
      folders.push(folder)
    }
  }
  return folders
}

/** 选择某目标的专属文件夹并保存书签，返回新的设置 */
export async function pickTargetFolder(settings: Settings, target: TargetId): Promise<Settings | null> {
  const current = settings.targetFolders?.[target]
  const result = await DocumentPicker.pickDirectoryBookmark({
    preferredName: `surge-module-folder-${target}`,
    initialDirectory: current?.path ?? settings.folderPath ?? undefined,
  })
  if (!result) {
    return null
  }
  return {
    ...settings,
    targetFolders: {
      ...(settings.targetFolders ?? {}),
      [target]: { bookmark: result.bookmarkName, path: result.path },
    },
  }
}

/** 清除某目标的专属文件夹（回落到主文件夹），返回新的设置 */
export function clearTargetFolder(settings: Settings, target: TargetId): Settings {
  const current = settings.targetFolders?.[target]
  if (current?.bookmark) {
    removeBookmark(current.bookmark)
  }
  const next = { ...(settings.targetFolders ?? {}) }
  delete next[target]
  return { ...settings, targetFolders: next }
}

/** 清理旧书签（切换目录时调用） */
export function removeBookmark(name: string | null): void {
  if (name && FileManager.bookmarkExists(name)) {
    try {
      FileManager.removeFileBookmark(name)
    } catch (error) {
      console.log("移除书签失败", error)
    }
  }
}

/** 可选择的其他目录（用于展示） */
export function candidateFolders(): Array<{ title: string; path: string }> {
  const list: Array<{ title: string; path: string }> = []
  try {
    if (FileManager.isiCloudEnabled) {
      list.push({ title: "iCloud Drive/SurgeModules", path: `${FileManager.iCloudDocumentsDirectory}/${MODULE_FOLDER_NAME}` })
    }
  } catch {
    // iCloud 不可用时忽略
  }
  list.push({ title: "App Documents/SurgeModules", path: `${FileManager.documentsDirectory}/${MODULE_FOLDER_NAME}` })
  return list
}
