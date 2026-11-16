import type { Chapter } from "../types/lesson"

/** 第 1 章：JS 是什么、四种运行环境
 * 写作标准：从零开始，每个新词第一次出现必须解释。
 * 这一章只讲 5 个词：JavaScript、代码、运行环境、浏览器、控制台。
 */
export const ch01: Chapter = {
  id: 1,
  title: "JS 是什么、四种运行环境",
  goal: "今天学 3 件事：\n1. JavaScript（简称 JS）是什么\n2. 代码是什么，代码是怎么跑起来的\n3. JS 能在 4 个地方跑：浏览器、Node.js、Cloudflare Workers、手机上的脚本 App（Scripting、Surge、Loon）",
  meaning:
    "学 JS，就是学一门能指挥机器的语言。学会了，你就能自己写小工具、自己改模块，不用求人。\n\n“运行环境”这个词要先分清：JS 代码本身只是一堆文字，得有个地方来执行它，这个地方就叫“运行环境”。不同的地方能做的事不一样，但语言本身是一样的。先分清地方，后面学才不晕。\n\n这一章没有要背的东西，看懂就行。真正的动手从第 2 章开始。",
  sections: [
    {
      heading: "1. JavaScript 是什么",
      body: "JavaScript（简称 JS，读作“接诶丝”）是一种“编程语言”。\n\n“编程”就是给机器写吩咐。“语言”就是你和机器说话用的话。合起来：JS 就是用来给机器下吩咐的一种话。\n\n你平时在手机上点的每一个按钮、看到的每一条消息，背后都有代码在跑。JS 就是写这种代码的语言之一。你要学的，就是怎么用 JS 写出自己的吩咐。",
      think: "你每天用的 tg-bot、MiSub，背后都是代码在跑，你觉得代码到底是什么东西？",
    },
    {
      heading: "2. 代码是什么",
      body: "“代码”就是写下来的吩咐。一行代码就是一条吩咐，机器会按顺序一条一条执行。\n\n比如这一行：\nconsole.log(\"你好\")\n\n这就是一条吩咐，意思是：把“你好”这两个字显示出来。\n\nconsole.log 是固定写法，你不用懂英语，记住就行：console.log(东西) = 把括号里的东西显示出来。\n\nconsole 是“控制台”的意思——控制台就是一个显示结果的地方。log 是“打印、记录”的意思。合起来，console.log 就是“在控制台打印出来”。\n\n双引号里面的字叫“字符串”，意思是“一串文字”。以后你会经常看到字符串，记住：双引号包着的，就是一串文字。",
      think: "console.log(\"你好\") 这一行，机器是怎么知道要显示“你好”这两个字的？",
    },
    {
      heading: "3. 运行环境是什么",
      body: "“运行环境”就是让代码跑起来的地方。\n\n代码本身只是一堆文字，它自己不会动，得有个地方来执行它。这个地方就叫运行环境。\n\n打个比方：菜谱是文字，厨房是做菜的地方。代码是菜谱，运行环境就是厨房。没有厨房，菜谱做不出菜；没有运行环境，代码也跑不起来。\n\n下面说的 4 个地方，都是 JS 的“厨房”。",
      think: "同样一句代码，为什么换个地方跑，结果就不一样？",
    },
    {
      heading: "4. 第一个地方：浏览器",
      body: "“浏览器”就是你平时上网用的 App，比如 Safari、Chrome。\n\n浏览器里能跑 JS，能操作网页：改文字、改颜色、点按钮。你现在看的教程网页，就是跑在浏览器里的。\n\n浏览器的特点：能直接看到网页，适合学 JS 的基础，因为结果马上能看见。",
      think: "你现在看的这个教程页面，是在哪个地方跑起来的？",
    },
    {
      heading: "5. 第二个地方：Node.js",
      body: "Node.js（读作“node 点接诶丝”）是一个装在电脑上的程序。它让 JS 能在电脑上直接跑，不用打开浏览器。\n\n适合写工具、跑服务器。比如你的电脑上要批量处理一批文件，就可以写一段 JS，用 Node.js 来跑。\n\n这一章你不用装 Node.js，先知道有这个地方就行。",
      think: "不用打开浏览器，代码能不能跑？",
    },
    {
      heading: "6. 第三个地方：Cloudflare Workers",
      body: "Cloudflare Workers（简称 Workers，读作“沃克尔斯”）是一个在网上的服务。你把 JS 代码传上去，全世界的人都能通过网址访问到它跑出来的结果。\n\n你的 tg-bot、MiSub 订阅服务、导航站，都是跑在 Workers 上的。它们就是你写的 JS 代码，只不过跑在 Cloudflare 的服务器上。\n\n“服务器”这个词的意思：一台一直开着的电脑，专门给别人提供服务。Workers 就是一种不用你自己买电脑的服务器。\n\n第 10 章会专门讲 Workers，到时候你就自己会写了。",
      think: "tg-bot 全天都在网上接消息，它跑在你手机上吗？",
    },
    {
      heading: "7. 第四个地方：手机上的脚本 App",
      body: "手机上也有能跑 JS 的 App，最常用的三个：\n\nScripting：专门跑 JS 的 App。你现在看的这套教程，就是在 Scripting 里跑的。以后你写的练习、小工具，都可以在 Scripting 里直接运行。\n\nSurge：你的代理工具。它里面也能跑 JS 脚本，用来改网络请求、做自动化。比如你用的那些模块，背后就是 JS 脚本。\n\nLoon：跟 Surge 类似的另一款代理工具，也能跑 JS 脚本。\n\n第 12 章讲 Surge 的脚本，第 13 章讲 Loon 的脚本，到时候你就能自己写模块了。",
      think: "Surge 里的去广告脚本，和浏览器里的网页代码，是同一种语言写的吗？",
    },
    {
      heading: "8. 这四个地方有什么共同点",
      body: "语言一样：不管在哪个地方跑，都是 JavaScript。变量、函数这些写法，到处都一样。\n\n能做的事不一样：浏览器能操作网页，Workers 能做网站后端，Surge 和 Loon 能改网络请求。\n\n所以学习顺序是：先学共同的部分（第 2 到 9 章），再学每个地方特有的本事（第 10 到 15 章），最后做两个完整的实战（第 16 章）。\n\n这一章就到这里。下面跑三个例子，亲手让机器显示点东西。",
      think: "四种地方都能跑 JS，那它们到底哪里一样、哪里不一样？",
    },
  ],
  examples: [
    {
      title: "例子 1：第一行代码",
      code: "console.log(\"你好，我是 cc\")",
      explain:
        "console.log 是固定写法，意思是“显示出来”。\n括号里是双引号包着的文字，叫“字符串”，意思是一串文字。\n运行后，下面会显示：你好，我是 cc。",
      output: "你好，我是 cc",
    },
    {
      title: "例子 2：让机器算数",
      code: "console.log(1 + 2)",
      explain:
        "括号里是 1 + 2。机器会先算出结果 3，再显示出来。\nJS 会算数，加减乘除都会，后面第 5 章专门讲。",
      output: "3",
    },
    {
      title: "例子 3：两条吩咐按顺序执行",
      code: "console.log(\"第一条\")\nconsole.log(\"第二条\")",
      explain:
        "代码是一条一条按顺序执行的。\n先执行第一行，显示“第一条”；再执行第二行，显示“第二条”。\n顺序不会乱，这是 JS 最基本的规矩。",
      output: "第一条\n第二条",
    },
  ],
  exercises: [
    {
      task: "把例子 1 里的“你好，我是 cc”换成你自己的名字，运行看结果。",
      hint: "只改双引号里面的字，别的不动。双引号和括号都要留着。",
      starter: "console.log(\"你好，我是 cc\")",
      answer: "console.log(\"你好，我是 cc\")",
      answerExplain:
        "双引号里面的字换成什么，显示出来的就是什么。\n运行后应该显示：你好，我是 cc。",
    },
    {
      task: "让机器算 10 + 20，再显示出来。",
      hint: "照例子 2 的样子，把 1 和 2 换成 10 和 20。",
      starter: "console.log(1 + 2)",
      answer: "console.log(10 + 20)",
      answerExplain: "括号里的 10 + 20 会先算出 30，再显示出来。\n运行后应该显示：30。",
    },
    {
      task: "写三行代码，分别显示你的名字、你的城市、你今天的心情。",
      hint: "一行显示一句话，写三行 console.log，每行双引号里写不同的内容。",
      starter:
        "console.log(\"你的名字\")\nconsole.log(\"你的城市\")\nconsole.log(\"今天的心情\")",
      answer:
        "console.log(\"cc\")\nconsole.log(\"我的城市\")\nconsole.log(\"今天心情不错\")",
      answerExplain:
        "三行代码按顺序执行，一行显示一句。\n运行后应该显示三行：cc、我的城市、今天心情不错。\n你自己的答案只要格式一样，内容写什么都行。",
    },
  ],
  mistakes: [
    {
      wrong: "// tg-bot 跑在 Workers 里\nconsole.log(document.title)",
      right: "// Workers 里没有页面，也没有 document\nconsole.log(\"tg-bot 跑在 Workers 里\")",
      why: "document 是浏览器的工具，Workers 的工具箱里没有它，写了就报“未定义”。",
    },
    {
      wrong: "// 在 Surge 脚本里\nfetch(\"https://api.github.com/zen\")",
      right: "// Surge 里发请求用 $httpClient，不用 fetch\n$httpClient.get(\"https://api.github.com/zen\", function (e, r, d) { console.log(d) })",
      why: "fetch 是浏览器和 Workers 的工具，Surge 的工具箱里没有它。",
    },
    {
      wrong: "// 在 Workers 里写的代码\nlocalStorage.setItem(\"订阅\", \"Kitty\")",
      right: "// Workers 里没有 localStorage，存数据用 KV\n// env.SUBS_KV.put(\"订阅\", \"Kitty\")",
      why: "存数据每个环境用的工具不一样：浏览器是 localStorage，Workers 是 KV，Surge 是 $persistentStore。",
    },
  ],
  recall: [
    {
      q: "JS 代码本身只是一堆文字，让它跑起来的地方叫什么？",
      a: "运行环境。",
    },
    {
      q: "在 Workers 里写 document 会怎样？为什么？",
      a: "报错“未定义”，因为 Workers 里没有页面，工具箱里没有 document。",
    },
    {
      q: "浏览器、Node.js、Workers、Surge 这四个地方，语言一样吗？区别在哪？",
      a: "语言一样，都是 JS；区别是每个环境自带的工具不一样。",
    },
  ],
  mentalModel: "JS 是同一个人，四个运行环境是四只不同的工具箱——写代码前先认环境，再找工具。",
}
