import {
  createContext,
  createEffect,
  createMemo,
  createSignal,
  onCleanup,
  onMount,
  Show,
  splitProps,
  useContext,
  type JSX,
  type ParentProps,
} from "solid-js"
import { Portal } from "solid-js/web"
import "./context-menu.css"

type MenuId = string | number
type MenuEvent = { props: any; event?: MouseEvent }
type MenuState = {
  event: MouseEvent
  props: any
  position?: { x: number; y: number }
}
type MenuHandler = (state: MenuState) => void

const handlers = new Map<MenuId, MenuHandler>()

export const useContextMenu = (options: { id: MenuId }) => ({
  show: (
    event: MouseEvent,
    next?: { props?: any; position?: { x: number; y: number } },
  ) => {
    event.preventDefault()
    handlers.get(options.id)?.({
      event,
      props: next?.props,
      position: next?.position,
    })
  },
  hideAll: () => handlers.forEach((handler) => handler(null as never)),
})

type ContextValue = {
  props: () => any
  close: () => void
}

const Context = createContext<ContextValue>()

const evaluate = <T,>(
  value: T | ((event: MenuEvent) => T),
  event: MenuEvent,
) =>
  typeof value === "function"
    ? (value as (event: MenuEvent) => T)(event)
    : value

export const Menu = (
  props: ParentProps<{
    id: MenuId
    theme?: string
    class?: string
    style?: string | JSX.CSSProperties
    onShown?: () => void
    onHidden?: () => void
  }>,
) => {
  const [open, setOpen] = createSignal(false)
  const [menuProps, setMenuProps] = createSignal<any>()
  const [position, setPosition] = createSignal({ x: 0, y: 0 })
  let menuRef: HTMLDivElement | undefined

  const close = () => {
    if (!open()) return
    setOpen(false)
    props.onHidden?.()
  }

  onMount(() => {
    handlers.set(props.id, (state) => {
      if (!state) {
        close()
        return
      }
      handlers.forEach((handler, id) => {
        if (id !== props.id) handler(null as never)
      })
      setMenuProps(state.props)
      setPosition(
        state.position ?? { x: state.event.clientX, y: state.event.clientY },
      )
      setOpen(true)
      props.onShown?.()
    })
    onCleanup(() => handlers.delete(props.id))
  })

  createEffect(() => {
    if (!open()) return
    requestAnimationFrame(() => {
      if (!menuRef) return
      const rect = menuRef.getBoundingClientRect()
      setPosition((current) => ({
        x: Math.max(0, Math.min(current.x, window.innerWidth - rect.width)),
        y: Math.max(0, Math.min(current.y, window.innerHeight - rect.height)),
      }))
      menuRef.focus()
    })
  })

  const onPointerDown = (event: PointerEvent) => {
    if (menuRef && !menuRef.contains(event.target as Node)) close()
  }
  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") close()
  }
  onMount(() => {
    document.addEventListener("pointerdown", onPointerDown)
    document.addEventListener("keydown", onKeyDown)
    onCleanup(() => {
      document.removeEventListener("pointerdown", onPointerDown)
      document.removeEventListener("keydown", onKeyDown)
    })
  })

  return (
    <Portal>
      <Show when={open()}>
        <Context.Provider value={{ props: menuProps, close }}>
          <div
            ref={menuRef}
            role="menu"
            tabindex="-1"
            class={`app-context-menu app-context-menu--${props.theme ?? "light"}${props.class ? ` ${props.class}` : ""}`}
            style={{
              ...(typeof props.style === "object" ? props.style : {}),
              left: `${position().x}px`,
              top: `${position().y}px`,
            }}
          >
            {props.children}
          </div>
        </Context.Provider>
      </Show>
    </Portal>
  )
}

export const Item = (
  props: ParentProps<{
    class?: string
    disabled?: boolean | ((event: MenuEvent) => boolean)
    hidden?: boolean | ((event: MenuEvent) => boolean)
    onClick?: (() => void) | ((event: MenuEvent) => void)
  }>,
) => {
  const context = useContext(Context)!
  const [local, others] = splitProps(props, [
    "class",
    "disabled",
    "hidden",
    "onClick",
    "children",
  ])
  const event = createMemo<MenuEvent>(() => ({ props: context.props() }))
  const hidden = () => evaluate(local.hidden ?? false, event())
  const disabled = () => evaluate(local.disabled ?? false, event())
  const activate = () => {
    if (disabled()) return
    ;(local.onClick as ((event: MenuEvent) => void) | undefined)?.(event())
    context.close()
  }
  return (
    <Show when={!hidden()}>
      <div
        {...others}
        role="menuitem"
        tabindex={disabled() ? undefined : "0"}
        aria-disabled={disabled() ? "true" : undefined}
        class={`app-context-menu__item${local.class ? ` ${local.class}` : ""}`}
        onClick={activate}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") activate()
        }}
      >
        {local.children}
      </div>
    </Show>
  )
}

export const Submenu = (
  props: ParentProps<{
    label: JSX.Element
    disabled?: boolean | ((event: MenuEvent) => boolean)
    hidden?: boolean | ((event: MenuEvent) => boolean)
  }>,
) => {
  const context = useContext(Context)!
  const event = createMemo<MenuEvent>(() => ({ props: context.props() }))
  const hidden = () => evaluate(props.hidden ?? false, event())
  const disabled = () => evaluate(props.disabled ?? false, event())
  return (
    <Show when={!hidden()}>
      <div
        class="app-context-menu__submenu"
        role="menuitem"
        aria-haspopup="menu"
        aria-disabled={disabled() ? "true" : undefined}
        tabindex={disabled() ? undefined : "0"}
      >
        <div class="app-context-menu__item app-context-menu__submenu-label">
          {props.label}
          <span aria-hidden="true">›</span>
        </div>
        <div
          class="app-context-menu app-context-menu__submenu-content"
          role="menu"
        >
          {props.children}
        </div>
      </div>
    </Show>
  )
}

export const Separator = () => <div class="app-context-menu__separator" />
