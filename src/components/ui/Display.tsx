import { createContext, useContext, type JSX, type ParentProps } from "solid-js"
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
      background: `var(--hope-colors-${props.colorScheme ?? "neutral"}4)`,
      color: `var(--hope-colors-${props.colorScheme ?? "neutral"}${props.colorScheme ? "11" : "12"})`,
    }}
  >
    {props.children}
  </span>
)

const AlertStatusContext = createContext("info")

export const AppAlert = (
  props: ParentProps<{
    status?: string
    w?: string
    flexDirection?: {
      "@initial"?: JSX.CSSProperties["flex-direction"]
      "@lg"?: JSX.CSSProperties["flex-direction"]
    }
  }>,
) => {
  const status = props.status ?? "info"
  return (
    <AlertStatusContext.Provider value={status}>
      <div
        role="alert"
        class={`app-alert app-alert--${status}${props.flexDirection ? " app-alert--responsive" : ""}`}
        style={{
          width: token(props.w, "sizes"),
          "--app-alert-direction-initial": props.flexDirection?.["@initial"],
          "--app-alert-direction-lg": props.flexDirection?.["@lg"],
        }}
      >
        {props.children}
      </div>
    </AlertStatusContext.Provider>
  )
}

export const AppAlertIcon = (props: { mr?: string }) => {
  const status = useContext(AlertStatusContext)
  const paths: Record<string, JSX.Element> = {
    success: (
      <path
        fill="currentColor"
        d="M16 2a14 14 0 1 0 14 14A14 14 0 0 0 16 2Zm-2 19.59l-5-5L10.59 15L14 18.41L21.41 11l1.596 1.586Z"
      />
    ),
    warning: (
      <path
        fill="currentColor"
        d="M29.49 29.87A1 1 0 0 1 29 30H3a1 1 0 0 1-.887-1.462l13-25a1 1 0 0 1 1.774 0l13 25a1 1 0 0 1-.397 1.332ZM17.125 21v-9h-2.25v9h2.25ZM16 26a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"
      />
    ),
    danger: (
      <path
        fill="currentColor"
        d="M16 2C8.3 2 2 8.3 2 16s6.3 14 14 14 14-6.3 14-14S23.7 2 16 2Zm-1.1 6h2.2v11h-2.2V8ZM16 25a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z"
      />
    ),
    info: (
      <path
        fill="currentColor"
        d="M16 2a14 14 0 1 0 14 14A14 14 0 0 0 16 2Zm0 6a1.5 1.5 0 1 1-1.5 1.5A1.5 1.5 0 0 1 16 8Zm4 16.125h-8v-2.25h2.875v-5.75H13v-2.25h4.125v8H20Z"
      />
    ),
  }
  return (
    <svg
      aria-hidden="true"
      class="app-alert__icon"
      viewBox="0 0 32 32"
      style={{ "margin-right": token(props.mr, "space") }}
    >
      {paths[status] ?? paths.info}
    </svg>
  )
}

export const AppAlertTitle = (props: ParentProps<{ mr?: string }>) => (
  <strong
    class="app-alert__title"
    style={{ "margin-right": token(props.mr, "space") }}
  >
    {props.children}
  </strong>
)

export const AppAlertDescription = (props: ParentProps) => (
  <span class="app-alert__description">{props.children}</span>
)

export const AppKbd = (props: ParentProps) => (
  <kbd class="app-kbd">{props.children}</kbd>
)

export const AppList = (
  props: ParentProps<{
    maxH?: string
    overflowY?: JSX.CSSProperties["overflow-y"]
  }>,
) => (
  <ul
    class="app-list"
    style={{
      "max-height": token(props.maxH, "sizes"),
      "overflow-y": props.overflowY,
    }}
  >
    {props.children}
  </ul>
)

export const AppListItem = (
  props: ParentProps<{ pl?: number | string; m?: number | string }>,
) => (
  <li
    style={{
      "padding-left":
        typeof props.pl === "number"
          ? `${props.pl}px`
          : token(props.pl, "space"),
      margin:
        typeof props.m === "number" ? `${props.m}px` : token(props.m, "space"),
    }}
  >
    {props.children}
  </li>
)
