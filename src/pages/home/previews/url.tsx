import { MaybeLoading } from "~/components/FullLoading"
import { parseInternetShortcutUrl } from "~/utils"
import { FileInfo } from "./info"
import { useFetchText, useParseText, useT } from "~/hooks"
import { createEffect } from "solid-js"
import { AppButton } from "~/components/ui/Button"

export default function () {
  const [content] = useFetchText()
  function openInNewWindow() {
    const ini = content()?.content
    const { text } = useParseText(ini)
    const url = parseInternetShortcutUrl(text())
    if (url) {
      const a = document.createElement("a")
      a.href = url
      a.rel = "noopener noreferrer"
      a.target = "_blank"
      a.click()
    }
  }
  createEffect(() => {
    openInNewWindow()
  })
  const t = useT()
  return (
    <MaybeLoading loading={content.loading}>
      <FileInfo>
        <AppButton onClick={openInNewWindow}>
          {t("home.preview.open_in_new_window")}
        </AppButton>
      </FileInfo>
    </MaybeLoading>
  )
}
