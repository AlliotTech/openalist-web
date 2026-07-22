import { Button, Icon } from "@hope-ui/solid"
import { createMemo, For, Show } from "solid-js"
import { useLink, useT } from "~/hooks"
import { getExternalPreviews, objStore } from "~/store"
import { FaSolidAngleDown } from "solid-icons/fa"
import { convertURL } from "~/utils"
import { AppMenu } from "~/components/ui/Menu"

export const OpenWith = () => {
  const t = useT()
  const previews = createMemo(() => {
    return getExternalPreviews(objStore.obj.name)
  })
  const { currentObjLink } = useLink()
  return (
    <Show when={previews().length}>
      <AppMenu>
        <AppMenu.Trigger
          as={Button}
          class="app-menu__trigger"
          colorScheme="success"
          rightIcon={<Icon as={FaSolidAngleDown} />}
        >
          {t("home.preview.open_with")}
        </AppMenu.Trigger>
        <AppMenu.Portal>
          <AppMenu.Content class="app-menu__content">
            <For each={previews()}>
              {(preview) => (
                <AppMenu.Item
                  as="a"
                  class="app-menu__item"
                  target="_blank"
                  href={convertURL(preview.value, {
                    raw_url: objStore.raw_url,
                    name: objStore.obj.name,
                    d_url: currentObjLink(true),
                  })}
                >
                  {preview.key}
                </AppMenu.Item>
              )}
            </For>
          </AppMenu.Content>
        </AppMenu.Portal>
      </AppMenu>
    </Show>
  )
}
