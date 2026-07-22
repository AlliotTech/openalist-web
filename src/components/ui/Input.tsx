import { splitProps, type JSX } from "solid-js"
import "./input.css"

type SharedInputProps = {
  class?: string
  style?: JSX.CSSProperties
  size?: string
  w?: string
  width?: string
  background?: string
  display?: string
  flexGrow?: JSX.CSSProperties["flex-grow"]
  invalid?: boolean
}

export type AppInputProps = Omit<
  JSX.InputHTMLAttributes<HTMLInputElement>,
  "size" | "width" | "style" | "class"
> &
  SharedInputProps

export type AppTextareaProps = Omit<
  JSX.TextareaHTMLAttributes<HTMLTextAreaElement>,
  "style" | "class"
> &
  SharedInputProps

const resolveToken = (value: string | undefined, prefix: string) =>
  value?.startsWith("$") ? `var(--hope-${prefix}-${value.slice(1)})` : value

const inputClass = (className: string | undefined, size: string | undefined) =>
  `app-input${size ? ` app-input--${size}` : ""}${className ? ` ${className}` : ""}`

export const AppInput = (props: AppInputProps) => {
  const [local, others] = splitProps(props, [
    "class",
    "style",
    "size",
    "w",
    "width",
    "background",
    "display",
    "flexGrow",
    "invalid",
  ])
  return (
    <input
      {...others}
      aria-invalid={local.invalid ? "true" : undefined}
      class={inputClass(local.class, local.size)}
      style={{
        ...(local.style ?? {}),
        width: resolveToken(local.w ?? local.width, "sizes"),
        background: resolveToken(local.background, "colors"),
        display: local.display,
        "flex-grow": local.flexGrow,
      }}
    />
  )
}

export const AppTextarea = (props: AppTextareaProps) => {
  const [local, others] = splitProps(props, [
    "class",
    "style",
    "size",
    "w",
    "width",
    "background",
    "display",
    "flexGrow",
    "invalid",
  ])
  return (
    <textarea
      {...others}
      aria-invalid={local.invalid ? "true" : undefined}
      class={`${inputClass(local.class, local.size)} app-textarea`}
      style={{
        ...(local.style ?? {}),
        width: resolveToken(local.w ?? local.width, "sizes"),
        background: resolveToken(local.background, "colors"),
        display: local.display,
        "flex-grow": local.flexGrow,
      }}
    />
  )
}
