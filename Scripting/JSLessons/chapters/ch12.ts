import type { Chapter } from "../types/lesson"

/** 第 12 章：Surge 脚本 API 详解
 * 写作标准：从零开始，每个新词第一次出现必须解释。
 * 这一章讲 4 个工具（$httpClient、$notification、$persistentStore、$done）和 3 种脚本类型。
 */
export const ch12: Chapter = {
  id: 12,
  title: "Surge 脚本 API 详解",
  goal: "今天学 4 件事：\n1. Surge 脚本里的四个工具：$httpClient、$notification、$persistentStore、$done\n2. 三种脚本什么时候跑：http-request、cron、event\n3. 回调函数到底是怎么回事\n4. 写一个每天自动检查订阅到期的脚本",
  meaning:
    "前面你学的都是 JS 语言本身，从这一章开始，学的是 Surge 这个地方特有的本事。\n\nSurge 里能跑脚本，靠的就是四个工具：去网上拿东西、发通知、存东西、收尾。你用的那些模块，背后就是用这四个工具写的脚本。学会了，你就能自己写提醒、自己写签到、自己改请求里的数据，不用只等着用别人写好的模块。\n\n不学这一章也行，但以后看到模块里的脚本，你一行都看不懂，出了问题也不知道从哪下手。",
  sections: [
    {
      heading: "1. 脚本是什么，脚本住在哪里",
      body: "“脚本”就是一段 JS 代码，只不过它不住在 Scripting 里，而是住在 Surge 里。\n\nSurge 的配置里有一个 [Script] 段，意思是“脚本”这一段。每个脚本占一行，写清楚：这个脚本叫什么、什么时候跑、脚本文件放在哪里。\n\n比如这一行：\n订阅检查 = type=cron,cronexp=\"0 9 * * *\",script-path=https://example.com/check.js\n\n“订阅检查”是这个脚本的名字。“type”是“类型”的意思，cron 是“定时任务”的意思，读作“克龙”，表示这个脚本按时间表跑。“cronexp”是时间表，这里写的是每天早上 9 点跑。“script-path”是“脚本文件放在哪里”，script 是“脚本”，path 是“路径”，合起来就是脚本文件的地址，可以是一个网址，也可以是手机上的本地文件。\n\ntype 有好几种，决定了脚本什么时候跑。这一章先讲最常用的三种：http-request、cron、event，第 7 节细说。",
      think: "一段 JS 住在 Surge 里，和住在 Scripting 里，有什么不一样？",
    },
    {
      heading: "2. 四个工具先认一遍",
      body: "Surge 给脚本准备了四个工具，名字都以 $ 开头。$ 不用念，它就是名字的一部分，意思是“这是 Surge 给你的工具”。\n\n$httpClient：http 是“网上”的意思，Client 是“客户端”的意思，合起来是“去网上拿东西的工具”。用来发请求、拉数据。\n\n$notification：notification 是“通知”的意思。用来给你的手机发一条通知，告诉你脚本跑完了、结果是什么。\n\n$persistentStore：persistent 是“一直保存着”的意思，Store 是“仓库”的意思，合起来是“一直保存东西的小仓库”。用来存数据，下次跑脚本还能读到。\n\n$done：done 是“做完了”的意思。脚本最后都要调它一次，告诉 Surge“我做完了”。\n\n下面四节，一个一个讲。",
      think: "Surge 给脚本的四个工具，哪一个是去网上拿东西的，哪一个是发通知的？",
    },
    {
      heading: "3. $httpClient：去网上拿东西",
      body: "$httpClient 最常用的是 get，意思是“拿”。写法有两种：\n\n第一种，直接给网址：\n$httpClient.get(\"https://api.github.com/zen\", function (error, response, data) { ... })\n\n第二种，给一个对象，能多带点东西，比如请求头：\n$httpClient.get({ url: \"https://api.github.com/zen\", headers: { \"User-Agent\": \"Surge\" } }, function (error, response, data) { ... })\n\nheaders 是“请求头”的意思，就是请求时附带的一些信息，比如告诉服务器你是谁。\n\n除了 get，还有 post、put、delete，意思是“发”、“改”、“删”，用法和 get 一样。\n\n注意后面那个 function：它叫“回调函数”。“回调”就是“回过头来调一下”的意思：你先让 $httpClient 去网上拿东西，东西拿到了，它再回过头来调你留下的这个函数，把结果交给你。第 6 章预告过回调函数，这里就是它第一次真正上场。\n\n回调函数固定有三个参数：error、response、data。error 是“错误”的意思，没出错就是空的，出错了里面就是错误信息。response 是“响应、回信”的意思，里面有 status（状态码，200 是成功）和 headers（响应头，就是回信时附带的信息）。data 是拿回来的内容本身。\n\n规矩：回调函数里第一件事，先判断 error 是不是空的。不空，说明这次没拿到东西，直接发通知报错；空的，再继续往下处理。",
      think: "让脚本去网上拉订阅，拉到了、没拉到，脚本怎么知道？",
    },
    {
      heading: "4. $notification：给自己发通知",
      body: "$notification.post 是发通知的固定写法。post 是“发出”的意思。\n\n它有三个参数，都是文字：\n$notification.post(\"订阅提醒\", \"Kitty 订阅\", \"还剩 3 天到期\")\n\n第一个是标题，第二个是副标题，第三个是内容。手机上弹出来的通知就是这三行字。\n\n脚本跑在后台，你看不见它，通知就是它跟你说话的办法。检查完了、出错了、快到期了，都用通知告诉你。",
      think: "脚本在后台跑，你看不见它，它怎么把结果告诉你？",
    },
    {
      heading: "5. $persistentStore：一个能一直存东西的小仓库",
      body: "脚本每次跑完就结束了，里面的变量（第 2 章学的）也就没了。下次再跑，又是从头开始。想让两次运行之间留下点东西，就用 $persistentStore。\n\n存东西：\n$persistentStore.write(\"2026-12-01\", \"kittyExpire\")\n\nwrite 是“写”的意思。第一个参数是要存的内容，第二个参数是名字。这个名字叫 key，key 是“钥匙”的意思，你可以理解成“给存的东西起个名字”，以后凭这个名字来取。\n\n取东西：\nconst expire = $persistentStore.read(\"kittyExpire\")\n\nread 是“读”的意思。给名字，就把存的东西拿回来。\n\n两个规矩要记住：第一，只能存文字。想存对象（第 4 章学的），先用 JSON.stringify（第 7 章学的）把它变成文字再存，取出来再用 JSON.parse 变回来。第二，不写名字也可以，那它就用这个脚本自己的名字当名字；但最好每次都写清楚名字，免得几个脚本互相串了。\n\n比如订阅到期日，你可以先存一次，以后每天的检查脚本直接读它，不用每次都去网上问。",
      think: "脚本跑完就结束了，下次跑还想记得上次存的到期日，东西放哪儿？",
    },
    {
      heading: "6. $done：收尾，一定要调一次",
      body: "每个脚本最后都要调一次 $done()，意思是“我做完了”。调了，Surge 才知道这次运行结束了，才会放手。\n\n不调会怎么样？Surge 会一直等，等到超时才放手，还会记一条警告。所以记住：不管脚本里走了哪条路（成功还是失败），最后都要调一次 $done()，而且只调一次。\n\n$done 后面括号里可以带东西，不同的脚本类型意思不一样：\n\nhttp-request 脚本（请求发出去之前跑的）：$done({}) 是“不改，原样放行”；$done({ url: \"新地址\" }) 是把请求改到新地址去。\n\nhttp-response 脚本（回信到了之后跑的）：$done({ body: \"新内容\" }) 是把回信的内容换掉。\n\ncron 脚本和 event 脚本（下面一节讲）：括号里带什么都没人看，写个空的 $done() 就行。",
      think: "脚本最后那句 $done() 是干什么的？不写会怎样？",
    },
    {
      heading: "7. 三种脚本：http-request、cron、event",
      body: "http-request：意思是“HTTP 请求”，HTTP 就是手机和服务器说话用的规矩。某个请求要发出去之前，先让脚本看一眼，能改请求的内容。配置里要写 pattern，pattern 是“样子、特征”的意思，就是用网址的样子来挑出哪些请求要过脚本这一关。比如 pattern=^https://api\\.example\\.com 就表示只拦这个网址开头的请求。想读到请求的完整内容，配置里还要加 requires-body=true，body 是“内容”，requires 是“需要”，合起来是“需要拿到完整的内容”。\n\nhttp-response：和 http-request 是两兄弟，只不过它是在回信到了之后跑，能改回信的内容。第 14 章的例子会用到它。\n\ncron：定时任务。配置里用 cronexp 写时间表，5 个数，意思是“分 时 日 月 星期”，星号是“任意”。比如 cronexp=\"0 9 * * *\" 就是每天早上 9 点跑。跑得太勤（比如一小时超过 10 次）手机会提示耗电，别设得太密。\n\nevent：意思是“事件”。出了某件事就跑一次，比如 network-changed（网络变了，Wi-Fi 切成流量了，或者反过来）。配置里用 event-name 写事件的名字。\n\n还有一种办法能马上跑一次：不用等时间到，在 Surge 里长按这个脚本，就能手动触发。写完脚本先手动跑一次，确认没问题再让它每天自动跑。",
      think: "定时跑的脚本和请求来了才跑的脚本，写起来有什么不一样？",
    },
  ],
  examples: [
    {
      title: "例子 1：算订阅还剩几天",
      code: "const today = new Date(\"2026-11-13\");\nconst expire = new Date(\"2026-12-01\");\nconst diff = expire.getTime() - today.getTime();\nconst days = Math.floor(diff / 1000 / 60 / 60 / 24);\nconsole.log(\"Kitty 订阅还剩 \" + days + \" 天到期\");",
      explain:
        "第一行：new Date(\"2026-11-13\") 是造出一个代表 2026 年 11 月 13 日的日期。Date 是“日期”的意思，new 是“造一个”的意思。\n第二行：造出到期日 2026 年 12 月 1 日。\n第三行：getTime() 是拿到这个日期对应的毫秒数。毫秒是千分之一秒，电脑内部用毫秒数来算时间。两个毫秒数相减，就是两个日期之间差了多少毫秒。\n第四行：把毫秒数换算成天数：除以 1000 变成秒，再除以 60 变成分钟，再除以 60 变成小时，再除以 24 变成天。Math.floor 是数学里的“向下取整”，就是去掉小数部分，只留整数天数。\n第五行：把结果拼成一句话显示出来。\n\n注意：这里的“今天”是写死的 2026 年 11 月 13 日，是为了让每次跑的结果都一样。真正的检查脚本里，要用现在这一刻来算，第 4 个例子会讲。",
      output: "Kitty 订阅还剩 18 天到期",
    },
    {
      title: "例子 2：解析订阅信息，挑出快到期的",
      code: "const text = '[{\"name\":\"Kitty 订阅\",\"expire\":\"2026-12-01\"},{\"name\":\"组合机场\",\"expire\":\"2027-01-15\"},{\"name\":\"天诚体验\",\"expire\":\"2026-11-20\"}]';\nconst subs = JSON.parse(text);\nconst today = new Date(\"2026-11-13\");\nfor (const sub of subs) {\n  const days = Math.floor((new Date(sub.expire).getTime() - today.getTime()) / 1000 / 60 / 60 / 24);\n  if (days <= 30) {\n    console.log(sub.name + \" 还剩 \" + days + \" 天，要续费了\");\n  }\n}",
      explain:
        "第一行：一段 JSON 文字（第 7 章学的），里面是三个订阅的名字和到期日。\n第二行：JSON.parse 把文字变回数组，里面是三个对象。\n第三行：今天写死成 2026 年 11 月 13 日。\n接下来是 for...of（第 4 章学的遍历），一个一个看。\n算出这个订阅还剩几天，和上一个例子一样的算法。\nif 判断（第 5 章学的），只挑 30 天内到期的。\n把名字和天数拼成一句话显示出来。\n\n跑完只显示两行，因为组合机场还剩 63 天，不在 30 天内，就不显示。",
      output: "Kitty 订阅 还剩 18 天，要续费了\n天诚体验 还剩 7 天，要续费了",
    },
    {
      title: "例子 3：拉订阅，数节点",
      code: "const subUrl = \"把这里换成你自己的订阅链接\";\n$httpClient.get(subUrl, function (error, response, data) {\n  if (error) {\n    $notification.post(\"订阅检查\", \"拉取失败\", \"错误：\" + error);\n    $done();\n    return;\n  }\n  const lines = data.split(\"\\n\");\n  let count = 0;\n  for (const line of lines) {\n    if (line.indexOf(\"= vless,\") !== -1 || line.indexOf(\"= trojan,\") !== -1 || line.indexOf(\"= ss,\") !== -1) {\n      count++;\n    }\n  }\n  $notification.post(\"订阅检查\", \"Kitty 订阅\", \"一共 \" + count + \" 个节点，状态码 \" + response.status);\n  $done();\n});",
      explain:
        "第一行：把订阅链接存在变量 subUrl 里。引号里要换成你自己的订阅链接，比如 MiSub 里 Kitty 那个。\n第二行：$httpClient.get 去拉这个链接。后面跟的是回调函数，等拉到了再执行。\n接下来先判断 error 是不是空的。不空，说明没拉到，发一条“拉取失败”的通知，然后 $done() 收尾。return 是第 6 章学的，意思是“返回、到此为止”，后面的代码就不跑了。\n再往下：data 是拉回来的订阅内容，一行一个节点。用 split(\"\\n\") 按换行切开，变成数组。\\n 是换行的意思。\n然后数一数里面有多少行是节点。节点那一行长这样：“香港01 = vless, 服务器, 443, …”，所以只要这一行里有 \"= vless,\" 或者 \"= trojan,\" 或者 \"= ss,\"，就数一个。indexOf 是第 3 章学的查找，返回 -1 就是没找到。|| 是第 5 章学的“或者”。\n最后发通知，把节点数告诉你。response.status 是状态码，200 是成功。再调 $done() 收尾。\n\n这个例子要放在 Surge 的 cron 脚本里跑，每天早上 9 点跑一次，配置行在下面的 runNote 里。",
      output: "通知标题：订阅检查\n通知副标题：Kitty 订阅\n通知内容：一共 30 个节点，状态码 200\n（节点数是你订阅里的实际数量，这里以 Kitty 订阅的 30 个为例）",
      where: "surge",
      runNote:
        "这个例子要在 Surge 里运行，Scripting 里没有 $httpClient、$notification、$done，跑不了。做法：把代码保存成一个 .js 文件（比如 check-nodes.js），传到网上拿到链接，或者放在 Surge 能读到的本地位置；在 Surge 配置的 [Script] 段加一行：节点计数 = type=cron,cronexp=\"0 9 * * *\",script-path=你的脚本地址。保存配置后，每天早上 9 点自动跑一次；想马上试，在 Surge 里长按这个脚本就能手动触发。",
    },
    {
      title: "例子 4：完整的订阅到期检查",
      code: "const subUrl = \"把这里换成你自己的订阅链接\";\n$httpClient.get(subUrl, function (error, response, data) {\n  if (error) {\n    $notification.post(\"订阅提醒\", \"拉取失败\", \"错误：\" + error);\n    $done();\n    return;\n  }\n  const info = response.headers[\"subscription-userinfo\"] || response.headers[\"Subscription-Userinfo\"] || \"\";\n  const parts = info.split(\";\");\n  let expire = 0;\n  for (const part of parts) {\n    const kv = part.split(\"=\");\n    if (kv[0].trim() === \"expire\") {\n      expire = Number(kv[1].trim());\n    }\n  }\n  if (!expire) {\n    $notification.post(\"订阅提醒\", \"Kitty 订阅\", \"这个订阅没有返回到期时间\");\n    $done();\n    return;\n  }\n  const days = Math.floor((expire * 1000 - Date.now()) / 1000 / 60 / 60 / 24);\n  const date = new Date(expire * 1000);\n  const dateText = date.getFullYear() + \"-\" + (date.getMonth() + 1) + \"-\" + date.getDate();\n  if (days <= 7) {\n    $notification.post(\"订阅提醒\", \"Kitty 订阅\", \"还剩 \" + days + \" 天到期（到期日 \" + dateText + \"），该续费了\");\n  } else {\n    $notification.post(\"订阅提醒\", \"Kitty 订阅\", \"还剩 \" + days + \" 天到期（到期日 \" + dateText + \"）\");\n  }\n  $done();\n});",
      explain:
        "开头：订阅链接存在变量里，换成你自己的；$httpClient.get 去拉订阅。\n先判断 error，不空就发“拉取失败”的通知，$done() 收尾。\n再往下：从响应头里找 subscription-userinfo。响应头就是服务器回信时附带的一些信息，其中有一项叫 subscription-userinfo，意思是“订阅的用户信息”，里面写着用了多少流量、还剩多少、什么时候到期。不同服务器写这个名字的大小写不一样，所以两个都试一下。|| 是第 5 章学的“或者”。\n接着把这一项按分号切开，一段一段看，找到开头是 expire 的那一段。trim() 是去掉两头空格的意思。expire 是“到期”的意思，后面跟的数字是“时间戳”：从 1970 年 1 月 1 日开始数的秒数。Number() 是把文字变成数字。\n如果没找到 expire，说明这个订阅没返回到期时间，发通知告诉你，$done() 收尾。\n再往下算还剩几天：expire 是秒数，乘以 1000 变成毫秒数；Date.now() 是现在这一刻的毫秒数；两个一减再换算成天。\n然后把到期日拼成“年-月-日”的文字。getFullYear() 是取年份，getMonth() 是取月份（它从 0 开始数，0 是一月，所以要加 1），getDate() 是取日子。\n最后：7 天内就到期，发一条带“该续费了”的通知；还早，就发一条普通的通知。再调 $done() 收尾。\n\n这个脚本要放在 Surge 的 cron 脚本里，每天早上 9 点跑一次，配置行在下面的 runNote 里。",
      output: "假设今天是 2026 年 11 月 13 日，订阅 2026 年 12 月 1 日到期，看到的通知是：\n通知标题：订阅提醒\n通知副标题：Kitty 订阅\n通知内容：还剩 18 天到期（到期日 2026-12-1）\n（天数是按你自己的订阅到期日算的，这里以 2026 年 12 月 1 日为例）",
      where: "surge",
      runNote:
        "这个例子要在 Surge 里运行，Scripting 里没有 $httpClient、$notification、$done，跑不了。做法：把代码保存成一个 .js 文件（比如 sub-expire.js），传到网上拿到链接；在 Surge 配置的 [Script] 段加一行：订阅到期检查 = type=cron,cronexp=\"0 9 * * *\",script-path=你的脚本地址。保存配置后，每天早上 9 点自动跑一次；想马上试，在 Surge 里长按这个脚本就能手动触发。",
    },
  ],
  exercises: [
    {
      task: "算一算：组合机场订阅 2027 年 1 月 15 日到期，今天是 2026 年 11 月 13 日，还剩几天？写一段代码算出来并显示。",
      hint: "照例子 1 的样子，改两个日期就行。到期日换成 2027-01-15，显示的话换成“组合机场订阅”。",
      starter: "const today = new Date(\"2026-11-13\");\nconst expire = new Date(\"2027-01-15\");\nconst diff = expire.getTime() - today.getTime();",
      answer:
        "const today = new Date(\"2026-11-13\");\nconst expire = new Date(\"2027-01-15\");\nconst days = Math.floor((expire.getTime() - today.getTime()) / 1000 / 60 / 60 / 24);\nconsole.log(\"组合机场订阅还剩 \" + days + \" 天到期\");",
      answerExplain:
        "算法和例子 1 一样：两个日期的毫秒数相减，再换算成天。\n运行后应该显示：组合机场订阅还剩 63 天到期。",
    },
    {
      task: "用例子 2 里那三个订阅，写一段代码，只挑出 7 天内到期的，显示名字和天数。",
      hint: "照例子 2 的样子，把 if 里那个 30 改成 7，显示的话改成“快到期了”。",
      starter: "const text = '[{\"name\":\"Kitty 订阅\",\"expire\":\"2026-12-01\"},{\"name\":\"组合机场\",\"expire\":\"2027-01-15\"},{\"name\":\"天诚体验\",\"expire\":\"2026-11-20\"}]';\nconst subs = JSON.parse(text);\nconst today = new Date(\"2026-11-13\");",
      answer:
        "const text = '[{\"name\":\"Kitty 订阅\",\"expire\":\"2026-12-01\"},{\"name\":\"组合机场\",\"expire\":\"2027-01-15\"},{\"name\":\"天诚体验\",\"expire\":\"2026-11-20\"}]';\nconst subs = JSON.parse(text);\nconst today = new Date(\"2026-11-13\");\nfor (const sub of subs) {\n  const days = Math.floor((new Date(sub.expire).getTime() - today.getTime()) / 1000 / 60 / 60 / 24);\n  if (days <= 7) {\n    console.log(sub.name + \" 还剩 \" + days + \" 天，快到期了\");\n  }\n}",
      answerExplain:
        "只改了两个地方：判断条件从 30 天改成 7 天，显示的文字改成“快到期了”。\n运行后应该只显示一行：天诚体验 还剩 7 天，快到期了。\nKitty 订阅还剩 18 天，不在 7 天内，所以不显示。",
    },
    {
      task: "写一个 Surge 的 cron 脚本：每天早上 8 点拉取你的订阅链接，如果拉取失败，就发一条通知说“订阅拉取失败”。拉取成功也发一条通知说“拉取成功”。",
      hint: "照例子 3 的样子，先判断 error，不空发失败通知，空的发成功通知。别忘了最后调 $done()。",
      starter: "const subUrl = \"把这里换成你自己的订阅链接\";\n$httpClient.get(subUrl, function (error, response, data) {\n  // 在这里判断 error：失败发一条通知，成功发一条通知，最后调 $done() 收尾\n  $done();\n});",
      answer:
        "const subUrl = \"把这里换成你自己的订阅链接\";\n$httpClient.get(subUrl, function (error, response, data) {\n  if (error) {\n    $notification.post(\"订阅检查\", \"拉取失败\", \"错误：\" + error);\n  } else {\n    $notification.post(\"订阅检查\", \"拉取成功\", \"状态码 \" + response.status);\n  }\n  $done();\n});",
      answerExplain:
        "先判断 error：不空说明失败，发失败通知；空的说明成功，发成功通知。两种路最后都要调 $done() 收尾。\n\n运行办法：把这段代码保存成文件（比如 sub-check.js），传到网上拿到链接；在 Surge 配置的 [Script] 段加一行：\n订阅检查 = type=cron,cronexp=\"0 8 * * *\",script-path=你的脚本地址\n保存配置后，每天早上 8 点自动跑；想马上试，在 Surge 里长按这个脚本手动触发一次。",
      answerWhere: "surge",
    },
  ],
  mistakes: [
    {
      wrong: "$httpClient.get(subUrl, function (error, response, data) {\n  $notification.post(\"订阅检查\", \"拉取成功\", \"状态码 \" + response.status);\n});",
      right: "$httpClient.get(subUrl, function (error, response, data) {\n  $notification.post(\"订阅检查\", \"拉取成功\", \"状态码 \" + response.status);\n  $done();\n});",
      why: "不调 $done()，Surge 以为脚本还没完，请求会一直卡到超时，App 就一直转圈。",
    },
    {
      wrong: "$persistentStore.write({ cookie: \"abc123\" }, \"cookie\")",
      right: "$persistentStore.write(JSON.stringify({ cookie: \"abc123\" }), \"cookie\")",
      why: "小仓库只收文字，对象要先用 JSON.stringify 变成文字再存，读出来再用 JSON.parse 变回去。",
    },
    {
      wrong: "$httpClient.get(subUrl, function (error, response, data) {\n  const lines = data.split(\"\\n\");",
      right: "$httpClient.get(subUrl, function (error, response, data) {\n  if (error) {\n    $notification.post(\"订阅检查\", \"拉取失败\", \"错误：\" + error);\n    $done();\n    return;\n  }\n  const lines = data.split(\"\\n\");",
      why: "拉取失败时 data 是空的，不先判断 error 就直接用它，脚本会在这行出错。",
    },
  ],
  recall: [
    {
      q: "$httpClient 回调函数的三个参数按顺序是什么？第一个先看什么？",
      a: "error、response、data；先看 error，error 不为空说明没拿到东西。",
    },
    {
      q: "$persistentStore 只能存什么？想存对象要怎么办？",
      a: "只能存文字；对象先 JSON.stringify 变成文字再存，读出来再 JSON.parse 变回去。",
    },
    {
      q: "$done() 有什么用？cron 脚本里也要调吗？",
      a: "告诉 Surge 脚本做完了；不管哪种脚本、成功还是失败，最后都要调一次，而且只调一次。",
    },
  ],
  mentalModel: "Surge 脚本就三步：看现场（$request/$response）、干活（$httpClient 拉、$persistentStore 存、$notification 说）、交卷（$done），出错也要交卷放行。",
}
