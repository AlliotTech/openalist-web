import { Select } from "@kobalte/core/select"
import { Combobox } from "@kobalte/core/combobox"
import type { JSX } from "solid-js"
import "./select.css"

export interface AppSelectOption<T extends string | number> {
  value: T
  label: string
}

export function AppCombobox<T extends string | number>(
  props: AppSelectBaseProps<T> & {
    value?: T
    defaultValue?: T
    onChange?: (value: T) => void
  },
) {
  const findOption = (value: T | undefined) =>
    props.options.find((option) => option.value === value)

  return (
    <Combobox<AppSelectOption<T>>
      gutter={5}
      sameWidth
      id={props.id}
      options={props.options}
      optionValue="value"
      optionTextValue="label"
      optionLabel="label"
      value={findOption(props.value)}
      defaultValue={findOption(props.defaultValue)}
      disabled={props.disabled}
      readOnly={props.readOnly}
      placeholder={props.placeholder}
      onChange={(selection) => {
        if (selection) props.onChange?.(selection.value)
      }}
      itemComponent={(itemProps) => (
        <Combobox.Item item={itemProps.item} class="app-select__item">
          <Combobox.ItemLabel class="app-select__item-label">
            {itemProps.item.rawValue.label}
          </Combobox.ItemLabel>
          <Combobox.ItemIndicator class="app-select__indicator">
            ✓
          </Combobox.ItemIndicator>
        </Combobox.Item>
      )}
      class={`app-select app-select--${props.size ?? "md"} app-select--${props.variant ?? "filled"}${props.class ? ` ${props.class}` : ""}`}
      style={props.style}
    >
      <Combobox.HiddenSelect />
      <Combobox.Control class="app-select__trigger">
        <Combobox.Input class="app-select__input" />
        <Combobox.Trigger class="app-select__combobox-trigger">
          <Combobox.Icon>⌄</Combobox.Icon>
        </Combobox.Trigger>
      </Combobox.Control>
      <Combobox.Portal>
        <Combobox.Content class="app-select__content">
          <Combobox.Listbox class="app-select__listbox" />
        </Combobox.Content>
      </Combobox.Portal>
    </Combobox>
  )
}

interface AppSelectBaseProps<T extends string | number> {
  id?: string
  options: AppSelectOption<T>[]
  placeholder?: string
  disabled?: boolean
  readOnly?: boolean
  class?: string
  style?: JSX.CSSProperties
  size?: "xs" | "sm" | "md" | "lg"
  variant?: "filled" | "outline"
}

type AppSelectProps<T extends string | number> = AppSelectBaseProps<T> &
  (
    | {
        multiple?: false
        value?: T
        defaultValue?: T
        onChange?: (value: T) => void
      }
    | {
        multiple: true
        value?: T[]
        defaultValue?: T[]
        onChange?: (value: T[]) => void
      }
  )

export function AppSelect<T extends string | number>(props: AppSelectProps<T>) {
  const findOption = (value: T | undefined) =>
    props.options.find((option) => option.value === value)
  const selectedValue = () =>
    props.multiple
      ? (props.value ?? []).map(findOption).filter(Boolean)
      : findOption(props.value)
  const initialValue = () =>
    props.multiple
      ? (props.defaultValue ?? []).map(findOption).filter(Boolean)
      : findOption(props.defaultValue)

  return (
    <Select<AppSelectOption<T>>
      gutter={5}
      sameWidth
      id={props.id}
      multiple={props.multiple as true}
      options={props.options}
      optionValue="value"
      optionTextValue="label"
      value={selectedValue() as any}
      defaultValue={initialValue() as any}
      disabled={props.disabled}
      readOnly={props.readOnly}
      placeholder={props.placeholder}
      onChange={(
        selection: AppSelectOption<T> | AppSelectOption<T>[] | null,
      ) => {
        if (props.multiple) {
          props.onChange?.(
            ((selection ?? []) as AppSelectOption<T>[]).map(
              (option) => option.value,
            ),
          )
        } else if (selection) {
          props.onChange?.((selection as AppSelectOption<T>).value)
        }
      }}
      itemComponent={(itemProps: any) => (
        <Select.Item item={itemProps.item} class="app-select__item">
          <Select.ItemLabel class="app-select__item-label">
            {itemProps.item.rawValue.label}
          </Select.ItemLabel>
          <Select.ItemIndicator class="app-select__indicator">
            ✓
          </Select.ItemIndicator>
        </Select.Item>
      )}
      class={`app-select app-select--${props.size ?? "md"} app-select--${props.variant ?? "filled"}${props.class ? ` ${props.class}` : ""}`}
      style={props.style}
    >
      <Select.HiddenSelect />
      <Select.Trigger class="app-select__trigger">
        <Select.Value<AppSelectOption<T>>>
          {(state) =>
            state
              .selectedOptions()
              .map((option) => option.label)
              .join(", ")
          }
        </Select.Value>
        <Select.Icon class="app-select__icon">⌄</Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content class="app-select__content">
          <Select.Listbox class="app-select__listbox" />
        </Select.Content>
      </Select.Portal>
    </Select>
  )
}
