import {
  Center,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Select,
  SelectContent,
  SelectIcon,
  SelectListbox,
  SelectOption,
  SelectOptionIndicator,
  SelectOptionText,
  SelectPlaceholder,
  SelectTrigger,
  SelectValue,
  VStack,
} from "@hope-ui/solid"
import { For, Match, onCleanup, Switch, createSignal } from "solid-js"
import { SwitchLanguageWhite, SwitchColorMode } from "~/components"
import { useT } from "~/hooks"
import { initialLocalSettings, local, LocalSetting, setLocal } from "~/store"
import { bus } from "~/utils"
import { AppDrawer } from "~/components/ui/Drawer"
import { AppSwitch } from "~/components/ui/Switch"

function LocalSettingEdit(props: LocalSetting) {
  const t = useT()
  return (
    <FormControl>
      <FormLabel>{t(`home.local_settings.${props.key}`)}</FormLabel>
      <Switch
        fallback={
          <Input
            value={local[props.key]}
            onInput={(e) => {
              setLocal(props.key, e.currentTarget.value)
            }}
          />
        }
      >
        <Match when={props.type === "select"}>
          <Select
            id={props.key}
            defaultValue={local[props.key]}
            onChange={(v) => setLocal(props.key, v)}
          >
            <SelectTrigger>
              <SelectPlaceholder>{t("global.choose")}</SelectPlaceholder>
              <SelectValue />
              <SelectIcon />
            </SelectTrigger>
            <SelectContent>
              <SelectListbox>
                <For
                  each={
                    typeof props.options === "function"
                      ? props.options()
                      : props.options
                  }
                >
                  {(item) => (
                    <SelectOption value={item}>
                      <SelectOptionText>
                        {t(`home.local_settings.${props.key}_options.${item}`)}
                      </SelectOptionText>
                      <SelectOptionIndicator />
                    </SelectOption>
                  )}
                </For>
              </SelectListbox>
            </SelectContent>
          </Select>
        </Match>
        <Match when={props.type === "boolean"}>
          <AppSwitch
            defaultChecked={local[props.key] === "true"}
            onChange={(checked) => {
              setLocal(props.key, checked.toString())
            }}
          />
        </Match>
      </Switch>
    </FormControl>
  )
}

export const LocalSettings = () => {
  const [isOpen, setOpen] = createSignal(false)
  const t = useT()
  const handler = (name: string) => {
    if (name === "local_settings") {
      setOpen(true)
    }
  }
  bus.on("tool", handler)
  onCleanup(() => {
    bus.off("tool", handler)
  })
  return (
    <AppDrawer
      open={isOpen()}
      placement="right"
      onOpenChange={setOpen}
      title={t("home.toolbar.local_settings")}
    >
      <VStack spacing="$2">
        <For each={initialLocalSettings.filter((s) => !s.hidden)}>
          {(setting) => <LocalSettingEdit {...setting} />}
        </For>
      </VStack>
      <Center mt="$4">
        <HStack spacing="$4" p="$2" color="$neutral11">
          <SwitchLanguageWhite />
          <SwitchColorMode />
        </HStack>
      </Center>
    </AppDrawer>
  )
}
