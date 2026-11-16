import { VStack, ZStack, useState } from "scripting"
import { LibraryProvider } from "./contexts/LibraryContext"
import { IconProvider } from "./contexts/IconContext"
import { loadSettings } from "./services/settingsStore"
import { ToastHost } from "./components/ToastHost"
import { fullFillFrame } from "./design/AllPatternDesign"
import { SurgeHomePage } from "./pages/SurgeHomePage"

/** 单页应用：只有首页 */
export function App({
  initialUrl,
  initialName,
}: {
  initialUrl?: string
  initialName?: string
}) {
  const [settings] = useState(() => loadSettings())

  return (
    <IconProvider>
      <LibraryProvider initialSettings={settings}>
        <ZStack>
          <VStack frame={fullFillFrame}>
            <SurgeHomePage initialUrl={initialUrl} initialName={initialName} />
          </VStack>
          <ToastHost />
        </ZStack>
      </LibraryProvider>
    </IconProvider>
  )
}
