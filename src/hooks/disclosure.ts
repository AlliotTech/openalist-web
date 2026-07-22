import { createSignal } from "solid-js"

export interface DisclosureOptions {
  defaultIsOpen?: boolean
  onOpen?: () => void
  onClose?: () => void
}

export const createDisclosure = (options: DisclosureOptions = {}) => {
  const [isOpen, setIsOpen] = createSignal(options.defaultIsOpen ?? false)

  const onOpen = () => {
    setIsOpen(true)
    options.onOpen?.()
  }
  const onClose = () => {
    setIsOpen(false)
    options.onClose?.()
  }
  const onToggle = () => {
    if (isOpen()) onClose()
    else onOpen()
  }

  return { isOpen, onOpen, onClose, onToggle }
}
