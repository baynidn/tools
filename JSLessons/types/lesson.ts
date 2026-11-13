/** JSLessons 章节内容的数据模型
 * 章节是纯数据（不含界面代码），界面由 components/LessonPage 统一渲染。
 * 写作标准：全简体中文；每个新词第一次出现必须解释；英文关键字只当固定写法讲。
 */

/** 一节讲解：一个小标题 + 一段讲解文字 */
export interface LessonSection {
  /** 小标题 */
  heading: string
  /** 讲解文字（简体中文，术语第一次出现必须解释） */
  body: string
  /** 先想一想：本小节讲解前先问用户一句，先问后讲 */
  think?: string
}

/** 例子/答案在哪里运行 */
export type ExampleWhere = "scripting" | "surge" | "loon" | "worker" | "rex"

/** 一个实践例子：能运行的代码 + 逐行解释 + 预期输出 */
export interface LessonExample {
  /** 例子标题 */
  title: string
  /** 能运行的 JS 代码（scripting 环境可直接跑；surge/loon/worker/rex 的例子只读不跑） */
  code: string
  /** 逐行解释：代码每一行是什么意思 */
  explain: string
  /** 预期输出（运行后应该看到的结果，方便对照） */
  output: string
  /** 在哪里运行：默认 scripting；Surge/Loon/Workers/REX 的例子标明地点 */
  where?: ExampleWhere
  /** 不能在 Scripting 里跑时，说明原因和去哪里跑 */
  runNote?: string
}

/** 一道练习题：题目 + 提示 + 输入框起始代码 + 答案 + 答案解释 */
export interface LessonExercise {
  /** 题目 */
  task: string
  /** 提示（做不出来时看） */
  hint: string
  /** 输入框里预先填好的代码：要改的那行例子、要修的那段错代码、或者题目给的数据。没有就从空开始，自己从头写。 */
  starter?: string
  /** 答案代码 */
  answer: string
  /** 答案解释：为什么这样写 */
  answerExplain: string
  /** 答案在哪里运行：默认 scripting；Worker/模块文件/Surge/Loon/REX 答案标明地点，这类答案不在 Scripting 里跑 */
  answerWhere?: ExampleWhere
}

/** 一个常错点：错的代码、对的代码、一句话原因 */
export interface LessonMistake {
  /** 错的代码（照着写会出问题） */
  wrong: string
  /** 对的代码 */
  right: string
  /** 一句话原因 */
  why: string
}

/** 一道回忆问题：合上书凭记忆答 */
export interface LessonRecall {
  /** 问题 */
  q: string
  /** 简短答案 */
  a: string
}

/** 一章的完整内容 */
export interface Chapter {
  /** 章号 1-17 */
  id: number
  /** 章标题 */
  title: string
  /** 今天学什么：本章要学的知识点（用中文列出来） */
  goal: string
  /** 有什么意义：为什么要学，不学的话会遇到什么问题 */
  meaning: string
  /** 讲解小节 */
  sections: LessonSection[]
  /** 实践例子 */
  examples: LessonExample[]
  /** 练习题 */
  exercises: LessonExercise[]
  /** 常错点：每章 2-3 个（错的代码、对的代码、一句话原因） */
  mistakes?: LessonMistake[]
  /** 回忆问题：每章 3 道（合上书凭记忆答，附简短答案） */
  recall?: LessonRecall[]
  /** 一句话心智模型：这章的概念到底是怎么回事 */
  mentalModel?: string
}
