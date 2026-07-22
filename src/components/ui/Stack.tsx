import { splitProps, type JSX, type ParentProps } from "solid-js"

const token = (value: string | number | undefined, group: string) => {
  if (typeof value === "number") return `${value}px`
  if (typeof value !== "string") return value
  return value.startsWith("$")
    ? `var(--hope-${group}-${value.slice(1)})`
    : value
}

type StackProps = ParentProps<
  Omit<JSX.HTMLAttributes<HTMLDivElement>, "style"> & {
    style?: JSX.CSSProperties
    spacing?: string
    gap?: string
    alignItems?: JSX.CSSProperties["align-items"]
    justifyContent?: JSX.CSSProperties["justify-content"]
    w?: string
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
    wrap?: JSX.CSSProperties["flex-wrap"]
    flexWrap?: JSX.CSSProperties["flex-wrap"]
    flex?: string | number
    overflow?: JSX.CSSProperties["overflow"]
    overflowX?: JSX.CSSProperties["overflow-x"]
    overflowY?: JSX.CSSProperties["overflow-y"]
    color?: string
    rounded?: string
    shadow?: string
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
    "overflow",
    "overflowX",
    "overflowY",
    "color",
    "rounded",
    "shadow",
  ])
  return (
    <div
      {...others}
      class={`app-stack app-stack--${local.direction}${local.class ? ` ${local.class}` : ""}`}
      style={
        {
          ...(local.style ?? {}),
          display: "flex",
          "flex-direction": local.direction,
          gap: token(local.gap ?? local.spacing, "space"),
          "align-items": local.alignItems,
          "justify-content": local.justifyContent,
          width: token(local.w, "sizes"),
          height: token(local.h, "sizes"),
          "min-width": token(local.minW, "sizes"),
          "max-width": token(local.maxW, "sizes"),
          "min-height": token(local.minH, "sizes"),
          "max-height": token(local.maxH, "sizes"),
          padding: token(local.p, "space"),
          "padding-left": token(local.px, "space"),
          "padding-right": token(local.px, "space"),
          "padding-top": token(local.py, "space"),
          "padding-bottom": token(local.py, "space"),
          margin: token(local.m, "space"),
          "margin-top": token(local.mt ?? local.my, "space"),
          "margin-bottom": token(local.mb ?? local.my, "space"),
          "margin-left": token(local.ml ?? local.mx, "space"),
          "margin-right": token(local.mr ?? local.mx, "space"),
          "flex-wrap": local.flexWrap ?? local.wrap,
          flex: local.flex,
          overflow: local.overflow,
          "overflow-x": local.overflowX,
          "overflow-y": local.overflowY,
          color: token(local.color, "colors"),
          "border-radius": token(local.rounded, "radii"),
          "box-shadow": token(local.shadow, "shadows"),
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
