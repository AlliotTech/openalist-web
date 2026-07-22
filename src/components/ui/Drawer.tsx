import { Dialog } from "@kobalte/core/dialog"
import type { JSXElement } from "solid-js"
import "./drawer.css"

export interface AppDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  placement: "left" | "right"
  title: JSXElement
  children: JSXElement
}

export const AppDrawer = (props: AppDrawerProps) => (
  <Dialog open={props.open} onOpenChange={props.onOpenChange} modal>
    <Dialog.Portal>
      <Dialog.Overlay class="app-drawer__overlay" />
      <Dialog.Content
        class="app-drawer__content"
        data-placement={props.placement}
      >
        <header class="app-drawer__header">
          <Dialog.Title class="app-drawer__title">{props.title}</Dialog.Title>
          <Dialog.CloseButton
            class="app-drawer__close"
            aria-label="Close drawer"
          >
            <span aria-hidden="true">×</span>
          </Dialog.CloseButton>
        </header>
        <div class="app-drawer__body">{props.children}</div>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog>
)
