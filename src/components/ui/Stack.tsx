import { splitProps, type JSX, type ParentProps } from "solid-js"
import { Dynamic } from "solid-js/web"
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

export type AppStackProps = ParentProps<
  Omit<JSX.HTMLAttributes<HTMLDivElement>, "style"> & {
    style?: JSX.CSSProperties
    as?: any
    href?: string
    spacing?: string
    gap?: string
    alignItems?: JSX.CSSProperties["align-items"]
    justifyContent?:
      | JSX.CSSProperties["justify-content"]
      | { "@initial"?: string; "@xl"?: string }
    flexDirection?:
      | JSX.CSSProperties["flex-direction"]
      | {
          "@initial"?: string
          "@sm"?: string
          "@md"?: string
          "@xl"?: string
        }
    columnGap?: string
    fontSize?: string
    w?:
      | string
      | number
      | {
          "@initial"?: string | number
          "@sm"?: string | number
          "@md"?: string | number
          "@lg"?: string | number
        }
    width?: string
    h?: string
    minW?: string | number
    maxW?: string | number
    minH?: string | number
    maxH?: string | number
    p?: string
    px?: string
    py?: string
    pt?: string
    pb?: string
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
    transition?: JSX.CSSProperties["transition"] | Record<string, unknown>
    initial?: unknown
    animate?: unknown
    exit?: unknown
    cursor?: JSX.CSSProperties["cursor"]
    zIndex?: string | number
    top?: string | number
    right?: string | number
    bottom?: string | number
    left?: string | number
    overflow?: JSX.CSSProperties["overflow"]
    overflowX?: JSX.CSSProperties["overflow-x"]
    overflowY?: JSX.CSSProperties["overflow-y"]
    color?: string
    rounded?: string
    shadow?: string
    pl?: string
    pr?: string
    bg?: string
    bgColor?: string
    background?: string
    border?: string
    borderTop?: string
    borderBottom?: string
    borderColor?: string
    _hover?: {
      border?: string
      bgColor?: string
      transform?: string
      boxShadow?: string
    }
    _active?: { transform?: string }
    css?: JSX.CSSProperties
  }
>

const Stack = (props: AppStackProps & { direction: "row" | "column" }) => {
  const [local, others] = splitProps(props, [
    "class",
    "as",
    "style",
    "children",
    "direction",
    "spacing",
    "gap",
    "alignItems",
    "justifyContent",
    "flexDirection",
    "columnGap",
    "fontSize",
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
    "pt",
    "pb",
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
    "cursor",
    "zIndex",
    "top",
    "right",
    "bottom",
    "left",
    "overflow",
    "overflowX",
    "overflowY",
    "color",
    "rounded",
    "shadow",
    "pl",
    "pr",
    "bg",
    "bgColor",
    "background",
    "border",
    "borderTop",
    "borderBottom",
    "borderColor",
    "_hover",
    "_active",
    "css",
  ])
  return (
    <Dynamic
      component={local.as ?? "div"}
      {...others}
      {...(typeof local.transition === "object"
        ? { transition: local.transition }
        : {})}
      class={`app-stack app-stack--${local.direction}${typeof local.wrap === "object" ? " app-stack--responsive-wrap" : ""}${typeof local.w === "object" ? " app-stack--responsive-width" : ""}${typeof local.flexDirection === "object" ? " app-stack--responsive-direction" : ""}${typeof local.justifyContent === "object" ? " app-stack--responsive-justify" : ""}${local._hover ? " app-stack--hover" : ""}${local._active ? " app-stack--active" : ""}${local.class ? ` ${local.class}` : ""}`}
      style={
        {
          ...(local.css ?? {}),
          ...(local.style ?? {}),
          display: "flex",
          "flex-direction":
            typeof local.flexDirection === "object"
              ? undefined
              : (local.flexDirection ?? local.direction),
          gap: token(local.gap ?? local.spacing, "space"),
          "column-gap": token(local.columnGap, "space"),
          "font-size": token(local.fontSize, "fontSizes"),
          "align-items": local.alignItems,
          "justify-content":
            typeof local.justifyContent === "object"
              ? undefined
              : local.justifyContent,
          width: token(
            typeof local.w === "object"
              ? local.width
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
          "padding-top": token(local.pt ?? local.py, "space"),
          "padding-bottom": token(local.pb ?? local.py, "space"),
          margin: token(local.m, "space"),
          "margin-top": token(local.mt ?? local.my, "space"),
          "margin-bottom": token(local.mb ?? local.my, "space"),
          "margin-left": token(local.ml ?? local.mx, "space"),
          "margin-right": token(local.mr ?? local.mx, "space"),
          "flex-wrap":
            local.flexWrap ??
            (typeof local.wrap === "object" ? undefined : local.wrap),
          flex: local.flex,
          position: local.position ?? local.pos,
          transition:
            typeof local.transition === "string" ? local.transition : undefined,
          cursor: local.cursor,
          "z-index": token(local.zIndex, "zIndices"),
          top: token(local.top, "space"),
          right: token(local.right, "space"),
          bottom: token(local.bottom, "space"),
          left: token(local.left, "space"),
          overflow: local.overflow,
          "overflow-x": local.overflowX,
          "overflow-y": local.overflowY,
          color: token(local.color, "colors"),
          "border-radius": token(local.rounded, "radii"),
          "box-shadow": token(local.shadow, "shadows"),
          background: cssTokens(local.bg ?? local.bgColor ?? local.background),
          border: cssTokens(local.border),
          "border-top": cssTokens(local.borderTop),
          "border-bottom": cssTokens(local.borderBottom),
          "border-color": cssTokens(local.borderColor),
          "--app-stack-width-md": token(
            typeof local.w === "object" ? local.w["@md"] : undefined,
            "sizes",
          ),
          "--app-stack-width-sm": token(
            typeof local.w === "object" ? local.w["@sm"] : undefined,
            "sizes",
          ),
          "--app-stack-width-lg": token(
            typeof local.w === "object" ? local.w["@lg"] : undefined,
            "sizes",
          ),
          "--app-stack-width-initial": token(
            typeof local.w === "object" ? local.w["@initial"] : undefined,
            "sizes",
          ),
          "--app-stack-hover-border": cssTokens(local._hover?.border),
          "--app-stack-hover-background": cssTokens(local._hover?.bgColor),
          "--app-stack-hover-transform": local._hover?.transform,
          "--app-stack-hover-shadow": local._hover?.boxShadow,
          "--app-stack-active-transform": local._active?.transform,
          "--app-stack-direction-sm":
            typeof local.flexDirection === "object"
              ? local.flexDirection["@sm"]
              : undefined,
          "--app-stack-direction-md":
            typeof local.flexDirection === "object"
              ? local.flexDirection["@md"]
              : undefined,
          "--app-stack-direction-xl":
            typeof local.flexDirection === "object"
              ? local.flexDirection["@xl"]
              : undefined,
          "--app-stack-direction-initial":
            typeof local.flexDirection === "object"
              ? (local.flexDirection["@initial"] ?? local.direction)
              : undefined,
          "--app-stack-wrap-initial":
            typeof local.wrap === "object" ? local.wrap["@initial"] : undefined,
          "--app-stack-wrap-md":
            typeof local.wrap === "object" ? local.wrap["@md"] : undefined,
          "--app-stack-justify-initial":
            typeof local.justifyContent === "object"
              ? local.justifyContent["@initial"]
              : undefined,
          "--app-stack-justify-xl":
            typeof local.justifyContent === "object"
              ? local.justifyContent["@xl"]
              : undefined,
        } as any
      }
    >
      {local.children}
    </Dynamic>
  )
}

export const AppHStack = (props: AppStackProps) => (
  <Stack {...props} direction="row" alignItems={props.alignItems ?? "center"} />
)

export const AppVStack = (props: AppStackProps) => (
  <Stack
    {...props}
    direction="column"
    alignItems={props.alignItems ?? "center"}
  />
)

export const AppCenter = (props: AppStackProps) => (
  <Stack
    {...props}
    direction="row"
    alignItems={props.alignItems ?? "center"}
    justifyContent={props.justifyContent ?? "center"}
  />
)

export const AppFlex = (
  props: AppStackProps & {
    direction?: AppStackProps["flexDirection"]
  },
) => <Stack {...props} flexDirection={props.direction} direction="row" />
