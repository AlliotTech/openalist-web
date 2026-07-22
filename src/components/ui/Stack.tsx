import { splitProps, type JSX, type ParentProps } from "solid-js"
import "./stack.css"

const token = (value: string | number | undefined, group: string) => {
  if (typeof value === "number") return `${value}px`
  if (typeof value !== "string") return value
  return value.startsWith("$")
    ? `var(--hope-${group}-${value.slice(1)})`
    : value
}

const cssTokens = (value: string | undefined) =>
  value?.replace(/\$([\w]+)/g, "var(--hope-colors-$1)")

type StackProps = ParentProps<
  Omit<JSX.HTMLAttributes<HTMLDivElement>, "style"> & {
    style?: JSX.CSSProperties
    spacing?: string
    gap?: string
    alignItems?: JSX.CSSProperties["align-items"]
    justifyContent?: JSX.CSSProperties["justify-content"]
    w?: string | { "@initial"?: string; "@lg"?: string }
    width?: string
    h?: string
    minW?: string | number
    maxW?: string | number
    minH?: string | number
    maxH?: string | number
    p?: string
    px?: string
    py?: string
    m?: string
    mt?: string
    mb?: string
    ml?: string
    mr?: string
    my?: string
    mx?: string
    wrap?:
      JSX.CSSProperties["flex-wrap"] | { "@initial"?: string; "@md"?: string }
    flexWrap?: JSX.CSSProperties["flex-wrap"]
    flex?: string | number
    position?: JSX.CSSProperties["position"]
    pos?: JSX.CSSProperties["position"]
    transition?: JSX.CSSProperties["transition"]
    overflow?: JSX.CSSProperties["overflow"]
    overflowX?: JSX.CSSProperties["overflow-x"]
    overflowY?: JSX.CSSProperties["overflow-y"]
    color?: string
    rounded?: string
    shadow?: string
    pl?: string
    pr?: string
    bg?: string
    background?: string
    border?: string
    _hover?: { border?: string }
    css?: JSX.CSSProperties
  }
>

const Stack = (props: StackProps & { direction: "row" | "column" }) => {
  const [local, others] = splitProps(props, [
    "class",
    "style",
    "children",
    "direction",
    "spacing",
    "gap",
    "alignItems",
    "justifyContent",
    "w",
    "width",
    "h",
    "minW",
    "maxW",
    "minH",
    "maxH",
    "p",
    "px",
    "py",
    "m",
    "mt",
    "mb",
    "ml",
    "mr",
    "my",
    "mx",
    "wrap",
    "flexWrap",
    "flex",
    "position",
    "pos",
    "transition",
    "overflow",
    "overflowX",
    "overflowY",
    "color",
    "rounded",
    "shadow",
    "pl",
    "pr",
    "bg",
    "background",
    "border",
    "_hover",
    "css",
  ])
  return (
    <div
      {...others}
      class={`app-stack app-stack--${local.direction}${typeof local.wrap === "object" ? " app-stack--responsive-wrap" : ""}${typeof local.w === "object" ? " app-stack--responsive-width" : ""}${local._hover?.border ? " app-stack--hover-border" : ""}${local.class ? ` ${local.class}` : ""}`}
      style={
        {
          ...(local.css ?? {}),
          ...(local.style ?? {}),
          display: "flex",
          "flex-direction": local.direction,
          gap: token(local.gap ?? local.spacing, "space"),
          "align-items": local.alignItems,
          "justify-content": local.justifyContent,
          width: token(
            typeof local.w === "object"
              ? local.w["@initial"]
              : (local.w ?? local.width),
            "sizes",
          ),
          height: token(local.h, "sizes"),
          "min-width": token(local.minW, "sizes"),
          "max-width": token(local.maxW, "sizes"),
          "min-height": token(local.minH, "sizes"),
          "max-height": token(local.maxH, "sizes"),
          padding: token(local.p, "space"),
          "padding-left": token(local.px, "space"),
          "padding-right": token(local.px, "space"),
          "padding-inline-start": token(local.pl, "space"),
          "padding-inline-end": token(local.pr, "space"),
          "padding-top": token(local.py, "space"),
          "padding-bottom": token(local.py, "space"),
          margin: token(local.m, "space"),
          "margin-top": token(local.mt ?? local.my, "space"),
          "margin-bottom": token(local.mb ?? local.my, "space"),
          "margin-left": token(local.ml ?? local.mx, "space"),
          "margin-right": token(local.mr ?? local.mx, "space"),
          "flex-wrap":
            local.flexWrap ??
            (typeof local.wrap === "object"
              ? (local.wrap["@initial"] as JSX.CSSProperties["flex-wrap"])
              : local.wrap),
          flex: local.flex,
          position: local.position ?? local.pos,
          transition: local.transition,
          overflow: local.overflow,
          "overflow-x": local.overflowX,
          "overflow-y": local.overflowY,
          color: token(local.color, "colors"),
          "border-radius": token(local.rounded, "radii"),
          "box-shadow": token(local.shadow, "shadows"),
          background: cssTokens(local.bg ?? local.background),
          border: cssTokens(local.border),
          "--app-stack-hover-border": cssTokens(local._hover?.border),
        } as any
      }
    >
      {local.children}
    </div>
  )
}

export const AppHStack = (props: StackProps) => (
  <Stack {...props} direction="row" />
)

export const AppVStack = (props: StackProps) => (
  <Stack {...props} direction="column" />
)
