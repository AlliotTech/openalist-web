import {
  createContext,
  createEffect,
  createSignal,
  useContext,
  type Accessor,
  type ParentProps,
} from "solid-js"

export type ColorMode = "light" | "dark"

const STORAGE_KEY = "hope-ui-color-mode"

const initialColorMode = (): ColorMode => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === "light" || stored === "dark") return stored
  } catch {}
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light"
}

type ColorModeContextValue = {
  colorMode: Accessor<ColorMode>
  setColorMode: (value: ColorMode) => void
  toggleColorMode: () => void
}

const ColorModeContext = createContext<ColorModeContextValue>()

export const AppColorModeProvider = (props: ParentProps) => {
  const [colorMode, setMode] = createSignal<ColorMode>(initialColorMode())
  const setColorMode = (value: ColorMode) => {
    setMode(value)
    try {
      localStorage.setItem(STORAGE_KEY, value)
    } catch {}
  }
  const toggleColorMode = () =>
    setColorMode(colorMode() === "dark" ? "light" : "dark")

  createEffect(() => {
    const dark = colorMode() === "dark"
    document.body.classList.toggle("hope-ui-dark", dark)
    document.body.classList.toggle("hope-ui-light", !dark)
  })

  return (
    <ColorModeContext.Provider
      value={{ colorMode, setColorMode, toggleColorMode }}
    >
      {props.children}
    </ColorModeContext.Provider>
  )
}

export const useColorMode = () => {
  const context = useContext(ColorModeContext)
  if (!context) throw new Error("useColorMode must be used within a provider")
  return context
}

export const useColorModeValue = <T, U>(light: T, dark: U) => {
  const { colorMode } = useColorMode()
  return () => (colorMode() === "dark" ? dark : light)
}
