import { Center, Icon, Spinner, useColorModeValue } from "@hope-ui/solid"
import { createSignal, For, Show } from "solid-js"
import {
  addLanguage,
  langMap,
  languages,
  loadedLangs,
  setLang,
} from "~/app/i18n"
// import { TbLanguageHiragana } from "solid-icons/tb";
import { IoLanguageOutline } from "solid-icons/io"
import { Portal } from "solid-js/web"
import { AppMenu } from "~/components/ui/Menu"

const [fetchingLang, setFetchingLang] = createSignal(false)

export const SwitchLanguage = () => {
  const switchLang = async (lang: string) => {
    if (!loadedLangs.has(lang)) {
      setFetchingLang(true)
      addLanguage(lang, (await langMap[lang]()).default)
      setFetchingLang(false)
      loadedLangs.add(lang)
    }
    setLang(lang)
    localStorage.setItem("lang", lang)
  }
  return (
    <>
      <AppMenu>
        <AppMenu.Trigger class="app-menu__trigger" aria-label="switch language">
          <Icon as={IoLanguageOutline} boxSize="$8" />
        </AppMenu.Trigger>
        <AppMenu.Portal>
          <AppMenu.Content class="app-menu__content">
            <For each={languages}>
              {(lang) => (
                <AppMenu.Item
                  class="app-menu__item"
                  onSelect={() => {
                    switchLang(lang.code)
                  }}
                >
                  {lang.lang}
                </AppMenu.Item>
              )}
            </For>
          </AppMenu.Content>
        </AppMenu.Portal>
      </AppMenu>
      <Show when={fetchingLang()}>
        <Portal>
          <Center
            h="$full"
            w="$full"
            pos="fixed"
            top={0}
            bg={useColorModeValue("$blackAlpha4", "$whiteAlpha4")()}
            zIndex="9000"
          >
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="$neutral4"
              color="$info10"
              size="xl"
            />
          </Center>
        </Portal>
      </Show>
    </>
  )
}

export const SwitchLanguageWhite = SwitchLanguage
