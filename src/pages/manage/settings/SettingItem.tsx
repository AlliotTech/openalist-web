import {
  Center,
  FormControl,
  FormHelperText,
  FormLabel,
  Icon,
} from "@hope-ui/solid"
import { AppInput, AppTextarea } from "~/components/ui/Input"
import { For, Match, Show, Switch } from "solid-js"
import { useT } from "~/hooks"
import { Flag, SettingItem, Type } from "~/types"
import { TiDelete } from "solid-icons/ti"
import { AppSwitch } from "~/components/ui/Switch"
import { AppSelect } from "~/components/ui/Select"

export type ItemProps = SettingItem & {
  onChange?: (value: string) => void
  onDelete?: () => void
  // value: () => string;
  hideLabel?: boolean
  w?: string
}

const Item = (props: ItemProps) => {
  const t = useT()
  return (
    <FormControl w={props.w ?? "100%"} display="flex" flexDirection="column">
      <Show when={!props.hideLabel}>
        <FormLabel for={props.key} display="flex" alignItems="center">
          {t(`settings.${props.key}`)}
          <Show when={props.flag === Flag.DEPRECATED}>
            <Icon
              ml="$2"
              as={TiDelete}
              boxSize="$5"
              color="$danger9"
              verticalAlign="middle"
              cursor="pointer"
              onClick={() => {
                props.onDelete?.()
              }}
            />
          </Show>
        </FormLabel>
      </Show>
      <Switch fallback={<Center>{t("settings_other.unknown_type")}</Center>}>
        <Match when={[Type.String, Type.Number].includes(props.type)}>
          <AppInput
            type={props.type === Type.Number ? "number" : ""}
            id={props.key}
            // value={props.value()}
            value={props.value}
            onInput={(e) => props.onChange?.(e.currentTarget.value)}
            readOnly={props.flag === Flag.READONLY}
          />
        </Match>
        <Match when={props.type === Type.Bool}>
          <AppSwitch
            id={props.key}
            defaultChecked={props.value === "true"}
            // checked={props.value() === "true"}
            onChange={(checked) =>
              // props.onChange?.(props.value() === "true" ? "false" : "true")
              props.onChange?.(checked.toString())
            }
            readOnly={props.flag === Flag.READONLY}
          />
        </Match>
        <Match when={props.type === Type.Text}>
          <AppTextarea
            id={props.key}
            value={props.value}
            // value={props.value()}
            onChange={(e) => props.onChange?.(e.currentTarget.value)}
            readOnly={props.flag === Flag.READONLY}
          />
        </Match>
        <Match when={props.type === Type.Select}>
          <AppSelect
            id={props.key}
            defaultValue={props.value}
            onChange={(value) => props.onChange?.(value)}
            readOnly={props.flag === Flag.READONLY}
            placeholder={t("global.choose")}
            options={(props.options?.split(",") ?? []).map((item) => ({
              value: item,
              label: t(`settings.${props.key}s.${item}`),
            }))}
          />
        </Match>
      </Switch>
      <FormHelperText>
        {props.help ? t(`settings.${props.key}-tips`) : ""}
      </FormHelperText>
    </FormControl>
  )
}

export { Item }
