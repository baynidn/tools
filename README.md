# tools

自用小工具合集。

## SurgeModuleTools.js

Scriptable 脚本：批量更新 Surge 模块（`.sgmodule`），支持从链接创建、更新单个 / 全部模块。

改版说明（基于 Script-Hub-Org/Script-Hub 的 SurgeModuleTool 2.04）：
- 版本 2.04.2
- 更新模块时保留本地 `#!category` 字段，不被上游替换
- 自更新只跟本仓库，不再拉上游
- 修复：重载 Surge 失败不再抛错；`alert` 改为顶层声明；`#!` 链接块改 lastIndexOf 定位
- 优化：等待改官方 Timer 异步实现，不再空转卡界面；版本号按段数字比较；只处理 `.sgmodule` 文件
