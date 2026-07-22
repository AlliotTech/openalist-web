import { createDisclosure } from "~/hooks/disclosure"
import { JSXElement, onCleanup, Show, Suspense } from "solid-js"
import { FullLoading } from "~/components/FullLoading"
import { useT } from "~/hooks"
import {
  AppModal,
  AppModalBody,
  AppModalCloseButton,
  AppModalContent,
  AppModalHeader,
  AppModalOverlay,
} from "~/components/ui/Modal"
import { bus } from "~/utils"

export const ModalWrapper = (props: {
  children: JSXElement
  name: string
  title: string
  blockScrollOnMount?: boolean
}) => {
  const t = useT()
  const handler = (name: string) => {
    if (name === props.name) {
      onOpen()
    }
  }
  bus.on("tool", handler)
  onCleanup(() => {
    bus.off("tool", handler)
  })
  const { isOpen, onOpen, onClose } = createDisclosure()
  return (
    <AppModal
      blockScrollOnMount={props.blockScrollOnMount}
      opened={isOpen()}
      onClose={onClose}
      closeOnOverlayClick={false}
      closeOnEsc={false}
      size={{
        "@initial": "xs",
        "@md": "md",
        "@lg": "lg",
        "@xl": "xl",
        "@2xl": "2xl",
      }}
    >
      <AppModalOverlay />
      <AppModalContent>
        <AppModalCloseButton />
        <AppModalHeader>{t(props.title)}</AppModalHeader>
        <AppModalBody>
          <Show when={isOpen()}>
            <Suspense fallback={<FullLoading />}>{props.children}</Suspense>
          </Show>
        </AppModalBody>
      </AppModalContent>
    </AppModal>
  )
}
