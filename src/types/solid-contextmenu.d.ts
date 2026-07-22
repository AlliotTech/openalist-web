declare module "solid-contextmenu" {
  import type { Component, JSX, ParentProps } from "solid-js"

  interface ContextMenuOptions<Props = unknown> {
    id?: string | number
    props?: Props
  }

  interface ContextMenuPosition {
    x: number
    y: number
  }

  interface ContextMenuEvent<Props = any> {
    props: Props
    event?: MouseEvent
  }

  interface ContextMenuController {
    show<Props = unknown>(
      event: MouseEvent,
      options?: ContextMenuOptions<Props> & { position?: ContextMenuPosition },
    ): void
    hideAll(): void
  }

  interface MenuProps extends ParentProps, JSX.HTMLAttributes<HTMLDivElement> {
    id: string | number
    animation?: string
    theme?: string
    onShown?: () => void
    onHidden?: () => void
  }

  interface ItemProps extends ParentProps {
    class?: string
    disabled?: boolean | (() => boolean)
    hidden?: boolean | (() => boolean) | ((event: ContextMenuEvent) => boolean)
    onClick?: (() => void) | ((event: ContextMenuEvent) => void)
  }

  interface SubmenuProps extends ItemProps {
    label: JSX.Element
  }

  export const Menu: Component<MenuProps>
  export const Item: Component<ItemProps>
  export const Submenu: Component<SubmenuProps>
  export const Separator: Component<ParentProps>
  export function useContextMenu(
    options?: ContextMenuOptions,
  ): ContextMenuController
}
