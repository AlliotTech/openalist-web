import { Tooltip as KobalteTooltip } from "@kobalte/core/tooltip"
import type { JSXElement } from "solid-js"
import { Show } from "solid-js"
import "./tooltip.css"

type TooltipPlacement =
  | "top"
  | "top-start"
  | "top-end"
  | "right"
  | "right-start"
  | "right-end"
  | "bottom"
  | "bottom-start"
  | "bottom-end"
  | "left"
  | "left-start"
  | "left-end"

export interface AppTooltipProps {
  label: JSXElement
  children: JSXElement
  disabled?: boolean
  placement?: TooltipPlacement
  withArrow?: boolean
}

export const AppTooltip = (props: AppTooltipProps) => (
  <KobalteTooltip
    disabled={props.disabled}
    placement={props.placement ?? "top"}
    gutter={8}
    openDelay={350}
    closeDelay={80}
  >
    <KobalteTooltip.Trigger as="span" class="app-tooltip__trigger">
      {props.children}
    </KobalteTooltip.Trigger>
    <KobalteTooltip.Portal>
      <KobalteTooltip.Content class="app-tooltip__content">
        {props.label}
        <Show when={props.withArrow}>
          <KobalteTooltip.Arrow class="app-tooltip__arrow" />
        </Show>
      </KobalteTooltip.Content>
    </KobalteTooltip.Portal>
  </KobalteTooltip>
)
