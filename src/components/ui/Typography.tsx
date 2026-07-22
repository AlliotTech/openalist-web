import { splitProps, type JSX, type ParentProps } from "solid-js"
import { Dynamic } from "solid-js/web"
import "./typography.css"

const token = (value: string | undefined, group: string) =>
  value?.startsWith("$") ? `var(--hope-${group}-${value.slice(1)})` : value

const colors = (value: string | undefined) =>
  value?.replace(/\$([\w]+)/g, "var(--hope-colors-$1)")

export type AppAnchorProps = ParentProps<
  Omit<JSX.AnchorHTMLAttributes<HTMLAnchorElement>, "style"> & {
    as?: any
    style?: JSX.CSSProperties
    external?: boolean
    w?: string
    display?: JSX.CSSProperties["display"]
    alignItems?: JSX.CSSProperties["align-items"]
    px?: string
    py?: string
    rounded?: string
    cursor?: JSX.CSSProperties["cursor"]
    color?: string
    bgColor?: string
    transition?: string
    _hover?: {
      transform?: string
      color?: string
      bgColor?: string
      textDecoration?: string
    }
  }
>

export const AppAnchor = (props: AppAnchorProps) => {
  const [local, others] = splitProps(props, [
    "as",
    "style",
    "children",
    "external",
    "w",
    "display",
    "alignItems",
    "px",
    "py",
    "rounded",
    "cursor",
    "color",
    "bgColor",
    "transition",
    "_hover",
  ])
  return (
    <Dynamic
      component={local.as ?? "a"}
      {...others}
      target={local.external ? "_blank" : others.target}
      rel={local.external ? "noopener noreferrer" : others.rel}
      class={`app-anchor${local._hover ? " app-anchor--hover" : ""}`}
      style={{
        ...(local.style ?? {}),
        width: token(local.w, "sizes"),
        display: local.display,
        "align-items": local.alignItems,
        "padding-left": token(local.px, "space"),
        "padding-right": token(local.px, "space"),
        "padding-top": token(local.py, "space"),
        "padding-bottom": token(local.py, "space"),
        "border-radius": token(local.rounded, "radii"),
        cursor: local.cursor,
        color: colors(local.color),
        background: colors(local.bgColor),
        transition: local.transition,
        "--app-anchor-hover-transform": local._hover?.transform,
        "--app-anchor-hover-color": colors(local._hover?.color),
        "--app-anchor-hover-background": colors(local._hover?.bgColor),
        "--app-anchor-hover-decoration": local._hover?.textDecoration,
      }}
    >
      {local.children}
    </Dynamic>
  )
}
