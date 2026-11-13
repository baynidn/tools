/** 学习进度：记下哪些章已完成，存在 jslessons-settings.json 里。
 * 写法照 SurgeMod 的 settingsStore：读不到或解析失败就回退空进度。
 */

export const PROGRESS_FILE_NAME = "jslessons-settings.json"

export interface Progress {
  /** 已完成章节的 id 列表 */
  completed: number[]
}

export function progressPath(): string {
  return `${FileManager.appGroupDocumentsDirectory}/${PROGRESS_FILE_NAME}`
}

/** 读取进度，失败回退空进度 */
export function loadProgress(): Progress {
  const path = progressPath()
  try {
    if (!FileManager.existsSync(path)) {
      return { completed: [] }
    }
    const raw = FileManager.readAsStringSync(path)
    const parsed = JSON.parse(raw) as Partial<Progress>
    const completed = Array.isArray(parsed.completed)
      ? parsed.completed.filter((n): n is number => typeof n === "number")
      : []
    return { completed }
  } catch (error) {
    console.log("读取进度失败", error)
    return { completed: [] }
  }
}

/** 保存进度 */
export async function saveProgress(progress: Progress): Promise<void> {
  const dir = FileManager.appGroupDocumentsDirectory
  if (!FileManager.existsSync(dir)) {
    await FileManager.createDirectory(dir, true)
  }
  await FileManager.writeAsString(progressPath(), JSON.stringify(progress, null, 2))
}

/** 标记一章完成（已完成的不重复加） */
export function markCompleted(progress: Progress, chapterId: number): Progress {
  if (progress.completed.includes(chapterId)) {
    return progress
  }
  return { completed: [...progress.completed, chapterId].sort((a, b) => a - b) }
}
