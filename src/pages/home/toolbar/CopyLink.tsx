import { useT, useCopyLink } from "~/hooks"
import { CenterIcon } from "./Icon"
import { AppMenu } from "~/components/ui/Menu"

export const CopyLink = () => {
  const t = useT()
  const { copySelectedPreviewPage, copySelectedRawLink } = useCopyLink()
  return (
    <AppMenu placement="top" gutter={10}>
      <AppMenu.Trigger
        as={CenterIcon}
        class="app-menu__trigger"
        name="copy_link"
      />
      <AppMenu.Portal>
        <AppMenu.Content class="app-menu__content">
          <AppMenu.Item
            class="app-menu__item"
            onSelect={() => {
              copySelectedPreviewPage()
            }}
          >
            {t("home.toolbar.preview_page")}
          </AppMenu.Item>
          <AppMenu.Item
            class="app-menu__item"
            onSelect={() => {
              copySelectedRawLink()
            }}
          >
            {t("home.toolbar.down_link")}
          </AppMenu.Item>
          <AppMenu.Item
            class="app-menu__item"
            onSelect={() => {
              copySelectedRawLink(true)
            }}
          >
            {t("home.toolbar.encode_down_link")}
          </AppMenu.Item>
        </AppMenu.Content>
      </AppMenu.Portal>
    </AppMenu>
  )
}
