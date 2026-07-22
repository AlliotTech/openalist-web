import { splitProps, type JSX, type ParentProps } from "solid-js"
import "./form.css"

const token = (value: string | undefined, group: string) =>
  value?.startsWith("$") ? `var(--hope-${group}-${value.slice(1)})` : value

type FormControlProps = ParentProps<
  Omit<JSX.HTMLAttributes<HTMLDivElement>, "style"> & {
    style?: JSX.CSSProperties
    w?: string
    display?: string
    flexDirection?: JSX.CSSProperties["flex-direction"]
    alignItems?: JSX.CSSProperties["align-items"]
    mb?: string
    gap?: string
    rounded?: string
    shadow?: string
    p?: string
    required?: boolean
  }
>

export const AppFormControl = (props: FormControlProps) => {
  const [local, others] = splitProps(props, [
    "class",
    "style",
    "w",
    "display",
    "flexDirection",
    "alignItems",
    "mb",
    "gap",
    "rounded",
    "shadow",
    "p",
    "required",
    "children",
  ])
  return (
    <div
      {...others}
      data-required={local.required ? "true" : undefined}
      class={`app-form-control${local.class ? ` ${local.class}` : ""}`}
      style={{
        ...(local.style ?? {}),
        width: token(local.w, "sizes"),
        display: local.display,
        "flex-direction": local.flexDirection,
        "align-items": local.alignItems,
        "margin-bottom": token(local.mb, "space"),
        gap: token(local.gap, "space"),
        "border-radius": token(local.rounded, "radii"),
        "box-shadow": token(local.shadow, "shadows"),
        padding: token(local.p, "space"),
      }}
    >
      {local.children}
    </div>
  )
}

type FormLabelProps = ParentProps<
  Omit<JSX.LabelHTMLAttributes<HTMLLabelElement>, "for" | "style"> & {
    for?: string
    style?: JSX.CSSProperties
    display?: string
    alignItems?: JSX.CSSProperties["align-items"]
    mb?: string
  }
>

export const AppFormLabel = (props: FormLabelProps) => {
  const [local, others] = splitProps(props, [
    "class",
    "style",
    "for",
    "display",
    "alignItems",
    "mb",
    "children",
  ])
  return (
    <label
      {...others}
      for={local.for}
      class={`app-form-label${local.class ? ` ${local.class}` : ""}`}
      style={{
        ...(local.style ?? {}),
        display: local.display,
        "align-items": local.alignItems,
        "margin-bottom": token(local.mb, "space"),
      }}
    >
      {local.children}
    </label>
  )
}

export const AppFormHelperText = (props: ParentProps) => (
  <div class="app-form-helper-text">{props.children}</div>
)
