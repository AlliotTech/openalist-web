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

export const AppToast = (props: AppToastProps) => (
  <Toast
    toastId={props.toastId}
    priority={props.status === "danger" ? "high" : "low"}
    class="app-toast"
    data-status={props.status ?? "custom"}
  >
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
    <Toast.ProgressTrack class="app-toast__progress-track">
      <Toast.ProgressFill class="app-toast__progress-fill" />
    </Toast.ProgressTrack>
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
