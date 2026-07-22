import { Tooltip as KobalteTooltip } from "@kobalte/core/tooltip"
import type { JSXElement } from "solid-js"
import { createSignal, Show } from "solid-js"
import "./tooltip.css"

const TOOLTIP_REUSE_WINDOW_MS = 300
let lastTooltipClosedAt = Number.NEGATIVE_INFINITY

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

export const AppTooltip = (props: AppTooltipProps) => {
  const [instant, setInstant] = createSignal(false)
  return (
    <KobalteTooltip
      disabled={props.disabled}
      placement={props.placement ?? "bottom"}
      gutter={8}
      openDelay={0}
      closeDelay={0}
      skipDelayDuration={TOOLTIP_REUSE_WINDOW_MS}
      onOpenChange={(open) => {
        const now = performance.now()
        if (open) {
          setInstant(now - lastTooltipClosedAt <= TOOLTIP_REUSE_WINDOW_MS)
        } else {
          lastTooltipClosedAt = now
        }
      }}
    >
      <KobalteTooltip.Trigger as="span" class="app-tooltip__trigger">
        {props.children}
      </KobalteTooltip.Trigger>
      <KobalteTooltip.Portal>
        <KobalteTooltip.Content
          class="app-tooltip__content"
          data-instant={instant() ? "" : undefined}
        >
          {props.label}
          <Show when={props.withArrow}>
            <KobalteTooltip.Arrow class="app-tooltip__arrow" />
          </Show>
        </KobalteTooltip.Content>
      </KobalteTooltip.Portal>
    </KobalteTooltip>
  )
}
