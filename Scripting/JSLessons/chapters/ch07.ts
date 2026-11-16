import type { Chapter } from "../types/lesson"

/** 第 7 章：JSON 必修课
 * 写作标准：从零开始，每个新词第一次出现必须解释。
 * 这一章讲：JSON 是什么，JSON 和 JS 对象的区别，JSON.stringify（对象变文字），
 * JSON.parse（文字变对象），KV 里存的就是 JSON 文字。
 * 举例用 MiSub 订阅配置，讲清 KV 里存的就是 JSON 文字。
 */
export const ch07: Chapter = {
  id: 7,
  title: "JSON 必修课",
  goal: "今天学 5 件事：\n1. JSON 是什么：一种写数据的格式\n2. JSON 和 JS 对象有什么区别（键必须双引号）\n3. JSON.stringify：对象变文字\n4. JSON.parse：文字变对象\n5. KV 里存的就是 JSON 文字：MiSub 的订阅配置就是这样存的",
  meaning:
    "你的 MiSub 订阅、tg-bot 的提醒，都要把数据存起来。KV（Cloudflare 的存储）只能存文字，不能直接存对象。所以要先把对象变成 JSON 文字存进去，读出来的时候再变回对象。\n\n不会 JSON，你就没法存数据、没法读配置。JSON 是所有后端存储、所有接口传数据的通用格式，学会它，第 10 章 Workers 才写得下去。",
  sections: [
    {
      heading: "1. JSON 是什么",
      body: "JSON 读作“杰森”，是一种写数据的格式。\n\n“格式”就是约定的写法。JSON 约定了一套写法，专门用来写数据：订阅配置、节点列表、提醒记录，都能用 JSON 写下来。\n\nJSON 最大的用处是存数据和传数据。你的 MiSub 订阅配置要存起来，tg-bot 的提醒要记下来，用的都是 JSON。\n\nJSON 不是 JS 特有的，全世界的程序都认它。学会了 JSON，以后看接口、看配置，都能看懂。",
      think: "订阅配置要存起来、发给别人，对象能直接发出去吗？存数据、传数据靠的是什么格式？",
    },
    {
      heading: "2. JSON 长什么样：一条 MiSub 订阅配置",
      body: "JSON 长得像 JS 对象。一条 MiSub 订阅配置写成 JSON 是这样：\n\n{\n  \"name\": \"Kitty\",\n  \"url\": \"https://misub-b32.pages.dev/sub/profiles/abc123\",\n  \"target\": \"surge\"\n}\n\n花括号 {} 里是一组“名字：值”，叫“键值对”。第 4 章讲过对象，JSON 跟对象长得一样。\n\nname 是“名字”，值是 \"Kitty\"。url 是“地址”，值是订阅链接。target 是“目标”，值是 \"surge\"，意思是这个订阅是给 Surge 用的。\n\n值可以是字符串（双引号包着的文字）、数字、布尔值（true 是“是”，false 是“不是”）、数组，也可以是另一个对象。",
      think: "一条 MiSub 订阅配置写成文字长什么样？键和值之间是什么关系？",
    },
    {
      heading: "3. JSON 和 JS 对象有什么区别",
      body: "JSON 和 JS 对象长得像，但规矩更严，有 4 条区别，一定要记住：\n\n第一，JSON 的键必须用双引号包着。JS 对象写 { name: \"Kitty\" } 也行，JSON 必须写 { \"name\": \"Kitty\" }。\n\n第二，JSON 的字符串只能用双引号，不能用单引号。写 'Kitty' 在 JSON 里是错的。\n\n第三，JSON 里不能写函数。函数是活的吩咐，JSON 只写死的数据。\n\n第四，JSON 里最后一个键值对后面不能加逗号。写了逗号就报错。\n\n一句话：JSON 是“死规矩”的文字格式，JS 对象是活的代码。JSON 只负责写数据，不负责干活。",
      think: "JSON 和 JS 对象长得一模一样，规矩上到底差在哪？",
    },
    {
      heading: "4. JSON.stringify：对象变文字",
      body: "JSON.stringify 是把对象变成 JSON 文字。stringify 是“变成文字”的意思。\n\n写法是这样：\nJSON.stringify(对象)\n\nJSON 是固定写法，点号后面跟 stringify。括号里放你要变的对象，它会还回来一串文字。\n\n举个例子：\nconst profile = { name: \"Kitty\", target: \"surge\" }\nconst text = JSON.stringify(profile)\n\ntext 的值就是 '{\"name\":\"Kitty\",\"target\":\"surge\"}'，一串文字。\n\n什么时候要变文字？要把数据存起来的时候。KV 只能存文字，不能直接存对象，所以存之前要先 stringify。下一节细讲。",
      think: "对象要存进只能存文字的 KV，得先变成什么？哪个方法能变？",
    },
    {
      heading: "5. JSON.parse：文字变对象",
      body: "JSON.parse 是把 JSON 文字变回对象。parse 是“解析、读懂”的意思。\n\n写法是这样：\nJSON.parse(文字)\n\n括号里放 JSON 文字，它会还回来一个对象。变回对象之后，就能用点号取值了。\n\n举个例子：\nconst text = '{\"name\":\"Kitty\",\"target\":\"surge\"}'\nconst profile = JSON.parse(text)\nconsole.log(profile.name)\n\n显示 Kitty。\n\n注意：text 外面用的是单引号，里面 JSON 用的是双引号。单引号和双引号都是字符串的写法，第 3 章讲过。这样写，里面的双引号不用转义，看着更清楚。\n\nstringify 和 parse 是一对：一个变文字，一个变回来。存的时候用 stringify，读的时候用 parse。",
      think: "从 KV 读出来的是一串文字，怎么变回能用点号取值的对象？",
    },
    {
      heading: "6. KV 里存的就是 JSON 文字",
      body: "KV 是 Cloudflare 提供的一种存储，专门用来存数据。你的 MiSub、tg-bot 都用 KV 存数据。\n\nKV 有一条规矩：只能存文字，不能直接存对象。\n\n所以 MiSub 存订阅配置的流程是这样：\n\n第一步，对象变成文字：JSON.stringify(profile)，得到一串 JSON 文字。\n\n第二步，把文字存进 KV。\n\n第三步，读的时候，从 KV 里读出文字。\n\n第四步，文字变回对象：JSON.parse(text)，又能用点号取值了。\n\n整个流程就是：对象 → 文字 → 存进 KV → 读出文字 → 对象。\n\n所以你以后看到 KV 里的数据，全是 JSON 文字，不是对象。想用的时候，先 parse 一下。\n\n数字经过这一圈还是数字：存进去之前 nodes 是 30，读出来还是 30，不会变成字符串 \"30\"。JSON 会记住每个值是什么类型。",
      think: "对象 → 文字 → 存进 KV → 读出文字 → 对象，走完这一圈，数字 30 还会是数字吗？",
    },
    {
      heading: "7. 写错 JSON 会怎样",
      body: "写错 JSON，parse 的时候会报错，程序就停下来了。最常见的两种错：\n\n第一种，单引号：{'name': 'Kitty'} 是错的，键和字符串值必须用双引号。\n\n第二种，尾巴多一个逗号：{\"name\": \"Kitty\",} 是错的，最后一个后面不能加逗号。\n\n报错的时候，报错信息会告诉你错在哪里，第 9 章会专门讲怎么读报错信息。\n\n写 JSON 的时候照规矩来：键和字符串值都用双引号，最后一个后面不加逗号，就不会错。实在不放心，写完先在心里读一遍：引号都成双成对吗？逗号都跟在值后面、不是跟在最后一个后面吗？",
      think: "JSON 写错了，程序会悄悄跳过、还是直接停下来？",
    },
  ],
  examples: [
    {
      title: "例子 1：把 MiSub 订阅配置变成 JSON 文字",
      code: "const profile = {\n  name: \"Kitty\",\n  url: \"https://misub-b32.pages.dev/sub/profiles/abc123\",\n  target: \"surge\"\n}\nconst text = JSON.stringify(profile)\nconsole.log(text)",
      explain:
        "profile 是一条 MiSub 订阅配置，是一个对象：名字是 Kitty，url 是订阅链接，target 是 surge。\nJSON.stringify(profile) 把这个对象变成一串 JSON 文字，存在 text 里。\n最后一行把 text 显示出来。注意：显示出来的文字里，键和字符串值都带双引号，中间没有空格，这是 JSON.stringify 变出来的标准样子。",
      output: "{\"name\":\"Kitty\",\"url\":\"https://misub-b32.pages.dev/sub/profiles/abc123\",\"target\":\"surge\"}",
    },
    {
      title: "例子 2：把 JSON 文字变回对象",
      code: "const text = '{\"name\":\"Kitty\",\"url\":\"https://misub-b32.pages.dev/sub/profiles/abc123\",\"target\":\"surge\"}'\nconst profile = JSON.parse(text)\nconsole.log(profile.name)\nconsole.log(profile.url)",
      explain:
        "text 是一段 JSON 文字，外面用单引号包着，里面 JSON 用双引号。\nJSON.parse(text) 把这段文字变回对象，存在 profile 里。\n变回对象之后，就能用点号取值了：profile.name 是 Kitty，profile.url 是订阅链接。\n最后一行显示订阅链接。",
      output: "Kitty\nhttps://misub-b32.pages.dev/sub/profiles/abc123",
    },
    {
      title: "例子 3：模拟 KV：存进去再读出来",
      code: "const kv = {}\nconst profile = { name: \"Kitty\", target: \"surge\", nodes: 30 }\nkv.profile = JSON.stringify(profile)\nconsole.log(kv.profile)\nconst back = JSON.parse(kv.profile)\nconsole.log(back.name)\nconsole.log(back.nodes)",
      explain:
        "kv 在这里假装是 Cloudflare 的 KV，只能存文字。\nprofile 是订阅配置对象：名字 Kitty，目标 surge，节点数 30。\nkv.profile = JSON.stringify(profile)：先把对象变成 JSON 文字，再存进 kv。\nconsole.log(kv.profile) 显示存进去的文字。\nconst back = JSON.parse(kv.profile)：读出来的时候，再把文字变回对象。\nback.name 是 Kitty，back.nodes 是 30。数字经过这一圈还是数字，不会变成字符串。",
      output: "{\"name\":\"Kitty\",\"target\":\"surge\",\"nodes\":30}\nKitty\n30",
    },
    {
      title: "例子 4：节点列表也能变 JSON",
      code: "const nodes = [\"香港 01\", \"日本 01\", \"美国 01\"]\nconst text = JSON.stringify(nodes)\nconsole.log(text)\nconst back = JSON.parse(text)\nconsole.log(back.length)\nconsole.log(back[0])",
      explain:
        "nodes 是 3 个节点的数组。\nJSON.stringify 不只能变对象，也能变数组：变出来的文字是 [\"香港 01\",\"日本 01\",\"美国 01\"]。\nJSON.parse 变回来之后，back 还是数组：back.length 是 3，back[0] 是第一个“香港 01”。\n所以不管是对象还是数组，都能用同一对方法存取。",
      output: "[\"香港 01\",\"日本 01\",\"美国 01\"]\n3\n香港 01",
    },
  ],
  exercises: [
    {
      task: "有一个节点对象：名字是“香港 01”，地区是“香港”，延迟是 120。把它变成 JSON 文字并显示出来。",
      hint: "先写对象，再 JSON.stringify，最后 console.log 显示。",
      starter: "const node = { name: \"香港 01\", area: \"香港\", delay: 120 }",
      answer: "const node = { name: \"香港 01\", area: \"香港\", delay: 120 }\nconst text = JSON.stringify(node)\nconsole.log(text)",
      answerExplain:
        "JSON.stringify 把对象变成文字：{\"name\":\"香港 01\",\"area\":\"香港\",\"delay\":120}。\n运行后应该显示这串文字。注意数字 120 在 JSON 里没有引号。",
    },
    {
      task: "下面是一段 JSON 文字：'{\"name\":\"日本 01\",\"delay\":98}'。把它变回对象，取出 delay 显示出来。",
      hint: "用 JSON.parse 变回对象，再用点号取 delay。",
      starter: "const text = '{\"name\":\"日本 01\",\"delay\":98}'",
      answer: "const text = '{\"name\":\"日本 01\",\"delay\":98}'\nconst node = JSON.parse(text)\nconsole.log(node.delay)",
      answerExplain: "JSON.parse 把文字变回对象，node.delay 是 98。\n运行后应该显示：98。",
    },
    {
      task: "模拟 KV 存取：把 { name: \"组合机场\", nodes: 102 } 变成文字存进 kv，再读出来变回对象，显示名字和节点数。",
      hint: "照例子 3 的样子，分四步写：stringify、存、parse、显示。",
      starter: "const kv = {}\nconst sub = { name: \"组合机场\", nodes: 102 }",
      answer: "const kv = {}\nconst sub = { name: \"组合机场\", nodes: 102 }\nkv.sub = JSON.stringify(sub)\nconst back = JSON.parse(kv.sub)\nconsole.log(back.name)\nconsole.log(back.nodes)",
      answerExplain:
        "存进去的是 JSON 文字，读出来 parse 之后又变回对象。\n运行后应该显示两行：组合机场、102。",
    },
    {
      task: "下面这段 JSON 写错了：{'name': 'Kitty'}。把它改对，再用 JSON.parse 变回对象，显示名字。",
      hint: "错在单引号，JSON 的键和字符串值必须用双引号。把单引号都换成双引号。",
      starter: "const text = \"{'name': 'Kitty'}\"\nconst obj = JSON.parse(text)\nconsole.log(obj.name)",
      answer: "const text = '{\"name\":\"Kitty\"}'\nconst obj = JSON.parse(text)\nconsole.log(obj.name)",
      answerExplain:
        "改对之后是 '{\"name\":\"Kitty\"}'：外面单引号是 JS 字符串的写法，里面 JSON 用双引号。\n运行后应该显示：Kitty。",
    },
  ],
  mistakes: [
    {
      wrong: "JSON.parse(\"{'name': 'Kitty'}\")",
      right: "JSON.parse('{\"name\":\"Kitty\"}')",
      why: "JSON 的键和字符串只能用双引号，单引号在 JSON 里是错的，parse 会直接报错。",
    },
    {
      wrong: "JSON.parse('{\"name\":\"Kitty\",}')",
      right: "JSON.parse('{\"name\":\"Kitty\"}')",
      why: "JSON 里最后一个后面不能加逗号，多一个逗号 parse 就报错。",
    },
    {
      wrong: "const text = '{\"name\":\"Kitty\"}'\nconsole.log(text.name)",
      right: "const text = '{\"name\":\"Kitty\"}'\nconst profile = JSON.parse(text)\nconsole.log(profile.name)",
      why: "text 只是一段文字，不是对象；在文字上取 .name 什么都取不到，先 parse 变回对象才能用点号取值。",
    },
  ],
  recall: [
    {
      q: "JSON.stringify 和 JSON.parse 各是干什么的？什么时候用哪个？",
      a: "stringify 把对象变文字，存数据、发数据之前用；parse 把文字变回对象，收到数据、读出数据之后用。",
    },
    {
      q: "JSON 的键和字符串，引号有什么规矩？",
      a: "必须用双引号，单引号不行；最后一个后面不能加逗号。",
    },
    {
      q: "KV 里存的是对象还是文字？读出来能直接用吗？",
      a: "KV 里只能存文字，存的是 JSON 文字；读出来要先 JSON.parse 变回对象才能用。",
    },
  ],
  mentalModel: "JSON 是写数据的死规矩文字格式：stringify 把对象打包成文字存起来、发出去，parse 把文字拆回对象再用；KV 里存的全是 JSON 文字。",
}
