import { splitProps, type JSX, type ParentProps } from "solid-js"
import { Dynamic } from "solid-js/web"
import "./layout.css"

const token = (value: string | number | undefined, group: string) => {
  if (typeof value === "number") return `${value}px`
  if (typeof value !== "string") return value
  return value.startsWith("$")
    ? `var(--hope-${group}-${value.slice(1)})`
    : value
}

const colors = (value: string | undefined) =>
  value?.replace(/\$([\w]+)/g, "var(--hope-colors-$1)")

const zIndex = (value: string | number | undefined) =>
  typeof value === "number" ? value.toString() : token(value, "zIndices")

type AppBoxProps = ParentProps<
  Omit<JSX.HTMLAttributes<HTMLDivElement>, "style"> & {
    as?: any
    style?: JSX.CSSProperties
    css?: JSX.CSSProperties
    w?: string | number | { "@initial"?: string; "@sm"?: string }
    h?: string | number
    height?: string | number
    className?: string
    minW?: string | number
    maxW?: string | number
    boxSize?: string | number
    p?: string
    px?: string
    py?: string
    pl?: string
    m?: string
    mt?: string
    mb?: string
    mx?: string
    pos?: JSX.CSSProperties["position"]
    position?: JSX.CSSProperties["position"]
    top?: string | number | { "@initial"?: string; "@sm"?: string }
    right?: string | number | { "@initial"?: string; "@sm"?: string }
    bottom?: string | number | { "@initial"?: string; "@sm"?: string }
    left?: string | number | { "@initial"?: string; "@sm"?: string }
    zIndex?: string | number
    flexShrink?: string | number
    overflow?: JSX.CSSProperties["overflow"]
    overflowX?: JSX.CSSProperties["overflow-x"]
    overflowY?: JSX.CSSProperties["overflow-y"]
    color?: string
    display?: string | { "@initial"?: string; "@sm"?: string }
    opacity?: string | number
    rounded?: string
    bg?: string
    bgColor?: string
    shadow?: string
    border?: string
    borderColor?: string
    borderBottomRadius?: string
    _hover?: {
      opacity?: string | number
      bgColor?: string
      color?: string
      transform?: string
      boxShadow?: string
    }
    _dark?: { bgColor?: string; color?: string }
    transition?: JSX.CSSProperties["transition"] | Record<string, unknown>
    initial?: unknown
    animate?: unknown
    exit?: unknown
  }
>

export const AppBox = (props: AppBoxProps) => {
  const [local, others] = splitProps(props, [
    "as",
    "class",
    "style",
    "css",
    "children",
    "w",
    "h",
    "height",
    "className",
    "minW",
    "maxW",
    "boxSize",
    "p",
    "px",
    "py",
    "pl",
    "m",
    "mt",
    "mb",
    "mx",
    "pos",
    "position",
    "top",
    "right",
    "bottom",
    "left",
    "zIndex",
    "flexShrink",
    "overflow",
    "overflowX",
    "overflowY",
    "color",
    "display",
    "opacity",
    "rounded",
    "bg",
    "bgColor",
    "shadow",
    "border",
    "borderColor",
    "borderBottomRadius",
    "_hover",
    "_dark",
    "transition",
  ])
  return (
    <Dynamic
      component={local.as ?? "div"}
      {...others}
      class={`app-box${typeof local.w === "object" || typeof local.display === "object" || typeof local.top === "object" || typeof local.right === "object" || typeof local.bottom === "object" || typeof local.left === "object" ? " app-box--responsive" : ""}${local._hover ? " app-box--hover" : ""}${local._dark ? " app-box--dark" : ""}${local.class ? ` ${local.class}` : ""}${local.className ? ` ${local.className}` : ""}`}
      {...(typeof local.transition === "object"
        ? { transition: local.transition }
        : {})}
      style={{
        ...(local.css ?? {}),
        ...(local.style ?? {}),
        width: token(
          local.boxSize ?? (typeof local.w === "object" ? undefined : local.w),
          "sizes",
        ),
        height: token(local.boxSize ?? local.h ?? local.height, "sizes"),
        "min-width": token(local.minW, "sizes"),
        "max-width": token(local.maxW, "sizes"),
        padding: token(local.p, "space"),
        "padding-left": token(local.px ?? local.pl, "space"),
        "padding-right": token(local.px, "space"),
        "padding-top": token(local.py, "space"),
        "padding-bottom": token(local.py, "space"),
        margin: token(local.m, "space"),
        "margin-top": token(local.mt, "space"),
        "margin-bottom": token(local.mb, "space"),
        "margin-left": token(local.mx, "space"),
        "margin-right": token(local.mx, "space"),
        position: local.pos ?? local.position,
        top: token(
          typeof local.top === "object" ? undefined : local.top,
          "space",
        ),
        right: token(
          typeof local.right === "object" ? undefined : local.right,
          "space",
        ),
        bottom: token(
          typeof local.bottom === "object" ? undefined : local.bottom,
          "space",
        ),
        left: token(
          typeof local.left === "object" ? undefined : local.left,
          "space",
        ),
        "z-index": zIndex(local.zIndex),
        "flex-shrink": local.flexShrink,
        overflow: local.overflow,
        "overflow-x": local.overflowX,
        "overflow-y": local.overflowY,
        color: token(local.color, "colors"),
        display: typeof local.display === "object" ? undefined : local.display,
        opacity: local.opacity,
        "border-radius": token(local.rounded, "radii"),
        background: colors(local.bg ?? local.bgColor),
        "box-shadow": token(local.shadow, "shadows"),
        border: colors(local.border),
        "border-color": colors(local.borderColor),
        "border-bottom-left-radius": token(local.borderBottomRadius, "radii"),
        "border-bottom-right-radius": token(local.borderBottomRadius, "radii"),
        transition:
          typeof local.transition === "string" ? local.transition : undefined,
        "--app-box-hover-opacity": local._hover?.opacity,
        "--app-box-hover-background": colors(local._hover?.bgColor),
        "--app-box-hover-color": colors(local._hover?.color),
        "--app-box-hover-transform": local._hover?.transform,
        "--app-box-hover-shadow": local._hover?.boxShadow,
        "--app-box-dark-background": colors(local._dark?.bgColor),
        "--app-box-dark-color": colors(local._dark?.color),
        "--app-box-width-sm": token(
          typeof local.w === "object" ? local.w["@sm"] : undefined,
          "sizes",
        ),
        "--app-box-width-initial": token(
          typeof local.w === "object" ? local.w["@initial"] : undefined,
          "sizes",
        ),
        "--app-box-display-sm":
          typeof local.display === "object" ? local.display["@sm"] : undefined,
        "--app-box-display-initial":
          typeof local.display === "object"
            ? local.display["@initial"]
            : undefined,
        "--app-box-top-sm": token(
          typeof local.top === "object" ? local.top["@sm"] : undefined,
          "space",
        ),
        "--app-box-top-initial": token(
          typeof local.top === "object" ? local.top["@initial"] : undefined,
          "space",
        ),
        "--app-box-right-sm": token(
          typeof local.right === "object" ? local.right["@sm"] : undefined,
          "space",
        ),
        "--app-box-right-initial": token(
          typeof local.right === "object" ? local.right["@initial"] : undefined,
          "space",
        ),
        "--app-box-bottom-sm": token(
          typeof local.bottom === "object" ? local.bottom["@sm"] : undefined,
          "space",
        ),
        "--app-box-bottom-initial": token(
          typeof local.bottom === "object"
            ? local.bottom["@initial"]
            : undefined,
          "space",
        ),
        "--app-box-left-sm": token(
          typeof local.left === "object" ? local.left["@sm"] : undefined,
          "space",
        ),
        "--app-box-left-initial": token(
          typeof local.left === "object" ? local.left["@initial"] : undefined,
          "space",
        ),
      }}
    >
      {local.children}
    </Dynamic>
  )
}

export const AppSpacer = () => <div aria-hidden="true" style={{ flex: "1" }} />
