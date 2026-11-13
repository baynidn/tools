import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type VirtualNode } from "scripting"
import { TARGETS } from "../constants/targets"
import type { ModuleEntry, Settings, TargetId, UpdateResult, UpdateSummary } from "../types"
import {
  importToTarget,
  installFromURL,
  reloadSurge,
  removeModule,
  scanFolders,
  updateAllModules,
  updateModule,
} from "../services/moduleService"
import {
  clearTargetFolder,
  pickModuleFolder,
  pickTargetFolder,
  removeBookmark,
  resolveAllModuleFolders,
  resolveModuleFolder,
  saveSettings,
  targetFolderPath,
} from "../services/settingsStore"

/** 全局状态 */
export type LibraryContextValue = {
  settings: Settings
  folderPath: string
  /** 全部模块目录（主文件夹 + 各目标专属文件夹） */
  folderPaths: string[]
  modules: ModuleEntry[]
  loading: boolean
  busy: boolean
  showNotice: (text: string | null) => void
  refresh: () => Promise<void>
  updateSettings: (patch: Partial<Settings>) => Promise<void>
  chooseFolder: () => Promise<void>
  /** 选择某目标的专属文件夹 */
  chooseTargetFolder: (target: TargetId) => Promise<void>
  /** 清除某目标的专属文件夹（回落到主文件夹） */
  clearTargetFolder: (target: TargetId) => Promise<void>
  /** 某目标的模块会保存到哪个目录（未设专属文件夹时返回主文件夹） */
  folderForTarget: (target: TargetId | null) => string
  updateOne: (entry: ModuleEntry) => Promise<UpdateResult>
  updateAll: () => Promise<UpdateSummary>
  addFromURL: (url: string, name: string, target?: TargetId | null) => Promise<ModuleEntry>
  importOne: (entry: ModuleEntry) => Promise<boolean>
  remove: (entry: ModuleEntry) => Promise<void>
  reload: () => Promise<boolean>
}

const LibraryContext = createContext<LibraryContextValue>()

type ToastContextValue = {
  notice: string | null
  showNotice: (text: string | null) => void
}

const ToastContext = createContext<ToastContextValue>()

/** 读取当前上下文的快捷 Hook */
export function useLibrary(): LibraryContextValue {
  return useContext(LibraryContext)
}

/** 读取提示条状态 */
export function useToast(): ToastContextValue {
  return useContext(ToastContext)
}

/** 把一条更新结果合并回列表 */
function mergeEntry(list: ModuleEntry[], entry: ModuleEntry): ModuleEntry[] {
  return list.map(item => (item.path === entry.path ? entry : item))
}

export function LibraryProvider({
  children,
  initialSettings,
}: {
  children: VirtualNode
  initialSettings: Settings
}): VirtualNode {
  const [settings, setSettings] = useState<Settings>(initialSettings)
  const [folderPath, setFolderPath] = useState<string>(initialSettings.folderPath ?? "")
  const [folderPaths, setFolderPaths] = useState<string[]>([])
  const [modules, setModules] = useState<ModuleEntry[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [busy, setBusy] = useState<boolean>(false)
  const [notice, setNotice] = useState<string | null>(null)
  const loadedRef = useRef(false)

  const showNotice = useCallback((text: string | null) => {
    setNotice(text)
  }, [])

  /** 重新解析全部目录并扫描模块；首次才显示骨架屏，后续静默更新 */
  const refresh = useCallback(async () => {
    if (!loadedRef.current) {
      setLoading(true)
    }
    try {
      const folders = await resolveAllModuleFolders(settings)
      const folder = folders[0] ?? ""
      setFolderPath(folder)
      setFolderPaths(folders)
      setModules(await scanFolders(folders))
      loadedRef.current = true
      setSettings(current => {
        if (current.folderPath === folder) {
          return current
        }
        const next: Settings = { ...current, folderPath: folder }
        void saveSettings(next)
        return next
      })
    } catch (error) {
      console.log("扫描模块失败", error)
      showNotice(`扫描失败：${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setLoading(false)
    }
  }, [settings, showNotice])

  useEffect(() => {
    void refresh()
    // 仅在首次挂载时扫描
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const updateSettings = useCallback(
    async (patch: Partial<Settings>) => {
      const next: Settings = { ...settings, ...patch }
      setSettings(next)
      await saveSettings(next)
    },
    [settings]
  )

  const chooseFolder = useCallback(async () => {
    const picked = await pickModuleFolder(settings)
    if (!picked) {
      return
    }
    if (settings.folderBookmark && settings.folderBookmark !== picked.folderBookmark) {
      removeBookmark(settings.folderBookmark)
    }
    setSettings(picked)
    await saveSettings(picked)
    const folders = await resolveAllModuleFolders(picked)
    setFolderPath(folders[0] ?? "")
    setFolderPaths(folders)
    setLoading(true)
    try {
      setModules(await scanFolders(folders))
    } finally {
      setLoading(false)
    }
    showNotice("模块目录已更新")
  }, [settings, showNotice])

  /** 选择某目标的专属文件夹；之后该目标的模块都会保存到这里，列表也会扫描这里 */
  const chooseTargetFolder = useCallback(async (target: TargetId) => {
    const picked = await pickTargetFolder(settings, target)
    if (!picked) {
      return
    }
    const old = settings.targetFolders?.[target]
    const next = picked.targetFolders?.[target]
    if (old?.bookmark && old.bookmark !== next?.bookmark) {
      removeBookmark(old.bookmark)
    }
    setSettings(picked)
    await saveSettings(picked)
    const folders = await resolveAllModuleFolders(picked)
    setFolderPath(folders[0] ?? "")
    setFolderPaths(folders)
    setLoading(true)
    try {
      setModules(await scanFolders(folders))
    } finally {
      setLoading(false)
    }
    showNotice(`${TARGETS[target].app} 文件夹已设置`)
  }, [settings, showNotice])

  /** 清除某目标的专属文件夹，之后该目标回落到主文件夹 */
  const clearTargetFolderSetting = useCallback(async (target: TargetId) => {
    const next = clearTargetFolder(settings, target)
    setSettings(next)
    await saveSettings(next)
    const folders = await resolveAllModuleFolders(next)
    setFolderPath(folders[0] ?? "")
    setFolderPaths(folders)
    setLoading(true)
    try {
      setModules(await scanFolders(folders))
    } finally {
      setLoading(false)
    }
    showNotice(`${TARGETS[target].app} 已回落到主文件夹`)
  }, [settings, showNotice])

  /** 某目标的模块会保存到哪个目录（未设专属文件夹时返回主文件夹） */
  const folderForTarget = useCallback((target: TargetId | null): string => {
    if (!target) {
      return folderPath
    }
    return targetFolderPath(settings, target) ?? folderPath
  }, [settings, folderPath])

  const updateOne = useCallback(
    async (entry: ModuleEntry): Promise<UpdateResult> => {
      setBusy(true)
      setModules(current => mergeEntry(current, { ...entry, status: "updating", error: undefined }))
      try {
        const result = await updateModule(entry, settings)
        setModules(current => mergeEntry(current, result.entry))
        if (result.ok) {
          const changes: string[] = []
          if (result.changedName) {
            changes.push(`名称：${entry.name} → ${result.entry.name}`)
          }
          if (result.changedDesc) {
            changes.push(`描述已更新`)
          }
          showNotice(changes.length > 0 ? `✅ ${result.entry.name} 已更新 · ${changes.join(" · ")}` : `✅ ${result.entry.name} 已更新`)
        } else if (result.reason === "no-url") {
          showNotice(`🈚️ ${entry.fileName} 没有订阅链接`)
        } else {
          showNotice(`❌ ${entry.name}：${result.message}`)
        }
        return result
      } finally {
        setBusy(false)
      }
    },
    [settings, showNotice]
  )

  const updateAll = useCallback(async (): Promise<UpdateSummary> => {
    setBusy(true)
    let pending: ModuleEntry[] = []
    const flush = () => {
      if (pending.length === 0) {
        return
      }
      const batch = pending
      pending = []
      setModules(current => {
        const map = new Map(current.map(item => [item.path, item]))
        for (const entry of batch) {
          map.set(entry.path, entry)
        }
        return Array.from(map.values())
      })
    }
    try {
      const summary = await updateAllModules(modules, settings, result => {
        pending.push(result.entry)
        if (pending.length >= 4) {
          flush()
        }
      })
      flush()
      if (settings.reloadAfterUpdate) {
        await reloadSurge()
      }
      const parts = [`✅ 成功 ${summary.success}`]
      if (summary.noUrl > 0) {
        parts.push(`🈚️ 无链接 ${summary.noUrl}`)
      }
      if (summary.failed.length > 0) {
        parts.push(`❌ 失败 ${summary.failed.length}`)
      }
      showNotice(`共 ${summary.total} 个模块 · ${parts.join(" · ")}`)
      return summary
    } finally {
      setBusy(false)
    }
  }, [modules, settings, showNotice])

  const addFromURL = useCallback(
    async (url: string, name: string, target?: TargetId | null): Promise<ModuleEntry> => {
      setBusy(true)
      try {
        // 首次从 URL Scheme 进入时目录可能还没解析出来，这里再解析一次
        const targetFolder = folderPath || (await resolveModuleFolder(settings))
        const entry = await installFromURL(url, name, targetFolder, settings, target)
        setModules(current => {
          const next = current.filter(item => item.path !== entry.path)
          next.push(entry)
          next.sort((a, b) => a.name.localeCompare(b.name, "zh-Hans-CN"))
          return next
        })
        showNotice(`✅ 已保存 ${entry.fileName}`)
        return entry
      } finally {
        setBusy(false)
      }
    },
    [folderPath, settings, showNotice]
  )

  const remove = useCallback(
    async (entry: ModuleEntry) => {
      await removeModule(entry)
      setModules(current => current.filter(item => item.path !== entry.path))
      showNotice(`已删除 ${entry.fileName}`)
    },
    [showNotice]
  )

  const importOne = useCallback(
    async (entry: ModuleEntry): Promise<boolean> => {
      const ok = await importToTarget(entry)
      showNotice(ok ? `已交给 ${TARGETS[entry.target].app} 导入` : "导入失败，可改用分享本地文件")
      return ok
    },
    [showNotice]
  )

  const reload = useCallback(async () => {
    const ok = await reloadSurge()
    showNotice(ok ? "已请求 Surge 重载模块" : "重载请求失败，可在 Surge 内手动重载")
    return ok
  }, [showNotice])

  const value = useMemo<LibraryContextValue>(
    () => ({
      settings,
      folderPath,
      folderPaths,
      modules,
      loading,
      busy,
      showNotice,
      refresh,
      updateSettings,
      chooseFolder,
      chooseTargetFolder,
      clearTargetFolder: clearTargetFolderSetting,
      folderForTarget,
      updateOne,
      updateAll,
      addFromURL,
      importOne,
      remove,
      reload,
    }),
    [
      settings,
      folderPath,
      folderPaths,
      modules,
      loading,
      busy,
      showNotice,
      refresh,
      updateSettings,
      chooseFolder,
      chooseTargetFolder,
      clearTargetFolderSetting,
      folderForTarget,
      updateOne,
      updateAll,
      addFromURL,
      importOne,
      remove,
      reload,
    ]
  )

  const toastValue = useMemo<ToastContextValue>(() => ({ notice, showNotice }), [notice, showNotice])

  return (
    <LibraryContext.Provider value={value}>
      <ToastContext.Provider value={toastValue}>{children}</ToastContext.Provider>
    </LibraryContext.Provider>
  )
}
