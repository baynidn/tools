import type { Chapter } from "../types/lesson"

/** 第 15 章：多端兼容写法
 * 写作标准：从零开始，每个新词第一次出现必须解释。
 */
export const ch15: Chapter = {
  id: 15,
  title: "多端兼容写法",
  goal: "今天学 4 件事：\n1. 为什么 Surge、Loon、QX、Stash 四个 App 的 JS 写法不一样\n2. 环境判断：怎么知道代码现在在哪个 App 里跑\n3. 封装：把不同的写法包成同一个函数\n4. 兼容层模板：一次写好，以后每个脚本开头复制过去就能用",
  meaning: "你现在用的模块，要在 Surge、Loon 里跑；以后你写的脚本，可能还要在 QX、Stash 里跑。四个 App 的 JS 语言是一样的，但它们给你的“工具”名字不一样：发请求、发通知、存东西，每个 App 的写法都不同。\n\n如果每个 App 各写一份代码，改一个功能要改四份，又累又容易改漏。学会兼容写法，你只用写一份代码，四个 App 都能跑，改功能也只改一个地方。\n\n这一章学完，你写的第 16 章两个实战脚本，就能直接在四个 App 里跑。",
  sections: [
    {
      heading: "1. 为什么四个 App 的写法不一样",
      body: "Surge、Loon、QX、Stash，都是手机上的代理 App，都能跑 JS 脚本。\n\nQX 是 Quantumult X 的简称，也是一款代理 App，跟 Surge、Loon 差不多。Stash 是另一款代理 App。\n\nJS 语言本身是一样的，变量、函数这些写法到处都一样。不一样的是每个 App 给 JS 准备的“工具”：\n\n发网络请求：Surge 和 Loon 叫 $httpClient，QX 叫 $task。\n发通知：Surge 和 Loon 叫 $notification，QX 叫 $notify。\n存东西：Surge 和 Loon 叫 $persistentStore，QX 叫 $prefs。\n\n这些带 $ 开头的名字叫“API”。API 的意思是：别人给你准备好的功能，你拿来就能用。第 12 章讲过 Surge 的 API，第 13 章讲过 Loon 的 API。\n\n所以问题不在语言，在工具名字不一样。只要把“名字不一样”这个问题解决掉，一段代码就能到处跑。",
      think: "JS 语言到处都一样，你猜四个 App 的脚本到底不一样在哪？",
    },
    {
      heading: "2. 环境判断：先问一句“现在是在哪个 App 里”",
      body: "“环境判断”的意思：代码先问一句“我现在是在哪个 App 里跑”，再决定用哪套写法。\n\n判断的办法是用 typeof。typeof 是看一个东西是什么类型的固定写法，第 2 章讲过。比如 typeof $task：如果在 QX 里，$task 是存在的，结果就不是 undefined；如果在 Surge 里，$task 不存在，结果就是 undefined。undefined 的意思是“没有这个东西”。\n\n判断的顺序是：先看 $task，有就是 QX；再看 $loon，有就是 Loon；再看 $httpClient，有就是 Surge 或者 Stash。\n\nStash 为什么不用单独判断？Stash 是照着 Surge 的写法做的，$httpClient 那一套在 Stash 里一样能用，所以把它当成 Surge 就行，不用分出来。\n\n在 Scripting 里，这四个记号一个都没有，所以判断结果是“都不是”。正好用这个办法区分“在代理 App 里跑”还是“在 Scripting 里跑”。",
      think: "代码自己怎么知道现在在哪个 App 里跑？你猜它靠什么认出来？",
    },
    {
      heading: "3. 封装：把不同的写法包成同一个函数",
      body: "“封装”的意思：把几种不同的写法包起来，对外只留一个名字。以后你只用记这一个名字，里面用哪套写法由它自己判断。\n\n比如发通知：包一个叫“统一通知”的函数，里面判断一下，是 QX 就用 $notify，是 Surge、Loon 就用 $notification.post。\n\n好处是：以后写脚本，你只写“统一通知(...)”，不用管现在在哪个 App 里；换个 App 跑，代码一行都不用改。\n\n提醒一句：你自己起的函数名字，在真的脚本里一般用英文（比如 notify），这里用中文名字是为了让你一眼看懂意思，道理完全一样。",
      think: "四个 App 发通知的写法各不相同，你猜能不能只记一个名字就全搞定？",
    },
    {
      heading: "4. 兼容层模板：一次写好，到处复制",
      body: "“兼容层”的意思：一层专门负责“翻译”的代码，把四个 App 的不同写法翻译成同一套写法。\n\n模板里有四样东西：环境判断、统一拉取（发网络请求）、统一通知、统一存取。\n\n用法很简单：每个新脚本开头，把模板复制过去，后面就只用统一的写法写逻辑，不用再管每个 App 的区别。\n\n还有一个不能忘的：每个脚本最后都要调 $done()。$done 的意思是“这个脚本跑完了”。忘了调，Surge 会一直等着，以为你还没跑完。",
      think: "参数在不同 App 里给法不一样，你猜一种读法能不能全接住？",
    },
    {
      heading: "5. 三个容易踩的坑",
      body: "坑 1：$httpClient 用的是“回调”写法。第 6 章说过回调函数：先发出请求，等有了结果再执行你给的函数。所以结果只能在回调函数里用，不能在外面等着拿。\n\n坑 2：QX 的 $task.fetch 返回的是 Promise。第 8 章讲过，Promise 是一张“以后会给结果”的欠条，要拿 .then 或者 await 才能拿到结果。\n\n坑 3：存东西的时候只能存文字（字符串）。想存对象，要先用 JSON.stringify 变成文字（第 7 章讲过），取出来再用 JSON.parse 变回来。",
      think: "请求发出去了，结果却拿不到，你猜问题最可能出在哪一步？",
    },
  ],
  examples: [
    {
      title: "例子 1：环境判断——先问一句“在哪个 App 里”",
      code: "function 是Surge() {\n  return typeof $httpClient !== \"undefined\" && typeof $loon === \"undefined\"\n}\nfunction 是Loon() {\n  return typeof $loon !== \"undefined\"\n}\nfunction 是QX() {\n  return typeof $task !== \"undefined\"\n}\nconsole.log(\"是 Surge 吗：\" + 是Surge())\nconsole.log(\"是 Loon 吗：\" + 是Loon())\nconsole.log(\"是 QX 吗：\" + 是QX())",
      explain: "typeof 是看一个东西是什么类型的固定写法，第 2 章讲过。typeof $httpClient 的意思就是问：$httpClient 这个东西存在吗。\n&& 的意思是“并且”，第 5 章讲过。\n是Surge() 的意思是：$httpClient 存在，并且 $loon 不存在，就是 Surge。\n是Loon() 的意思是：$loon 存在，就是 Loon。\n是QX() 的意思是：$task 存在，就是 QX。\n在 Scripting 里跑，这三个记号一个都没有，所以三个都是 false。false 是“不是”的意思，第 2 章讲过。",
      output: "是 Surge 吗：false\n是 Loon 吗：false\n是 QX 吗：false",
    },
    {
      title: "例子 2：兼容层模板",
      code: "// ============ 兼容层模板：复制到每个脚本开头 ============\n\n// 判断现在是在哪个 App 里\nfunction 环境() {\n  if (typeof $task !== \"undefined\") return \"QX\"\n  if (typeof $loon !== \"undefined\") return \"Loon\"\n  if (typeof $httpClient !== \"undefined\") return \"Surge\"\n  return \"不知道\"\n}\n\n// 统一发通知：QX 用 $notify，Surge、Loon、Stash 用 $notification.post\nfunction 统一通知(标题, 内容) {\n  if (环境() === \"QX\") {\n    $notify(标题, \"\", 内容)\n  } else {\n    $notification.post(标题, \"\", 内容)\n  }\n}\n\n// 统一存东西：QX 用 $prefs，Surge、Loon、Stash 用 $persistentStore\nfunction 统一存(key, value) {\n  if (环境() === \"QX\") {\n    $prefs.setValueForKey(value, key)\n  } else {\n    $persistentStore.write(value, key)\n  }\n}\n\n// 统一取东西\nfunction 统一取(key) {\n  if (环境() === \"QX\") {\n    return $prefs.valueForKey(key)\n  } else {\n    return $persistentStore.read(key)\n  }\n}\n\n// 统一拉取：发网络请求拿内容，拿到以后执行你给的函数\n// 回调函数的意思：第 6 章讲过，先发出请求，等有了结果再执行这个函数\nfunction 统一拉取(网址, 回调) {\n  if (环境() === \"QX\") {\n    $task.fetch({ url: 网址 }).then(\n      function (回复) { 回调(null, 回复.body) },\n      function (错误) { 回调(错误) }\n    )\n  } else {\n    $httpClient.get(网址, function (错误, 回复, 内容) {\n      回调(错误, 内容)\n    })\n  }\n}\n\n// ============ 下面是用法：逻辑部分只用统一的写法 ============\n统一通知(\"订阅检查\", \"今天查完了，30 个节点都正常\")\n统一存(\"上次节点数\", \"30\")\n$done()",
      explain: "这个模板分两部分：上面是“工具箱”，下面是“用法”。\n环境() 先判断在哪个 App 里：有 $task 就是 QX，有 $loon 就是 Loon，有 $httpClient 就是 Surge（Stash 也走这一条）。\n统一通知、统一存、统一取、统一拉取，都是先判断环境，再用对应的写法。\n统一拉取的回调里，回调(null, 回复.body) 的 null 是“没有错误”的意思（null 的意思就是“没有”，第 2 章讲过）；回调(错误) 是把错误传回去。\n最后一行的 $done() 的意思是“这个脚本跑完了”，每个脚本最后都要调一次。\n定义函数的那几行不会显示任何东西，只有统一通知那一行会弹出一条通知。",
      output: "手机弹出一条通知：\n标题：订阅检查\n内容：今天查完了，30 个节点都正常",
      where: "surge",
      runNote: "这段代码要在 Surge、Loon、QX、Stash 里跑。Scripting 里没有 $httpClient、$notification、$task、$prefs 这些东西，所以在 Scripting 里跑不了；先看懂写法，第 16 章会真的用上它。",
    },
    {
      title: "例子 3：统一存取的 Scripting 版——先用对象当“小本子”",
      code: "// 在 Scripting 里没有 $persistentStore，先用一个对象当“小本子”\n// 对象 = 一堆有名字的东西放在一起\nlet 小本子 = {}\n\nfunction 存(key, value) {\n  小本子[key] = value\n}\n\nfunction 取(key) {\n  return 小本子[key]\n}\n\n存(\"上次节点数\", 30)\n存(\"订阅名字\", \"Kitty\")\nconsole.log(\"订阅：\" + 取(\"订阅名字\"))\nconsole.log(\"节点数：\" + 取(\"上次节点数\"))",
      explain: "Scripting 里没有 $persistentStore，所以先用一个对象当“小本子”，把东西记在对象里。\n存(key, value) 的意思是：往小本子里记一个东西，key 是这个东西的名字，value 是它的值。\n小本子[key] = value 的意思是：把值放到小本子里，挂上这个名字。\n取(key) 的意思是：按名字把东西拿出来。\n这个例子是练手用的，真的存取要到 Surge 里用 $persistentStore。",
      output: "订阅：Kitty\n节点数：30",
    },
    {
      title: "例子 4：发一次真的网络请求，看状态码",
      code: "async function 拉取() {\n  let 回复 = await fetch(\"https://api.github.com/zen\")\n  console.log(\"状态码：\" + 回复.status)\n}\n\nawait 拉取()",
      explain: "async 的意思是“异步函数”，第 8 章讲过。\nawait 的意思是“等一等，等结果回来”。\nfetch 是去网上拿东西，第 8 章讲过；这里拿的是 GitHub 上的一句话。\n回复.status 是状态码，状态码是服务器告诉你“这次请求怎么样了”的数字，200 的意思是“成功了”。",
      output: "状态码：200",
    },
  ],
  exercises: [
    {
      task: "写一个 是Loon() 函数，判断现在是不是在 Loon 里跑，打印结果。在 Scripting 里跑，应该显示 false。",
      hint: "照例子 1 的样子，用 typeof $loon 判断。$loon 是 Loon 才有的记号。",
      starter: "function 是Loon() {\n  // 在这里写判断：typeof $loon 是不是不等于 \"undefined\"\n}\nconsole.log(\"是 Loon 吗：\" + 是Loon());",
      answer: "function 是Loon() {\n  return typeof $loon !== \"undefined\"\n}\nconsole.log(\"是 Loon 吗：\" + 是Loon())",
      answerExplain: "typeof $loon 的意思是问：$loon 这个东西存在吗。在 Scripting 里它不存在，结果是 undefined，所以 是Loon() 返回 false（false 是“不是”的意思）。\n运行后应该显示：是 Loon 吗：false。",
    },
    {
      task: "用一个对象当“小本子”，存一个订阅的名字和节点数，再取出来打印成一句话：Kitty 有 30 个节点。",
      hint: "照例子 3 的样子，先建一个空对象，再用小本子[\"名字\"] = 值的写法存东西。",
      starter: "let 小本子 = {}\n小本子[\"订阅名字\"] = \"Kitty\"\n小本子[\"节点数\"] = 30",
      answer: "let 小本子 = {}\n小本子[\"订阅名字\"] = \"Kitty\"\n小本子[\"节点数\"] = 30\nconsole.log(小本子[\"订阅名字\"] + \"有\" + 小本子[\"节点数\"] + \"个节点\")",
      answerExplain: "小本子[\"订阅名字\"] = \"Kitty\" 的意思是：往小本子里存一个叫“订阅名字”的东西，值是 Kitty。取的时候用小本子[\"订阅名字\"] 就能拿出来。\n运行后应该显示：Kitty有30个节点。",
    },
    {
      task: "写一个“通知”函数：在 Surge、Loon 里用 $notification.post 发通知，在 Scripting 里没有 $notification，就用 console.log 打印出来。调用一次，标题写“订阅提醒”，内容写“订阅还有 3 天到期”。",
      hint: "先用 typeof $notification 判断它存在不存在，存在就用 $notification.post，不存在就用 console.log。",
      starter: "function 通知(标题, 内容) {\n  // 先判断 typeof $notification 是不是不等于 \"undefined\"\n  // 存在就用 $notification.post(标题, \"\", 内容)，不存在就用 console.log 打印出来\n}\n通知(\"订阅提醒\", \"订阅还有 3 天到期\")",
      answer: "function 通知(标题, 内容) {\n  if (typeof $notification !== \"undefined\") {\n    $notification.post(标题, \"\", 内容)\n  } else {\n    console.log(\"通知：\" + 标题 + \"：\" + 内容)\n  }\n}\n通知(\"订阅提醒\", \"订阅还有 3 天到期\")",
      answerExplain: "typeof $notification !== \"undefined\" 的意思是：$notification 这个东西存在。在 Scripting 里它不存在，所以走 console.log 那条路。\n运行后应该显示：通知：订阅提醒：订阅还有 3 天到期。",
    },
  ],
  mistakes: [
    {
      wrong: "if ($loon) {\n  console.log(\"在 Loon 里\")\n}",
      right: "if (typeof $loon !== \"undefined\") {\n  console.log(\"在 Loon 里\")\n}",
      why: "直接写一个不存在的变量会立刻报错，脚本直接停掉；用 typeof 问，不存在也只会回答没有这个东西，不会报错。",
    },
    {
      wrong: "统一通知(\"订阅检查\", \"今天查完了，30 个节点都正常\")",
      right: "统一通知(\"订阅检查\", \"今天查完了，30 个节点都正常\")\n$done()",
      why: "$done 是告诉 App 脚本跑完了，忘了调，App 会一直等着，以为你还没跑完。",
    },
    {
      wrong: "let 订阅 = { 名字: \"Kitty\", 节点数: 30 }\n$persistentStore.write(订阅, \"订阅\")",
      right: "let 订阅 = { 名字: \"Kitty\", 节点数: 30 }\n$persistentStore.write(JSON.stringify(订阅), \"订阅\")",
      why: "存东西只能存文字，对象要先用 JSON.stringify 变成文字，取出来再用 JSON.parse 变回来。",
    },
  ],
  recall: [
    {
      q: "怎么判断代码现在在哪个 App 里跑？",
      a: "用 typeof 问专属变量在不在：有 $task 是 QX，有 $loon 是 Loon，有 $httpClient 是 Surge 或 Stash。",
    },
    {
      q: "兼容层是干什么的？",
      a: "把四个 App 不同的写法翻译成同一套写法，主逻辑只写一份，差异只留在适配层。",
    },
    {
      q: "每个脚本最后为什么一定要调 $done()？",
      a: "$done 是告诉 App 脚本跑完了，忘了调，App 会一直等着，以为还没跑完。",
    },
  ],
  mentalModel: "多端兼容就是先问一句在哪个 App，再把各端不同的写法翻译成同一套，主逻辑永远只写一份。",
}
