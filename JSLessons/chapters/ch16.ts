import type { Chapter } from "../types/lesson"

/** 第 16 章：完整实战两例
 * 写作标准：从零开始，每个新词第一次出现必须解释。
 */
export const ch16: Chapter = {
  id: 16,
  title: "完整实战两例",
  goal: "今天学 2 个完整实战：\n1. 订阅节点计数器：拉 MiSub 的 Surge 订阅，数节点、按地区分组，发通知告诉你结果\n2. 模块状态检查脚本：检查你那几个模块的网址能不能打开，坏了就通知你\n两个脚本的代码都是完整的，改一个链接就能直接用。",
  meaning: "前面 15 章学的都是零件：变量、函数、JSON、异步、Surge 的 API、兼容写法。这一章把零件拼成两个能真正用的东西。\n\n订阅节点计数器：每天自动跑一次，节点少了、哪个地区的节点没了，你马上知道，不用一个一个数。\n\n模块状态检查：你放在 GitHub 上的模块，万一哪天地址变了、仓库出问题了，它第一时间通知你，不用等到要用的时候才发现坏了。\n\n这一章的重点不是背代码，是看一个完整的脚本是怎么从“要做什么”一步一步变成代码的。看懂这个过程，你就能自己写别的脚本了。",
  sections: [
    {
      heading: "1. 实战 1：订阅节点计数器要做什么",
      body: "这个脚本每天自动跑一次，做三件事：\n\n1. 去拉你的订阅链接，拿到订阅内容。订阅内容就是一行一个节点，像这样：香港 01 = vless, example.com, 443, ...\n2. 数一数一共有多少个节点，再按地区分个组：香港几个、美国几个、日本几个。\n3. 发一条通知告诉你结果。\n\n为什么要做这个？节点数突然变少了，可能是机场出问题了；某个地区的节点全没了，可能是订阅更新出问题了。每天看一眼通知，心里就有数。",
      think: "每天数一遍订阅里有多少个节点，你猜最省事的办法是自己一个个数，还是让脚本数？",
    },
    {
      heading: "2. 实战 1 分三步：拉取、数、分组",
      body: "第 1 步，拉取：用 $httpClient.get 去拉订阅链接（第 12 章讲过，$httpClient 是 Surge、Loon 里发网络请求的工具）。拉回来的内容是一大段文字。\n\n第 2 步，数：用 split 按换行把这段文字切成一行一行（split 是切分的固定写法，第 3 章讲过；代码里写的是 split(\"\\n\")，\\n 就是换行的意思，一行结束、下一行开始的地方就是一个换行）。然后一行一行看：这一行是不是节点？节点行的样子是“名字 = 协议, 服务器, 端口,...”，比如“香港 01 = vless, ...”。只要这一行里有“ = vless,”或者“ = trojan,”这些字，就是节点行。\n\n第 3 步，分组：看节点名字里有没有地名。名字里有“香港”就归到香港，有“美国”就归到美国。有些节点名字是英文代号，比如 HK、US、JP，也要认。分组的办法就是第 15 章说的“认地区”函数。\n\n还有两个小东西：trim() 是去掉一串文字两头空格的固定写法；continue 的意思是“这一行跳过，看下一行”。",
      think: "一整段订阅文字摆在面前，你猜第一步该先把它变成什么样子才好数？",
    },
    {
      heading: "3. 实战 2：模块状态检查脚本要做什么",
      body: "这个脚本也是每天自动跑一次，做三件事：\n\n1. 列出你要检查的模块网址，比如 SurgeModuleTools、ModuleDock、SurgeMod 在 GitHub 上的地址。\n2. 一个一个去访问，看哪个能打开、哪个打不开。\n3. 发一条通知汇总结果：正常几个，异常几个，异常的是谁。\n\n为什么要做这个？模块是每天都在用的东西，万一哪天仓库里的文件被误删了、地址变了，你马上就能知道，不用等到想更新模块的时候才发现。",
      think: "模块的网址坏了，你猜什么时候发现最晚、什么时候发现最早？",
    },
    {
      heading: "4. 实战 2 分三步：列清单、轮流查、汇总",
      body: "第 1 步，列清单：把要检查的模块写成一个数组，数组里放对象（第 4 章讲过，数组是一排有顺序的东西，对象是一堆有名字的东西放在一起）。每个对象有两个东西：名字和网址。\n\n第 2 步，轮流查：用 $httpClient.get 一个一个去访问。注意一个关键点：发网络请求是异步的（第 8 章讲过，异步是不用等，好了再通知你）。三个请求几乎同时发出去，谁先回来没准。所以要数“查完几个”，等三个都查完了再发通知，不能查完一个发一个。\n\n第 3 步，汇总：把正常的名字放进一个数组，把异常的名字放进另一个数组，最后用 join(\"、\") 把异常的名字连成一串文字（join 是把数组里的东西用指定的字连成一串文字的固定写法）。\n\n还有一个小提醒：检查的时候要看状态码。状态码是服务器告诉你“这次请求怎么样了”的数字，200 的意思是“成功了”，不是 200 就是有问题。",
      think: "三个请求差不多同时发出去，你猜怎么知道三个都查完了、可以发通知了？",
    },
    {
      heading: "5. 怎么用、怎么调",
      body: "用法：把完整代码放进 Surge，当成定时任务（cron）每天跑一次。cron 是定时任务的意思，到了你定的时间自动跑一次，第 12 章讲过。Loon 里也能直接跑同一份代码，因为 Loon 和 Surge 的 API 是一样的。\n\n调试的办法：不要一上来就把完整版放进 Surge。先在 Scripting 里把核心逻辑跑通——分组的函数、汇总的函数，用的都是第 15 章以前讲过的东西，在 Scripting 里都能跑。核心逻辑通了，再把完整版放进 Surge，只调“拉取”和“通知”这两步。\n\n出问题了怎么办：先看第 9 章的办法，分段打印。用 console.log 把拉回来的内容、数出来的行数、分组的结果一段一段打出来，看到哪一步不对，就修哪一步。",
      think: "完整版脚本直接放进 Surge 就跑，你猜万一跑不起来，第一步该先查哪里？",
    },
  ],
  examples: [
    {
      title: "例子 1：订阅节点计数器（完整版）",
      code: "// 订阅节点计数器：拉订阅，数节点，按地区分组，发通知\n// 用法：放进 Surge（或 Loon）当定时任务（cron），每天自动跑一次\n\n// 第 1 步：把下面这行改成你自己的订阅链接，比如 MiSub 的 Surge 订阅地址\nlet 订阅链接 = \"https://sub.example.com/xxx\"\n\n// 看节点名字里有没有地名，有就归到那个地区\nfunction 认地区(名字) {\n  if (名字.indexOf(\"香港\") !== -1 || 名字.indexOf(\"HK\") !== -1) return \"香港\"\n  if (名字.indexOf(\"美国\") !== -1 || 名字.indexOf(\"洛杉矶\") !== -1 || 名字.indexOf(\"US\") !== -1) return \"美国\"\n  if (名字.indexOf(\"日本\") !== -1 || 名字.indexOf(\"东京\") !== -1 || 名字.indexOf(\"JP\") !== -1) return \"日本\"\n  if (名字.indexOf(\"新加坡\") !== -1 || 名字.indexOf(\"SG\") !== -1) return \"新加坡\"\n  if (名字.indexOf(\"台湾\") !== -1 || 名字.indexOf(\"TW\") !== -1) return \"台湾\"\n  if (名字.indexOf(\"英国\") !== -1 || 名字.indexOf(\"伦敦\") !== -1 || 名字.indexOf(\"UK\") !== -1) return \"英国\"\n  return \"其他\"\n}\n\n// 看这一行是不是节点：节点行的样子是“名字 = 协议, 服务器, 端口,...”\nfunction 是节点行(行) {\n  let 协议 = [\" = vmess,\", \" = vless,\", \" = trojan,\", \" = ss,\", \" = ssr,\", \" = hysteria2,\", \" = tuic,\"]\n  for (let i = 0; i < 协议.length; i++) {\n    if (行.indexOf(协议[i]) !== -1) return true\n  }\n  return false\n}\n\n$httpClient.get(订阅链接, function (错误, 响应, 内容) {\n  if (错误) {\n    $notification.post(\"节点计数\", \"\", \"拉订阅失败了：\" + 错误)\n    $done()\n    return\n  }\n  let 行列表 = 内容.split(\"\\n\")\n  let 分组 = {}\n  let 总数 = 0\n  for (let i = 0; i < 行列表.length; i++) {\n    let 行 = 行列表[i].trim()\n    if (!是节点行(行)) continue\n    let 名字 = 行.split(\" = \")[0].trim()\n    let 地区 = 认地区(名字)\n    if (!分组[地区]) 分组[地区] = 0\n    分组[地区] = 分组[地区] + 1\n    总数 = 总数 + 1\n  }\n  let 报告 = \"一共 \" + 总数 + \" 个节点\\n\"\n  for (let 地区 in 分组) {\n    报告 = 报告 + 地区 + \"：\" + 分组[地区] + \" 个\\n\"\n  }\n  $notification.post(\"节点计数\", \"\", 报告)\n  $done()\n})",
      explain: "第 1 行先改成你自己的订阅链接，比如 MiSub 的 Surge 订阅地址。\n$httpClient.get 是去拉订阅（第 12 章讲过）；拉回来以后执行的函数叫“回调函数”，第 6 章讲过。\n内容.split(\"\\n\") 是按换行把整段文字切成一行一行（\\n 就是换行的意思）。\ntrim() 是去掉一串文字两头空格的固定写法。\ncontinue 的意思是“这一行跳过，看下一行”。\nfor...in 是遍历对象的写法：把对象里的每个键名轮流取出来，这里是把每个地区轮流取出来拼进报告里。\n最后发一条通知，报告里有总数和每个地区的数量；下面的数字是你订阅的真实数字，这里是照 30 个节点的样子举的例子。",
      output: "比如你的订阅有 30 个节点，通知会是这样：\n标题：节点计数\n内容：一共 30 个节点\n香港：12 个\n美国：8 个\n日本：5 个\n新加坡：3 个\n其他：2 个",
      where: "surge",
      runNote: "这段代码要放进 Surge（或 Loon）里跑，当成定时任务每天跑一次。Scripting 里没有 $httpClient、$notification，所以跑不了。先把订阅链接改成你自己的 MiSub Surge 订阅地址，再放进去。",
    },
    {
      title: "例子 2：核心逻辑——按地区分组（能在 Scripting 里跑）",
      code: "// 订阅里常见的节点名字（Surge 格式里 = 前面的名字）\nlet 节点名字 = [\"香港 01\", \"香港 02\", \"香港 03\", \"美国洛杉矶 01\", \"美国硅谷 01\", \"日本东京 01\", \"日本大阪 01\", \"新加坡 01\", \"台湾 01\", \"英国伦敦 01\", \"德国 01\"]\n\nfunction 认地区(名字) {\n  if (名字.indexOf(\"香港\") !== -1 || 名字.indexOf(\"HK\") !== -1) return \"香港\"\n  if (名字.indexOf(\"美国\") !== -1 || 名字.indexOf(\"洛杉矶\") !== -1 || 名字.indexOf(\"US\") !== -1) return \"美国\"\n  if (名字.indexOf(\"日本\") !== -1 || 名字.indexOf(\"东京\") !== -1 || 名字.indexOf(\"JP\") !== -1) return \"日本\"\n  if (名字.indexOf(\"新加坡\") !== -1 || 名字.indexOf(\"SG\") !== -1) return \"新加坡\"\n  if (名字.indexOf(\"台湾\") !== -1 || 名字.indexOf(\"TW\") !== -1) return \"台湾\"\n  if (名字.indexOf(\"英国\") !== -1 || 名字.indexOf(\"伦敦\") !== -1 || 名字.indexOf(\"UK\") !== -1) return \"英国\"\n  return \"其他\"\n}\n\nlet 分组 = {}\nfor (let i = 0; i < 节点名字.length; i++) {\n  let 地区 = 认地区(节点名字[i])\n  if (!分组[地区]) 分组[地区] = 0\n  分组[地区] = 分组[地区] + 1\n}\nconsole.log(\"一共 \" + 节点名字.length + \" 个节点\")\nfor (let 地区 in 分组) {\n  console.log(地区 + \"：\" + 分组[地区] + \" 个\")\n}",
      explain: "认地区函数就是完整版里用的那个，一模一样。\n节点名字是 Surge 格式里 = 前面的名字。\n分组的办法：建一个空对象，地区第一次出现时先记成 0，再加 1。\nfor...in 是遍历对象的写法：把对象里的每个键名轮流取出来。\n注意“德国 01”哪个地区都不是，所以归到“其他”。",
      output: "一共 11 个节点\n香港：3 个\n美国：2 个\n日本：2 个\n新加坡：1 个\n台湾：1 个\n英国：1 个\n其他：1 个",
    },
    {
      title: "例子 3：模块状态检查脚本（完整版）",
      code: "// 模块状态检查：看看每个模块的网址能不能打开\n// 用法：放进 Surge（或 Loon）当定时任务（cron），每天自动跑一次\n\n// 要检查的模块：名字 + 网址（已经按你 GitHub 上 baynidn/tools 仓库的真实地址写好了）\nlet 模块列表 = [\n  { 名字: \"SurgeModuleTools\", 网址: \"https://raw.githubusercontent.com/baynidn/tools/main/SurgeModuleTools.js\" },\n  { 名字: \"ModuleDock\", 网址: \"https://raw.githubusercontent.com/baynidn/tools/main/ModuleDock/script.json\" },\n  { 名字: \"SurgeMod\", 网址: \"https://raw.githubusercontent.com/baynidn/tools/main/SurgeMod/script.json\" }\n]\n\nlet 好的 = []\nlet 坏的 = []\nlet 查完的 = 0\n\nfor (let i = 0; i < 模块列表.length; i++) {\n  let 模块 = 模块列表[i]\n  $httpClient.get(模块.网址, function (错误, 响应, 内容) {\n    if (错误 || 响应.status !== 200) {\n      坏的.push(模块.名字)\n    } else {\n      好的.push(模块.名字)\n    }\n    查完的 = 查完的 + 1\n    if (查完的 === 模块列表.length) {\n      let 报告 = \"正常 \" + 好的.length + \" 个，异常 \" + 坏的.length + \" 个\"\n      if (坏的.length > 0) {\n        报告 = 报告 + \"\\n异常：\" + 坏的.join(\"、\")\n      }\n      $notification.post(\"模块检查\", \"\", 报告)\n      $done()\n    }\n  })\n}",
      explain: "模块的网址已经按你 GitHub 上 baynidn/tools 仓库的真实地址写好了，不用改就能用。\nfor 循环里用 let 声明“模块”，每一轮的“模块”都是独立的，不会串。\n响应.status 是状态码，200 的意思是“成功了”；错误或者状态码不是 200，就记成异常。\n查完的数到 3（也就是模块列表的长度）时，说明三个都查完了，这时候才发通知。\n如果哪个模块打不开了，通知里会多一行“异常：名字”。",
      output: "标题：模块检查\n内容：正常 3 个，异常 0 个",
      where: "surge",
      runNote: "这段代码要放进 Surge（或 Loon）里跑，当成定时任务每天跑一次。Scripting 里没有 $httpClient、$notification，所以跑不了。模块的网址是真实地址，不用改就能用。",
    },
    {
      title: "例子 4：核心逻辑——汇总报告（能在 Scripting 里跑）",
      code: "let 检查结果 = [\n  { 名字: \"SurgeModuleTools\", 正常: true },\n  { 名字: \"ModuleDock\", 正常: true },\n  { 名字: \"SurgeMod\", 正常: false }\n]\n\nlet 好的 = []\nlet 坏的 = []\nfor (let i = 0; i < 检查结果.length; i++) {\n  if (检查结果[i].正常) {\n    好的.push(检查结果[i].名字)\n  } else {\n    坏的.push(检查结果[i].名字)\n  }\n}\n\nconsole.log(\"正常 \" + 好的.length + \" 个，异常 \" + 坏的.length + \" 个\")\nif (坏的.length > 0) {\n  console.log(\"异常：\" + 坏的.join(\"、\"))\n}",
      explain: "检查结果是假数据，真的检查要去访问网址（例子 3 的完整版）。\n好的和坏的分别放进两个数组：正常就放进好的，不正常就放进坏的。\njoin(\"、\") 是把数组里的东西用“、”连成一串文字的固定写法。\n如果没有异常，第二行就不打印。",
      output: "正常 2 个，异常 1 个\n异常：SurgeMod",
    },
  ],
  exercises: [
    {
      task: "把下面这段订阅文本存进一个变量，用 split 按行切开，数一数有几行是节点（节点行的样子是“名字 = 协议, ...”），打印结果。\n\n香港 01 = vless, example.com, 443\n# 这是一行注释\n美国 01 = trojan, example.com, 443\n[Proxy]\n日本 01 = ss, example.com, 8388",
      hint: "节点行里都有“ = ”这三个字，注释行和 [Proxy] 行没有。用 indexOf(\" = \") 判断这一行里有没有“ = ”，有就是节点行。",
      starter: "let 订阅文本 = \"香港 01 = vless, example.com, 443\\n# 这是一行注释\\n美国 01 = trojan, example.com, 443\\n[Proxy]\\n日本 01 = ss, example.com, 8388\"\nlet 行列表 = 订阅文本.split(\"\\n\")",
      answer: "let 订阅文本 = \"香港 01 = vless, example.com, 443\\n# 这是一行注释\\n美国 01 = trojan, example.com, 443\\n[Proxy]\\n日本 01 = ss, example.com, 8388\"\nlet 行列表 = 订阅文本.split(\"\\n\")\nlet 数量 = 0\nfor (let i = 0; i < 行列表.length; i++) {\n  if (行列表[i].indexOf(\" = \") !== -1) {\n    数量 = 数量 + 1\n  }\n}\nconsole.log(\"节点一共 \" + 数量 + \" 个\")",
      answerExplain: "split(\"\\n\") 是按换行切开，得到 5 行；indexOf(\" = \") 找的是“ = ”这三个字，找到了就不是 -1，找不到就是 -1；数下来一共 3 行是节点。\n运行后应该显示：节点一共 3 个。",
    },
    {
      task: "给一个节点名字数组：[\"HK 01\", \"HK 02\", \"US 01\", \"JP 01\", \"JP 02\", \"JP 03\"]，用例子 2 的认地区函数分组，打印一共几个节点、每个地区几个。",
      hint: "认地区函数直接照例子 2 的抄；分组的办法也照例子 2 的抄：建一个空对象，地区第一次出现时先记成 0，再加 1。",
      starter: "let 节点 = [\"HK 01\", \"HK 02\", \"US 01\", \"JP 01\", \"JP 02\", \"JP 03\"]",
      answer: "let 节点 = [\"HK 01\", \"HK 02\", \"US 01\", \"JP 01\", \"JP 02\", \"JP 03\"]\n\nfunction 认地区(名字) {\n  if (名字.indexOf(\"香港\") !== -1 || 名字.indexOf(\"HK\") !== -1) return \"香港\"\n  if (名字.indexOf(\"美国\") !== -1 || 名字.indexOf(\"洛杉矶\") !== -1 || 名字.indexOf(\"US\") !== -1) return \"美国\"\n  if (名字.indexOf(\"日本\") !== -1 || 名字.indexOf(\"东京\") !== -1 || 名字.indexOf(\"JP\") !== -1) return \"日本\"\n  if (名字.indexOf(\"新加坡\") !== -1 || 名字.indexOf(\"SG\") !== -1) return \"新加坡\"\n  if (名字.indexOf(\"台湾\") !== -1 || 名字.indexOf(\"TW\") !== -1) return \"台湾\"\n  if (名字.indexOf(\"英国\") !== -1 || 名字.indexOf(\"伦敦\") !== -1 || 名字.indexOf(\"UK\") !== -1) return \"英国\"\n  return \"其他\"\n}\n\nlet 分组 = {}\nfor (let i = 0; i < 节点.length; i++) {\n  let 地区 = 认地区(节点[i])\n  if (!分组[地区]) 分组[地区] = 0\n  分组[地区] = 分组[地区] + 1\n}\nconsole.log(\"一共 \" + 节点.length + \" 个节点\")\nfor (let 地区 in 分组) {\n  console.log(地区 + \"：\" + 分组[地区] + \" 个\")\n}",
      answerExplain: "HK 开头的是香港，US 开头的是美国，JP 开头的是日本。\n运行后应该显示：\n一共 6 个节点\n香港：2 个\n美国：1 个\n日本：3 个",
    },
    {
      task: "给一个模块检查结果数组：SurgeModuleTools 正常，ModuleDock 异常，SurgeMod 异常。写代码汇总：打印“正常几个，异常几个”，再打印异常的名字。",
      hint: "照例子 4 的样子，准备两个空数组：好的和坏的，轮流看每个模块，正常就放进好的，不正常就放进坏的；最后用 join(\"、\") 把坏的名字连起来。",
      starter: "let 模块 = [\n  { 名字: \"SurgeModuleTools\", 正常: true },\n  { 名字: \"ModuleDock\", 正常: false },\n  { 名字: \"SurgeMod\", 正常: false }\n]",
      answer: "let 模块 = [\n  { 名字: \"SurgeModuleTools\", 正常: true },\n  { 名字: \"ModuleDock\", 正常: false },\n  { 名字: \"SurgeMod\", 正常: false }\n]\n\nlet 好的 = []\nlet 坏的 = []\nfor (let i = 0; i < 模块.length; i++) {\n  if (模块[i].正常) {\n    好的.push(模块[i].名字)\n  } else {\n    坏的.push(模块[i].名字)\n  }\n}\n\nconsole.log(\"正常 \" + 好的.length + \" 个，异常 \" + 坏的.length + \" 个\")\nif (坏的.length > 0) {\n  console.log(\"异常：\" + 坏的.join(\"、\"))\n}",
      answerExplain: "好的数组里 1 个名字，坏的数组里 2 个名字；join(\"、\") 是把数组里的东西用“、”连成一串文字。\n运行后应该显示：\n正常 1 个，异常 2 个\n异常：ModuleDock、SurgeMod",
    },
  ],
  mistakes: [
    {
      wrong: "let n = await env.LINKS.get(\"count:gh\")\nawait env.LINKS.put(\"count:gh\", n + 1)",
      right: "let n = Number(await env.LINKS.get(\"count:gh\")) || 0\nawait env.LINKS.put(\"count:gh\", String(n + 1))",
      why: "KV 里存的全是字符串，不转数字就加，加出来的是拼起来的文字 71，不是 8。",
    },
    {
      wrong: "$httpClient.get(模块.网址, function (错误, 响应, 内容) {\n  $notification.post(\"模块检查\", \"\", \"查完了一个\")\n})",
      right: "$httpClient.get(模块.网址, function (错误, 响应, 内容) {\n  查完的 = 查完的 + 1\n  if (查完的 === 模块列表.length) {\n    $notification.post(\"模块检查\", \"\", \"三个都查完了\")\n  }\n})",
      why: "发网络请求是异步的，三个请求谁先回来没准；不等全查完就发通知，数字是错的。",
    },
    {
      wrong: "for (var i = 0; i < 模块列表.length; i++) {\n  var 模块 = 模块列表[i]\n  $httpClient.get(模块.网址, function () { console.log(模块.名字) })\n}",
      right: "for (let i = 0; i < 模块列表.length; i++) {\n  let 模块 = 模块列表[i]\n  $httpClient.get(模块.网址, function () { console.log(模块.名字) })\n}",
      why: "var 声明的变量每一轮是同一个，回调跑起来时循环早跑完了，取到的全是最后一个模块；let 每一轮都是独立的。",
    },
  ],
  recall: [
    {
      q: "订阅节点计数器分哪三步？",
      a: "拉取订阅、数节点、按地区分组，再发通知。",
    },
    {
      q: "KV 里的计数为什么要先 Number() 再加？",
      a: "KV 存的全是字符串，不转就加会拼成文字，比如 7 加 1 变成 71。",
    },
    {
      q: "模块状态检查为什么要等三个都查完再发通知？",
      a: "发请求是异步的，谁先回来没准；不等全查完就发，数字是错的。",
    },
  ],
  mentalModel: "实战就是骨架加细节：云端是接请求、读数据、查存储、回响应，手机端是拿现场、改数据、交卷，剩下的只是规模和分支。",
}
