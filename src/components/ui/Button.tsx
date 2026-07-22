import { Dynamic } from "solid-js/web"
import { splitProps, type JSX, type JSXElement } from "solid-js"
import "./button.css"

export interface AppButtonProps {
  as?: "button" | "a"
  href?: string
  target?: string
  type?: "button" | "submit" | "reset"
  disabled?: boolean
  loading?: boolean
  onClick?: any
  children?: JSXElement
  class?: string
  style?: JSX.CSSProperties
  colorScheme?: string
  variant?: string
  size?: unknown
  w?: string
  width?: string
  display?: string
  px?: string
  my?: string
  mt?: string
  leftIcon?: JSXElement
  rightIcon?: JSXElement
  [key: string]: unknown
}

const resolveSize = (size: unknown) =>
  typeof size === "string" ? ` app-button--${size}` : ""

export const AppButton = (props: AppButtonProps) => {
  const [local, others] = splitProps(props, [
    "as",
    "loading",
    "onClick",
    "children",
    "class",
    "style",
    "colorScheme",
    "variant",
    "size",
    "w",
    "width",
    "display",
    "px",
    "my",
    "mt",
    "leftIcon",
    "rightIcon",
  ])
  const component = () => local.as ?? "button"
  const width = () => local.w ?? local.width

  return (
    <Dynamic
      component={component()}
      {...others}
      disabled={
        component() === "button" ? props.disabled || local.loading : undefined
      }
      aria-disabled={props.disabled || local.loading ? "true" : undefined}
      aria-busy={local.loading ? "true" : undefined}
      onClick={(event: MouseEvent) => {
        if (props.disabled || local.loading) {
          event.preventDefault()
          return
        }
        if (Array.isArray(local.onClick)) local.onClick[0](local.onClick[1])
        else local.onClick?.(event)
      }}
      class={`app-button app-button--${local.colorScheme ?? "primary"}${
        local.variant ? ` app-button--${local.variant}` : ""
      }${resolveSize(local.size)}${local.class ? ` ${local.class}` : ""}`}
      style={{
        ...(local.style ?? {}),
        width: width()?.startsWith("$")
          ? `var(--hope-sizes-${width()!.slice(1)})`
          : width(),
        display: local.display,
        "margin-top": (local.mt ?? local.my)?.startsWith("$")
          ? `var(--hope-space-${(local.mt ?? local.my)!.slice(1)})`
          : (local.mt ?? local.my),
        "margin-bottom": local.my?.startsWith("$")
          ? `var(--hope-space-${local.my.slice(1)})`
          : local.my,
      }}
    >
      {local.loading ? (
        <span class="app-button__spinner" aria-hidden="true" />
      ) : null}
      {local.leftIcon}
      {local.children}
      {local.rightIcon}
    </Dynamic>
  )
}

export const AppIconButton = (
  props: Omit<AppButtonProps, "children"> & {
    icon: JSXElement
    "aria-label": string
    compact?: boolean
  },
) => {
  const [local, others] = splitProps(props, ["icon", "compact", "class"])
  return (
    <AppButton
      {...others}
      class={`app-icon-button${local.class ? ` ${local.class}` : ""}`}
    >
      {local.icon}
    </AppButton>
  )
}
