import { Button, Divider, HStack, ScrollView, Spacer, Text, TextField, VStack, useState } from "scripting"
import { getChapter } from "../chapters"
import { codeInputFrame, leadingFillFrame, palette, spacing } from "../design"
import type { Navigate } from "../types/navigation"
import type { Chapter } from "../types/lesson"
import { runExample, type RunResult } from "../utils/runExample"

/** 章节页：目标、意义、讲解、例子（可运行）、练习（可看答案）、完成按钮 */
export function LessonPage({
  chapterId,
  completed,
  onComplete,
  go,
}: {
  chapterId: number
  completed: boolean
  onComplete: (id: number) => void
  go: Navigate
}) {
  const chapter: Chapter | undefined = getChapter(chapterId)
  const [outputs, setOutputs] = useState<Record<number, RunResult>>({})
  const [running, setRunning] = useState<Record<number, boolean>>({})
  const [showAnswer, setShowAnswer] = useState<Record<number, boolean>>({})
  /** 每道练习输入框里用户自己写的代码（下标是练习序号，没写过就取 starter，没 starter 就是空） */
  const [exerciseCode, setExerciseCode] = useState<Record<number, string>>({})
  /** 每道练习“运行我的代码”的结果 */
  const [exerciseOutputs, setExerciseOutputs] = useState<Record<number, RunResult>>({})
  const [exerciseRunning, setExerciseRunning] = useState<Record<number, boolean>>({})
  /** 每道回忆问题的答案是否展开 */
  const [showRecall, setShowRecall] = useState<Record<number, boolean>>({})

  if (!chapter) {
    return (
      <VStack alignment="center" spacing={spacing.md} frame={leadingFillFrame}>
        <Text font="headline">这一章还没写好</Text>
        <Text font="subheadline" foregroundStyle={palette.secondaryLabel}>
          第 {chapterId} 章正在写，写好后会更新进来。
        </Text>
        <Button title="返回首页" buttonStyle="glass" action={() => go({ name: "home" })} />
      </VStack>
    )
  }

  async function runOne(index: number, code: string) {
    setRunning(prev => ({ ...prev, [index]: true }))
    const result = await runExample(code)
    setOutputs(prev => ({ ...prev, [index]: result }))
    setRunning(prev => ({ ...prev, [index]: false }))
  }

  /** 运行一道练习里用户自己写的代码 */
  async function runExercise(index: number, code: string) {
    setExerciseRunning(prev => ({ ...prev, [index]: true }))
    const result = await runExample(code)
    setExerciseOutputs(prev => ({ ...prev, [index]: result }))
    setExerciseRunning(prev => ({ ...prev, [index]: false }))
  }

  /** 把一道练习的输入框恢复成起始代码（或清空），同时清掉上次的运行结果 */
  function resetExercise(index: number, starter?: string) {
    setExerciseCode(prev => ({ ...prev, [index]: starter ?? "" }))
    setExerciseOutputs(prev => {
      const next = { ...prev }
      delete next[index]
      return next
    })
  }

  const next = getChapter(chapterId + 1)

  return (
    <ScrollView>
      <VStack alignment="leading" spacing={spacing.md} frame={leadingFillFrame}>
        <Text font="largeTitle" fontWeight="bold">
          第 {chapter.id} 章
        </Text>
        <Text font="title2" fontWeight="semibold">
          {chapter.title}
        </Text>
        {completed ? (
          <Text font="subheadline" foregroundStyle={palette.success}>
            ✓ 本章已完成
          </Text>
        ) : null}

        <Text font="headline">今天学什么</Text>
        <Text font="body">{chapter.goal}</Text>

        <Text font="headline">有什么意义</Text>
        <Text font="body">{chapter.meaning}</Text>

        <Divider />
        {chapter.sections.map((section, i) => (
          <VStack key={i} alignment="leading" spacing={spacing.sm}>
            <Text font="headline">{section.heading}</Text>
            {section.think ? (
              <Text font="body" foregroundStyle={palette.warning}>
                💭 先想一想：{section.think}
              </Text>
            ) : null}
            <Text font="body">{section.body}</Text>
          </VStack>
        ))}

        <Divider />
        <Text font="title3" fontWeight="semibold">
          实践例子
        </Text>
        {chapter.examples.map((example, i) => {
          const result = outputs[i]
          const isRunning = running[i] ?? false
          const runnable = (example.where ?? "scripting") === "scripting"
          return (
            <VStack key={i} alignment="leading" spacing={spacing.sm}>
              <Text font="headline">{example.title}</Text>
              <Text font="body" foregroundStyle={palette.secondaryLabel}>
                {example.explain}
              </Text>
              <Text font="body">{example.code}</Text>
              {runnable ? (
                <Button
                  title={isRunning ? "运行中…" : "运行这个例子"}
                  systemImage="play.fill"
                  buttonStyle="glass"
                  action={() => void runOne(i, example.code)}
                />
              ) : (
                <Text font="caption" foregroundStyle={palette.warning}>
                  这个例子在 Scripting 里跑不了：{example.runNote ?? "请到对应的环境里运行。"}
                </Text>
              )}
              {result ? (
                <VStack alignment="leading" spacing={2}>
                  <Text font="subheadline" fontWeight="semibold">
                    运行结果：
                  </Text>
                  {result.lines.length > 0 ? (
                    <Text font="body">{result.lines.join("\n")}</Text>
                  ) : (
                    <Text font="body" foregroundStyle={palette.secondaryLabel}>
                      （没有输出）
                    </Text>
                  )}
                  {result.ok ? null : (
                    <Text font="body" foregroundStyle={palette.danger}>
                      出错了：{result.error}
                    </Text>
                  )}
                  <Text font="caption" foregroundStyle={palette.secondaryLabel}>
                    预期输出：{example.output}
                  </Text>
                </VStack>
              ) : null}
            </VStack>
          )
        })}

        {chapter.mistakes && chapter.mistakes.length > 0 ? (
          <VStack alignment="leading" spacing={spacing.sm}>
            <Divider />
            <Text font="title3" fontWeight="semibold">
              常错点
            </Text>
            <Text font="body" foregroundStyle={palette.secondaryLabel}>
              这些错最容易犯，错的代码和对的代码对照看，记住一句话原因。
            </Text>
            {chapter.mistakes.map((mistake, i) => (
              <VStack key={i} alignment="leading" spacing={spacing.sm}>
                <Text font="headline">错点 {i + 1}</Text>
                <Text font="subheadline" fontWeight="semibold">
                  错的代码：
                </Text>
                <Text font="body">{mistake.wrong}</Text>
                <Text font="subheadline" fontWeight="semibold">
                  对的代码：
                </Text>
                <Text font="body">{mistake.right}</Text>
                <Text font="body">原因：{mistake.why}</Text>
              </VStack>
            ))}
          </VStack>
        ) : null}

        <Divider />
        <Text font="title3" fontWeight="semibold">
          怎么练习
        </Text>
        <Text font="body" foregroundStyle={palette.secondaryLabel}>
          每道题下面都有输入框：自己动手写，写完点“运行我的代码”看结果。做不出来先看提示，实在不会再点“看答案”对照。
        </Text>
        {chapter.exercises.map((exercise, i) => {
          const open = showAnswer[i] ?? false
          const answerWhere = exercise.answerWhere ?? "scripting"
          const runnable = answerWhere === "scripting"
          const code = exerciseCode[i] ?? exercise.starter ?? ""
          const result = exerciseOutputs[i]
          const isRunning = exerciseRunning[i] ?? false
          const whereLabel =
            answerWhere === "worker"
              ? "这个答案是 Worker 代码，部署到 Cloudflare Workers 运行"
              : answerWhere === "surge"
                ? "这个答案是 Surge 模块或脚本，放到 Surge 里运行"
                : answerWhere === "loon"
                  ? "这个答案是 Loon 配置或脚本，放到 Loon 里运行"
                  : answerWhere === "rex"
                    ? "这个答案是 REX 模块文件，放到 REX 里运行"
                    : ""
          return (
            <VStack key={i} alignment="leading" spacing={spacing.sm}>
              <Text font="headline">练习 {i + 1}</Text>
              <Text font="body">{exercise.task}</Text>
              <Text font="caption" foregroundStyle={palette.secondaryLabel}>
                提示：{exercise.hint}
              </Text>
              <Text font="subheadline" fontWeight="semibold">
                在这里写你的代码：
              </Text>
              <TextField
                title="我的代码"
                axis="vertical"
                value={code}
                onChanged={value => setExerciseCode(prev => ({ ...prev, [i]: value }))}
                prompt="点这里写你的代码…"
                frame={codeInputFrame}
              />
              <HStack spacing={spacing.sm}>
                {runnable ? (
                  <Button
                    title={isRunning ? "运行中…" : "运行我的代码"}
                    systemImage="play.fill"
                    buttonStyle="glass"
                    action={() => void runExercise(i, code)}
                  />
                ) : (
                  <Text font="caption" foregroundStyle={palette.warning}>
                    这道题的答案在 Scripting 里跑不了，先在这里把代码写下来，再到对应的地方去试。
                  </Text>
                )}
                <Button
                  title="重新开始"
                  buttonStyle="glass"
                  action={() => resetExercise(i, exercise.starter)}
                />
              </HStack>
              {result ? (
                <VStack alignment="leading" spacing={2}>
                  <Text font="subheadline" fontWeight="semibold">
                    你的运行结果：
                  </Text>
                  {result.lines.length > 0 ? (
                    <Text font="body">{result.lines.join("\n")}</Text>
                  ) : (
                    <Text font="body" foregroundStyle={palette.secondaryLabel}>
                      （没有输出）
                    </Text>
                  )}
                  {result.ok ? null : (
                    <Text font="body" foregroundStyle={palette.danger}>
                      出错了：{result.error}
                    </Text>
                  )}
                  <Text font="caption" foregroundStyle={palette.secondaryLabel}>
                    看看显示的是不是你想要的，不对就改改再运行一次，也可以点“看答案”对照。
                  </Text>
                </VStack>
              ) : null}
              <Button
                title={open ? "收起答案" : "看答案"}
                buttonStyle="glass"
                action={() => setShowAnswer(prev => ({ ...prev, [i]: !open }))}
              />
              {open ? (
                <VStack alignment="leading" spacing={2}>
                  {whereLabel ? (
                    <Text font="caption" foregroundStyle={palette.warning}>
                      {whereLabel}
                    </Text>
                  ) : null}
                  <Text font="body">{exercise.answer}</Text>
                  <Text font="body" foregroundStyle={palette.secondaryLabel}>
                    {exercise.answerExplain}
                  </Text>
                </VStack>
              ) : null}
            </VStack>
          )
        })}

        {chapter.recall && chapter.recall.length > 0 ? (
          <VStack alignment="leading" spacing={spacing.sm}>
            <Divider />
            <Text font="title3" fontWeight="semibold">
              回忆问题
            </Text>
            <Text font="body" foregroundStyle={palette.secondaryLabel}>
              合上书写一写，凭记忆答，答完再点开看答案。
            </Text>
            {chapter.recall.map((item, i) => {
              const open = showRecall[i] ?? false
              return (
                <VStack key={i} alignment="leading" spacing={2}>
                  <Text font="body" fontWeight="semibold">
                    问题 {i + 1}：{item.q}
                  </Text>
                  <Button
                    title={open ? "收起答案" : "看答案"}
                    buttonStyle="glass"
                    action={() => setShowRecall(prev => ({ ...prev, [i]: !open }))}
                  />
                  {open ? (
                    <Text font="body" foregroundStyle={palette.secondaryLabel}>
                      答案：{item.a}
                    </Text>
                  ) : null}
                </VStack>
              )
            })}
          </VStack>
        ) : null}
        {chapter.mentalModel ? (
          <VStack alignment="leading" spacing={spacing.sm}>
            <Divider />
            <Text font="title3" fontWeight="semibold">
              一句话记住
            </Text>
            <Text font="body">{chapter.mentalModel}</Text>
          </VStack>
        ) : null}

        <Divider />
        <HStack spacing={spacing.md}>
          {completed ? (
            <Text font="subheadline" foregroundStyle={palette.success}>
              ✓ 已完成本章
            </Text>
          ) : (
            <Button
              title="完成本章"
              systemImage="checkmark"
              buttonStyle="glassProminent"
              action={() => onComplete(chapter.id)}
            />
          )}
          <Spacer />
          {next ? (
            <Button title="下一章 ›" buttonStyle="glass" action={() => go({ name: "lesson", id: next.id })} />
          ) : (
            <Button title="返回首页" buttonStyle="glass" action={() => go({ name: "home" })} />
          )}
        </HStack>
      </VStack>
    </ScrollView>
  )
}
