import { changeColor } from "seemly"
import { BsGridFill, BsCardImage } from "solid-icons/bs"
import { FaSolidListUl } from "solid-icons/fa"
import { Switch, Match, For } from "solid-js"
import { Dynamic } from "solid-js/web"
import { useT } from "~/hooks"
import { getMainColor, LayoutType, layout, setLayout } from "~/store"
import { AppMenu } from "~/components/ui/Menu"
import { AppIconButton } from "~/components/ui/Button"

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
        as={AppIconButton}
        class="app-menu__trigger"
        style={{
          color: getMainColor(),
          background: changeColor(getMainColor(), { alpha: 0.15 }),
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
