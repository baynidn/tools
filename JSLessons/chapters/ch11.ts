import type { Chapter } from "../types/lesson"

/** 第 11 章：模块文件格式（.sgmodule / Loon 插件）
 * 写作标准：从零开始，每个新词第一次出现必须解释。
 * 这一章讲：.sgmodule、#!name/#!desc、[Script]/[Rule]/[MITM]、Loon 插件。
 */
export const ch11: Chapter = {
  id: 11,
  title: "模块文件格式（.sgmodule / Loon 插件）",
  goal: "今天学 5 件事：\n1. .sgmodule 是什么\n2. 文件开头的 #!name、#!desc 是什么意思\n3. [Script]、[Rule]、[MITM] 三个段是干什么的\n4. Loon 插件（.plugin）长什么样\n5. 自己写一个最简单的模块",
  meaning:
    "你手机上装的那些模块（Sub-Store、签到脚本、Cookie 获取）全是这种文件。看懂格式，你就能自己改模块、自己写一个：比如给 MiSub 加一条规则、给 tg-bot 加一个定时检查。\n\n不懂格式，模块出问题只能干瞪眼；懂了，照着样子改几行就能用。这一章不写 JS，只写配置文件——模块文件本身就是纯文本，改起来比写代码还简单。",
  sections: [
    {
      heading: "1. .sgmodule 是什么",
      body: "“模块”的英文叫 module，就是一份纯文本文件，告诉 Surge：“你要帮我多干这几件事。”文件名的最后是 .sgmodule，比如 Sub-Store.sgmodule。\n\n“纯文本”就是只有文字，没有图片、没有格式，手机备忘录就能打开。\n\n模块里可以写三件事：跑一段 JS 脚本、加几条规则、解密几个网址。每一件事写在一个“段”里，下面几节一个一个讲。\n\n你手机上装的模块（Sub-Store、签到脚本、Cookie 获取）全是这种文件。看懂它，你就能自己改、自己写。\n\n“后缀名”这个词要记住：文件名最后那个点加几个字母（.sgmodule），就是后缀名，它告诉手机“这是什么文件”。",
      think: ".sgmodule 文件打开全是文字，它到底是代码，还是别的什么东西？",
    },
    {
      heading: "2. 文件开头：#!name 和 #!desc（模块的“名片”）",
      body: "文件最上面几行是“名片”，告诉 Surge 这个模块叫什么、是干什么的。\n\n#!name=名字：模块的名字，装上后在列表里显示的就是它。\n\n#!desc=一句话介绍：模块是干什么的。\n\n# 开头的行叫“注释”，意思是“写给人看的说明，机器会跳过不执行”。# 后面再加一个 !（#!）是特殊的注释，Surge 会专门来读它。\n\n还可以写 #!category=分类：模块属于哪个分类。你之前让 ModuleDock 在更新时保留本地分类，保的就是这一行。\n\n#!author=作者、#!icon=图标、#!system=ios 也是名片的一部分，不写也行。",
      think: "模块装上后，列表里显示的名字和介绍，是从文件的哪里读出来的？",
    },
    {
      heading: "3. [Script] 段：让 Surge 在什么时候跑一段 JS",
      body: "[Script] 段是“脚本段”：方括号括起来的标题，下面跟着属于这一段的行。Script 是“脚本”的意思，就是 JS 代码文件。\n\n每一行写一个任务，格式是：名字 = type=什么时候跑，pattern=哪些网址触发，script-path=脚本文件在哪里。\n\ntype=http-request：在收到请求的时候跑。比如打开某个 App 发请求时，脚本就跑起来。\n\ntype=http-response：在服务器回信的时候跑。回信里常常带着登录信息，脚本就是这时候把它存下来。\n\ntype=cron：定时跑。cronexp=\"0 8 * * *\" 是定时表达式，意思是每天早上 8 点整。括号里是 5 个数：分、时、日、月、星期。0 8 * * * 就是 0 分、8 点、每天（* 是“不管、都行”的意思）。\n\npattern 是一串“长相规则”，用来认出哪些网址要处理。pattern 里用的是“正则表达式”（读作“政则”，第 12 章会细讲），现在只要会抄：^ 的意思是“以……开头”，\\. 的意思是“真正的点”，\\/ 的意思是“斜杠”，.* 的意思是“后面不管是什么”。\n\nscript-path 是脚本文件的位置：可以是一个网址（脚本在网上），也可以是一个文件名（脚本跟模块放在一起）。\n\nrequires-body=true 的意思是“把请求的内容也交给脚本”。脚本要读内容时才加，不加也可以。",
      think: "想让 Surge 在打开某个 App 时跑一段脚本，模块里要写哪一行、写在哪一段？",
    },
    {
      heading: "4. [Rule] 段：哪些网址走代理",
      body: "[Rule] 段是“规则段”，每一行一条规则，写法跟你的 Surge 配置里的规则一模一样。\n\nDOMAIN-SUFFIX,telegram.org,Proxy：意思是“以 telegram.org 结尾的网址，都走 Proxy（代理）”。DOMAIN-SUFFIX 是“域名后缀”，Proxy 是 Surge 自带的代理策略。\n\n模块里的规则只在模块打开时生效，关掉模块，规则就不起作用了。这样你不用改主配置，就能临时加规则。\n\n比如你想让 MiSub 订阅站走代理，在模块里加一行 DOMAIN-SUFFIX,misub-b32.pages.dev,Proxy 就行，不用去动 Surge 的主配置。练习 1 就是让你写这个。",
      think: "只想让 MiSub 订阅站走代理，又不想动主配置，有什么办法？",
    },
    {
      heading: "5. [MITM] 段：解密 HTTPS 才能改内容",
      body: "很多 App 用的是 HTTPS（网址以 https:// 开头），内容是加密的，Surge 看不到里面是什么，也就改不了。\n\n“MITM”是“中间人”的英文缩写。做法是：Surge 假装成服务器，先把加密的内容解开，看一眼、改一改，再重新加密送回去。\n\n[MITM] 段里写 hostname = 要解密的网址，比如 hostname = %APPEND% passport.iqiyi.com。hostname 是“主机名”，就是网址里那个主域名。\n\n%APPEND% 的意思是“追加”：加在原来解密列表的后面，别把原来的覆盖掉。\n\n要让 MITM 生效，手机里必须装好并信任 Surge 的证书。“证书”是一张证明“我就是 Surge”的证件，手机信任它，才肯把加密内容交给 Surge 解。没装证书，[MITM] 写了也没用。",
      think: "App 的内容是加密的，脚本怎么才能看到里面的登录信息？",
    },
    {
      heading: "6. Loon 插件（.plugin）长什么样",
      body: "Loon 也有模块，叫“插件”，文件后缀是 .plugin，比如 BiliBili-local.plugin。\n\n开头一样是 #!name、#!desc 这些名片行。段的名字也差不多：[Script]、[Rule]、[MITM] 都有。\n\n写法有两点不一样（重点）：\n\n第一，[Script] 里的一行，Loon 不写“名字 = type=...”，而是把触发方式写在最前面：http-request 网址规则 script-path=..., tag=...。tag 是给这个脚本起的名字。\n\n第二，定时任务写成：cron \"30 7 * * *\" script-path=..., tag=...。引号里是定时表达式，意思是每天早上 7 点半。\n\nLoon 还多一个 [Argument] 段：放几个开关和填空，让装插件的人自己选。比如“扫码 Cookie = switch,false”就是一个开关，默认关着；“RunTime = input,\"30 7 * * *\"”就是一个填空，默认填的是每天早上 7 点半。\n\n安装也不一样：Surge 的模块可以从链接安装；Loon 的插件要放进手机「文件」App 里 Loon 文件夹下的 Plugins 目录，再重新打开 Loon。",
      think: "Loon 的插件和 Surge 的模块，打开看长得像吗？哪两行写法不一样？",
    },
    {
      heading: "7. Surge 模块和 Loon 插件的区别（对照表）",
      body: "把两边的区别列一张对照表，记不住时回来翻：\n\n文件后缀：Surge 是 .sgmodule，Loon 是 .plugin。\n\n脚本那一行：Surge 写“名字 = type=http-request,pattern=...,script-path=...”；Loon 写“http-request 网址规则 script-path=..., tag=...”。\n\n规则的动作：Surge 写策略组的名字（比如 Proxy、DIRECT）；Loon 写 PROXY、DIRECT、REJECT（全大写）。\n\n[MITM] 段：两边都有，写法一样，都是 hostname = ...。\n\n参数：Surge 用文件头的 #!arguments；Loon 用 [Argument] 段。\n\n记住：格式不一样，但思路一样——都是“名片 + 几个段”。会了 Surge 的，再看 Loon 的，照着样子改就行。",
      think: "Surge 和 Loon 的模块格式，记住哪几处不同就够用了？",
    },
    {
      heading: "8. 一个模块从写好到装上手机要走哪几步",
      body: "一个模块从写好到装上手机，要走 4 步：\n\n第 1 步：在手机备忘录或电脑记事本里写好文件，保存成 .sgmodule（Surge）或 .plugin（Loon）。\n\n第 2 步：Surge：用 Surge 的“从链接安装”，或者把文件放进 SurgeModules 文件夹；Loon：把文件放进 Loon 文件夹下的 Plugins 目录。\n\n第 3 步：在 Surge 或 Loon 的模块/插件列表里找到它，打开开关。\n\n第 4 步：如果模块里有 [MITM]，确认手机已经信任了证书；如果有脚本，确认 script-path 里的文件能拿到（网址能打开，或者文件跟模块放在一起）。\n\n出问题时先看两点：名片行是不是 #! 开头、方括号的段名有没有写错。这两处错得最多。",
      think: "一个模块写好了，到装上手机能用，中间要走哪几步？哪一步最容易忘？",
    },
  ],
  examples: [
    {
      title: "例子 1：最简单的模块——只加一条规则",
      code: "#!name=Telegram 走代理\n#!desc=让 telegram.org 的流量走代理\n#!category=学习\n\n[Rule]\nDOMAIN-SUFFIX,telegram.org,Proxy",
      explain:
        "#!name=Telegram 走代理 是模块的名字，装上后在列表里显示的就是它。\n#!desc=让 telegram.org 的流量走代理 是一句话介绍。\n#!category=学习 是模块的分类。\n[Rule] 是规则段，下面一行 DOMAIN-SUFFIX,telegram.org,Proxy 的意思是：以 telegram.org 结尾的网址，都走代理。",
      output: "安装后，Surge 的模块列表里出现“Telegram 走代理”。打开它，访问 telegram.org 就会走代理；关掉它，规则就不起作用。",
      where: "surge",
      runNote:
        "这是配置文件，不是 JS 代码，在 Scripting 里跑不了。保存成 telegram.sgmodule，在 Surge 里安装（从链接安装，或放进 SurgeModules 文件夹）。",
    },
    {
      title: "例子 2：带脚本和解密的模块——爱奇艺 Cookie 获取",
      code: "#!name=爱奇艺 Cookie 获取\n#!desc=打开爱奇艺时，把登录信息存下来，签到脚本要用\n\n[Script]\n爱奇艺 Cookie = type=http-request,pattern=^https:\\/\\/passport\\.iqiyi\\.com\\/apis\\/user\\/,script-path=iqiyi-cookie.js\n\n[MITM]\nhostname = %APPEND% passport.iqiyi.com",
      explain:
        "#!name 和 #!desc 是模块的名片。\n[Script] 段里一行就是一个任务：爱奇艺 Cookie = type=http-request，意思是“在收到请求的时候跑”；pattern=^https:\\/\\/passport\\.iqiyi\\.com\\/apis\\/user\\/ 的意思是“只处理发往爱奇艺登录接口的请求”；script-path=iqiyi-cookie.js 是脚本文件的名字。\n[MITM] 段里 hostname = %APPEND% passport.iqiyi.com 的意思是“把爱奇艺登录接口的网址加进解密列表”，不解密，脚本就看不到请求里的登录信息。",
      output: "安装后打开爱奇艺 App，模块在登录请求经过时自动跑脚本，把登录信息存下来；签到脚本就能用它自动签到。",
      where: "surge",
      runNote:
        "这是配置文件，不是 JS 代码，在 Scripting 里跑不了。保存成 iqiyi-cookie.sgmodule，在 Surge 里安装。script-path 里的 iqiyi-cookie.js 是第 12 章要写的脚本，这里先知道它是个 JS 文件的名字。",
    },
    {
      title: "例子 3：Loon 插件——B 站 Cookie 获取",
      code: "#!name=B站 Cookie 获取\n#!desc=打开 B 站时，把登录信息存下来\n\n[Script]\nhttp-response ^https?:\\/\\/app\\.bilibili\\.com\\/x\\/resource\\/fingerprint\\? script-path=bilibili-cookie.js, tag=B站 Cookie, timeout=30\n\n[MITM]\nhostname = app.bilibili.com",
      explain:
        "#!name 和 #!desc 是插件的名片，和 Surge 模块一样。\n[Script] 段里：http-response 写在最前面，意思是“在服务器回信的时候跑”；后面跟着网址的长相规则；script-path=bilibili-cookie.js 是脚本文件；tag=B站 Cookie 是给这个脚本起的名字。\n[MITM] 段里 hostname = app.bilibili.com 的意思是“解密 B 站这个网址”，不解密，脚本就看不到回信里的登录信息。\n注意：Loon 的 [Script] 不写“名字 = type=...”，触发方式直接写在行首，这是和 Surge 最大的不同。",
      output: "安装后打开 B 站 App，插件在服务器回信时自动跑脚本，把登录信息存下来；每日任务脚本就能用它自动做任务。",
      where: "loon",
      runNote:
        "这是 Loon 的插件文件，不是 JS 代码，在 Scripting 里跑不了。保存成 bilibili-cookie.plugin，放进手机「文件」App 里 Loon 文件夹下的 Plugins 目录，再重新打开 Loon。",
    },
    {
      title: "例子 4：用 JS 读出模块的名字（在 Scripting 里跑）",
      code: "const moduleText = \"#!name=订阅到期检查\\n#!desc=每天检查一次订阅\"\nconst lines = moduleText.split(\"\\n\")\nconst nameLine = lines[0]\nconst name = nameLine.replace(\"#!name=\", \"\")\nconsole.log(name)",
      explain:
        "这个例子不用部署，在 Scripting 里就能跑。\nmoduleText 是一段模块文件的内容（第 1 行是名字，第 2 行是介绍）。\n.split(\"\\n\") 是按换行切开，变成一排东西（数组，第 4 章讲过）。lines[0] 是第 1 行。\n.replace(\"#!name=\", \"\") 是把“#!name=”这几个字换成空的，剩下的就是名字。\n你的 ModuleDock 读模块名字、读 #!category 分类，用的就是这个办法。",
      output: "订阅到期检查",
    },
  ],
  exercises: [
    {
      task: "写一个 Surge 模块：让 MiSub 订阅站（misub-b32.pages.dev）走代理。模块名字叫“MiSub 走代理”，介绍写“让 MiSub 订阅站走代理”。",
      hint: "照例子 1 的样子写：开头三行名片，空一行，[Rule] 段，一行规则。规则用 DOMAIN-SUFFIX，动作写 Proxy。",
      starter: "#!name=MiSub 走代理\n#!desc=让 MiSub 订阅站走代理\n\n[Rule]\n",
      answer:
        "#!name=MiSub 走代理\n#!desc=让 MiSub 订阅站走代理\n\n[Rule]\nDOMAIN-SUFFIX,misub-b32.pages.dev,Proxy",
      answerExplain:
        "这是配置文件，不是 JS 代码，不用在 Scripting 里跑。\n保存成 misub.sgmodule，放进手机「文件」App 里的 SurgeModules 文件夹，然后在 Surge 的模块列表里打开它。\n打开后，访问 misub-b32.pages.dev 就会走代理。",
      answerWhere: "surge",
    },
    {
      task: "下面是一段模块文件的内容，写一段代码取出它的 #!desc 的值并显示出来。\n#!name=Telegram 走代理\n#!desc=让 telegram.org 的流量走代理\n#!category=学习",
      hint: "照例子 4 的样子：先按换行切开，再一行一行找开头是 #!desc= 的那一行，把“#!desc=”换成空的。找开头可以用 indexOf(\"#!desc=\") === 0（第 3 章讲过查找）。",
      starter: "const text = \"#!name=Telegram 走代理\\n#!desc=让 telegram.org 的流量走代理\\n#!category=学习\"\nconst lines = text.split(\"\\n\")",
      answer:
        "const text = \"#!name=Telegram 走代理\\n#!desc=让 telegram.org 的流量走代理\\n#!category=学习\"\nconst lines = text.split(\"\\n\")\nlet desc = \"\"\nfor (const line of lines) {\n  if (line.indexOf(\"#!desc=\") === 0) {\n    desc = line.replace(\"#!desc=\", \"\")\n  }\n}\nconsole.log(desc)",
      answerExplain:
        "先按换行切成一排（数组）。\nfor...of（第 4 章）一行一行看过去。\nindexOf(\"#!desc=\") === 0 的意思是“这一行开头就是 #!desc=”。\n找到后把“#!desc=”换成空的，剩下的就是介绍。\n运行后应该显示：让 telegram.org 的流量走代理。",
    },
    {
      task: "给练习 1 的模块加一行分类：#!category=学习。写出改完的完整模块。",
      hint: "分类行写在名片里，放在 #!desc 的下一行。",
      starter: "#!name=MiSub 走代理\n#!desc=让 MiSub 订阅站走代理\n\n[Rule]\nDOMAIN-SUFFIX,misub-b32.pages.dev,Proxy",
      answer:
        "#!name=MiSub 走代理\n#!desc=让 MiSub 订阅站走代理\n#!category=学习\n\n[Rule]\nDOMAIN-SUFFIX,misub-b32.pages.dev,Proxy",
      answerExplain:
        "这是配置文件，不是 JS 代码。\n保存成 misub.sgmodule，放进手机「文件」App 里的 SurgeModules 文件夹，重新装一次（或者在 Surge 里重新载入模块），分类就生效了。\nModuleDock 在更新模块时保留本地分类，保的就是 #!category 这一行。",
      answerWhere: "surge",
    },
    {
      task: "把练习 1 的规则写成 Loon 插件格式：模块名字和介绍不变，规则动作按 Loon 的写法。",
      hint: "Loon 的文件后缀是 .plugin。规则段一样叫 [Rule]，但动作要写全大写的 PROXY。开头三行名片照抄。",
      starter: "#!name=MiSub 走代理\n#!desc=让 MiSub 订阅站走代理\n\n[Rule]\nDOMAIN-SUFFIX,misub-b32.pages.dev,Proxy",
      answer:
        "#!name=MiSub 走代理\n#!desc=让 MiSub 订阅站走代理\n#!category=学习\n\n[Rule]\nDOMAIN-SUFFIX,misub-b32.pages.dev,PROXY",
      answerExplain:
        "这是 Loon 的插件文件，不是 JS 代码。\n保存成 misub.plugin，放进手机「文件」App 里 Loon 文件夹下的 Plugins 目录，再重新打开 Loon。\n打开后，访问 misub-b32.pages.dev 就会走代理。\n和 Surge 版比，只变了一处：规则动作写成了全大写的 PROXY。",
      answerWhere: "loon",
    },
  ],
  mistakes: [
    {
      wrong: "[MITM]\nhostname = passport.iqiyi.com",
      right: "[MITM]\nhostname = %APPEND% passport.iqiyi.com",
      why: "不写 %APPEND%，这一行会把原来的解密列表整个覆盖掉，只留下这一个域名。",
    },
    {
      wrong: "爱奇艺 Cookie = type=http-request,pattern=^https:\\/\\/passport\\.iqiyi\\.com\\/apis\\/user\\/,script-path=iqiyi-cookie.js",
      right: "爱奇艺 Cookie = type=http-request,pattern=^https:\\/\\/passport\\.iqiyi\\.com\\/apis\\/user\\/,script-path=iqiyi-cookie.js,requires-body=true",
      why: "脚本要读请求里的内容，不写 requires-body=true，脚本拿到的内容就是空的，看起来就像脚本没起作用。",
    },
    {
      wrong: "[Rule]\nDOMAIN-SUFFIX,misub-b32.pages.dev,Proxy  // 写在 Loon 插件里",
      right: "[Rule]\nDOMAIN-SUFFIX,misub-b32.pages.dev,PROXY  // 写在 Loon 插件里",
      why: "Loon 的规则动作要全大写，写小写的 Proxy，Loon 不认这条规则。",
    },
  ],
  recall: [
    {
      q: "一个模块文件最少有哪几块？",
      a: "文件头的 #!name、#!desc 名片，加上 [Rule]、[Script]、[MITM] 这几个段。",
    },
    {
      q: "%APPEND% 是什么意思？不写它会怎样？",
      a: "追加的意思；不写它，hostname 会把原来的解密列表整个覆盖掉。",
    },
    {
      q: "Surge 的 [Script] 行和 Loon 的有什么不一样？",
      a: "Surge 写“名字 = type=...”；Loon 把触发方式写在行首，再用 tag=... 起名字。",
    },
  ],
  mentalModel: "模块文件就是一张声明单：名片写它是谁，[Rule] 加规则，[Script] 说脚本什么时候跑，[MITM] 说解密哪个域名——文件本身不干活，干活的是它指向的脚本。",
}
