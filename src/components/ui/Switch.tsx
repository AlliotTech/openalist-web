import { Switch } from "@kobalte/core/switch"
import type { JSXElement } from "solid-js"
import "./switch.css"

export interface AppSwitchProps {
  id?: string
  checked?: boolean
  defaultChecked?: boolean
  onChange?: (checked: boolean) => void
  readOnly?: boolean
  disabled?: boolean
  children?: JSXElement
}

export const AppSwitch = (props: AppSwitchProps) => (
  <Switch
    id={props.id}
    checked={props.checked}
    defaultChecked={props.defaultChecked}
    onChange={props.onChange}
    readOnly={props.readOnly}
    disabled={props.disabled}
    class="app-switch"
  >
    <Switch.Input />
    <Switch.Control class="app-switch__control">
      <Switch.Thumb class="app-switch__thumb" />
    </Switch.Control>
    {props.children ? (
      <Switch.Label class="app-switch__label">{props.children}</Switch.Label>
    ) : null}
  </Switch>
)
