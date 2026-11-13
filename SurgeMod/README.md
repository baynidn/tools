# SurgeMod

只保留 Surge 的本地模块管理器，相当于 SurgeModuleTools 的功能 + 界面：

- 批量更新带 `#SUBSCRIBED` 的本地 Surge 模块（`.sgmodule`）
- 点一行更新单个模块
- 从链接安装，自动取出真正的资源地址
- 重载 Surge
- 选择模块文件夹
- 更新时保留本地 `#!category` 字段，不被上游替换（与 SurgeModuleTools 2.04.2 同一逻辑）

只有首页一个页面，没有其它页面。

## 导入

```text
https://github.com/baynidn/tools/tree/main/SurgeMod
```

更新时重新导入一次仓库目录即可；本地模块与设置不受影响。

## 来源

基于 ModuleDock（Zerolost/scripting-script）精简为 Surge 单端。
