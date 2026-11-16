/** 在教程里运行例子代码，并抓回 console.log 的输出。
 * 用 new Function 包一层 async，例子里可以用 await。
 * 超时 5 秒，防止死循环卡住界面。
 */

export interface RunResult {
  /** 是否跑成功 */
  ok: boolean
  /** 抓到的 console.log 输出，每行一条 */
  lines: string[]
  /** 失败时的错误信息 */
  error?: string
}

/** 把一个值变成能显示的文字 */
function stringify(value: unknown): string {
  if (typeof value === "string") {
    return value
  }
  if (value === undefined) {
    return "undefined"
  }
  try {
    return JSON.stringify(value) ?? String(value)
  } catch {
    return String(value)
  }
}

/** 运行一段例子代码，返回输出 */
export async function runExample(code: string): Promise<RunResult> {
  const lines: string[] = []
  const realLog = console.log
  const realError = console.error
  // 临时接管 console.log / console.error，把输出收进 lines
  console.log = (...args: unknown[]) => {
    lines.push(args.map(stringify).join(" "))
  }
  console.error = (...args: unknown[]) => {
    lines.push("错误：" + args.map(stringify).join(" "))
  }
  try {
    const fn = new Function(`return (async () => {\n${code}\n})()`) as () => Promise<unknown>
    const timeout = new Promise<never>((_resolve, reject) => {
      setTimeout(() => reject(new Error("运行超时（5 秒），可能有死循环")), 5000)
    })
    await Promise.race([fn(), timeout])
    return { ok: true, lines }
  } catch (error) {
    return {
      ok: false,
      lines,
      error: error instanceof Error ? error.message : String(error),
    }
  } finally {
    console.log = realLog
    console.error = realError
  }
}
