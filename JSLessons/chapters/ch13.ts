import type { Chapter } from "../types/lesson"

/** 第 13 章：Loon 脚本 API 与差异
 * 写作标准：从零开始，每个新词第一次出现必须解释。
 * 这一章讲 Loon 的同名 API、和 Surge 的异同、Loon 特有的东西。
 */
export const ch13: Chapter = {
  id: 13,
  title: "Loon 脚本 API 与差异",
  goal: "今天学 4 件事：\n1. Loon 的四个 API，和 Surge 是不是一样\n2. Loon 和 Surge 的差异对照表\n3. Loon 特有的东西：$loon、$config、$utils 这些\n4. 把 Surge 的脚本搬到 Loon 上跑",
  meaning:
    "Surge 和 Loon 是两款很像的代理工具，脚本那套写法几乎一样。学会第 12 章，Loon 的脚本你已经会了八成。\n\n但有几个地方不一样：配置的写法不一样，Loon 还多了几个 Surge 没有的工具。直接把 Surge 的脚本和配置原样搬到 Loon 上，有的能跑，有的会报错。这一章就是把“一样的地方”和“不一样的地方”一次分清，以后一份代码两个 App 都能用。",
  sections: [
    {
      heading: "1. Loon 和 Surge 是一家人",
      body: "Loon 和 Surge 都是手机上的代理工具，都能跑 JS 脚本，而且脚本里能用的四个工具，名字一模一样：$httpClient、$notification、$persistentStore、$done。\n\n所以第 12 章学的东西，在 Loon 里基本不用重新学。拉数据、发通知、存东西、收尾，写法都一样。\n\n怎么判断一段代码现在跑在哪个 App 里？Loon 里有一个特有的东西叫 $loon。$loon 是一段文字，写着手机型号和 Loon 的版本，比如“iPhone15,2 18.0 3.2.0(1000)”。Surge 里没有 $loon。所以判断办法就是：typeof $loon !== \"undefined\"。typeof 是第 2 章学的，意思是“看这是什么类型”；如果 $loon 不存在，typeof 的结果就是 \"undefined\"，意思是“没有定义”。整句的意思是“$loon 存在吗”。在 Loon 里跑是 true（意思是“是”），在 Surge 里跑是 false（意思是“不是”）。\n\n第 15 章讲多端兼容写法时，这个判断会派上大用场。",
      think: "第 12 章的 Surge 脚本，拿到 Loon 里能直接跑吗？要先看什么？",
    },
    {
      heading: "2. 差异对照表",
      body: "下面一张表，一行一个对比项：\n\n对比项：四个 API 的名字\nSurge：$httpClient、$notification、$persistentStore、$done\nLoon：和 Surge 一模一样\n\n对比项：$httpClient 的写法\nSurge：要写回调函数，等拿到了再执行\nLoon：一样，也要写回调函数\n\n对比项：$notification 发通知\nSurge：三个参数，标题、副标题、内容\nLoon：还能多加两个东西：一个是 attach，能带图片、链接、复制的文字；一个是 delay，意思是“等几毫秒再发”\n\n对比项：$persistentStore 存东西\nSurge：只能存文字，不写名字就用脚本自己的名字\nLoon：一样只能存文字；另外能删单个（write(undefined, 名字)），还能一键清空全部（remove()）\n\n对比项：$done 收尾\nSurge：调一次就行；cron 和 event 里括号里带什么都没人看\nLoon：一样调一次；通用脚本还能在括号里带一个结果对象（标题和内容），给点它运行的人看\n\n对比项：脚本配置的写法\nSurge：名字 = type=http-request,pattern=网址特征,script-path=脚本地址\nLoon：http-request 网址特征 script-path=脚本地址,tag=名字\n\n对比项：定时任务的写法\nSurge：type=cron,cronexp=\"0 9 * * *\"\nLoon：cron \"0 9 * * *\" script-path=脚本地址\n\n对比项：判断现在在哪个 App\nSurge：没有专门的办法\nLoon：有 $loon，一段写着设备和版本的文字\n\n对比项：切换策略组\nSurge：没有现成的工具\nLoon：有 $config.setSelectPolicy，脚本里能直接换策略组选的节点\n\n对比项：读现在的配置\nSurge：没有\nLoon：有 $config.getConfig，能拿到当前配置的摘要\n\n对比项：查 IP 是哪个国家的\nSurge：没有\nLoon：有 $utils.geoip，输入 IP 就返回国家代码\n\n对比项：点一下就运行的脚本\nSurge：长按脚本能手动触发一次\nLoon：有通用脚本，能在 App 里点一下就运行，还能从节点入口运行\n\n对比项：插件的参数\nSurge：argument 一串文字，脚本里拿到的是文字\nLoon：插件多一个 [Argument] 段，参数带类型（文字、数字、开关），脚本里拿到的是对象\n\n对比项：setInterval\nSurge：按设好的时间反复跑\nLoon：只跑一次，和 setTimeout 一样，想反复跑要在回调函数里再调一次 setTimeout",
      think: "Loon 和 Surge 的脚本，到底一样的地方多，还是不一样的地方多？",
    },
    {
      heading: "3. Loon 特有的东西（上）：$loon 和 $config",
      body: "$loon 上一节讲过了，是一段写着设备和版本的文字，专门用来判断“现在是不是在 Loon 里”。\n\n$config 是 Loon 特有的配置工具。config 是“配置”的意思，就是 Loon 现在的设置。\n\n$config.getConfig()：把当前配置的摘要拿回来，是一段 JSON 文字（第 7 章学的），要用 JSON.parse 变回对象再用。里面有 running_model（运行模式）、final（兜底策略组）、all_policy_groups（所有的策略组）这些。\n\n$config.getSelectedPolicy(\"国外社交\")：查某个策略组现在选的是哪个节点。getSelectedPolicy 是“拿到选中的策略”的意思。\n\n$config.setSelectPolicy(\"国外社交\", \"香港节点\")：切换策略组选的节点。setSelectPolicy 是“设置选中的策略”的意思。成功返回 true（意思是“是，成功了”），失败返回 false（意思是“不是，失败了”）。这是 Loon 很厉害的一个功能：脚本能自己换节点。比如晚上 11 点自动切到香港节点，早上再切回来。\n\n$config.setRunningModel(1)：切换运行模式。setRunningModel 是“设置运行模式”的意思。0 是全局直连，1 是规则模式，2 是全局代理。\n\nSurge 里没有 $config 这套东西。Surge 想从脚本里控制 App，要用另一套更麻烦的办法，第 15 章会提一句。",
      think: "$config 是干什么的？Surge 里有吗？",
    },
    {
      heading: "4. Loon 特有的东西（下）：$utils、通知和通用脚本",
      body: "$utils 是 Loon 的小工具箱。utils 是“小工具”的意思。\n\n$utils.geoip(\"1.1.1.1\")：查一个 IP 是哪个国家的，返回国家代码，比如 \"US\" 是美国。geoip 是“地理 IP”的意思。\n\n$utils.ipasn(\"1.1.1.1\")：查一个 IP 的 ASN。ASN 是“自治系统号”，就是一大段 IP 归谁管的编号，比如某个机场的 IP 段就归某个 ASN 管。\n\n$notification.post 在 Loon 里更能干：除了标题、副标题、内容，还能多加两个参数。第四个是 attach，意思是“附带的东西”，能带一张图片、一个点开就打开的链接、一段点开就复制的文字。第五个是 delay，意思是“等几毫秒再发”。\n\n通用脚本：Loon 里有一类脚本叫通用脚本，意思是“通用的脚本”，不用等请求、不用等时间，在 App 里点一下就能跑。还能从节点入口运行：长按一个节点，选这个脚本跑，脚本里能通过 $environment.params 拿到这个节点的名字。$environment 是“环境”的意思，params 是“参数”的意思。\n\n新版 Loon 还多了 $crypto（加密）和 $dns（查域名），要 Loon Build 988 以上才有。这两个现在用得少，先知道名字就行。",
      think: "$utils、通知多两个参数、通用脚本，这些都是 Loon 才有的吗？",
    },
    {
      heading: "5. Loon 的脚本配置写法",
      body: "Loon 的配置里也有一个 [Script] 段，但写法和 Surge 不一样。Surge 是“名字 = type=...,pattern=...”这种写法，Loon 是直接把类型写在最前面：\n\nhttp-request 拦截请求：\nhttp-request ^https://api\\.example\\.com script-path=request.js,tag=拦截请求,requires-body=true,timeout=10\n\n“http-request”是类型，后面跟的是网址特征（和 Surge 的 pattern 一个意思），再后面是 script-path、tag、requires-body、timeout。tag 是“标签”的意思，就是给这个脚本起个名字，显示在列表里。timeout 是“超时”的意思，就是最多等几秒，等不到就放弃。\n\n定时任务：\ncron \"0 9 * * *\" script-path=cron.js,tag=每天检查,timeout=300\n\ncron 后面直接跟时间表（5 个数，和 Surge 的 cronexp 一个意思），再跟 script-path 和 tag。\n\n另外要提一句：Loon 3.5.1 有了新写法，样子不太一样，但老写法还能用。你现在看到的模块基本都是老写法，先学老写法够用了。\n\nLoon 的插件还多一个 [Argument] 段。Argument 是“参数”的意思。插件作者可以在这里把参数做成界面上的选项：文字框、数字框、开关。用户在界面上填好，脚本里通过 $argument 拿到的是一个对象，里面的值还带着类型（文字就是文字，数字就是数字，开关就是 true/false）。Surge 的 argument 只是一串文字，脚本里拿到手还要自己拆。",
      think: "Loon 的定时任务那一行，和 Surge 的长得一样吗？",
    },
    {
      heading: "6. 把 Surge 的脚本搬到 Loon 上",
      body: "四个 API 不用改：$httpClient、$notification、$persistentStore、$done 在 Loon 里名字和用法都一样。第 12 章的订阅到期检查脚本，原样放进 Loon 就能跑。\n\n要改的是配置那一行：Surge 的“名字 = type=cron,cronexp=...”要改成 Loon 的“cron \"...\" script-path=...”这种写法。\n\n还有三个小坑要注意：\n\n第一，setInterval 在 Loon 里只跑一次，和 setTimeout 一样。想反复跑，要在回调函数里再调一次 setTimeout，自己接力。\n\n第二，$persistentStore.remove() 是清空全部存的东西，不是只删一个。删单个要用 write(undefined, 名字)。别乱用 remove()，不然别的脚本存的东西也没了。\n\n第三，$notification.post 在 Loon 里多两个参数，别在 Surge 的脚本里用，用了 Surge 不认。反过来，Loon 里用 Surge 那三个参数完全没问题。\n\n记住一句：JS 代码基本不用动，动的是配置那一行。",
      think: "把 Surge 脚本搬到 Loon 上，JS 代码要改吗？最容易踩的坑是哪三个？",
    },
  ],
  examples: [
    {
      title: "例子 1：判断现在在哪个 App 里",
      code: "console.log(typeof $loon !== \"undefined\");",
      explain:
        "typeof 是第 2 章学的，意思是“看这是什么类型”。\n$loon 是 Loon 特有的东西，Surge 和 Scripting 里都没有。\n如果 $loon 不存在，typeof 的结果就是 \"undefined\"，意思是“没有定义”。\n!== 是第 5 章学的“不等于”。整句的意思是“$loon 存在吗”。\n在 Scripting 里跑，显示 false，意思是“不是”，说明现在不在 Loon 里。同一段代码放 Loon 里跑，显示 true，意思是“是”，说明现在在 Loon 里。\n第 15 章写多端兼容的代码时，就是靠这一句来判断的。",
      output: "false",
    },
    {
      title: "例子 2：先练思路——模拟 Loon 的 $config",
      code: "const config = {\n  groups: {\n    \"国外社交\": [\"香港节点\", \"美国节点\", \"日本节点\"],\n    selected: { \"国外社交\": \"香港节点\" }\n  }\n};\nfunction getSelected(group) {\n  return config.groups.selected[group];\n}\nfunction setSelected(group, node) {\n  if (config.groups[group].indexOf(node) !== -1) {\n    config.groups.selected[group] = node;\n    return true;\n  }\n  return false;\n}\nconsole.log(\"现在选的是：\" + getSelected(\"国外社交\"));\nsetSelected(\"国外社交\", \"日本节点\");\nconsole.log(\"切换后选的是：\" + getSelected(\"国外社交\"));",
      explain:
        "这个例子在 Scripting 里跑，先练思路，不用真的去动 Loon 的配置。\n开头造一个假的配置对象 config，里面有一个策略组“国外社交”，有三个节点可选，现在选的是“香港节点”。策略组就是 Surge、Loon 里的一组节点选择，比如“国外社交”就是一个策略组，里面有香港节点、美国节点这些选项。\ngetSelected 函数，意思是“拿到选中的”，给策略组名字，就返回现在选的是谁。\nsetSelected 函数，意思是“设置选中的”，给策略组名字和节点名字，先检查这个节点在不在这个组里（indexOf 是第 3 章学的查找，返回 -1 就是没找到），在就换掉，返回 true；不在就返回 false。\n然后显示现在选的是谁，再切换到“日本节点”，再显示一次，确认已经换了。\n\nLoon 里真正的 $config.getSelectedPolicy 和 $config.setSelectPolicy 就是这么个意思，只不过它们动的是 Loon 真实的配置。",
      output: "现在选的是：香港节点\n切换后选的是：日本节点",
    },
    {
      title: "例子 3：Loon 版——拉订阅，数节点",
      code: "const subUrl = \"把这里换成你自己的订阅链接\";\n$httpClient.get(subUrl, function (error, response, data) {\n  if (error) {\n    $notification.post(\"订阅检查\", \"拉取失败\", \"错误：\" + error);\n    $done();\n    return;\n  }\n  const lines = data.split(\"\\n\");\n  let count = 0;\n  for (const line of lines) {\n    if (line.indexOf(\"= vless,\") !== -1 || line.indexOf(\"= trojan,\") !== -1 || line.indexOf(\"= ss,\") !== -1) {\n      count++;\n    }\n  }\n  $notification.post(\"订阅检查\", \"Kitty 订阅\", \"一共 \" + count + \" 个节点，状态码 \" + response.status);\n  $done();\n});",
      explain:
        "这段代码和第 12 章例 3 一字不差。四个 API 的名字和用法在 Loon 里完全一样，所以不用改。\n开头：订阅链接换成你自己的。\n$httpClient.get 去拉订阅，后面跟回调函数。\n先判断 error，不空就发失败通知，$done() 收尾。\n按换行切开，数一数里面有多少行是节点。\n最后发通知，再调 $done() 收尾。\n\n不一样的是配置那一行，见下面的 runNote。",
      output: "通知标题：订阅检查\n通知副标题：Kitty 订阅\n通知内容：一共 30 个节点，状态码 200\n（节点数是你订阅里的实际数量，这里以 Kitty 订阅的 30 个为例）",
      where: "loon",
      runNote:
        "这个例子要在 Loon 里运行，Scripting 里没有 $httpClient、$notification、$done，跑不了。做法：把代码保存成一个 .js 文件，传到网上拿到链接；在 Loon 配置的 [Script] 段加一行：cron \"0 9 * * *\" script-path=你的脚本地址,tag=订阅节点数。保存配置后，每天早上 9 点自动跑一次；Loon 里点开这个脚本，能看到运行日志。",
    },
    {
      title: "例子 4：晚上自动切到香港节点",
      code: "const changed = $config.setSelectPolicy(\"国外社交\", \"香港节点\");\nif (changed) {\n  $notification.post(\"策略切换\", \"国外社交\", \"已经切到香港节点\");\n} else {\n  $notification.post(\"策略切换\", \"国外社交\", \"切换失败，检查策略组名字对不对\");\n}\n$done();",
      explain:
        "第一行：$config.setSelectPolicy(\"国外社交\", \"香港节点\")，意思是“把‘国外社交’这个策略组切到‘香港节点’”。引号里的名字要换成你自己 Loon 配置里真实的策略组名字和节点名字。\n接下来：如果返回 true，意思是“是，成功了”，发通知说已经切过去了。\n不然就是返回了 false，意思是“不是，失败了”，发通知让你检查策略组名字写对了没有。\n最后一行：$done() 收尾。\n\n这个脚本要放在 Loon 的 cron 里，每天晚上 11 点跑一次，配置行在下面的 runNote 里。",
      output: "通知标题：策略切换\n通知副标题：国外社交\n通知内容：已经切到香港节点",
      where: "loon",
      runNote:
        "这个例子要在 Loon 里运行，Scripting 里没有 $config，跑不了；Surge 里也没有 $config，这个例子是 Loon 特有的。做法：把代码保存成一个 .js 文件，传到网上拿到链接；在 Loon 配置的 [Script] 段加一行：cron \"0 23 * * *\" script-path=你的脚本地址,tag=晚上切香港节点。保存配置后，每天晚上 11 点自动跑一次。",
    },
  ],
  exercises: [
    {
      task: "写一个函数 isLoon()，返回现在是不是在 Loon 里。在 Scripting 里运行，看显示什么。",
      hint: "照例子 1 的样子，把 typeof $loon !== \"undefined\" 放进函数里，返回它。再用 console.log 显示 isLoon() 的结果。",
      starter: "function isLoon() {\n  return $loon !== undefined;\n}\nconsole.log(isLoon());",
      answer:
        "function isLoon() {\n  return typeof $loon !== \"undefined\";\n}\nconsole.log(isLoon());",
      answerExplain:
        "函数里返回 typeof $loon !== \"undefined\" 的结果。在 Scripting 里跑，$loon 不存在，显示 false，意思是“不是”，说明现在不在 Loon 里。\n同一段代码放 Loon 里跑，会显示 true，意思是“是”，说明现在在 Loon 里。\n运行后应该显示：false。",
    },
    {
      task: "用对象模拟 Loon 的配置，写 getSelectedPolicy 和 setSelectPolicy 两个函数：先查“国外社交”现在选了谁，再切到“美国节点”，把切换前、切换成功了没有、切换后都显示出来。",
      hint: "照例子 2 的样子，函数名字换成 getSelectedPolicy 和 setSelectPolicy。切换前显示一次，切换后显示一次，中间把 setSelectPolicy 返回的结果也显示出来。",
      starter: "const config = {\n  groups: {\n    \"国外社交\": [\"香港节点\", \"美国节点\", \"日本节点\"],\n    selected: { \"国外社交\": \"香港节点\" }\n  }\n};",
      answer:
        "const config = {\n  groups: {\n    \"国外社交\": [\"香港节点\", \"美国节点\", \"日本节点\"],\n    selected: { \"国外社交\": \"香港节点\" }\n  }\n};\nfunction getSelectedPolicy(group) {\n  return config.groups.selected[group];\n}\nfunction setSelectPolicy(group, node) {\n  if (config.groups[group].indexOf(node) !== -1) {\n    config.groups.selected[group] = node;\n    return true;\n  }\n  return false;\n}\nconsole.log(\"切换前：\" + getSelectedPolicy(\"国外社交\"));\nconst ok = setSelectPolicy(\"国外社交\", \"美国节点\");\nconsole.log(\"切换成功了吗：\" + ok);\nconsole.log(\"切换后：\" + getSelectedPolicy(\"国外社交\"));",
      answerExplain:
        "getSelectedPolicy 是查现在选了谁，setSelectPolicy 是切换。切换前是“香港节点”，切换返回 true，意思是“是，成功了”，切换后是“美国节点”。\n运行后应该显示三行：\n切换前：香港节点\n切换成功了吗：true\n切换后：美国节点",
    },
    {
      task: "把第 12 章例 4 的订阅到期检查脚本搬到 Loon 上：写出 Loon 配置里 [Script] 段的那一行。JS 代码要不要改？",
      hint: "四个 API 的名字和用法两边一样，JS 代码一字不用改。只改配置那一行：Loon 的定时任务是 cron \"时间表\" script-path=脚本地址,tag=名字 这种写法。",
      starter: "订阅到期检查 = type=cron,cronexp=\"0 9 * * *\",script-path=你的脚本地址",
      answer: "cron \"0 9 * * *\" script-path=你的脚本地址,tag=订阅到期检查",
      answerExplain:
        "JS 代码一字不用改，因为 $httpClient、$notification、$persistentStore、$done 在 Loon 里名字和用法都一样。\n\n运行办法：把第 12 章例 4 的代码保存成文件（比如 sub-expire.js），传到网上拿到链接；在 Loon 配置的 [Script] 段加上面这一行，script-path 换成你自己的脚本地址。保存配置后，每天早上 9 点自动跑；Loon 里点开这个脚本，能看到运行日志。",
      answerWhere: "loon",
    },
  ],
  mistakes: [
    {
      wrong: "if ($loon) {\n  console.log(\"在 Loon 里\")\n}",
      right: "if (typeof $loon !== \"undefined\") {\n  console.log(\"在 Loon 里\")\n}",
      why: "在 Surge 或 Scripting 里根本没有 $loon，直接写它会报“没定义”的错；typeof 不存在的东西只会返回 \"undefined\"，不会报错。",
    },
    {
      wrong: "setInterval(check, 60000)  // 在 Loon 里指望它每分钟跑一次",
      right: "function check() {\n  // 检查订阅到期\n  setTimeout(check, 60000)  // 跑完自己再约下一次\n}\ncheck()",
      why: "Loon 里 setInterval 只跑一次，和 setTimeout 一样，想反复跑要在回调里再调一次 setTimeout，自己接力。",
    },
    {
      wrong: "$persistentStore.remove()  // 只想删掉 kittyExpire 这一项",
      right: "$persistentStore.write(undefined, \"kittyExpire\")  // 只删掉 kittyExpire 这一项",
      why: "remove() 是清空全部存的东西，一个不留；删单个要用 write(undefined, 名字)。",
    },
  ],
  recall: [
    {
      q: "判断代码现在是不是在 Loon 里，靠什么？怎么写？",
      a: "靠 $loon；写 typeof $loon !== \"undefined\"，是 true 就说明在 Loon 里。",
    },
    {
      q: "Loon 里脚本能直接换策略组选的节点，靠哪个工具？Surge 有吗？",
      a: "靠 $config.setSelectPolicy；Surge 没有，这是 Loon 特有的。",
    },
    {
      q: "把 Surge 脚本搬到 Loon 上，JS 代码要改吗？要改的是什么？",
      a: "JS 代码基本不用改；要改的是配置里 [Script] 段那一行，换成 Loon 的写法。",
    },
  ],
  mentalModel: "Loon 和 Surge 是亲兄弟：四个 API 同名同用法，JS 代码基本不用动；不一样的是配置那一行的写法，和 Loon 多出来的 $loon、$config、$utils 这几件小工具。",
}
