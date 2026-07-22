import { Toast } from "@kobalte/core/toast"
import type { JSXElement } from "solid-js"
import "./toast.css"

export type ToastStatus = "success" | "danger" | "info" | "warning"

export interface AppToastProps {
  toastId: number
  status?: ToastStatus
  title?: string
  children?: JSXElement
}

const StatusIcon = (props: { status: ToastStatus }) => {
  const paths = {
    success:
      "M16 2a14 14 0 1 0 14 14A14 14 0 0 0 16 2Zm-2 19.59l-5-5L10.59 15L14 18.41L21.41 11l1.596 1.586Z",
    info: "M16 2a14 14 0 1 0 14 14A14 14 0 0 0 16 2Zm0 6a1.5 1.5 0 1 1-1.5 1.5A1.5 1.5 0 0 1 16 8Zm4 16.125h-8v-2.25h2.875v-5.75H13v-2.25h4.125v8H20Z",
    warning:
      "M29.49 29.87A1 1 0 0 1 29 30H3a1 1 0 0 1-.887-1.462l13-25a1 1 0 0 1 1.774 0l13 25a1 1 0 0 1-.397 1.332ZM17.125 21v-9h-2.25v9h2.25ZM16 26a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z",
    danger:
      "M16 2C8.3 2 2 8.3 2 16s6.3 14 14 14 14-6.3 14-14S23.7 2 16 2Zm-1.1 6h2.2v11h-2.2V8ZM16 25a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z",
  }
  return (
    <svg class="app-toast__icon" viewBox="0 0 32 32" aria-hidden="true">
      <path fill="currentColor" d={paths[props.status]} />
    </svg>
  )
}

export const AppToast = (props: AppToastProps) => (
  <Toast
    toastId={props.toastId}
    priority={props.status === "danger" ? "high" : "low"}
    class="app-toast"
    data-status={props.status ?? "custom"}
  >
    {props.status && <StatusIcon status={props.status} />}
    <div class="app-toast__content">
      {props.title ? (
        <Toast.Title class="app-toast__title">{props.title}</Toast.Title>
      ) : (
        props.children
      )}
    </div>
    <Toast.CloseButton class="app-toast__close" aria-label="Close notification">
      <span aria-hidden="true">×</span>
    </Toast.CloseButton>
  </Toast>
)

export const AppToastRegion = () => (
  <Toast.Region
    duration={3000}
    limit={5}
    pauseOnInteraction
    pauseOnPageIdle
    swipeDirection="right"
    class="app-toast-region"
  >
    <Toast.List class="app-toast-list" />
  </Toast.Region>
)
