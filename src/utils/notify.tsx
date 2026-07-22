import { toaster } from "@kobalte/core/toast"
import type { JSXElement } from "solid-js"
import { AppToast, type ToastStatus } from "~/components/ui/ToastRegion"
import { firstUpperCase } from "."

const showMessage = (status: ToastStatus, message: string) =>
  toaster.show((props) => (
    <AppToast
      toastId={props.toastId}
      status={status}
      title={firstUpperCase(message)}
    />
  ))

const notify = {
  render: (element: JSXElement) =>
    toaster.show((props) => (
      <AppToast toastId={props.toastId}>{element}</AppToast>
    )),
  success: (message: string) => showMessage("success", message),
  error: (message: string) => showMessage("danger", message),
  info: (message: string) => showMessage("info", message),
  warning: (message: string) => showMessage("warning", message),
}

export { notify }
