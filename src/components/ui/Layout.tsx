import { splitProps, type JSX, type ParentProps } from "solid-js"
import { Dynamic } from "solid-js/web"

const token = (value: string | number | undefined, group: string) => {
  if (typeof value === "number") return `${value}px`
  if (typeof value !== "string") return value
  return value.startsWith("$")
    ? `var(--hope-${group}-${value.slice(1)})`
    : value
}

const colors = (value: string | undefined) =>
  value?.replace(/\$([\w]+)/g, "var(--hope-colors-$1)")

type AppBoxProps = ParentProps<
  Omit<JSX.HTMLAttributes<HTMLDivElement>, "style"> & {
    as?: any
    style?: JSX.CSSProperties
    css?: JSX.CSSProperties
    w?: string | number
    h?: string | number
    height?: string | number
    className?: string
    minW?: string | number
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
    top?: string | number
    right?: string | number
    bottom?: string | number
    left?: string | number
    zIndex?: string | number
    flexShrink?: string | number
    overflow?: JSX.CSSProperties["overflow"]
    overflowX?: JSX.CSSProperties["overflow-x"]
    overflowY?: JSX.CSSProperties["overflow-y"]
    color?: string
    rounded?: string
    bg?: string
    bgColor?: string
    shadow?: string
    border?: string
    borderColor?: string
    transition?: JSX.CSSProperties["transition"] | Record<string, unknown>
    initial?: unknown
    animate?: unknown
    exit?: unknown
  }
>

export const AppBox = (props: AppBoxProps) => {
  const [local, others] = splitProps(props, [
    "as",
    "style",
    "css",
    "children",
    "w",
    "h",
    "height",
    "className",
    "minW",
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
    "rounded",
    "bg",
    "bgColor",
    "shadow",
    "border",
    "borderColor",
    "transition",
  ])
  return (
    <Dynamic
      component={local.as ?? "div"}
      {...others}
      class={local.className}
      {...(typeof local.transition === "object"
        ? { transition: local.transition }
        : {})}
      style={{
        ...(local.css ?? {}),
        ...(local.style ?? {}),
        width: token(local.boxSize ?? local.w, "sizes"),
        height: token(local.boxSize ?? local.h ?? local.height, "sizes"),
        "min-width": token(local.minW, "sizes"),
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
        top: token(local.top, "space"),
        right: token(local.right, "space"),
        bottom: token(local.bottom, "space"),
        left: token(local.left, "space"),
        "z-index": token(local.zIndex, "zIndices"),
        "flex-shrink": local.flexShrink,
        overflow: local.overflow,
        "overflow-x": local.overflowX,
        "overflow-y": local.overflowY,
        color: token(local.color, "colors"),
        "border-radius": token(local.rounded, "radii"),
        background: colors(local.bg ?? local.bgColor),
        "box-shadow": token(local.shadow, "shadows"),
        border: colors(local.border),
        "border-color": colors(local.borderColor),
        transition:
          typeof local.transition === "string" ? local.transition : undefined,
      }}
    >
      {local.children}
    </Dynamic>
  )
}

export const AppSpacer = () => <div aria-hidden="true" style={{ flex: "1" }} />
