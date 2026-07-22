import { Dialog } from "@kobalte/core/dialog"
import {
  createContext,
  splitProps,
  useContext,
  type JSX,
  type JSXElement,
} from "solid-js"
import "./modal.css"

interface ModalContextValue {
  initialFocus?: string
  closeOnOverlayClick: boolean
  closeOnEsc: boolean
}

const ModalContext = createContext<ModalContextValue>()

export interface AppModalProps {
  opened: boolean
  onClose: () => void
  blockScrollOnMount?: boolean
  initialFocus?: string
  closeOnOverlayClick?: boolean
  closeOnEsc?: boolean
  size?: unknown
  scrollBehavior?: unknown
  children: JSXElement
}

export const AppModal = (props: AppModalProps) => (
  <Dialog
    open={props.opened}
    onOpenChange={(open) => {
      if (!open) props.onClose()
    }}
    preventScroll={props.blockScrollOnMount !== false}
  >
    <ModalContext.Provider
      value={{
        initialFocus: props.initialFocus,
        closeOnOverlayClick: props.closeOnOverlayClick !== false,
        closeOnEsc: props.closeOnEsc !== false,
      }}
    >
      <Dialog.Portal>{props.children}</Dialog.Portal>
    </ModalContext.Provider>
  </Dialog>
)

export const AppModalOverlay = (props: JSX.HTMLAttributes<HTMLDivElement>) => (
  <Dialog.Overlay
    {...props}
    class={`app-modal__overlay ${props.class ?? ""}`}
  />
)

export const AppModalContent = (
  props: JSX.HTMLAttributes<HTMLDivElement> & { children: JSXElement },
) => {
  const context = useContext(ModalContext)
  const [local, others] = splitProps(props, ["class", "children"])
  return (
    <Dialog.Content
      {...others}
      class={`app-modal__content ${local.class ?? ""}`}
      onOpenAutoFocus={(event) => {
        if (!context?.initialFocus) return
        const target = document.querySelector<HTMLElement>(context.initialFocus)
        if (!target) return
        event.preventDefault()
        target.focus()
      }}
      onPointerDownOutside={(event) => {
        if (!context?.closeOnOverlayClick) event.preventDefault()
      }}
      onEscapeKeyDown={(event) => {
        if (!context?.closeOnEsc) event.preventDefault()
      }}
    >
      {local.children}
    </Dialog.Content>
  )
}

export const AppModalHeader = (
  props: JSX.HTMLAttributes<HTMLHeadingElement> & { children: JSXElement },
) => {
  const [local, others] = splitProps(props, ["class", "children"])
  return (
    <Dialog.Title {...others} class={`app-modal__header ${local.class ?? ""}`}>
      {local.children}
    </Dialog.Title>
  )
}

export const AppModalBody = (
  props: JSX.HTMLAttributes<HTMLDivElement> & { children: JSXElement },
) => {
  const [local, others] = splitProps(props, ["class", "children"])
  return (
    <div {...others} class={`app-modal__body ${local.class ?? ""}`}>
      {local.children}
    </div>
  )
}

export const AppModalFooter = (
  props: JSX.HTMLAttributes<HTMLDivElement> & { children: JSXElement },
) => {
  const [local, others] = splitProps(props, ["class", "children"])
  return (
    <div {...others} class={`app-modal__footer ${local.class ?? ""}`}>
      {local.children}
    </div>
  )
}

export const AppModalCloseButton = () => (
  <Dialog.CloseButton class="app-modal__close" aria-label="Close dialog">
    ×
  </Dialog.CloseButton>
)
