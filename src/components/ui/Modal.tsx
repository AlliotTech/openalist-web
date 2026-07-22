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
  size: ResponsiveModalSize
  scrollBehavior: AppModalScrollBehavior
}

const ModalContext = createContext<ModalContextValue>()

type AppModalSize =
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "4xl"
  | "5xl"
  | "6xl"
  | "7xl"
  | "8xl"
  | "full"

type ResponsiveModalSize =
  | AppModalSize
  | {
      "@initial"?: AppModalSize
      "@sm"?: AppModalSize
      "@md"?: AppModalSize
      "@lg"?: AppModalSize
      "@xl"?: AppModalSize
      "@2xl"?: AppModalSize
    }

type AppModalScrollBehavior = "inside" | "outside"

export interface AppModalProps {
  opened: boolean
  onClose: () => void
  blockScrollOnMount?: boolean
  initialFocus?: string
  closeOnOverlayClick?: boolean
  closeOnEsc?: boolean
  size?: ResponsiveModalSize
  scrollBehavior?: AppModalScrollBehavior
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
        size: props.size ?? "md",
        scrollBehavior: props.scrollBehavior ?? "outside",
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
  const [local, others] = splitProps(props, ["class", "children", "style"])
  const size = () => context?.size ?? "md"
  const initialSize = () =>
    typeof size() === "object" ? ((size() as any)["@initial"] ?? "md") : size()
  const sizeToken = (value: AppModalSize | undefined) =>
    value === "full"
      ? "100vw"
      : value
        ? `var(--hope-sizes-${value})`
        : undefined
  return (
    <Dialog.Content
      {...others}
      class={`app-modal__content${typeof size() === "object" ? " app-modal__content--responsive" : ""} ${local.class ?? ""}`}
      data-size={initialSize()}
      data-scroll-behavior={context?.scrollBehavior ?? "outside"}
      style={
        {
          ...(typeof local.style === "object" ? local.style : {}),
          "--app-modal-size-initial": sizeToken(
            typeof size() === "object"
              ? (size() as any)["@initial"]
              : undefined,
          ),
          "--app-modal-size-sm": sizeToken(
            typeof size() === "object" ? (size() as any)["@sm"] : undefined,
          ),
          "--app-modal-size-md": sizeToken(
            typeof size() === "object" ? (size() as any)["@md"] : undefined,
          ),
          "--app-modal-size-lg": sizeToken(
            typeof size() === "object" ? (size() as any)["@lg"] : undefined,
          ),
          "--app-modal-size-xl": sizeToken(
            typeof size() === "object" ? (size() as any)["@xl"] : undefined,
          ),
          "--app-modal-size-2xl": sizeToken(
            typeof size() === "object" ? (size() as any)["@2xl"] : undefined,
          ),
        } as JSX.CSSProperties
      }
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
  const context = useContext(ModalContext)
  const [local, others] = splitProps(props, ["class", "children"])
  return (
    <div
      {...others}
      class={`app-modal__body ${local.class ?? ""}`}
      data-scroll-behavior={context?.scrollBehavior ?? "outside"}
    >
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
