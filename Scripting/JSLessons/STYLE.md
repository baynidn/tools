# JSLessons 写作标准（写每一章前必读）

读者：cc，不会英语，从零学 JS，只用手机。之前每天的课第一节就有他看不懂的词，所以这一套必须真正从零开始。

## 1. 语言铁律
- 全简体中文讲解。
- 英文关键字（let、const、console.log、Promise、fetch、JSON 等）只当固定写法讲：**第一次出现必须给中文意思**，之后每次用都带中文或已经解释过。
- 每个新词第一次出现，必须用一句话解释。不许出现没解释过的术语。
- 口语化、短句，像跟朋友说话。不用书面语、长难句，不用“首先、其次、综上所述”这类套话。

## 2. 每章固定结构（照 types/lesson.ts 的 Chapter 类型）
- goal：今天学什么（列出知识点）
- meaning：有什么意义（为什么要学，不学的话会遇到什么问题）
- sections：讲解小节，至少 4 节，每节 heading + body
- examples：实践例子，至少 3 个，每个有 title、code、explain、output
- exercises：练习题，至少 3 道，每道有 task、hint、answer、answerExplain
- 每道练习都有输入框：用户自己在里面写代码，点“运行我的代码”看结果，只看答案不算练。输入框是 TextField（axis="vertical"，多行），不是 TextEditor（Scripting 没有这个组件）。
- starter（起始代码）：要改的那行例子、要修的那段错代码、题目给的数据，先填进输入框，用户只改关键部分；从头写的题不填，输入框从空开始。starter 是给用户改的，不是答案，不许直接填答案代码。
- “修错”类练习的 starter 故意是错的（比如变量名数字开头、JSON 用单引号），运行时会报错，错了才是对的——用户修好再运行。

## 3. 例子必须能跑
- scripting 环境的例子：纯 JS，**不许用 document、window、alert**。每个例子的 output 必须与实际运行结果一字不差（包括换行）。
- fetch 的例子：用 `fetch("https://api.github.com/zen")` 这类真实可访问的地址，或用 setTimeout 模拟，不要编一个不存在的网址。
- 异步例子：用 `await new Promise(r => setTimeout(r, 100))` 这类写法，别用超过 1 秒的等待。
- where 字段：默认 scripting；Surge 的例子标 "surge"，Loon 标 "loon"，Workers 标 "worker"，并写 runNote 说明去哪里运行、为什么在 Scripting 里跑不了。
- 练习题的 answer 代码必须能运行（测试会真的跑一遍）。

## 4. 举例要用用户自己的东西
- 用 tg-bot、MiSub、订阅、模块、Surge、节点这些他天天用的东西举例，不要用 foo/bar、抽象的 a/b/c。
- 比如：数组举例用节点列表，对象举例用一条订阅配置，JSON 举例用 KV 里存的数据。

## 5. 术语对照（第一次出现时按这个解释）
- 变量 = 给数据起个名字存起来，后面随时能用
- 函数 = 一段能重复用的吩咐
- 对象 = 一堆有名字的东西放在一起
- 数组 = 一排有顺序的东西
- 字符串 = 一串文字（双引号包着的）
- 数字 = 数
- 布尔值 = 是 / 不是（true 是“是”，false 是“不是”）
- 异步 = 不用等，好了再通知你
- Promise = 一张“以后会给结果”的欠条
- fetch = 去网上拿东西
- JSON = 一种写数据的格式
- API = 别人给你准备好的功能，你拿来就能用
- 服务器 = 一台一直开着的电脑，专门给别人提供服务
- 客户端 = 你手机上的 App
- 运行环境 = 让代码跑起来的地方

## 6. 章节内容要点（按《JavaScript学习资料》17 章）
- 第 2 章 变量与数据类型：let、const（var 提一句别用）；字符串、数字、布尔值、null、undefined；typeof；变量命名规矩
- 第 3 章 字符串：引号三种；拼接（+ 和模板字符串）；length、取字符、转大小写、查找、切分、替换；用订阅链接举例
- 第 4 章 数组与对象：数组创建、取元素、length、push、for...of 遍历、map、filter；对象键值对、点号取值、增删改；数组里放对象（节点列表举例）
- 第 5 章 运算符与控制流：算术、比较（== 和 === 的区别要讲清）、逻辑 && || !；if/else；三元运算符；for、while；用“节点是否过期”举例
- 第 6 章 函数：function 是什么；参数、返回值；箭头函数；作用域（变量在哪里能用）；回调函数预告
- 第 7 章 JSON：JSON 是什么；JSON.stringify（对象变文字）、JSON.parse（文字变对象）；JSON 和 JS 对象的区别（键必须双引号）；用 MiSub 订阅配置举例；KV 里存的就是 JSON 文字
- 第 8 章 异步：同步和异步；setTimeout；Promise；async/await；fetch；忘了 await 的 bug；用 tg-bot 定时刷新订阅举例
- 第 9 章 报错处理与调试：报错是什么；常见报错（拼写错、括号没关、undefined）；try/catch；console.log 调试法；怎么读报错信息（第几行、什么错）
- 第 10 章 Cloudflare Workers：Workers 是什么；请求和响应（Request/Response）；写一个返回“你好”的 Worker；环境变量、KV 绑定；部署；用 tg-bot / sub-provider 举例
- 第 11 章 模块文件格式：.sgmodule 是什么；[Script]、[Rule]、[MITM] 等段；#!name、#!desc 的意思；Loon 插件格式；写一个最简单的模块
- 第 12 章 Surge 脚本 API：$httpClient、$notification、$persistentStore、$done；脚本类型（http-request、cron、event）；真实例子（检查订阅到期）
- 第 13 章 Loon 脚本 API 与差异：Loon 的同名 API 和 Surge 的异同；Loon 特有的东西；差异对照表
- 第 14 章 REX 模块说明：REX 是什么；REX 模块格式；和 Surge/Loon 模块的区别；写一个 REX 能用的脚本
- 第 15 章 多端兼容写法：一段代码同时在 Surge、Loon、QX、Stash 跑；环境判断；封装统一的 http、通知、存储函数；给一个兼容层模板
- 第 16 章 完整实战两例：例 1 订阅节点计数器（拉订阅链接，数节点、按地区分组）；例 2 模块状态检查脚本。代码要完整、能直接用
- 第 17 章 学习路线与练习：回顾 17 章；下一步学什么（TypeScript、写自己的 Worker 项目、给 SurgeMod 加功能）；10 道综合练习题

## 7. 文件规范
- 每章一个文件：chapters/ch02.ts … ch17.ts，导出 `export const ch02: Chapter = {...}`（章号对应）。
- 文件头 import：`import type { Chapter } from "../types/lesson"`。
- 用 muse.exec + python stdin 原样落盘（muse.write 会剥缩进），写完自己用 node 跑一遍例子验证输出。
- 只写自己负责的章节文件，不要改 chapters/index.ts（主代理统一登记）。
