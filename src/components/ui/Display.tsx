import type { JSX, ParentProps } from "solid-js"
import "./display.css"

const token = (value: string | undefined, group: string) =>
  value?.startsWith("$") ? `var(--hope-${group}-${value.slice(1)})` : value

export const AppSkeleton = (props: {
  w?: string
  h?: string
  rounded?: string
}) => (
  <div
    aria-hidden="true"
    class="app-skeleton"
    style={{
      width: token(props.w, "sizes"),
      height: token(props.h, "sizes"),
      "border-radius": token(props.rounded, "radii"),
    }}
  />
)

export const AppDivider = () => <hr class="app-divider" />

export const AppBadge = (
  props: ParentProps<{
    colorScheme?: string
    ml?: string
    css?: JSX.CSSProperties | Record<string, string>
  }>,
) => (
  <span
    class="app-badge"
    style={{
      ...(props.css as JSX.CSSProperties),
      "margin-left": token(props.ml, "space"),
      background: `var(--hope-colors-${props.colorScheme ?? "neutral"}3)`,
      color: `var(--hope-colors-${props.colorScheme ?? "neutral"}11)`,
    }}
  >
    {props.children}
  </span>
)

export const AppAlert = (
  props: ParentProps<{
    status?: string
    w?: string
    flexDirection?: {
      "@initial"?: JSX.CSSProperties["flex-direction"]
      "@lg"?: JSX.CSSProperties["flex-direction"]
    }
  }>,
) => (
  <div
    role="alert"
    class={`app-alert app-alert--${props.status ?? "info"}${props.flexDirection ? " app-alert--responsive" : ""}`}
    style={{
      width: token(props.w, "sizes"),
      "flex-direction": props.flexDirection?.["@initial"],
      "--app-alert-direction-lg": props.flexDirection?.["@lg"],
    }}
  >
    {props.children}
  </div>
)

export const AppAlertIcon = (props: { mr?: string }) => (
  <span
    aria-hidden="true"
    class="app-alert__icon"
    style={{ "margin-right": token(props.mr, "space") }}
  >
    !
  </span>
)

export const AppAlertTitle = (props: ParentProps<{ mr?: string }>) => (
  <strong style={{ "margin-right": token(props.mr, "space") }}>
    {props.children}
  </strong>
)

export const AppAlertDescription = (props: ParentProps) => (
  <span>{props.children}</span>
)
