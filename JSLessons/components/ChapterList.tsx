import { Button, HStack, LazyVStack, ScrollView, Spacer, Text, VStack } from "scripting"
import { TOTAL_CHAPTERS, chapters } from "../chapters"
import { leadingFillFrame, palette, spacing } from "../design"
import type { Navigate } from "../types/navigation"

/** 首页：17 章列表 + 学习进度 */
export function ChapterList({
  completed,
  go,
}: {
  completed: Set<number>
  go: Navigate
}) {
  const doneCount = chapters.filter(c => completed.has(c.id)).length
  return (
    <ScrollView>
      <VStack alignment="leading" spacing={spacing.md} frame={leadingFillFrame}>
        <Text font="largeTitle" fontWeight="bold">
          从零学 JavaScript
        </Text>
        <Text font="subheadline" foregroundStyle={palette.secondaryLabel}>
          17 章互动教程，在 Scripting 里边看边跑边练。每个词都解释，每个例子都能运行。
        </Text>
        <Text font="subheadline" foregroundStyle={palette.secondaryLabel}>
          已完成 {doneCount} / {TOTAL_CHAPTERS} 章
        </Text>
        <LazyVStack alignment="leading" spacing={spacing.sm}>
          {chapters.map(chapter => {
            const done = completed.has(chapter.id)
            return (
              <Button
                key={chapter.id}
                buttonStyle="plain"
                action={() => go({ name: "lesson", id: chapter.id })}
              >
                <HStack spacing={spacing.md} alignment="center" frame={leadingFillFrame}>
                  <Text font="headline" foregroundStyle={done ? palette.success : palette.accent}>
                    {done ? "✓" : String(chapter.id)}
                  </Text>
                  <VStack alignment="leading" spacing={2}>
                    <Text font="headline">第 {chapter.id} 章 · {chapter.title}</Text>
                    <Text font="caption" foregroundStyle={palette.secondaryLabel} lineLimit={2}>
                      {chapter.goal.split("\n")[0]}
                    </Text>
                  </VStack>
                  <Spacer />
                  <Text font="caption" foregroundStyle={palette.tertiaryLabel}>
                    {done ? "已完成" : "›"}
                  </Text>
                </HStack>
              </Button>
            )
          })}
        </LazyVStack>
        <Text font="caption" foregroundStyle={palette.tertiaryLabel}>
          每天学一章，学完点“完成本章”。第 8 章起越往后越动手：异步、Workers、模块格式、Surge 和 Loon 脚本接口，最后是两个完整实战。
        </Text>
      </VStack>
    </ScrollView>
  )
}
