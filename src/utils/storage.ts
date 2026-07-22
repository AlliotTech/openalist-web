import { makePersisted, type SyncStorage } from "@solid-primitives/storage"
import { createSignal } from "solid-js"

interface StorageSignalOptions<T> {
  storage?: SyncStorage
  serializer?: (value: T) => string
  deserializer?: (value: string) => T
}

export function createStorageSignal<T>(
  name: string,
  initialValue: T,
  options: StorageSignalOptions<T> = {},
) {
  return makePersisted(createSignal(initialValue), {
    name,
    storage: options.storage ?? localStorage,
    serialize: options.serializer ?? ((value) => String(value)),
    deserialize:
      options.deserializer ?? ((value: string) => value as unknown as T),
  })
}
