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
