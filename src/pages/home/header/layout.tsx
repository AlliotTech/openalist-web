import { IconButton } from "@hope-ui/solid"
import { changeColor } from "seemly"
import { BsGridFill, BsCardImage } from "solid-icons/bs"
import { FaSolidListUl } from "solid-icons/fa"
import { Switch, Match, For } from "solid-js"
import { Dynamic } from "solid-js/web"
import { useT } from "~/hooks"
import { getMainColor, LayoutType, layout, setLayout } from "~/store"
import { AppMenu } from "~/components/ui/Menu"

const layouts = {
  list: FaSolidListUl,
  grid: BsGridFill,
  image: BsCardImage,
} as const

export const Layout = () => {
  const t = useT()
  return (
    <AppMenu>
      <AppMenu.Trigger
        as={IconButton}
        class="app-menu__trigger"
        color={getMainColor()}
        bgColor={changeColor(getMainColor(), { alpha: 0.15 })}
        _hover={{
          bgColor: changeColor(getMainColor(), { alpha: 0.2 }),
        }}
        aria-label="switch layout"
        compact
        size="lg"
        icon={
          <Switch>
            <Match when={layout() === "list"}>
              <FaSolidListUl />
            </Match>
            <Match when={layout() === "grid"}>
              <BsGridFill />
            </Match>
            <Match when={layout() === "image"}>
              <BsCardImage />
            </Match>
          </Switch>
        }
      />
      <AppMenu.Portal>
        <AppMenu.Content class="app-menu__content">
          <For each={Object.entries(layouts)}>
            {(item) => (
              <AppMenu.Item
                class="app-menu__item"
                onSelect={() => {
                  setLayout(item[0] as LayoutType)
                }}
              >
                <span class="app-menu__icon">
                  <Dynamic component={item[1]} />
                </span>
                {t(`home.layouts.${item[0]}`)}
              </AppMenu.Item>
            )}
          </For>
        </AppMenu.Content>
      </AppMenu.Portal>
    </AppMenu>
  )
}
