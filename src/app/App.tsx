import { AppProgress } from "~/components/ui/Loading"
import { useIsRouting } from "@solidjs/router"
import {
  Component,
  createEffect,
  createSignal,
  JSXElement,
  Match,
  onCleanup,
  Switch,
} from "solid-js"
import { Portal } from "solid-js/web"
import { useLoading, useRouter, useT } from "~/hooks"
import { bus, r, handleRespWithoutAuthAndNotify } from "~/utils"
import { setSettings } from "~/store"
import { Error, FullScreenLoading } from "~/components"
import "./index.css"
import { addLanguage, initialLang, langMap, loadedLangs } from "./i18n"
import { Resp } from "~/types"
import { setArchiveExtensions } from "~/store/archive"

const App: Component<{ children?: JSXElement }> = (props) => {
  const t = useT()
  const isRouting = useIsRouting()
  const { to, pathname } = useRouter()
  const onTo = (path: string) => {
    to(path)
  }
  bus.on("to", onTo)
  onCleanup(() => {
    bus.off("to", onTo)
  })

  createEffect(() => {
    bus.emit("pathname", pathname())
  })

  const [err, setErr] = createSignal<string[]>([])
  const [loading, data] = useLoading(() =>
    Promise.all([
      (async () => {
        addLanguage(initialLang, (await langMap[initialLang]()).default)
        loadedLangs.add(initialLang)
      })(),
      (async () => {
        handleRespWithoutAuthAndNotify(
          (await r.get("/public/settings")) as Resp<Record<string, string>>,
          setSettings,
          (e) => setErr(err().concat(e)),
        )
      })(),
      (async () => {
        handleRespWithoutAuthAndNotify(
          (await r.get("/public/archive_extensions")) as Resp<string[]>,
          setArchiveExtensions,
          (e) => setErr(err().concat(e)),
        )
      })(),
    ]),
  )
  data()
  return (
    <>
      <Portal>
        <AppProgress
          indeterminate
          size="xs"
          position="fixed"
          top="0"
          left="0"
          right="0"
          zIndex="$banner"
          d={isRouting() ? "block" : "none"}
        />
      </Portal>
      <Switch fallback={props.children}>
        <Match when={err().length > 0}>
          <Error
            h="100vh"
            msg={
              t("home.fetching_settings_failed") +
              err()
                .map((e) => t("home." + e))
                .join(", ")
            }
          />
        </Match>
        <Match when={loading()}>
          <FullScreenLoading />
        </Match>
      </Switch>
    </>
  )
}

export default App
