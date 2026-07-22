import { splitProps, type JSX } from "solid-js"
import { Dynamic } from "solid-js/web"
import "./icon.css"

const token = (value: string | number | undefined, group: string) => {
  if (typeof value === "number") return `${value}px`
  if (typeof value !== "string") return value
  return value.startsWith("$")
    ? `var(--hope-${group}-${value.slice(1)})`
    : value
}

export type AppIconProps = Omit<JSX.HTMLAttributes<HTMLElement>, "style"> & {
  as?: any
  style?: JSX.CSSProperties
  boxSize?: string | number
  p?: string
  pl?: string
  ml?: string
  mr?: string
  color?: string
  cursor?: JSX.CSSProperties["cursor"]
  verticalAlign?: JSX.CSSProperties["vertical-align"]
  pos?: JSX.CSSProperties["position"]
  top?: string | number
  right?: string | number
  bottom?: string | number
  left?: string | number
  zIndex?: string | number
  transform?: string
  transition?: string
  rounded?: string
  bgColor?: string
  _hover?: {
    bgColor?: string
    color?: string
    transform?: string
    boxShadow?: string
  }
  _focus?: { outline?: string }
  _active?: { transform?: string; transition?: string }
}

export const AppIcon = (props: AppIconProps) => {
  const [local, others] = splitProps(props, [
    "class",
    "as",
    "style",
    "boxSize",
    "p",
    "pl",
    "ml",
    "mr",
    "color",
    "cursor",
    "verticalAlign",
    "pos",
    "top",
    "right",
    "bottom",
    "left",
    "zIndex",
    "transform",
    "transition",
    "rounded",
    "bgColor",
    "_hover",
    "_focus",
    "_active",
  ])
  return (
    <Dynamic
      component={local.as ?? "svg"}
      {...others}
      class={`app-icon${local._hover ? " app-icon--hover" : ""}${local._focus ? " app-icon--focus" : ""}${local._active ? " app-icon--active" : ""}${local.class ? ` ${local.class}` : ""}`}
      style={{
        ...(local.style ?? {}),
        width: token(local.boxSize, "sizes"),
        height: token(local.boxSize, "sizes"),
        padding: token(local.p, "space"),
        "padding-left": token(local.pl, "space"),
        "margin-left": token(local.ml, "space"),
        "margin-right": token(local.mr, "space"),
        color: token(local.color, "colors"),
        cursor: local.cursor,
        "vertical-align": local.verticalAlign,
        position: local.pos,
        top: token(local.top, "space"),
        right: token(local.right, "space"),
        bottom: token(local.bottom, "space"),
        left: token(local.left, "space"),
        "z-index": token(local.zIndex, "zIndices"),
        transform: local.transform,
        transition: local.transition,
        "border-radius": token(local.rounded, "radii"),
        background: token(local.bgColor, "colors"),
        "--app-icon-hover-background": token(local._hover?.bgColor, "colors"),
        "--app-icon-hover-color": token(local._hover?.color, "colors"),
        "--app-icon-hover-transform": local._hover?.transform,
        "--app-icon-hover-shadow": local._hover?.boxShadow,
        "--app-icon-focus-outline": local._focus?.outline,
        "--app-icon-active-transform": local._active?.transform,
        "--app-icon-active-transition": local._active?.transition,
      }}
    />
  )
}
