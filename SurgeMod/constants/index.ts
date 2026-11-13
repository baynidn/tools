import type { Settings } from "../types"

/** 工具版本 */
export const TOOL_VERSION = "1.0.0"

/** 原版工具使用的请求头 */
export const DEFAULT_USER_AGENT = "script-hub/1.0.0"

/** 默认模块目录名（放在 Scripting 的 iCloud/Documents 或沙盒 Documents 下） */
export const MODULE_FOLDER_NAME = "SurgeModules"

/** 设置文件名（与 ModuleDock 分开，避免互相覆盖设置） */
export const SETTINGS_FILE_NAME = "surgemod-settings.json"

export const IGNORED_EXTENSIONS = [".conf", ".txt", ".js", ".list"]

/** 默认设置 */
export const DEFAULT_SETTINGS: Settings = {
  folderBookmark: null,
  folderPath: null,
  userAgent: DEFAULT_USER_AGENT,
  reloadAfterUpdate: false,
  showModulesWithoutUrl: true,
}

/** Surge 重载模块的特殊地址（Surge 会拦截该请求并重载模块） */
export const SURGE_RELOAD_URL = "http://script.hub/reload"

/** 打开 Surge 的 URL Scheme */
export const SURGE_OPEN_URL = "surge:///start"

/** Surge 官方仓库地址 */
export const SURGE_MODULE_STORE_URL = "https://github.com/Script-Hub-Org/Script-Hub"

/** 仓库目录（用于重新导入/更新脚本） */
export const REPO_DIR_URL = "https://github.com/baynidn/tools/tree/main/SurgeMod"

/** Surge 安装远程模块 */
export const SURGE_INSTALL_PREFIX = "surge:///install-module?url="
