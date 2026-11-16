import type { Chapter } from "../types/lesson"

/** 第 8 章：异步：Promise、async/await、fetch
 * 写作标准：从零开始，每个新词第一次出现必须解释。
 * 这一章讲异步：不用等，好了再通知你。重点是 async/await 和 fetch，还有忘了 await 这个最常见的 bug。
 */
export const ch08: Chapter = {
  id: 8,
  title: "异步：Promise、async/await、fetch",
  goal: `今天学 5 件事：
1. 同步和异步是什么意思
2. setTimeout：等一等再做
3. Promise：一张“以后会给结果”的欠条
4. async 和 await：最顺手的等结果写法
5. fetch：去网上拿东西`,
  meaning: `JS 里很多事都要等：等网上回数据、等定时器到时间、等订阅刷新完。如果不会异步，要么程序卡在那里不动，要么拿到的是还没回来的东西。
你的 tg-bot 每天定时刷新订阅、查流量、发提醒，全靠异步。不学这一章，后面第 10 章 Workers、第 12 章 Surge 脚本都写不了，因为那些地方天天要等网上回数据。
这一章还会讲一个新手最容易踩的 bug：忘了写 await。认出它、改掉它，是这一章最重要的收获。`,
  sections: [
    {
      heading: "1. 同步和异步是什么",
      body: `“同步”这个词，意思是“一件事做完，再做下一件”，像排队，一个一个来。
“异步”这个词，意思是“不用等，事情好了再通知你”。
打个比方：同步像在窗口排队买东西，前面的人没买完，你只能站着等。异步像你点了外卖，不用在店里等着，做好了会送到你手里，这段时间你该干嘛干嘛。
JS 里，console.log 是同步的，写完马上显示。去网上拿数据是异步的，因为网上回数据要花时间，不能站在原地干等。
记住：异步不是“不做”，是“不等”。事情还在做，只是你不用等结果，好了它会通知你。`,
      think: "去网上拿数据要花时间，程序是站在原地干等，还是先去忙别的？",
    },
    {
      heading: "2. setTimeout：等一等再做",
      body: `setTimeout 是固定写法，意思是“等一等再做”。写法是这样的：
setTimeout(要做的事, 等多少毫秒)
“毫秒”这个词，是时间单位，1000 毫秒就是 1 秒。所以 100 毫秒就是 0.1 秒，很短。
“要做的事”写成一个函数（第 6 章学过函数），比如 () => { console.log("你好") }。这个箭头函数的意思是“显示‘你好’”。箭头函数是第 6 章学过的一种简写的函数。
注意：setTimeout 不会卡住后面的代码。后面的代码先跑，时间到了，要做的事才跑。例子 1 会演示这一点。
这章的例子最后都有一行“等一等”，是让程序等前面的事做完再结束。没有这一行，例子提前结束了，后面的话显示不出来。这一行里有个第 4 节才讲的东西，你现在不用懂它，照抄就行，看到第 4 节就明白了。`,
      think: "想让一句话 100 毫秒后再显示，后面的代码会等它吗？",
    },
    {
      heading: "3. Promise：一张“以后会给结果”的欠条",
      body: `“Promise”这个词，读作“普罗米斯”，是固定写法，意思是“一件还没做完的事，完了会把结果给你”。你可以把它想成一张“欠条”：你去店里定了一个东西，店员给你一张欠条，说“货到了我通知你”。Promise 就是这张欠条。
Promise 有三种状态。“状态”这个词就是“现在怎么样了”。三种状态是：pending（读作“喷丁”，意思是“还在等”）、成功了（拿到了结果）、失败了（出错了）。
写法是这样的：new Promise(一个函数)。new 是固定写法，意思是“造一个新的”。这个函数会收到一个叫 resolve 的东西，resolve 是固定写法，意思是“事情做完了，结果给你”。做完了就调用它。
拿到结果后要做什么，用 .then。then 是“然后”的意思，意思是“拿到结果后，然后做这件事”。写法是：欠条.then(结果 => { ... })。
告诉你一个好消息：现在写代码基本都用下一节的 async/await，不用 .then 也能写。但 Promise 这个词你一定要认得，因为到处都是它，报错信息里也会出现它。`,
      think: "网上还没回数据，你手里拿到的那张‘欠条’到底是什么？",
    },
    {
      heading: "4. async 和 await：最顺手的写法",
      body: `“async”这个词，读作“诶辛克”，是固定写法，意思是“这个函数里有要等的事”。写在函数前面，像这样：async function 刷新订阅() { ... }。
“await”这个词，读作“饿喂特”，是固定写法，意思是“在这里等一等，等结果来了再往下走”。写法是：const 结果 = await 一张欠条。
记住一条规矩：函数里用 await，函数前面就要加 async。async 和 await 是一对，总是成双出现。另外，在 Scripting 里，await 也可以直接写在脚本最外层，不用包在函数里，这章的例子就是这么写的。
对比上一节的 .then：async/await 写出来的代码看起来像同步的，一行一行往下走，好读得多。
再看一个固定写法：await new Promise(r => setTimeout(r, 100))。意思是“造一张欠条，100 毫秒后算完成，然后在这里等它完成”。这里的 r 就是上一节说的 resolve，图省事简写成 r。等 100 毫秒到了，欠条完成，await 后面的代码才继续跑。
注意：await 只会让这个函数里的代码等一等，函数外面的代码不等，该跑还是跑。例子 2 会演示这一点。`,
      think: "想等结果来了再往下走，哪两个词要成双出现？",
    },
    {
      heading: "5. fetch：去网上拿东西",
      body: `“fetch”这个词，读作“费奇”，是固定写法，意思是“去网上拿东西”。写法是：fetch("网址")。
fetch 会返回一张 Promise 欠条，所以前面要加 await：const 回应 = await fetch("网址")。
“回应”这个词，就是网上给你的回信。在代码里一般写成 response，读作“瑞斯庞斯”，意思是“回应、回信”。你也可以起中文名字叫“回应”，意思一样。
拿到回应后，先查两样东西：
回应.ok：ok 是“好不好”的意思。回应.ok 是 true（第 2 章学过，true 是“是”）就是拿到了，是 false（“不是”）就是没拿到。
回应.status：status 是“状态码”的意思，是一个数字。200 的意思是“成功了”。404 的意思是“没找到”。
确认拿到了，再拿内容：
回应.text()：text 是“文字”的意思，意思是“把内容当成文字拿回来”。也要 await，因为拿内容也要等一会儿。
回应.json()：json 是第 7 章学的 JSON 的意思，意思是“把内容当成 JSON 拿回来，变成对象”。也要 await。
记住这个顺序：先查 ok，ok 是 true 再拿内容。直接拿内容，万一没拿到就容易出错。
例子 4 用的网址是 https://api.github.com/zen，这是一个真实能访问的网址，每次会回一句短的话，内容每次都不一样。`,
      think: "去网上拿东西，先查什么、再拿内容？顺序反了会怎样？",
    },
    {
      heading: "6. 忘了 await：最常见的 bug",
      body: `这是新手最容易踩的 bug，几乎人人都会踩一次。
“bug”这个词，意思是“程序里的小毛病”，代码写错了，跑出来的结果不对。
忘了写 await 会怎么样：你拿到的不是真正的数据，而是一张 Promise 欠条。打印出来是 [object Promise]，意思是“这是一个 Promise”，也就是一张还没完成的欠条，不是你要的数据。
怎么认出来：打印出来的东西是 [object Promise]，就是忘了 await。（在浏览器的控制台里，它会显示成 Promise { <pending> }，意思一样：还在等。）
怎么改：在那一行前面加上 await，等结果真的来了再用。例子 3 会演示：同一段代码，不加 await 和加 await，结果完全不一样。`,
      think: "打印出来是 [object Promise]，这说明什么？该加什么？",
    },
    {
      heading: "7. tg-bot 是怎么用异步的",
      body: `你的 tg-bot 要做的事很多：回消息、查订阅到期、刷新订阅、查流量、发提醒。其中“刷新订阅”“查流量”要去网上拿数据，得等一会儿。
如果用同步的写法：bot 去刷新一个订阅，要等网上慢慢回数据，这段时间里别人发的消息它都回不了，整个 bot 卡住了。
所以 tg-bot 里这些要等的事，全都用 async/await 写：去网上拿数据时 await 等一等，等的过程里 bot 还能回别的消息，数据到了再继续算。
画个流程给你看：你发 /subs → bot 用 await 去网上拉订阅数据 → 数据到了，算好每个订阅还剩几天 → 回消息给你。
记住：以后你写自己的脚本，凡是要等网上回数据的，都用 async/await。这是 JS 里最常用的写法。`,
      think: "tg-bot 一边等订阅刷新、一边还要回消息，它是怎么做到的？",
    },
  ],
  examples: [
    {
      title: "例子 1：setTimeout 不会卡住后面的代码",
      code: `console.log("第一条：开始")
setTimeout(() => {
  console.log("第二条：等了 100 毫秒才显示")
}, 100)
console.log("第三条：不用等，先显示")
await new Promise(r => setTimeout(r, 200))`,
      explain: `第 1 行：显示“第一条：开始”。
第 2 到 4 行：setTimeout 是“等一等再做”。括号里第一样是“要做的事”（一个箭头函数，意思是“显示第二条”），第二样是 100，意思是等 100 毫秒（0.1 秒）。
第 5 行：显示“第三条：不用等，先显示”。这一行不等 setTimeout，马上就跑。
第 6 行：等 200 毫秒，让程序等第二条显示出来再结束（第 2 节讲过，照抄就行）。
所以先显示第一条和第三条，100 毫秒后才显示第二条。`,
      output: "第一条：开始\n第三条：不用等，先显示\n第二条：等了 100 毫秒才显示",
    },
    {
      title: "例子 2：用 async/await 刷新订阅",
      code: `async function 刷新订阅() {
  console.log("开始刷新订阅")
  await new Promise(r => setTimeout(r, 100))
  console.log("订阅刷新完了，一共 86 个节点")
}

const 刷新好了 = 刷新订阅()
console.log("不等刷新完，这行先显示")
await 刷新好了`,
      explain: `第 1 行：async function 是“这个函数里有要等的事”。函数名叫“刷新订阅”。
第 2 行：显示“开始刷新订阅”。
第 3 行：await 是“在这里等一等”。new Promise(r => setTimeout(r, 100)) 的意思是“造一张欠条，100 毫秒后算完成”。这一行会等 100 毫秒。
第 4 行：100 毫秒到了，显示“订阅刷新完了，一共 86 个节点”。
第 7 行：调用“刷新订阅”，但没写 await，所以不等它做完就往下走。调用的结果（一张欠条）存在“刷新好了”这个变量里。
第 8 行：显示“不等刷新完，这行先显示”。
第 9 行：await 刷新好了，是“等刷新真的做完”。没有这一行，例子提前结束了，最后一句显示不出来。
所以顺序是：先显示“开始刷新订阅”，再显示“不等刷新完”，最后才显示“订阅刷新完了”。`,
      output: "开始刷新订阅\n不等刷新完，这行先显示\n订阅刷新完了，一共 86 个节点",
    },
    {
      title: "例子 3：忘了 await 是最常见的 bug",
      code: `async function 拿节点数() {
  await new Promise(r => setTimeout(r, 100))
  return 86
}

async function 主流程() {
  const 没等到的 = 拿节点数()
  console.log("没写 await，拿到的是：" + 没等到的)
  const 等到的 = await 拿节点数()
  console.log("写了 await，拿到的是：" + 等到的)
}

await 主流程()`,
      explain: `第 1 到 4 行：“拿节点数”这个函数等 100 毫秒后返回 86。return 是“返回、交出来”的意思（第 6 章学过）。
第 7 行：调用“拿节点数”，但没写 await。所以“没等到的”不是 86，而是一张还没完成的欠条（Promise）。
第 8 行：打印出来是“没写 await，拿到的是：[object Promise]”。[object Promise] 的意思是“这是一个 Promise”，也就是一张欠条，不是真正的数据。
第 9 行：这次写了 await，等结果真的来了再往下走。
第 10 行：打印“写了 await，拿到的是：86”，这才是真正的数据。
记住：打印出来是 [object Promise]，就是忘了写 await，加上去就好了。
最后一行：await 主流程() 是“等主流程做完”，让例子等前面的事做完再结束。`,
      output: "没写 await，拿到的是：[object Promise]\n写了 await，拿到的是：86",
    },
    {
      title: "例子 4：用 fetch 去网上拿一句话",
      code: `async function 拿一句话() {
  const 回应 = await fetch("https://api.github.com/zen")
  console.log("状态码：" + 回应.status)
  console.log("成功了吗：" + 回应.ok)
  const 内容 = await 回应.text()
  console.log("拿到内容了")
}

await 拿一句话()`,
      explain: `第 1 行：async function，因为里面要等网上回数据。
第 2 行：fetch 是“去网上拿东西”。网址 https://api.github.com/zen 是真实能访问的，每次会回一句短的话。await 是“等网上回信”。
第 3 行：回应.status 是状态码，200 的意思是“成功了”。
第 4 行：回应.ok 是“拿到了吗”，true 是“是，拿到了”。
第 5 行：回应.text() 是“把内容当成文字拿回来”，也要 await。
第 6 行：显示“拿到内容了”。内容每次随机不一样，这里不打印它，只确认拿到了。
想看内容的话，把第 6 行换成 console.log(内容)，每次跑出来的句子都不一样。
最后一行：await 拿一句话() 是“等拿一句话做完”，让例子等前面的事做完再结束。`,
      output: "状态码：200\n成功了吗：true\n拿到内容了",
    },
  ],
  exercises: [
    {
      task: "写一个 async 函数，名字叫“查流量”，等 100 毫秒后显示“流量还剩 50G”，然后调用它。",
      hint: "照例子 2 的样子写：async function 查流量() { ... }，里面用 await new Promise(r => setTimeout(r, 100)) 等 100 毫秒，再 console.log 显示。最后别忘了调用查流量()，前面加 await 等它做完。",
      answer: `async function 查流量() {
  await new Promise(r => setTimeout(r, 100))
  console.log("流量还剩 50G")
}

await 查流量()`,
      answerExplain: `async function 是“这个函数里有要等的事”。
await new Promise(r => setTimeout(r, 100)) 是“等 100 毫秒”。
等到了，再显示“流量还剩 50G”。
最后一行 await 查流量() 是“等查流量做完”，让程序等它做完再结束。
运行后应该显示：流量还剩 50G。`,
    },
    {
      task: `下面这段代码想拿到节点数 86，但打印出来是 [object Promise]。请找出问题并改对。
async function 拿节点数() {
  await new Promise(r => setTimeout(r, 100))
  return 86
}

async function 主流程() {
  const 数量 = 拿节点数()
  console.log("节点数是：" + 数量)
}

主流程()`,
      hint: "打印出来是 [object Promise]，就是忘了写 await。在“拿节点数()”前面加上 await，等结果来了再用。最后一行也改成 await 主流程()，让程序等它做完。",
      starter: `async function 拿节点数() {
  await new Promise(r => setTimeout(r, 100))
  return 86
}

async function 主流程() {
  const 数量 = 拿节点数()
  console.log("节点数是：" + 数量)
}

主流程()`,
      answer: `async function 拿节点数() {
  await new Promise(r => setTimeout(r, 100))
  return 86
}

async function 主流程() {
  const 数量 = await 拿节点数()
  console.log("节点数是：" + 数量)
}

await 主流程()`,
      answerExplain: `问题出在“const 数量 = 拿节点数()”这一行：没写 await，拿到的是一张还没完成的欠条，不是 86。
改成“const 数量 = await 拿节点数()”，等结果真的来了再往下走，数量就是 86。
最后一行 await 主流程() 是“等主流程做完”，让程序等它做完再结束。
运行后应该显示：节点数是：86。`,
    },
    {
      task: "用 fetch 去 https://api.github.com/zen 拿一句话。先查回应.ok：如果是 true（拿到了），就把内容拿回来并显示“拿到内容了”；如果是 false（没拿到），就显示“没拿到，状态码是：”加上状态码。",
      hint: "照例子 4 写：const 回应 = await fetch(\"https://api.github.com/zen\")。然后用 if（第 5 章学过）判断回应.ok 是不是 true。拿内容用 await 回应.text()。别忘了整个函数前面加 async，最后调用时前面加 await。",
      answer: `async function 拿一句话() {
  const 回应 = await fetch("https://api.github.com/zen")
  if (回应.ok) {
    const 内容 = await 回应.text()
    console.log("拿到内容了")
  } else {
    console.log("没拿到，状态码是：" + 回应.status)
  }
}

await 拿一句话()`,
      answerExplain: `fetch 是“去网上拿东西”，要 await 等它回信。
先查回应.ok：true 是拿到了，false 是没拿到。
拿到了，再用 await 回应.text() 把内容拿回来，显示“拿到内容了”。
没拿到，就显示状态码，方便找原因。
运行后应该显示：拿到内容了。`,
    },
  ],
  mistakes: [
    {
      wrong: "const 数量 = 拿节点数()\nconsole.log(\"节点数是：\" + 数量)",
      right: "const 数量 = await 拿节点数()\nconsole.log(\"节点数是：\" + 数量)",
      why: "没写 await，拿到的是还没完成的欠条（Promise），不是真正的数据；想等结果来了再用，就在前面加 await。",
    },
    {
      wrong: "const 回应 = await fetch(\"https://api.github.com/zen\")\nconst 内容 = await 回应.text()",
      right: "const 回应 = await fetch(\"https://api.github.com/zen\")\nif (回应.ok) {\n  const 内容 = await 回应.text()\n}",
      why: "fetch 遇到 404、500 也正常返回、不会报错；不先查回应.ok，拿到错误页面也会当成数据用。",
    },
    {
      wrong: "const 内容 = await 回应.text()\nconst 数据 = await 回应.json()",
      right: "const 数据 = await 回应.json()\nconsole.log(数据)",
      why: "回应正文只能读一次，读完就没了；text() 和 json() 只能选一个，动手前先想好按文字读还是按 JSON 读。",
    },
  ],
  recall: [
    {
      q: "同步和异步有什么区别？",
      a: "同步是一件做完再做下一件；异步是不用等，好了再通知你。",
    },
    {
      q: "async 和 await 是什么关系？忘了写 await 会怎样？",
      a: "async 标在函数前面，里面才能用 await；忘了 await 拿到的是 Promise 欠条，不是真正的数据，打印出来是 [object Promise]。",
    },
    {
      q: "fetch 拿到回应后，第一件事该做什么？",
      a: "先查回应.ok（或状态码）：是 true 再拿内容；404、500 时 fetch 不报错，不查就直接读会把错误页面当数据。",
    },
  ],
  mentalModel: "异步就是先拿一张‘以后给结果’的欠条：async 标明函数里有要等的事，await 在原地等结果来了再往下走，fetch 去网上拿东西、拿回来先查 ok 再读内容。",
}
