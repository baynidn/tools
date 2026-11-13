import type { Chapter } from "../types/lesson"

/** 第 6 章：函数
 * 写作标准：从零开始，每个新词第一次出现必须解释。
 * 这一章讲：function 是什么，参数、返回值，箭头函数，作用域，回调函数预告。
 * 举例用算剩余天数、判断订阅过期、挑香港节点，都是用户天天见的东西。
 */
export const ch06: Chapter = {
  id: 6,
  title: "函数",
  goal: "今天学 5 件事：\n1. 函数是什么：一段能重复用的吩咐\n2. 参数：调用时传进去的东西\n3. 返回值：函数算完还回来的结果（return）\n4. 箭头函数：一种更短的写法\n5. 作用域：变量在哪里能用",
  meaning:
    "没有函数，同样的吩咐要抄很多遍，改一处要改十处。有了函数，写一次，到处用：算剩余天数的吩咐写成函数，tg-bot 的订阅提醒、MiSub 的节点检查都能调它。\n\n函数是把代码从“只能跑一遍”变成“能重复用的工具”的关键。后面第 8 章的异步、第 10 章的 Workers、第 12 章的 Surge 脚本，全是函数搭起来的。这一章必须学扎实。",
  sections: [
    {
      heading: "1. 函数是什么",
      body: "“函数”就是一段能重复用的吩咐。\n\n你每天都要算“订阅还剩几天”：30 天的套餐用了 12 天，还剩几天？90 天的套餐用了 45 天，还剩几天？算法都一样，只是数字不同。\n\n没有函数，你每次都要把算法重新写一遍。有了函数，你把算法写成一个函数，起个名字，以后每次只要叫它的名字、把数字传进去，它就算好还给你。\n\nfunction 是“函数”的意思。写函数的固定写法是：\nfunction 名字() {\n  吩咐\n}\n\n名字是你自己起的，比如算剩余天数，就叫 leftDays。left 是“剩下”的意思，Days 是“天数”的意思，合起来就是“剩下的天数”。",
      think: "每天都要算‘订阅还剩几天’，算法都一样、只是数字不同，猜猜怎么只写一次算法、换数字就能反复用？",
    },
    {
      heading: "2. 定义函数和调用函数",
      body: "定义函数就是写出这个函数，告诉机器“我有一个叫这个名字的吩咐”。光定义不叫它，它不会自己跑。\n\n调用函数就是叫它干活。写法是：写函数名，后面加一对括号。\n\n比如：\nfunction sayHi() {\n  console.log(\"你好\")\n}\nsayHi()\n\n前三行是定义：有一个叫 sayHi 的吩咐，内容是显示“你好”。最后一行 sayHi() 是调用：叫它干活。运行后显示“你好”。\n\n注意：定义了不调用，什么都不会发生。就像你写了菜谱不做菜，永远吃不上。",
      think: "写好了函数，光定义不叫它，它会自己跑吗？",
    },
    {
      heading: "3. 参数：传进去的东西",
      body: "“参数”就是调用函数时传进去的东西。参数是“传进去的数据”的意思。\n\n写函数的时候，在括号里写参数的名字：\nfunction leftDays(total, used) {\n  return total - used\n}\n\ntotal 是“总天数”，used 是“已用天数”。这两个就是参数。\n\n调用的时候，在括号里写真正的数据：\nleftDays(30, 12)\n\n30 传给 total，12 传给 used，函数就用这两个数算：30 - 12 = 18。\n\n多个参数用逗号隔开，传的时候按顺序对上：第一个给第一个，第二个给第二个。传错了顺序，结果就错了。",
      think: "同一个函数，30 天用了 12 天和 90 天用了 45 天，怎么让它算出两个不同的答案？",
    },
    {
      heading: "4. 返回值 return：还回来的结果",
      body: "return 是“还回来”的意思。函数算完的结果，用 return 还回来。\n\nfunction leftDays(total, used) {\n  return total - used\n}\n\nreturn total - used 的意思是：算出 total - used 的结果，把这个结果还给调用的人。\n\n调用的时候要把结果接住，或者直接用：\nconsole.log(leftDays(30, 12))\n\n这里 leftDays(30, 12) 的结果是 18，console.log 就显示 18。\n\n没有 return 的函数，调用的结果是 undefined。undefined 是“没有值”的意思，第 2 章讲过。这样的函数只能做事（比如显示点东西），不能把结果给你。",
      think: "函数算完的结果，怎么交还给叫它的人？不交会怎样？",
    },
    {
      heading: "5. 箭头函数：更短的写法",
      body: "箭头函数是函数的另一种写法，更短。=> 读作“箭头”。\n\n写法是这样：\nconst isSlow = (delay) => {\n  return delay > 200\n}\n\nconst isSlow 是用 const 给这个函数起个名字叫 isSlow。is 是“是不是”的意思，Slow 是“慢”的意思，合起来就是“是不是慢”。\n\n(delay) 是参数，=> 后面的花括号里是指令。干的活跟 function 写的一模一样，只是写法短一点。\n\n箭头函数最常用的地方是配合数组的 filter、map 这些方法（第 4 章讲过）：\nregions.filter((r) => r === \"香港\")\n\n意思是：把 regions 里每个元素叫 r，留下 r 是“香港”的那些。\n\n先会认、会写简单的箭头函数就行。两种写法都要认得，因为别人的代码两种都会用。",
      think: "函数有没有更短的写法？看到 (r) => 这样的东西，你认得它吗？",
    },
    {
      heading: "6. 作用域：变量在哪里能用",
      body: "“作用域”就是变量能用的范围。作用域是“起作用的范围”的意思。\n\n规矩是这样：\n\n函数里定义的变量，只能在函数里用，出了函数就用不了。\n\n函数外面定义的变量，里面和外面都能用。\n\n举个例子：\nconst shopName = \"洗浴中心\"\nfunction sayHi() {\n  const msg = \"你好\"\n  console.log(shopName + msg)\n}\n\nshopName 是在外面定义的，函数里面能用，外面也能用。msg 是在函数里定义的，只能在函数里用，出了函数就找不到它了。\n\n为什么要这样？因为函数里的变量是临时的，函数跑完就没了。这样不同的函数可以用相同的变量名，互不干扰。",
      think: "函数里起的名字，出了函数还能用吗？外面起的名字，函数里能用吗？",
    },
    {
      heading: "7. 回调函数预告：函数也能当参数传",
      body: "函数也能当参数传给别的函数。这种传进去的函数叫“回调函数”。\n\n“回调”这个词的意思是：你把一个函数交给别人，别人办完事再“回头叫它”。\n\n比如第 4 章的 filter：\nregions.filter((r) => r === \"香港\")\n\n括号里的箭头函数就是回调函数。你把它交给 filter，filter 每检查一个元素，就回头叫它一次，问“这个留不留”。\n\n这一章你只要知道有这回事就行。第 8 章讲异步的时候，回调函数会大量出现，到时候再细讲。",
      think: "函数能不能像数字一样传给别的函数？别人拿到它，会什么时候用？",
    },
  ],
  examples: [
    {
      title: "例子 1：算剩余天数的函数",
      code: "function leftDays(total, used) {\n  return total - used\n}\nconsole.log(leftDays(30, 12))\nconsole.log(leftDays(90, 45))",
      explain:
        "第一行到第三行是定义函数：名字叫 leftDays，参数是 total（总天数）和 used（已用天数），return 的是 total - used。\n第四行调用它：leftDays(30, 12)，30 传给 total，12 传给 used，算出 18，显示 18。\n第五行再调用一次：leftDays(90, 45)，算出 45，显示 45。\n同一个函数，换两组数字，各算各的。这就是函数的好处：写一次，到处用。",
      output: "18\n45",
    },
    {
      title: "例子 2：判断订阅是否过期",
      code: "function isExpired(left) {\n  return left <= 0\n}\nconsole.log(isExpired(5))\nconsole.log(isExpired(0))\nconsole.log(isExpired(-3))",
      explain:
        "isExpired 是“是不是过期了”的意思。参数 left 是“还剩几天”。\nreturn 的是 left <= 0：还剩天数小于等于 0，就是过期了。比较的结果是布尔值，也就是“是 / 不是”。\nisExpired(5)：5 <= 0 是 false（不是），显示 false。\nisExpired(0)：0 <= 0 是 true（是），显示 true。\nisExpired(-3)：-3 <= 0 是 true（是），显示 true。\n函数不只能返回数字，也能返回“是 / 不是”。",
      output: "false\ntrue\ntrue",
    },
    {
      title: "例子 3：用箭头函数挑出香港节点",
      code: "const regions = [\"香港\", \"日本\", \"香港\", \"美国\"]\nconst hk = regions.filter((r) => r === \"香港\")\nconsole.log(hk)\nconsole.log(hk.length)",
      explain:
        "regions 是 4 个地区。\nfilter 是第 4 章讲过的数组方法：留下一个个检查后符合条件的。\n括号里的 (r) => r === \"香港\" 是箭头函数：把每个元素叫 r，r 是“香港”就留下。\nfilter 跑完，hk 是 [\"香港\", \"香港\"]，一共 2 个。\nconsole.log(hk) 显示整个数组，App 里显示数组时，每个文字前后会带双引号，样子是 [“香港”,“香港”]，这是把数组写成一行文字的固定样子。\nconsole.log(hk.length) 显示个数 2。length 是“长度”的意思，第 4 章讲过。",
      output: "[\"香港\",\"香港\"]\n2",
    },
    {
      title: "例子 4：变量在哪里能用",
      code: "const shopName = \"洗浴中心\"\nfunction sayHi() {\n  const msg = \"你好\"\n  console.log(shopName + msg)\n}\nsayHi()\nconsole.log(shopName)",
      explain:
        "shopName 是在外面定义的，函数里面能用，外面也能用。\nmsg 是在函数里定义的，只能在函数里用。\nsayHi() 调用后，函数里用 shopName 和 msg 拼成“洗浴中心你好”，显示出来。\n最后一行在外面显示 shopName，显示“洗浴中心”，没问题。\n如果在外面写 console.log(msg)，就会报错：msg 在外面找不到。第 9 章会讲这种报错。",
      output: "洗浴中心你好\n洗浴中心",
    },
  ],
  exercises: [
    {
      task: "写一个叫 leftDays 的函数，输入总天数和已用天数，返回剩余天数。然后调用它算 30 天用了 12 天，显示结果。",
      hint: "照例子 1 的样子：function leftDays(total, used)，里面 return total - used。",
      answer: "function leftDays(total, used) {\n  return total - used\n}\nconsole.log(leftDays(30, 12))",
      answerExplain: "leftDays(30, 12) 算出 30 - 12 = 18。\n运行后应该显示：18。",
    },
    {
      task: "写一个叫 isSlow 的函数，输入一个延迟，延迟大于 200 就返回 true（是），否则返回 false（不是）。调用它两次：延迟 120 和延迟 350，显示结果。",
      hint: "返回值写 return delay > 200，比较的结果本身就是 true 或 false，不用再写 if。",
      answer: "function isSlow(delay) {\n  return delay > 200\n}\nconsole.log(isSlow(120))\nconsole.log(isSlow(350))",
      answerExplain:
        "isSlow(120)：120 > 200 是 false（不是），显示 false。\nisSlow(350)：350 > 200 是 true（是），显示 true。\n运行后应该显示两行：false、true。",
    },
    {
      task: "把练习 2 的函数改写成箭头函数，名字还是 isSlow，调用两次显示结果。",
      hint: "写法是 const isSlow = (delay) => { ... }，里面的 return 不变。",
      starter: "function isSlow(delay) {\n  return delay > 200\n}\nconsole.log(isSlow(120))\nconsole.log(isSlow(350))",
      answer: "const isSlow = (delay) => {\n  return delay > 200\n}\nconsole.log(isSlow(120))\nconsole.log(isSlow(350))",
      answerExplain:
        "箭头函数和 function 写法干的活一样，只是写法短一点。\n运行后应该显示两行：false、true。",
    },
    {
      task: "写一个叫 subStatus 的函数，输入订阅名和剩余天数，返回一句“订阅：Kitty，还剩 5 天”这样的文字。调用它一次，订阅名用“Kitty”，剩余天数用 5，显示结果。",
      hint: "返回值用 + 把几段文字拼起来：第 3 章讲过字符串拼接。",
      answer: "function subStatus(name, left) {\n  return \"订阅：\" + name + \"，还剩 \" + left + \" 天\"\n}\nconsole.log(subStatus(\"Kitty\", 5))",
      answerExplain:
        "subStatus(\"Kitty\", 5) 把“订阅：”“Kitty”“，还剩 ”“5”“ 天”拼成一句“订阅：Kitty，还剩 5 天”。\n运行后应该显示：订阅：Kitty，还剩 5 天。",
    },
  ],
  mistakes: [
    {
      wrong: "function leftDays(total, used) {\n  return total - used\n}",
      right: "function leftDays(total, used) {\n  return total - used\n}\nconsole.log(leftDays(30, 12))",
      why: "只定义不调用，函数一行都不会跑；写完函数一定要叫它一声。",
    },
    {
      wrong: "function leftDays(total, used) {\n  total - used\n}\nconsole.log(leftDays(30, 12))",
      right: "function leftDays(total, used) {\n  return total - used\n}\nconsole.log(leftDays(30, 12))",
      why: "算完不写 return，结果交不回来，调用拿到的是 undefined（没有值）。",
    },
    {
      wrong: "function sayHi() {\n  const msg = \"你好\"\n}\nconsole.log(msg)",
      right: "function sayHi() {\n  const msg = \"你好\"\n  console.log(msg)\n}\nsayHi()",
      why: "函数里定义的变量只能在函数里用，出了函数就找不到了；要用它，就在函数里面用。",
    },
  ],
  recall: [
    {
      q: "参数和返回值各是干什么的？",
      a: "参数是调用时传进去的数据；返回值是函数用 return 交还回来的结果。",
    },
    {
      q: "箭头函数和 function 写法有什么不一样？",
      a: "干的活一样，箭头函数更短；一行版箭头函数不用写 return，箭头后面的就是返回值。",
    },
    {
      q: "函数里定义的变量，出了函数还能用吗？为什么？",
      a: "不能用，函数跑完它就没了；里面能看外面，外面看不见里面。",
    },
  ],
  mentalModel: "函数就是把一段吩咐起个名字打包起来：传参数进去，return 把结果交回来，写一次、到处调用；箭头函数是更短的写法，作用域管的是变量在哪里能用。",
}
