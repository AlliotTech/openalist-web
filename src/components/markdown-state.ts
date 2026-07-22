import { createSignal } from "solid-js"
import { createStorageSignal } from "~/utils/storage"

export const [isTocVisible, setTocVisible] = createSignal(false)

export const [isTocDisabled, setTocDisabled] = createStorageSignal(
  "isMarkdownTocDisabled",
  true,
  {
    serializer: (value: boolean) => JSON.stringify(value),
    deserializer: (value) => JSON.parse(value),
  },
)
