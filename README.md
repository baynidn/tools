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

## SurgeMod

只保留 Surge 的单页本地模块管理器，相当于 SurgeModuleTools 的功能 + 界面：

- 批量更新带 `#SUBSCRIBED` 的本地 Surge 模块（`.sgmodule`），点一行更新单个
- 从链接安装（链接框在首页顶部），自动取出真正的资源地址
- 重载 Surge、选择模块文件夹
- 更新时保留本地 `#!category` 字段，不被上游替换
- 只有首页一个页面；导入地址：`https://github.com/baynidn/tools/tree/main/SurgeMod`

## ModuleDock

Scripting 脚本：本地模块管理器，支持 Surge / Loon / Stash / Shadowrocket，批量更新带 `#SUBSCRIBED` 的本地模块。

改版说明（基于 Zerolost/scripting-script 的 ModuleDock 3.6.0）：
- 更新模块时保留本地 `#!category` 字段，不被上游替换（与 SurgeModuleTools 2.04.2 同一逻辑）
- 分目标文件夹：每个目标 App 可在设置页单独指定文件夹，转换安装时保存到专属文件夹；不设的跟主文件夹；列表同时扫描主文件夹和专属文件夹
- 导入地址：`https://github.com/baynidn/tools/tree/main/ModuleDock`

## JSLessons

Scripting 脚本：从零学 JavaScript 的 17 章互动教程，在 Scripting 里边看边跑边练。

- 每章固定四部分：今天学什么、有什么意义、实践例子（点一下就能运行看结果）、怎么练习（有提示、有答案、有答案解释）
- 从零开始：每个新词第一次出现都解释，不用查英文资料；英文关键字只当固定写法讲
- 17 章：JS 是什么、变量、字符串、数组与对象、运算符、函数、JSON、异步、报错调试、Cloudflare Workers、模块格式、Surge/Loon/REX 脚本接口、多端兼容、完整实战两例、学习路线
- 学完能自己写 Worker 和 Surge、Loon、REX 模块；进度自动保存（做完一章点“完成本章”）
- 导入地址：`https://github.com/baynidn/tools/tree/main/JSLessons`

- 每道练习都有输入框：自己写代码，点“运行我的代码”看结果（2026-11-13 加上）；要改的例子、要修的错代码会先填进输入框，只改关键部分就行
