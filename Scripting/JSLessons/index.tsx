import { Dialog, Navigation, Script } from "scripting"
import { App } from "./app"

/** 入口 */
async function run(): Promise<void> {
  try {
    await Navigation.present({
      element: <App />,
      modalPresentationStyle: "pageSheet",
    })
  } catch (error) {
    console.error("JS教程运行失败", error)
    await Dialog.alert({
      title: "运行失败",
      message: error instanceof Error ? error.message : String(error),
    })
  } finally {
    Script.exit()
  }
}

void run()
