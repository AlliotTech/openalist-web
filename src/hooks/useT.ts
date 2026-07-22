import { translate } from "~/app/i18n"
import type { BaseTemplateArgs } from "@solid-primitives/i18n"
import { firstUpperCase } from "~/utils"

const useT = () => {
  return (
    key: string,
    params?: BaseTemplateArgs | undefined,
    defaultValue?: string | undefined,
  ) => {
    const value = translate(key, params) ?? defaultValue
    if (!value) {
      if (import.meta.env.DEV) return key
      let lastDotIndex = key.lastIndexOf(".")
      if (lastDotIndex === key.length - 1) {
        lastDotIndex = key.lastIndexOf(".", lastDotIndex - 1)
      }
      const last = key.slice(lastDotIndex + 1)
      return firstUpperCase(last).split("_").join(" ")
    }
    return value
  }
}

export { useT }
