import type { Chapter } from "../types/lesson"

/** 第 14 章：REX 模块说明
 * 写作标准：从零开始，每个新词第一次出现必须解释。
 * 这一章讲 REX 是什么、REX 模块格式、和 Surge/Loon 模块的区别、写一个 REX 能用的脚本。
 */
export const ch14: Chapter = {
  id: 14,
  title: "REX 模块说明",
  goal: "今天学 4 件事：\n1. REX 是什么\n2. REX 模块长什么样\n3. REX 模块和 Surge、Loon 模块的区别\n4. 写一个 REX 能用的脚本",
  meaning:
    "REX 和 Surge 是一脉的代理工具，模块和脚本那套写法基本一样。学会第 12 章，REX 的模块你已经能看懂八九成。\n\n为什么还要单独学一章？因为 REX 比较新，有些地方和 Surge 不完全一样，个别字段、个别接口在不同版本支持得不一样。不知道这些，拿 Surge 的模块往 REX 里一放，跑不起来还不知道问题出在哪。\n\n学会这一章，以后不管是 Surge、Loon 还是 REX 的模块，你都能看懂、能改、能自己写。",
  sections: [
    {
      heading: "1. REX 是什么",
      body: "REX 是一款手机上的代理工具，和 Surge、Loon 是一类东西：都能按规则分流流量，都能装模块，都能跑 JS 脚本。\n\n它相对比较新，出来得比 Surge、Loon 晚。所以网上的模块、教程没有 Surge、Loon 那么多，但核心那套东西是一样的。\n\n记住一句：REX 的模块体系和 Surge 一脉。学完 Surge 那章，REX 的模块就能看懂个八九成。这一章就是补上剩下那一两成。",
      think: "你已经会了 Surge 的模块，猜一猜：REX 的模块要从头学，还是基本能直接看懂？",
    },
    {
      heading: "2. REX 模块长什么样",
      body: "REX 的模块和 Surge 的模块一样，都是“一个文本文件 = 一包功能”。文件开头是 #!name，意思是“这个模块叫什么名字”，#! 是模块文件的固定开头。\n\n下面是一个完整的 REX 模块例子：\n#!name=去广告小助手\n#!desc=把某个 App 返回里的广告清空\n\n[Script]\n去广告 = type=http-response, pattern=^https://api\\.example\\.com/feed, script-path=https://example.com/remove-ads.js, requires-body=true\n\n[MITM]\nhostname = api.example.com\n\n一段一段看：\n\n#!name 是模块的名字，#!desc 是模块的介绍，desc 是“描述”的意思。\n\n[Script] 段是“脚本”这一段，声明这个模块带了一个脚本：名字叫“去广告”，类型是 http-response（回信到了之后跑），pattern 是网址特征，script-path 是脚本文件的地址，requires-body=true 是要拿到完整的回信内容。\n\n[MITM] 段是“解密”这一段。MITM 是“中间人”的意思。https 的内容是加密的，代理想看里面的东西、改里面的东西，得先解密。hostname 是“主机名”，就是域名，这里写 api.example.com，意思是“只解密这个域名的 https 内容”。\n\n另外还有 [Rule] 段（规则）和 [URL Rewrite] 段（网址重写），第 11 章讲过模块文件格式，这里不再重复。一个模块不一定四个段都有，用到哪个写哪个。像上面这个模块，只用脚本和解密，就只写这两个段。",
      think: "一个模块文件里，名字、脚本、解密这几样东西，你猜会分在几个段里写？",
    },
    {
      heading: "3. 脚本声明怎么写",
      body: "模块里声明脚本，就是 [Script] 段里的一行。REX 的写法和 Surge 一模一样，几个参数的意思也一样：\n\ntype：类型。http-request 是请求发出去之前跑，http-response 是回信到了之后跑，cron 是定时跑，event 是出了某件事就跑。\n\npattern：网址特征。只拦符合这个样子的请求或回信。\n\nscript-path：脚本文件放在哪里，可以是网址，也可以是本地文件。\n\nrequires-body：要不要拿到完整的内容。true 是“是，要”，false 是“不是，不要”。想改回信的内容，一定要写 requires-body=true，不然脚本读不到内容。\n\nargument：传给脚本的一句话。脚本里用 $argument 能拿到它。\n\n定时任务的例子：\n订阅到期检查 = type=cron, cronexp=\"0 9 * * *\", script-path=https://example.com/sub-check.js\n\ncronexp 是时间表，这里是每天早上 9 点跑。\n\n注意：REX 比较新，不同版本对个别字段的支持可能有出入，比如某些 $done 参数、cron 的写法。照 Surge 的写法写，多数情况能直接跑；跑不起来，先对照 REX 自带的示例改一改，别死磕。",
      think: "想让脚本在回信到了之后才跑，你猜声明里哪个词说了算？",
    },
    {
      heading: "4. 脚本里能用的 API",
      body: "REX 的脚本里，能用的工具和 Surge 是同一套：\n\n$request：请求。http-request 脚本里能读到它，里面有 url（网址）、method（请求方法，比如 GET、POST）、headers（请求头）、body（请求内容）。\n\n$response：响应、回信。http-response 脚本里能读到它，里面有 status（状态码）、headers（响应头）、body（回信内容）。\n\n$httpClient：去网上拿东西。第 12 章讲过。\n\n$persistentStore：一直保存东西的小仓库。第 12 章讲过。\n\n$notification：发通知。第 12 章讲过。\n\n$done：收尾。第 12 章讲过。\n\n所以第 12 章的订阅到期检查脚本，放到 REX 里不用改一个字。下面的例子 3 就是证明。",
      think: "Surge 里那套 $httpClient、$notification，到了 REX 里，你猜要不要换名字？",
    },
    {
      heading: "5. 和 Surge、Loon 模块的区别",
      body: "三家放在一起比，记住这几点：\n\n模块文件结构：REX 和 Surge 基本同构，都是 #!name 开头，[Rule]、[URL Rewrite]、[Script]、[MITM] 分段。同构是“结构长得一样”的意思。Loon 的插件也是这些段，叫法不一样，Loon 叫它插件（.lpx 文件或者插件链接）。\n\n脚本声明参数：REX 和 Surge 的 type、pattern、script-path、requires-body、argument 含义一致。Loon 的写法不一样，是“http-request 网址特征 script-path=...”这种直接写在最前面的样子，第 13 章讲过。\n\n脚本里能用的 API：REX 和 Surge 是同一套。Loon 的四个 API 名字也一样，但 Loon 多了 $config、$utils 这些特有的，第 13 章讲过。\n\n插件参数：Loon 的插件多一个 [Argument] 段，参数做成界面上的选项，脚本里拿到的是带类型的对象。REX 和 Surge 没有这个，参数就是 argument 一串文字。\n\n版本差异：Surge 和 Loon 出来得久，写法比较稳定。REX 比较新，不同版本对个别字段、个别接口的支持可能有出入。这是 REX 最大的不同：写 REX 模块不能光凭记忆，要拿现成模块当模板，跑起来再确认。",
      think: "三家放在一起，你猜哪两家最像、哪一家写法最不一样？",
    },
    {
      heading: "6. 写 REX 模块的三条规矩",
      body: "第一条：先拿一个官方或者社区现成的模块当模板改，别白手起家。把它的 [Script] 段、[MITM] 段照抄下来，只改名字、网址和脚本地址，跑通了再慢慢改自己的东西。\n\n第二条：脚本先在小范围测试。先只拦一个域名，确认 $done 的行为正常、通知能发出来，再全量启用。一下子全开，出了问题不好找。\n\n第三条：同一份脚本想同时在 Surge、Loon、REX 里跑，用第 15 章的判端模板。先判断现在在哪个 App，再走对应的写法，一份代码三处都能用。",
      think: "拿到一个新模块就直接全量启用，你猜最可能先在哪一步翻车？",
    },
  ],
  examples: [
    {
      title: "例子 1：先练思路——数订阅里的节点",
      code: "const text = \"香港01 = vless, hk.example.com, 443, username=xxx\\n香港02 = vless, hk2.example.com, 443, username=xxx\\n美国01 = trojan, us.example.com, 443, password=xxx\\n\";\nconst lines = text.split(\"\\n\");\nlet count = 0;\nfor (const line of lines) {\n  if (line.indexOf(\"= vless,\") !== -1 || line.indexOf(\"= trojan,\") !== -1) {\n    count++;\n  }\n}\nconsole.log(\"一共 \" + count + \" 个节点\");",
      explain:
        "第一行：一段订阅文字，一行一个节点，最后一行后面也有一个换行。vless、trojan 都是节点的类型（第 11 章讲过模块，第 12 章的例子里见过这种格式）。username=xxx 里的 xxx 是打码的账号，实际是一串编号。\n第二行：split(\"\\n\") 按换行切开，变成数组。\\n 是换行的意思。\n第三行：count 是“数量”的意思，先记成 0。\n接下来是 for...of（第 4 章学的遍历），一个一个看。\n如果这一行里有 \"= vless,\" 或者 \"= trojan,\"，就数一个。|| 是第 5 章学的“或者”。\n最后一行：把总数显示出来。\n\n跑完显示“一共 3 个节点”。最后一行是空的，里面没有 \"= vless,\"，所以不数。",
      output: "一共 3 个节点",
    },
    {
      title: "例子 2：先练思路——解析返回，算剩余天数和流量",
      code: "const body = '{\"name\":\"Kitty 订阅\",\"expire\":\"2026-12-01\",\"used\":60,\"total\":100}';\nconst info = JSON.parse(body);\nconst today = new Date(\"2026-11-13\");\nconst days = Math.floor((new Date(info.expire).getTime() - today.getTime()) / 1000 / 60 / 60 / 24);\nconst left = info.total - info.used;\nconsole.log(info.name + \" 还剩 \" + days + \" 天，流量还剩 \" + left + \"G\");",
      explain:
        "第一行：一段 JSON 文字，假装是某个接口返回的订阅信息：名字、到期日、已用流量 60G、总共 100G。\n第二行：JSON.parse 把文字变回对象。\n第三行：今天写死成 2026 年 11 月 13 日。\n第四行：算还剩几天，和第 12 章例 1 一样的算法。\n第五行：总共减去已用，算出还剩多少流量。\n最后一行：拼成一句话显示出来。\n\n这种“解析返回、算一算、显示出来”的思路，就是第 3、第 4 个例子的核心。先在 Scripting 里练熟了，再去写真正的脚本。",
      output: "Kitty 订阅 还剩 18 天，流量还剩 40G",
    },
    {
      title: "例子 3：REX 能用的脚本——订阅到期检查",
      code: "const subUrl = \"把这里换成你自己的订阅链接\";\n$httpClient.get(subUrl, function (error, response, data) {\n  if (error) {\n    $notification.post(\"订阅提醒\", \"拉取失败\", \"错误：\" + error);\n    $done();\n    return;\n  }\n  const info = response.headers[\"subscription-userinfo\"] || response.headers[\"Subscription-Userinfo\"] || \"\";\n  const parts = info.split(\";\");\n  let expire = 0;\n  for (const part of parts) {\n    const kv = part.split(\"=\");\n    if (kv[0].trim() === \"expire\") {\n      expire = Number(kv[1].trim());\n    }\n  }\n  if (!expire) {\n    $notification.post(\"订阅提醒\", \"Kitty 订阅\", \"这个订阅没有返回到期时间\");\n    $done();\n    return;\n  }\n  const days = Math.floor((expire * 1000 - Date.now()) / 1000 / 60 / 60 / 24);\n  const date = new Date(expire * 1000);\n  const dateText = date.getFullYear() + \"-\" + (date.getMonth() + 1) + \"-\" + date.getDate();\n  if (days <= 7) {\n    $notification.post(\"订阅提醒\", \"Kitty 订阅\", \"还剩 \" + days + \" 天到期（到期日 \" + dateText + \"），该续费了\");\n  } else {\n    $notification.post(\"订阅提醒\", \"Kitty 订阅\", \"还剩 \" + days + \" 天到期（到期日 \" + dateText + \"）\");\n  }\n  $done();\n});",
      explain:
        "这段代码和第 12 章例 4 一字不差。它只用了三个工具：$httpClient、$notification、$done。REX 和 Surge 用同一套 API，所以不用改一个字，放进 REX 模块就能跑。\n开头：订阅链接换成你自己的；$httpClient.get 去拉订阅。\n先判断 error，不空就发失败通知，$done() 收尾。\n再往下：从响应头里找 subscription-userinfo，里面有到期时间。\n接着按分号切开，找到 expire 那一段，取出时间戳。时间戳是从 1970 年 1 月 1 日开始数的秒数。\n没找到 expire，就发通知说没返回到期时间。\n再往下算还剩几天，再把到期日拼成文字，7 天内到期就提醒续费，还早就发普通通知。\n最后一行：$done() 收尾。\n\n放 Surge 里跑，配置行和第 12 章一样；放 REX 里跑，配置行也一样，见下面的 runNote。",
      output: "假设今天是 2026 年 11 月 13 日，订阅 2026 年 12 月 1 日到期，看到的通知是：\n通知标题：订阅提醒\n通知副标题：Kitty 订阅\n通知内容：还剩 18 天到期（到期日 2026-12-1）\n（天数是按你自己的订阅到期日算的，这里以 2026 年 12 月 1 日为例）",
      where: "surge",
      runNote:
        "这份脚本在 Surge 里跑，也能原样放进 REX 模块的 [Script] 段里跑，因为 REX 和 Surge 用同一套 API。放 Surge：配置里加一行“订阅到期检查 = type=cron, cronexp=\"0 9 * * *\", script-path=你的脚本地址”。放 REX：模块文件里加同一行。Scripting 里没有 $httpClient 这些，跑不了。",
    },
    {
      title: "例子 4：REX 能用的脚本——清空返回里的广告",
      code: "const obj = JSON.parse($response.body);\nif (obj.ads) {\n  obj.ads = [];\n}\n$done({ body: JSON.stringify(obj) });",
      explain:
        "第一行：JSON.parse 把 $response.body（回信的内容）变回对象。$response.body 是回信的正文。\n接下来：如果这个对象里有 ads（广告）这一项，就把它清空成空数组 []。ads 是“广告”的意思。\n最后一行：$done({ body: JSON.stringify(obj) })，意思是“把改好的内容发回去”。JSON.stringify 是把对象变回文字。\n\n这个脚本拦的是某个 App 拉内容的接口。原来返回里带着几条广告，改完后广告那一项是空的，App 里就看不到广告了。\n\n注意：配置里一定要加 requires-body=true，不然 $response.body 是空的，读不到内容。这个脚本在 Loon 里跑，也能原样放进 REX 模块里跑，因为 REX 和 Surge、Loon 用同一套 $done 的写法。",
      output: "假设原来返回的是 {\"ads\":[{\"id\":1},{\"id\":2}],\"content\":\"今天的新闻\"}，改完后变成 {\"ads\":[],\"content\":\"今天的新闻\"}，广告那一项被清空了。",
      where: "loon",
      runNote:
        "这个例子要在 Loon 里运行，Scripting 里没有 $response、$done，跑不了；同一份脚本也能原样放进 REX 模块的 [Script] 段里跑。放 Loon：配置里加一行“http-response ^https://api\\.example\\.com/feed script-path=你的脚本地址,requires-body=true,tag=去广告”。放 REX：模块文件里加一行“去广告 = type=http-response, pattern=^https://api\\.example\\.com/feed, script-path=你的脚本地址, requires-body=true”。注意 requires-body=true 一定要加，不然 $response.body 是空的。",
    },
  ],
  exercises: [
    {
      task: "写一段代码，数一数下面这段订阅文字里有几个 vless 节点：\n香港01 = vless, hk.example.com, 443, username=xxx\n香港02 = vless, hk2.example.com, 443, username=xxx\n美国01 = trojan, us.example.com, 443, password=xxx\n日本01 = vless, jp.example.com, 443, username=xxx",
      hint: "照例子 1 的样子，先按换行切开，再一个一个看。只数里面有 \"= vless,\" 的行，trojan 的行不数。",
      starter: "const text = \"香港01 = vless, hk.example.com, 443, username=xxx\\n香港02 = vless, hk2.example.com, 443, username=xxx\\n美国01 = trojan, us.example.com, 443, password=xxx\\n日本01 = vless, jp.example.com, 443, username=xxx\\n\";\nconst lines = text.split(\"\\n\");\nlet count = 0;",
      answer:
        "const text = \"香港01 = vless, hk.example.com, 443, username=xxx\\n香港02 = vless, hk2.example.com, 443, username=xxx\\n美国01 = trojan, us.example.com, 443, password=xxx\\n日本01 = vless, jp.example.com, 443, username=xxx\\n\";\nconst lines = text.split(\"\\n\");\nlet count = 0;\nfor (const line of lines) {\n  if (line.indexOf(\"= vless,\") !== -1) {\n    count++;\n  }\n}\nconsole.log(\"vless 节点一共 \" + count + \" 个\");",
      answerExplain:
        "按换行切开后是 4 行有内容的行加 1 行空行。里面有 \"= vless,\" 的是香港01、香港02、日本01，一共 3 个。美国01 是 trojan，不数。空行里没有 \"= vless,\"，也不数。\n运行后应该显示：vless 节点一共 3 个。",
    },
    {
      task: "写一个函数 willExpireSoon(expire)，给它一个到期日（比如 \"2026-11-20\"），如果 7 天内到期就返回 true，不然返回 false。今天固定是 2026 年 11 月 13 日。写完用 \"2026-11-20\" 和 \"2026-12-01\" 各试一次。",
      hint: "照第 12 章例 1 的算法算天数，再判断天数是不是小于等于 7。函数里要 return（返回）这个判断的结果。",
      starter: "const today = new Date(\"2026-11-13\");\n// 在下面写 willExpireSoon 函数：算出还剩几天，小于等于 7 就返回 true",
      answer:
        "function willExpireSoon(expire) {\n  const today = new Date(\"2026-11-13\");\n  const days = Math.floor((new Date(expire).getTime() - today.getTime()) / 1000 / 60 / 60 / 24);\n  return days <= 7;\n}\nconsole.log(willExpireSoon(\"2026-11-20\"));\nconsole.log(willExpireSoon(\"2026-12-01\"));",
      answerExplain:
        "\"2026-11-20\" 离 2026 年 11 月 13 日是 7 天，7 小于等于 7，所以返回 true，意思是“是，快到期了”。\"2026-12-01\" 是 18 天，大于 7，返回 false，意思是“不是，还早”。\n运行后应该显示两行：\ntrue\nfalse",
    },
    {
      task: "把第 12 章例 4 的订阅到期检查脚本做成一个完整的 REX 模块文件：写出模块全文（包括 #!name 和 [Script] 段）。",
      hint: "模块开头是 #!name 和 #!desc。脚本声明照 Surge 的写法：名字 = type=cron, cronexp=\"0 9 * * *\", script-path=脚本地址。脚本代码用第 12 章例 4 那份，不用改。",
      starter: "#!name=订阅到期检查\n#!desc=每天早上 9 点检查 Kitty 订阅还剩几天，快到期就发通知",
      answer:
        "#!name=订阅到期检查\n#!desc=每天早上 9 点检查 Kitty 订阅还剩几天，快到期就发通知\n\n[Script]\n订阅到期检查 = type=cron, cronexp=\"0 9 * * *\", script-path=https://example.com/sub-check.js",
      answerExplain:
        "模块文件就是一段文字：开头 #!name 是名字，#!desc 是介绍；[Script] 段里声明定时脚本，每天早上 9 点跑。\n\n运行办法：把这段文字保存成一个文件（比如 sub-check.sgmodule），把 script-path 换成你自己的 sub-check.js 的真实地址；在 REX 里导入这个模块文件。脚本代码用第 12 章例 4 那份，一字不用改，因为 REX 和 Surge 用同一套 API。每天早上 9 点自动跑；快到期了就发通知提醒你。",
      answerWhere: "rex",
    },
  ],
  mistakes: [
    {
      wrong: "去广告 = type=http-response, pattern=^https://api\\.example\\.com/feed, script-path=去广告.js",
      right: "去广告 = type=http-response, pattern=^https://api\\.example\\.com/feed, script-path=去广告.js, requires-body=true",
      why: "想改回信内容，一定要写 requires-body=true，不然脚本读不到回信内容，改了也白改。",
    },
    {
      wrong: "#!name=去广告小助手\n#!desc=把某个 App 返回里的广告清空\n\n[Script]\n去广告 = type=http-response, pattern=^https://api\\.example\\.com/feed, script-path=去广告.js, requires-body=true",
      right: "#!name=去广告小助手\n#!desc=把某个 App 返回里的广告清空\n\n[Script]\n去广告 = type=http-response, pattern=^https://api\\.example\\.com/feed, script-path=去广告.js, requires-body=true\n\n[MITM]\nhostname = api.example.com",
      why: "https 的内容是加密的，不在 [MITM] 段里写 hostname 就解不开，脚本看不到回信内容。",
    },
    {
      wrong: "去广告 = type=http-response, pattern=.*, script-path=去广告.js, requires-body=true",
      right: "去广告 = type=http-response, pattern=^https://api\\.example\\.com/feed, script-path=去广告.js, requires-body=true",
      why: "pattern 写成 .* 会把所有请求都拦下来，先只拦一个域名测通了再放开，出问题也好找。",
    },
  ],
  recall: [
    {
      q: "REX 模块和 Surge 模块是什么关系？",
      a: "基本是一家人：结构、声明、接口都一样，学完 Surge 就能看懂 REX 八九成。",
    },
    {
      q: "想改回信内容，模块声明里必须加什么？",
      a: "requires-body=true，不然脚本读不到回信内容。",
    },
    {
      q: "写 REX 模块的三条规矩是什么？",
      a: "先拿模板改、先小范围测、三端兼容用判端模板。",
    },
  ],
  mentalModel: "REX 模块就是 Surge 模块的亲戚：骨架、声明、接口都一样，照 Surge 的写法写，再留心个别字段在新版本上支不支持。",
}
