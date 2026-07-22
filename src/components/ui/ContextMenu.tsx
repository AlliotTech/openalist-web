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

const menuItems = (menu: HTMLElement) =>
  Array.from(menu.querySelectorAll<HTMLElement>('[role="menuitem"]')).filter(
    (item) =>
      item.closest('[role="menu"]') === menu &&
      item.getAttribute("aria-disabled") !== "true",
  )

const focusRelativeItem = (menu: HTMLElement, offset: number) => {
  const items = menuItems(menu)
  if (!items.length) return
  const current = items.indexOf(document.activeElement as HTMLElement)
  const next =
    current < 0 ? (offset > 0 ? 0 : items.length - 1) : current + offset
  items[(next + items.length) % items.length]?.focus()
}

const handleMenuNavigation = (event: KeyboardEvent) => {
  const menu = event.currentTarget as HTMLElement
  if (event.key === "ArrowDown" || event.key === "ArrowUp") {
    event.preventDefault()
    event.stopPropagation()
    focusRelativeItem(menu, event.key === "ArrowDown" ? 1 : -1)
  } else if (event.key === "Home" || event.key === "End") {
    event.preventDefault()
    event.stopPropagation()
    const items = menuItems(menu)
    items[event.key === "Home" ? 0 : items.length - 1]?.focus()
  }
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
  const [closing, setClosing] = createSignal(false)
  const [menuProps, setMenuProps] = createSignal<any>()
  const [anchorPoint, setAnchorPoint] = createSignal({ x: 0, y: 0 })
  const [position, setPosition] = createSignal({ x: 0, y: 0 })
  const [transformOrigin, setTransformOrigin] = createSignal("0px 0px")
  let menuRef: HTMLDivElement | undefined
  let closeTimer: ReturnType<typeof setTimeout> | undefined

  const close = () => {
    if (!open()) return
    setOpen(false)
    setClosing(true)
    clearTimeout(closeTimer)
    closeTimer = setTimeout(() => setClosing(false), 100)
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
      clearTimeout(closeTimer)
      setClosing(false)
      const requestedPosition = state.position ?? {
        x: state.event.clientX,
        y: state.event.clientY,
      }
      setAnchorPoint(requestedPosition)
      setPosition(requestedPosition)
      setOpen(true)
      props.onShown?.()
    })
    onCleanup(() => handlers.delete(props.id))
    onCleanup(() => clearTimeout(closeTimer))
  })

  createEffect(() => {
    if (!open()) return
    requestAnimationFrame(() => {
      if (!menuRef) return
      const rect = menuRef.getBoundingClientRect()
      const current = position()
      const nextPosition = {
        x: Math.max(0, Math.min(current.x, window.innerWidth - rect.width)),
        y: Math.max(0, Math.min(current.y, window.innerHeight - rect.height)),
      }
      const anchor = anchorPoint()
      const originX = Math.max(
        0,
        Math.min(anchor.x - nextPosition.x, rect.width),
      )
      const originY = Math.max(
        0,
        Math.min(anchor.y - nextPosition.y, rect.height),
      )
      setPosition(nextPosition)
      setTransformOrigin(`${originX}px ${originY}px`)
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
      <Show when={open() || closing()}>
        <Context.Provider value={{ props: menuProps, close }}>
          <div
            ref={menuRef}
            role="menu"
            tabindex="-1"
            class={`app-context-menu app-context-menu--${props.theme ?? "light"}${props.class ? ` ${props.class}` : ""}`}
            data-closed={closing() ? "" : undefined}
            style={{
              ...(typeof props.style === "object" ? props.style : {}),
              left: `${position().x}px`,
              top: `${position().y}px`,
              "transform-origin": transformOrigin(),
            }}
            onKeyDown={handleMenuNavigation}
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
  let triggerRef: HTMLDivElement | undefined
  let contentRef: HTMLDivElement | undefined
  const [submenuPosition, setSubmenuPosition] = createSignal({
    left: 0,
    top: 0,
  })
  const [submenuTransformOrigin, setSubmenuTransformOrigin] =
    createSignal("0px 0px")
  const positionSubmenu = () => {
    requestAnimationFrame(() => {
      if (!triggerRef || !contentRef) return
      const triggerRect = triggerRef.getBoundingClientRect()
      const contentRect = contentRef.getBoundingClientRect()
      const space = 4
      const opensRight =
        triggerRect.right + contentRect.width <= window.innerWidth
      const left = opensRight
        ? triggerRect.right
        : Math.max(space, triggerRect.left - contentRect.width)
      const top = Math.max(
        space,
        Math.min(
          triggerRect.top - 6,
          window.innerHeight - contentRect.height - space,
        ),
      )
      setSubmenuPosition({ left, top })
      setSubmenuTransformOrigin(
        `${opensRight ? 0 : contentRect.width}px ${triggerRect.top + triggerRect.height / 2 - top}px`,
      )
    })
  }
  return (
    <Show when={!hidden()}>
      <div
        ref={triggerRef}
        class="app-context-menu__submenu"
        role="menuitem"
        aria-haspopup="menu"
        aria-disabled={disabled() ? "true" : undefined}
        tabindex={disabled() ? undefined : "0"}
        onMouseEnter={positionSubmenu}
        onFocus={positionSubmenu}
        onKeyDown={(e) => {
          if (disabled()) return
          if (e.key === "ArrowRight") {
            e.preventDefault()
            e.stopPropagation()
            positionSubmenu()
            requestAnimationFrame(() => menuItems(contentRef!)[0]?.focus())
          } else if (e.key === "ArrowLeft") {
            e.preventDefault()
            e.stopPropagation()
            triggerRef?.focus()
          }
        }}
      >
        <div class="app-context-menu__item app-context-menu__submenu-label">
          {props.label}
          <span aria-hidden="true">›</span>
        </div>
        <div
          ref={contentRef}
          class="app-context-menu app-context-menu__submenu-content"
          role="menu"
          style={{
            left: `${submenuPosition().left}px`,
            top: `${submenuPosition().top}px`,
            "transform-origin": submenuTransformOrigin(),
          }}
          onKeyDown={(e) => {
            handleMenuNavigation(e)
            if (e.key === "ArrowLeft") {
              e.preventDefault()
              e.stopPropagation()
              triggerRef?.focus()
            }
          }}
        >
          {props.children}
        </div>
      </div>
    </Show>
  )
}

export const Separator = () => <div class="app-context-menu__separator" />
