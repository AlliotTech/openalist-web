import { Checkbox } from "@kobalte/core/checkbox"
import type { JSX, JSXElement } from "solid-js"
import "./checkbox.css"

export interface AppCheckboxProps {
  id?: string
  checked?: boolean
  defaultChecked?: boolean
  indeterminate?: boolean
  disabled?: boolean
  onChange?: (checked: boolean) => void
  onClick?: JSX.EventHandlerUnion<HTMLDivElement, MouseEvent>
  class?: string
  style?: JSX.CSSProperties
  children?: JSXElement
}

export const AppCheckbox = (props: AppCheckboxProps) => (
  <Checkbox
    id={props.id}
    checked={props.checked}
    defaultChecked={props.defaultChecked}
    indeterminate={props.indeterminate}
    disabled={props.disabled}
    onChange={props.onChange}
    onClick={props.onClick}
    class={`app-checkbox${props.class ? ` ${props.class}` : ""}`}
    style={props.style}
  >
    <Checkbox.Input />
    <Checkbox.Control class="app-checkbox__control">
      <Checkbox.Indicator class="app-checkbox__indicator">
        <span class="app-checkbox__check" aria-hidden="true" />
      </Checkbox.Indicator>
    </Checkbox.Control>
    {props.children ? (
      <Checkbox.Label class="app-checkbox__label">
        {props.children}
      </Checkbox.Label>
    ) : null}
  </Checkbox>
)
