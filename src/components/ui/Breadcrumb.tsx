import { splitProps, type JSX, type ParentProps } from "solid-js"
import { Dynamic } from "solid-js/web"
import "./breadcrumb.css"

const token = (value: string | number | undefined, group: string) => {
  if (typeof value === "number") return `${value}px`
  if (typeof value !== "string") return value
  return value.startsWith("$")
    ? `var(--hope-${group}-${value.slice(1)})`
    : value
}

const colors = (value: string | undefined) =>
  value?.replace(/\$([\w]+)/g, "var(--hope-colors-$1)")

export type AppBreadcrumbProps = ParentProps<{
  class?: string
  position?: JSX.CSSProperties["position"]
  zIndex?: string | number
  top?: string | number
  background?: string
  w?: string
  py?: string
  pl?: string
  pr?: string
  masked?: boolean
}>

export const AppBreadcrumb = (props: AppBreadcrumbProps) => (
  <nav
    aria-label="breadcrumb"
    class={`app-breadcrumb${props.masked ? " app-breadcrumb--masked" : ""}${props.class ? ` ${props.class}` : ""}`}
    style={{
      position: props.position,
      "z-index": token(props.zIndex, "zIndices"),
      top: token(props.top, "space"),
      background: colors(props.background),
      width: token(props.w, "sizes"),
      "padding-top": token(props.py, "space"),
      "padding-bottom": token(props.py, "space"),
      "padding-left": token(props.pl, "space"),
      "padding-right": token(props.pr, "space"),
    }}
  >
    <ol class="app-breadcrumb__list">{props.children}</ol>
  </nav>
)

export const AppBreadcrumbItem = (props: ParentProps<{ class?: string }>) => (
  <li class={`app-breadcrumb__item${props.class ? ` ${props.class}` : ""}`}>
    {props.children}
  </li>
)

type LinkProps = ParentProps<
  Omit<JSX.AnchorHTMLAttributes<HTMLAnchorElement>, "style"> & {
    as?: any
    currentPage?: boolean
    css?: JSX.CSSProperties | Record<string, string>
    color?: string
    cursor?: JSX.CSSProperties["cursor"]
    p?: string
    rounded?: string
    _hover?: {
      bgColor?: string
      color?: string
      transform?: string
      boxShadow?: string
    }
    _active?: { transform?: string; transition?: string }
  }
>

export const AppBreadcrumbLink = (props: LinkProps) => {
  const [local, others] = splitProps(props, [
    "as",
    "class",
    "children",
    "currentPage",
    "css",
    "color",
    "cursor",
    "p",
    "rounded",
    "_hover",
    "_active",
  ])
  return (
    <Dynamic
      component={local.as ?? (local.currentPage ? "span" : "a")}
      {...others}
      href={local.currentPage && !local.as ? undefined : others.href}
      aria-current={local.currentPage ? "page" : undefined}
      class={`app-breadcrumb__link${local._hover ? " app-breadcrumb__link--hover" : ""}${local._active ? " app-breadcrumb__link--active" : ""}${local.class ? ` ${local.class}` : ""}`}
      style={{
        ...(local.css as JSX.CSSProperties),
        color: colors(local.color),
        cursor: local.cursor,
        padding: token(local.p, "space"),
        "border-radius": token(local.rounded, "radii"),
        "--app-breadcrumb-hover-background": colors(local._hover?.bgColor),
        "--app-breadcrumb-hover-color": colors(local._hover?.color),
        "--app-breadcrumb-hover-transform": local._hover?.transform,
        "--app-breadcrumb-hover-shadow": local._hover?.boxShadow,
        "--app-breadcrumb-active-transform": local._active?.transform,
        "--app-breadcrumb-active-transition": local._active?.transition,
      }}
    >
      {local.children}
    </Dynamic>
  )
}

export const AppBreadcrumbSeparator = (props: {
  class?: string
  mx?: string
}) => (
  <span
    aria-hidden="true"
    class={`app-breadcrumb__separator${props.class ? ` ${props.class}` : ""}`}
    style={{
      "margin-left": token(props.mx, "space"),
      "margin-right": token(props.mx, "space"),
    }}
  >
    /
  </span>
)
