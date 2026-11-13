import { NavigationDestination, NavigationStack, VStack, ZStack, useCallback, useObservable, useState } from "scripting"
import { ChapterList } from "./components/ChapterList"
import { LessonPage } from "./components/LessonPage"
import { fullFillFrame } from "./design"
import { loadProgress, markCompleted, saveProgress } from "./services/progressStore"
import type { Navigate, Route } from "./types/navigation"

/** 路由编码成字符串 */
function encodeRoute(route: Route): string {
  return JSON.stringify(route)
}

function decodeRoute(raw: string): Route | null {
  if (!raw) {
    return null
  }
  try {
    const parsed = JSON.parse(raw) as Route
    if (parsed && typeof parsed.name === "string") {
      return parsed
    }
  } catch (error) {
    console.log("解析路由失败", error)
  }
  return null
}

/** 教程主入口：首页是章节列表，点一章进章节页 */
export function App() {
  const [progress, setProgress] = useState(() => loadProgress())
  const completed = new Set(progress.completed)
  const path = useObservable<string[]>([])

  const go = useCallback<Navigate>(
    next => {
      if (next.name === "home") {
        path.setValue([])
        return
      }
      path.setValue([...path.value, encodeRoute(next)])
    },
    [path]
  )

  function handleComplete(chapterId: number) {
    const nextProgress = markCompleted(progress, chapterId)
    setProgress(nextProgress)
    void saveProgress(nextProgress)
  }

  function renderRoute(raw: string) {
    const route = decodeRoute(raw)
    if (!route) {
      return <VStack />
    }
    switch (route.name) {
      case "lesson":
        return (
          <LessonPage
            chapterId={route.id}
            completed={completed.has(route.id)}
            onComplete={handleComplete}
            go={go}
          />
        )
      default:
        return <VStack />
    }
  }

  return (
    <ZStack>
      <NavigationStack path={path}>
        <VStack
          frame={fullFillFrame}
          navigationDestination={<NavigationDestination>{renderRoute}</NavigationDestination>}
        >
          <ChapterList completed={completed} go={go} />
        </VStack>
      </NavigationStack>
    </ZStack>
  )
}
