import {
  AppBreadcrumb as Breadcrumb,
  AppBreadcrumbItem as BreadcrumbItem,
  AppBreadcrumbLink as BreadcrumbLink,
  type AppBreadcrumbProps,
  AppBreadcrumbSeparator as BreadcrumbSeparator,
} from "~/components/ui/Breadcrumb"
import { A as Link } from "@solidjs/router"
import { createMemo, For, Show } from "solid-js"
import { usePath, useRouter, useT } from "~/hooks"
import { getSetting, local } from "~/store"
import { encodePath, hoverColor, joinBase } from "~/utils"

export const Nav = () => {
  const { pathname } = useRouter()
  const paths = createMemo(() => ["", ...pathname().split("/").filter(Boolean)])
  const t = useT()
  const { setPathAs } = usePath()

  const stickyProps = createMemo<AppBreadcrumbProps>(() => {
    switch (local["position_of_header_navbar"]) {
      case "only_navbar_sticky":
        return { masked: true, position: "sticky", zIndex: "$sticky", top: 0 }
      case "sticky":
        return { masked: true, position: "sticky", zIndex: "$sticky", top: 60 }
      default:
        return {
          masked: false,
          position: undefined,
          zIndex: undefined,
          top: undefined,
        }
    }
  })

  return (
    <Breadcrumb
      {...stickyProps}
      background="$background"
      class="nav"
      w="$full"
      py="$2"
    >
      <For each={paths()}>
        {(name, i) => {
          const isLast = createMemo(() => i() === paths().length - 1)
          const path = paths()
            .slice(0, i() + 1)
            .join("/")
          const href = encodePath(path)
          let text = () => name
          if (text() === "") {
            text = () => getSetting("home_icon") + t("manage.sidemenu.home")
          }
          return (
            <BreadcrumbItem class="nav-item">
              <BreadcrumbLink
                class="nav-link"
                css={{
                  wordBreak: "break-all",
                  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
                color="unset"
                _hover={{
                  bgColor: hoverColor() as any,
                  color: "unset",
                  transform: "translateY(-1px)",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                }}
                _active={{
                  transform: "scale(.95)",
                  transition: "0.1s",
                }}
                cursor="pointer"
                p="$2"
                rounded="$lg"
                currentPage={isLast()}
                as={isLast() ? undefined : Link}
                href={joinBase(href)}
                onMouseEnter={() => setPathAs(path)}
              >
                {text()}
              </BreadcrumbLink>
              <Show when={!isLast()}>
                <BreadcrumbSeparator class="nav-separator" mx="$2" />
              </Show>
            </BreadcrumbItem>
          )
        }}
      </For>
    </Breadcrumb>
  )
}
