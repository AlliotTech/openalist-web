import { splitProps, type JSX, type ParentProps } from "solid-js"
import { Dynamic } from "solid-js/web"
import "./typography.css"

const token = (value: string | number | undefined, group: string) => {
  if (typeof value === "number") return `${value}px`
  return value?.startsWith("$")
    ? `var(--hope-${group}-${value.slice(1)})`
    : value
}

const colors = (value: string | undefined) =>
  value?.replace(/\$([\w]+)/g, "var(--hope-colors-$1)")

const sizeLineHeight = (value: string | undefined) => {
  const lineHeights: Record<string, string> = {
    xs: "$4",
    sm: "$5",
    base: "$6",
    lg: "$7",
    xl: "$7",
    "2xl": "$8",
    "3xl": "$9",
    "4xl": "$10",
    "5xl": "$none",
    "6xl": "$none",
    "7xl": "$none",
    "8xl": "$none",
    "9xl": "$none",
  }
  return token(lineHeights[value ?? ""], "lineHeights")
}

const normalizeCss = (value: Record<string, unknown> | undefined) =>
  Object.fromEntries(
    Object.entries(value ?? {}).map(([key, item]) => [
      key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`),
      item,
    ]),
  )

type ResponsiveValue =
  string | number | { "@initial"?: string | number; "@md"?: string | number }

type TypeProps = ParentProps<{
  as?: any
  class?: string
  href?: string
  target?: string
  title?: string
  css?: JSX.CSSProperties | Record<string, unknown>
  color?: string
  size?: string
  fontSize?: string
  fontWeight?: string
  fontStyle?: JSX.CSSProperties["font-style"]
  textAlign?: JSX.CSSProperties["text-align"]
  w?: ResponsiveValue
  display?: ResponsiveValue
  overflow?: JSX.CSSProperties["overflow"]
  cursor?: JSX.CSSProperties["cursor"]
  p?: string
  px?: string
  pl?: string
  pr?: string
  m?: string
  mt?: string
  mb?: string
  ml?: string
  mr?: string
  my?: string
  rounded?: string
  bgColor?: string
  transition?: string
  _hover?: { color?: string; bgColor?: string }
  onClick?: JSX.EventHandlerUnion<HTMLElement, MouseEvent>
}>

const Type = (props: TypeProps & { element: "p" | "h2" }) => {
  const [local, others] = splitProps(props, [
    "as",
    "class",
    "children",
    "element",
    "css",
    "color",
    "size",
    "fontSize",
    "fontWeight",
    "fontStyle",
    "textAlign",
    "w",
    "display",
    "overflow",
    "cursor",
    "p",
    "px",
    "pl",
    "pr",
    "m",
    "mt",
    "mb",
    "ml",
    "mr",
    "my",
    "rounded",
    "bgColor",
    "transition",
    "_hover",
  ])
  const responsive =
    typeof local.w === "object" || typeof local.display === "object"
  return (
    <Dynamic
      component={local.as ?? local.element}
      {...others}
      class={`app-type${responsive ? " app-type--responsive" : ""}${local.element === "h2" ? " app-heading" : ""}${local._hover ? " app-type--hover" : ""}${local.class ? ` ${local.class}` : ""}`}
      style={{
        ...normalizeCss(local.css as Record<string, unknown>),
        color: colors(local.color),
        "font-size": token(local.fontSize ?? local.size, "fontSizes"),
        "line-height": sizeLineHeight(local.size),
        "font-weight": token(local.fontWeight, "fontWeights"),
        "font-style": local.fontStyle,
        "text-align": local.textAlign,
        width: token(
          typeof local.w === "object" ? undefined : local.w,
          "sizes",
        ),
        display: typeof local.display === "object" ? undefined : local.display,
        overflow: local.overflow,
        cursor: local.cursor,
        padding: token(local.p, "space"),
        "padding-left": token(local.pl ?? local.px, "space"),
        "padding-right": token(local.pr ?? local.px, "space"),
        margin: token(local.m, "space"),
        "margin-top": token(local.mt ?? local.my, "space"),
        "margin-bottom": token(local.mb ?? local.my, "space"),
        "margin-left": token(local.ml, "space"),
        "margin-right": token(local.mr, "space"),
        "border-radius": token(local.rounded, "radii"),
        background: colors(local.bgColor),
        transition: local.transition,
        "--app-type-hover-color": colors(local._hover?.color),
        "--app-type-hover-background": colors(local._hover?.bgColor),
        "--app-type-width-md": token(
          typeof local.w === "object" ? local.w["@md"] : undefined,
          "sizes",
        ),
        "--app-type-width-initial": token(
          typeof local.w === "object" ? local.w["@initial"] : undefined,
          "sizes",
        ),
        "--app-type-display-md":
          typeof local.display === "object" ? local.display["@md"] : undefined,
        "--app-type-display-initial":
          typeof local.display === "object"
            ? local.display["@initial"]
            : undefined,
      }}
    >
      {local.children}
    </Dynamic>
  )
}

export const AppText = (props: TypeProps) => <Type {...props} element="p" />

export const AppHeading = (props: TypeProps) => <Type {...props} element="h2" />

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
