import { RadioGroup } from "@kobalte/core/radio-group"
import type { JSXElement } from "solid-js"
import "./radio-group.css"

export interface AppRadioGroupProps {
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  children: JSXElement
}

export const AppRadioGroup = (props: AppRadioGroupProps) => (
  <RadioGroup
    value={props.value}
    defaultValue={props.defaultValue}
    onChange={props.onChange}
    class="app-radio-group"
  >
    {props.children}
  </RadioGroup>
)

export const AppRadio = (props: { value: string; children: JSXElement }) => (
  <RadioGroup.Item value={props.value} class="app-radio">
    <RadioGroup.ItemInput />
    <RadioGroup.ItemControl class="app-radio__control">
      <RadioGroup.ItemIndicator class="app-radio__indicator" />
    </RadioGroup.ItemControl>
    <RadioGroup.ItemLabel class="app-radio__label">
      {props.children}
    </RadioGroup.ItemLabel>
  </RadioGroup.Item>
)
