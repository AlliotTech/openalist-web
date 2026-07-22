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
    overflow?: JSX.CSSProperties["overflow"]
    overflowX?: JSX.CSSProperties["overflow-x"]
    rounded?: string
    bg?: string
    bgColor?: string
    shadow?: string
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
    "overflow",
    "overflowX",
    "rounded",
    "bg",
    "bgColor",
    "shadow",
    "transition",
  ])
  return (
    <Dynamic
      component={local.as ?? "div"}
      {...others}
      {...(typeof local.transition === "object"
        ? { transition: local.transition }
        : {})}
      style={{
        ...(local.css ?? {}),
        ...(local.style ?? {}),
        width: token(local.boxSize ?? local.w, "sizes"),
        height: token(local.boxSize ?? local.h, "sizes"),
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
        position: local.pos,
        overflow: local.overflow,
        "overflow-x": local.overflowX,
        "border-radius": token(local.rounded, "radii"),
        background: colors(local.bg ?? local.bgColor),
        "box-shadow": token(local.shadow, "shadows"),
        transition:
          typeof local.transition === "string" ? local.transition : undefined,
      }}
    >
      {local.children}
    </Dynamic>
  )
}

export const AppSpacer = () => <div aria-hidden="true" style={{ flex: "1" }} />
