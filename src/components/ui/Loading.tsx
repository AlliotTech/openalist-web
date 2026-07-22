import { splitProps, type JSX } from "solid-js"
import "./loading.css"

const token = (value: string | undefined, group: string) =>
  value?.startsWith("$") ? `var(--hope-${group}-${value.slice(1)})` : value

export type AppSpinnerProps = Omit<
  JSX.HTMLAttributes<HTMLSpanElement>,
  "style"
> & {
  style?: JSX.CSSProperties
  size?: string
  thickness?: string
  speed?: string
  emptyColor?: string
  color?: string
}

export const AppSpinner = (props: AppSpinnerProps) => {
  const [local, others] = splitProps(props, [
    "class",
    "style",
    "size",
    "thickness",
    "speed",
    "emptyColor",
    "color",
  ])
  return (
    <span
      {...others}
      role="status"
      aria-label="Loading"
      class={`app-spinner app-spinner--${local.size ?? "md"}${local.class ? ` ${local.class}` : ""}`}
      style={{
        ...(local.style ?? {}),
        color: token(local.color, "colors"),
        "border-width": local.thickness,
        "border-bottom-color": token(local.emptyColor, "colors"),
        "border-left-color": token(local.emptyColor, "colors"),
        "animation-duration": local.speed,
      }}
    />
  )
}

export type AppProgressProps = Omit<
  JSX.HTMLAttributes<HTMLDivElement>,
  "style"
> & {
  style?: JSX.CSSProperties
  value?: number
  indeterminate?: boolean
  size?: string
  w?: string
  trackColor?: string
  color?: string
  mr?: string
  d?: string
  rounded?: string
  position?: JSX.CSSProperties["position"]
  top?: string
  left?: string
  right?: string
  zIndex?: string
}

export const AppProgress = (props: AppProgressProps) => {
  const [local, others] = splitProps(props, [
    "class",
    "style",
    "value",
    "indeterminate",
    "size",
    "w",
    "trackColor",
    "color",
    "mr",
    "d",
    "rounded",
    "position",
    "top",
    "left",
    "right",
    "zIndex",
    "children",
  ])
  const value = () => Math.min(100, Math.max(0, local.value ?? 0))
  return (
    <div
      {...others}
      role="progressbar"
      aria-valuenow={local.indeterminate ? undefined : value()}
      aria-valuemin="0"
      aria-valuemax="100"
      class={`app-progress app-progress--${local.size ?? "md"}${local.indeterminate ? " app-progress--indeterminate" : ""}${local.class ? ` ${local.class}` : ""}`}
      style={{
        ...(local.style ?? {}),
        width: token(local.w, "sizes"),
        background: token(local.trackColor, "colors"),
        "margin-right": token(local.mr, "space"),
        "border-radius": token(local.rounded, "radii"),
        display: local.d,
        position: local.position,
        top: local.top,
        left: local.left,
        right: local.right,
        "z-index": token(local.zIndex, "zIndices"),
      }}
    >
      <div
        class="app-progress__indicator"
        style={{
          width: local.indeterminate ? undefined : `${value()}%`,
          background: local.indeterminate
            ? `linear-gradient(to right, transparent 0%, ${token(local.color, "colors") ?? "var(--hope-colors-primary9)"} 50%, transparent 100%)`
            : token(local.color, "colors"),
        }}
      />
    </div>
  )
}
