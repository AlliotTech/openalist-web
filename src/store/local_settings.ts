import { createStore } from "solid-js/store"
import { isMobile } from "~/utils/compatibility"

const initialStorage = Object.fromEntries(
  Array.from({ length: localStorage.length }, (_, index) => {
    const key = localStorage.key(index)!
    return [key, localStorage.getItem(key) ?? ""]
  }),
)
const [local, setLocalStore] =
  createStore<Record<string, string>>(initialStorage)

const setLocal = (key: string, value: string) => {
  localStorage.setItem(key, value)
  setLocalStore(key, value)
}

const remove = (key: string) => {
  localStorage.removeItem(key)
  setLocalStore(key, undefined!)
}

const clear = () => {
  localStorage.clear()
  for (const key of Object.keys(local)) {
    setLocalStore(key, undefined!)
  }
}

const toJSON = () => ({ ...local })
// export function isValidKey(
//   key: string | number | symbol,
//   object: object
// ): key is keyof typeof object {
//   return key in object
// }

export interface LocalSetting {
  key: string
  default: string
  type?: "select" | "boolean" | "number"
  options?: string[] | (() => string[])
  hidden?: boolean
}

export const initialLocalSettings: LocalSetting[] = [
  {
    key: "aria2_rpc_url",
    default: "http://localhost:6800/jsonrpc",
  },
  {
    key: "aria2_rpc_secret",
    default: "",
  },
  {
    key: "global_default_layout",
    default: "list",
    type: "select",
    options: ["list", "grid", "image"],
  },
  {
    key: "show_folder_in_image_view",
    default: "top",
    type: "select",
    options: ["top", "bottom", "none"],
  },
  {
    key: "show_sidebar",
    default: "none",
    type: "select",
    options: ["none", "visible"],
  },
  {
    key: "position_of_header_navbar",
    default: "static",
    type: "select",
    options: ["static", "sticky", "only_navbar_sticky"],
  },
  {
    key: "grid_item_size",
    default: "90",
    type: "number",
  },
  {
    key: "list_item_filename_overflow",
    default: "ellipsis",
    type: "select",
    options: ["ellipsis", "scrollable", "multi_line"],
  },
  {
    key: "open_item_on_checkbox",
    default: "direct",
    type: "select",
    options: ["direct", "dblclick", "disable_while_checked"],
  },
]
for (const setting of initialLocalSettings) {
  if (!local[setting.key]) {
    setLocal(setting.key, setting.default)
  }
}

export { local, setLocal, remove, clear, toJSON }
