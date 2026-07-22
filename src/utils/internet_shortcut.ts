import { parse } from "ini"
import { recordKeysToLowerCase } from "./convert"

export const parseInternetShortcutUrl = (content: string): string | null => {
  try {
    const config = recordKeysToLowerCase(parse(content))
    const value = config.internetshortcut?.url
    if (typeof value !== "string") return null

    const url = new URL(value)
    return url.protocol === "http:" || url.protocol === "https:"
      ? url.href
      : null
  } catch {
    return null
  }
}
