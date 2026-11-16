import type { Chapter } from "../types/lesson"

/** 第 10 章：Cloudflare Workers 详解
 * 写作标准：从零开始，每个新词第一次出现必须解释。
 * 这一章讲：Workers、请求/响应、环境变量、KV、部署。
 */
export const ch10: Chapter = {
  id: 10,
  title: "Cloudflare Workers 详解",
  goal: "今天学 5 件事：\n1. Workers 是什么（不用自己买电脑的服务器）\n2. 请求（Request）和响应（Response）是什么\n3. 写一个返回“你好”的 Worker\n4. 环境变量（env）：藏起来的设置\n5. KV 绑定：一个能上网的记事本；部署：把代码传上去",
  meaning:
    "你的 tg-bot、MiSub 订阅服务、sub-provider、导航站，全是跑在 Workers 上的 JS 代码。不懂它，你只能用别人写好的；懂了，你能自己写一个网址服务：比如一个显示订阅到期时间的页面、一个帮你数节点的接口。\n\n这一章的代码不在 Scripting 里跑，要部署到 Cloudflare 上才跑——正好借此分清“运行环境”：同样的 JS，换个地方跑，能做的事就不一样。",
  sections: [
    {
      heading: "1. Workers 是什么",
      body: "Cloudflare Workers（简称 Workers，读作“沃克尔斯”）是 Cloudflare 提供的一个服务：你把 JS 代码传上去，它就帮你在全世界的电脑上跑这段代码，别人打开一个网址就能用。\n\n“服务器”这个词第 1 章讲过：一台一直开着的电脑，专门给别人提供服务。以前要做一个网站，得自己买一台电脑、一直开着、还要管它别坏。现在不用了：代码交给 Workers，Cloudflare 帮你管电脑，你只管写代码。\n\n你的 tg-bot、MiSub 订阅服务、sub-provider、导航站，全是跑在 Workers 上的 JS 代码。\n\n“部署”这个词要先记住：把写好的代码传到 Cloudflare 上、让它开始工作的过程，就叫部署。以后会经常说“部署”，记住：部署 = 上传代码并上线。",
      think: "不用自己买电脑，代码也能在网上跑吗？别人打开网址，是谁在替你跑这段代码？",
    },
    {
      heading: "2. 请求和响应：Request 和 Response",
      body: "别人打开你的网址，手机会给 Workers 发一个“请求”；Workers 跑完代码，再发一个“响应”回去，手机上就显示出内容。\n\n“请求”的英文叫 Request，读作“瑞奎斯特”。请求就是一句话：“我要看这个网址的东西。”请求里带着网址，告诉 Workers 你要什么。\n\n“响应”的英文叫 Response，读作“瑞斯庞斯”。响应就是 Workers 的回话：“给你，这是你要的东西。”响应里带着文字、图片或者 JSON（JSON 是第 7 章讲过的一种写数据的格式）。\n\n打个比方：请求是你点菜，响应是服务员端上来的菜。没有请求，就没有响应。\n\n在 Workers 的代码里，你会收到一个名叫 request 的请求，最后要交出一个 Response 响应。这是 Workers 定好的规矩：收到请求，交出响应。",
      think: "你点开一个网址，手机和服务器之间到底说了哪两句话？",
    },
    {
      heading: "3. 写第一个 Worker：返回“你好”",
      body: "下面是第一个 Worker，完整代码在例子 1 里。先把每一行是什么意思看懂。\n\nexport default { ... }：固定写法，意思是“把大括号里的东西交给 Cloudflare”。export 是“交出去”，default 是“主要的”。合起来：把这个主要的配置交出去。\n\nasync fetch(request) { ... }：意思是“收到请求时，就跑大括号里的代码”。fetch 这个词第 8 章讲过，是“去网上拿东西”；在这里它是 Workers 规定好的名字，意思是“收到请求”。async 是“异步”的意思（第 8 章：不用等，好了再通知你），这里先照抄，不用深究。\n\nreturn new Response(\"你好\")：new 是“新建一个”，Response 是“响应”。合起来：新建一个响应，内容是“你好”。return 是“交出去”，意思是把这个响应交出去给访问的人。\n\n这段代码在 Scripting 里跑不了，因为 Scripting 里没有“有人访问网址”这回事。它要部署到 Workers 上（第 7 节讲怎么部署），部署完了打开网址，页面上就显示“你好”。",
      think: "只返回一句固定的“你好”，要几行代码？哪一行是真正把话交出去的？",
    },
    {
      heading: "4. 让 Worker 会“看人下菜”：读请求里的地址",
      body: "只会说一句固定的“你好”还不够。真正的服务要会“看人下菜”：访问的人在网址里多说一句，回答就跟着变。\n\n比如网址是 https://你的网址/?name=cc。问号后面的 name=cc 叫“参数”，意思是访问的人顺便告诉你一句话：“名字是 cc”。\n\nnew URL(request.url)：把网址文字变成一个能拆开看的“网址对象”。URL 读作“尤阿艾欧”，就是网址的意思。request.url 是请求里带的网址。\n\nurl.searchParams.get(\"name\")：searchParams 是“网址里的参数”，get(\"name\") 是“取出名叫 name 的参数”。如果网址里没有 name，就拿不到东西，返回 null。null 是“没有、空”的意思，第 2 章讲过。\n\n|| \"朋友\"：|| 是“或者”的意思（第 5 章讲过）。拿不到名字时，就用“朋友”代替。所以网址里不写名字，看到的就是“你好，朋友”。\n\n你的 sub-provider 就是这么干的：它从网址的路径里读出访问口令（比如 /p/abc123.yaml 里的 abc123），口令对了才给订阅，口令不对就不给。例子 2 就是这个本事的简化版。",
      think: "同一个网址，换个名字打开，页面能不能跟着变？名字藏在网址的哪个位置？",
    },
    {
      heading: "5. 环境变量：藏起来的设置",
      body: "有些东西不能直接写进代码，比如密码、密钥。代码可能会发给别人看，写进去就泄露了。\n\n“环境变量”就是藏在 Cloudflare 后台的一组设置，代码运行时才能读到，别人看你的代码是看不到的。环境变量的英文叫 env，读作“恩维”，就是“环境”的意思。\n\n在代码里，fetch 的第二个参数 env 就是这组设置：env.ADMIN_PASSWORD 的意思是“从设置里取出名叫 ADMIN_PASSWORD 的密码”。\n\n比如 tg-bot 的机器人密钥、MiSub 的管理员密码，都是放在环境变量里的。你在 Cloudflare 后台的“设置 → 变量”里填好，代码里用 env.名字 来读。\n\n记住一条铁规矩：密码、密钥、口令，一律放环境变量，不写进代码。",
      think: "密码写进代码会怎样？有没有一个别人看代码看不到、代码运行时却能读到的地方？",
    },
    {
      heading: "6. KV 绑定：一个能上网的记事本",
      body: "有些东西要存下来，下次请求还能读到，比如 MiSub 的订阅配置、sub-provider 缓存的订阅内容、访问次数。代码里的变量（第 2 章）请求一结束就没了，存不住。\n\n“KV”是 Cloudflare 提供的一个能上网的记事本。K 是 Key，意思是“钥匙、名字”；V 是 Value，意思是“值、内容”。合起来：按名字存东西，按名字取东西。KV 读作“kei-vi”。\n\n取东西用 get，存东西用 put，都是固定写法：\n\nenv.COUNT_KV.get(\"visits\")：打开名叫 COUNT_KV 的记事本，取出名字叫 visits 的那一页。\n\nenv.COUNT_KV.put(\"visits\", \"1\")：在名叫 COUNT_KV 的记事本里，把 visits 这一页写成 1。\n\n“绑定”这个词：把一个 KV 记事本和你的 Worker 连起来，就叫绑定。绑定时要给记事本起个名字（比如 COUNT_KV、MISUB_KV），代码里就用这个名字来叫它。\n\n你的 MiSub 就是把所有订阅配置存在 KV 里；sub-provider 把拉到的订阅缓存 10 分钟存在 KV 里，下次有人要，直接给缓存的，不用重新去拉。例子 5 就是用 KV 做一个访客计数器。",
      think: "请求一结束，变量就没了，那订阅配置、下次还要用的次数存在哪儿？",
    },
    {
      heading: "7. 部署：把代码传上去，拿到一个网址",
      body: "写好代码，要“部署”才能用。部署 = 上传代码并上线（第 1 节讲过）。\n\n最简单的办法：在 Cloudflare 后台打开 Workers，点“创建”，把代码粘贴进去，点“部署”。几秒钟后，你就得到一个网址，比如 https://你的名字.workers.dev。\n\n部署成功后，后台会显示你的网址和测试结果。打开网址，看到的就是你的 Worker 跑出来的结果。\n\n注意：workers.dev 结尾的网址在国内打不开，正式用的服务都要挂你自己的域名，比如 tg-bot 用的是 bot.baynidn.cc.cd。刚学的时候，先在后台看测试结果就行，不用急着挂域名。\n\n还有一个办法是用命令行工具 wrangler 上传，你现在不用学，先会后台粘贴部署就行。",
      think: "代码写好了，怎么才能拿到一个别人能打开的网址？",
    },
    {
      heading: "8. 串起来：tg-bot 是怎么跑的",
      body: "以 tg-bot 为例，把这一章串起来走一遍：\n\n1. 你在 Telegram 里发一句话。\n2. Telegram 把这句话发给 tg-bot 的 Worker 网址，这就是一个请求。\n3. Worker 的 fetch 跑起来：从请求里读出你发了什么，从 KV 里读出你的订阅，从环境变量里读出密钥。\n4. Worker 需要回话时，再用 fetch（第 8 章：去网上拿东西）去调 Telegram 的接口，把回复发出去。\n5. 最后交出一个响应，告诉 Telegram“收到了”。\n\n所以一个 Worker 就是：收到请求 → 读请求、读环境变量、读 KV、可能再去网上拿点东西 → 交出响应。\n\n这一章的 5 个例子就是把这条链子拆开练：先会说“你好”，再会看网址里的参数，再会用 KV 记数。下一章换一个地方：手机上的模块文件。",
      think: "tg-bot 收到你一句话，到回你一句话，中间走了哪几步？",
    },
  ],
  examples: [
    {
      title: "例子 1：返回“你好”的 Worker",
      code: "export default {\n  async fetch(request) {\n    return new Response(\"你好\")\n  }\n}",
      explain:
        "export default 是固定写法，意思是“把大括号里的东西交给 Cloudflare”。\nasync fetch(request) 的意思是“收到请求时，就跑大括号里的代码”。\nreturn new Response(\"你好\") 的意思是“新建一个响应，内容是‘你好’，交出去”。\n部署后打开网址，页面上就显示：你好。",
      output: "你好",
      where: "worker",
      runNote:
        "这段代码要部署到 Cloudflare Workers 上才能跑。在 Scripting 里跑不了，因为 Scripting 里没有“有人访问网址就运行”的环境。部署后打开你的 Worker 网址，页面上就显示“你好”。",
    },
    {
      title: "例子 2：按名字打招呼的 Worker",
      code: "export default {\n  async fetch(request) {\n    const url = new URL(request.url)\n    const name = url.searchParams.get(\"name\") || \"朋友\"\n    return new Response(\"你好，\" + name)\n  }\n}",
      explain:
        "new URL(request.url) 是把网址文字变成一个能拆开看的“网址对象”。\nurl.searchParams.get(\"name\") 是从网址里取出名叫 name 的参数。\n|| \"朋友\" 是拿不到名字时用的代替。\n打开 https://你的网址/?name=cc，页面显示：你好，cc；不加参数打开，显示：你好，朋友。",
      output: "你好，cc",
      where: "worker",
      runNote:
        "同样要部署到 Workers 上才能跑。部署后在网址后面加上 ?name=cc 再打开，比如 https://你的网址/?name=cc，页面显示“你好，cc”。",
    },
    {
      title: "例子 3：拆开订阅链接（在 Scripting 里跑）",
      code: "const link = \"https://misub-b32.pages.dev/sub/profiles/abc123?target=surge\"\nconst u = new URL(link)\nconsole.log(u.hostname)\nconsole.log(u.pathname)\nconsole.log(u.searchParams.get(\"target\"))",
      explain:
        "这个例子不用部署，在 Scripting 里就能跑。\nnew URL(链接) 是把一串网址文字变成能拆开看的“网址对象”。\nu.hostname 是网址里的主域名，u.pathname 是网址里的路径，u.searchParams.get(\"target\") 是取出名叫 target 的参数。\nWorker 读请求里的网址，用的就是这三个本事。",
      output: "misub-b32.pages.dev\n/sub/profiles/abc123\nsurge",
    },
    {
      title: "例子 4：把订阅信息变成 JSON 文字（在 Scripting 里跑）",
      code: "const data = { name: \"Kitty\", count: 30, ok: true }\nconst text = JSON.stringify(data)\nconsole.log(text)",
      explain:
        "这个例子不用部署，在 Scripting 里就能跑。\nJSON.stringify 是第 7 章讲过的：把对象变成 JSON 文字。\nWorker 交出响应时，内容常常就是这样一段 JSON 文字；KV 里存的订阅配置，也是这样一段文字。\n运行后显示：{\"name\":\"Kitty\",\"count\":30,\"ok\":true}。",
      output: "{\"name\":\"Kitty\",\"count\":30,\"ok\":true}",
    },
    {
      title: "例子 5：用 KV 做的访客计数器",
      code: "export default {\n  async fetch(request, env) {\n    const old = await env.COUNT_KV.get(\"visits\")\n    const n = (old === null ? 0 : Number(old)) + 1\n    await env.COUNT_KV.put(\"visits\", String(n))\n    return new Response(\"你是第 \" + n + \" 位访客\")\n  }\n}",
      explain:
        "env.COUNT_KV.get(\"visits\") 是从 KV 记事本里取出名字叫 visits 的一页。\n第一次访问时，记事本里还没有这一页，get 会返回 null（没有、空），所以 n 从 0 开始加 1，等于 1。\nawait env.COUNT_KV.put(\"visits\", String(n)) 是把新的次数存回记事本。String(n) 是把数字 n 变成文字，因为 KV 里只能存文字。\nreturn new Response(\"你是第 \" + n + \" 位访客\") 是把次数告诉访问的人。",
      output: "你是第 1 位访客",
      where: "worker",
      runNote:
        "COUNT_KV 是 KV 绑定的名字。先在 Cloudflare 后台新建一个 KV 命名空间，在 Worker 的设置里绑定，名字就填 COUNT_KV，再部署这段代码。部署后第一次打开网址，页面显示“你是第 1 位访客”；刷新一次，就变成第 2 位。",
    },
  ],
  exercises: [
    {
      task: "把例子 1 里的“你好”改成“你好，欢迎来到我的小站”，写出完整的 Worker 代码。",
      hint: "只改 new Response( ) 括号里的字，别的不动。双引号和括号都要留着。",
      starter: "export default {\n  async fetch(request) {\n    return new Response(\"你好\")\n  }\n}",
      answer:
        "export default {\n  async fetch(request) {\n    return new Response(\"你好，欢迎来到我的小站\")\n  }\n}",
      answerExplain:
        "只改了响应里的文字，别的地方一模一样。\n部署后打开网址，页面应该显示：你好，欢迎来到我的小站。",
      answerWhere: "worker",
    },
    {
      task: "下面这条订阅链接，target 参数的值是什么？写一段代码取出来并显示。\nhttps://misub-b32.pages.dev/sub/profiles/abc123?target=clash",
      hint: "照例子 3 的样子，先 new URL(链接)，再用 searchParams.get(\"target\") 取出来。",
      starter: "const link = \"https://misub-b32.pages.dev/sub/profiles/abc123?target=clash\"\nconst u = new URL(link)",
      answer:
        "const link = \"https://misub-b32.pages.dev/sub/profiles/abc123?target=clash\"\nconst u = new URL(link)\nconsole.log(u.searchParams.get(\"target\"))",
      answerExplain:
        "new URL(链接) 把网址变成能拆开看的“网址对象”。\nsearchParams.get(\"target\") 取出名叫 target 的参数。\n运行后应该显示：clash。",
    },
    {
      task: "写一个 Worker：网址里有 ?name=名字，就显示“你好，名字”；没有名字，就显示“你好，朋友”。",
      hint: "照例子 2 的样子写。记住拿不到名字时返回的是 null，用 || \"朋友\" 来代替。",
      starter: "export default {\n  async fetch(request) {\n    return new Response(\"你好\")\n  }\n}",
      answer:
        "export default {\n  async fetch(request) {\n    const url = new URL(request.url)\n    const name = url.searchParams.get(\"name\") || \"朋友\"\n    return new Response(\"你好，\" + name)\n  }\n}",
      answerExplain:
        "new URL(request.url) 把网址变成能拆开看的对象。\nsearchParams.get(\"name\") 取出名字，拿不到时用 || \"朋友\" 代替。\n部署后打开 https://你的网址/?name=cc，页面显示：你好，cc；不加参数打开，显示：你好，朋友。",
      answerWhere: "worker",
    },
    {
      task: "把下面这条节点信息变成 JSON 文字并显示出来（KV 里存的就是这种文字）：名字是“香港 01”，类型是 vless，端口是 443。",
      hint: "先写一个对象 { name: \"香港 01\", type: \"vless\", port: 443 }，再用 JSON.stringify 把它变成文字，最后 console.log 显示出来。",
      starter: "const node = { name: \"香港 01\", type: \"vless\", port: 443 }",
      answer:
        "const node = { name: \"香港 01\", type: \"vless\", port: 443 }\nconst text = JSON.stringify(node)\nconsole.log(text)",
      answerExplain:
        "对象（第 4 章）是“一堆有名字的东西放在一起”。\nJSON.stringify（第 7 章）是把对象变成 JSON 文字。\n运行后应该显示：{\"name\":\"香港 01\",\"type\":\"vless\",\"port\":443}。",
    },
  ],
  mistakes: [
    {
      wrong: "const old = await env.COUNT_KV.get(\"visits\")\nconst n = old + 1",
      right: "const old = await env.COUNT_KV.get(\"visits\")\nconst n = (old === null ? 0 : Number(old)) + 1",
      why: "KV 里取出来永远是文字，文字 \"1\" 加 1 会拼成 \"11\"，要先用 Number() 转成数字再加。",
    },
    {
      wrong: "await env.MY_KV.get(\"visits\")  // 后台绑的名字其实是 COUNT_KV",
      right: "await env.COUNT_KV.get(\"visits\")  // 代码和后台用同一个名字 COUNT_KV",
      why: "绑定按名字精确匹配，代码里的名字和后台绑的名字差一个字母，读到的就是 undefined（空的、不存在）。",
    },
    {
      wrong: "async fetch(request) {\n  new Response(\"你好\")\n}",
      right: "async fetch(request) {\n  return new Response(\"你好\")\n}",
      why: "不写 return，响应造出来也没交出去，访问的人什么都收不到。",
    },
  ],
  recall: [
    {
      q: "Workers 里收到请求、交出响应，靠的是哪两个东西？",
      a: "收到请求靠 fetch(request)，交出响应靠 return new Response(...)。",
    },
    {
      q: "KV 里取出来的值是什么类型？想拿它做加法要先干什么？",
      a: "永远是文字；要先用 Number() 转成数字再加，存回去再用 String() 转回文字。",
    },
    {
      q: "密码、密钥应该写进代码里，还是放进环境变量？",
      a: "放环境变量（env），代码里只写 env.名字来读，绝不把密码直接写进代码。",
    },
  ],
  mentalModel: "Workers 就是一台不用你管的电脑：有人发请求进来，fetch 接住、干活，最后 return 一个 Response 交回去；env 是藏起来的设置，KV 是能上网的记事本。",
}
