import { Heading } from "@hope-ui/solid"
import { AppSimpleGrid as SimpleGrid } from "~/components/ui/Grid"
import { AppHStack as HStack } from "~/components/ui/Stack"
import {
  AppFormControl as FormControl,
  AppFormLabel as FormLabel,
} from "~/components/ui/Form"
import { AppButton } from "~/components/ui/Button"
import { AppInput } from "~/components/ui/Input"
import { createSignal } from "solid-js"
import { FolderChooseInput, MaybeLoading } from "~/components"
import { useFetch, useManageTitle, useT, useUtil } from "~/hooks"
import { Group, SettingItem, PResp } from "~/types"
import { handleResp, notify, r } from "~/utils"
import { Item } from "./SettingItem"

const OtherSettings = () => {
  const t = useT()
  useManageTitle("manage.sidemenu.other")
  const [uri, setUri] = createSignal("")
  const [secret, setSecret] = createSignal("")
  const [qbitUrl, setQbitUrl] = createSignal("")
  const [qbitSeedTime, setQbitSeedTime] = createSignal("")
  const [transmissionUrl, setTransmissionUrl] = createSignal("")
  const [transmissionSeedTime, setTransmissionSeedTime] = createSignal("")
  const [pan115TempDir, set115TempDir] = createSignal("")
  const [pikpakTempDir, setPikPakTempDir] = createSignal("")
  const [thunderTempDir, setThunderTempDir] = createSignal("")
  const [token, setToken] = createSignal("")
  const [settings, setSettings] = createSignal<SettingItem[]>([])
  const [settingsLoading, settingsData] = useFetch((): PResp<SettingItem[]> =>
    r.get(`/admin/setting/list?groups=${Group.ARIA2},${Group.SINGLE}`),
  )
  const [setAria2Loading, setAria2] = useFetch((): PResp<string> =>
    r.post("/admin/setting/set_aria2", { uri: uri(), secret: secret() }),
  )
  const [setQbitLoading, setQbit] = useFetch((): PResp<string> =>
    r.post("/admin/setting/set_qbit", {
      url: qbitUrl(),
      seedtime: qbitSeedTime(),
    }),
  )
  const [setTransmissionLoading, setTransmission] = useFetch(
    (): PResp<string> =>
      r.post("/admin/setting/set_transmission", {
        uri: transmissionUrl(),
        seedtime: transmissionSeedTime(),
      }),
  )
  const [set115Loading, set115] = useFetch((): PResp<string> =>
    r.post("/admin/setting/set_115", {
      temp_dir: pan115TempDir(),
    }),
  )
  const [setPikPakLoading, setPikPak] = useFetch((): PResp<string> =>
    r.post("/admin/setting/set_pikpak", {
      temp_dir: pikpakTempDir(),
    }),
  )
  const [setThunderLoading, setThunder] = useFetch((): PResp<string> =>
    r.post("/admin/setting/set_thunder", {
      temp_dir: thunderTempDir(),
    }),
  )
  const refresh = async () => {
    const resp = await settingsData()
    handleResp(resp, (data) => {
      setUri(data.find((i) => i.key === "aria2_uri")?.value || "")
      setSecret(data.find((i) => i.key === "aria2_secret")?.value || "")
      setToken(data.find((i) => i.key === "token")?.value || "")
      setQbitUrl(data.find((i) => i.key === "qbittorrent_url")?.value || "")
      setQbitSeedTime(
        data.find((i) => i.key === "qbittorrent_seedtime")?.value || "",
      )
      setTransmissionUrl(
        data.find((i) => i.key === "transmission_uri")?.value || "",
      )
      setTransmissionSeedTime(
        data.find((i) => i.key === "transmission_seedtime")?.value || "",
      )
      set115TempDir(data.find((i) => i.key === "115_temp_dir")?.value || "")
      setPikPakTempDir(
        data.find((i) => i.key === "pikpak_temp_dir")?.value || "",
      )
      setThunderTempDir(
        data.find((i) => i.key === "thunder_temp_dir")?.value || "",
      )
      setSettings(data)
    })
  }
  refresh()
  const [resetTokenLoading, resetToken] = useFetch((): PResp<string> =>
    r.post("/admin/setting/reset_token"),
  )
  const { copy } = useUtil()

  return (
    <MaybeLoading loading={settingsLoading()}>
      <Heading mb="$2">{t("settings_other.aria2")}</Heading>
      <SimpleGrid gap="$2" columns={{ "@initial": 1, "@md": 2 }}>
        <Item
          {...settings().find((i) => i.key === "aria2_uri")!}
          value={uri()}
          onChange={(str) => setUri(str)}
        />
        <Item
          {...settings().find((i) => i.key === "aria2_secret")!}
          value={secret()}
          onChange={(str) => setSecret(str)}
        />
      </SimpleGrid>
      <AppButton
        my="$2"
        loading={setAria2Loading()}
        onClick={async () => {
          const resp = await setAria2()
          handleResp(resp, (data) => {
            notify.success(`${t("settings_other.aria2_version")} ${data}`)
          })
        }}
      >
        {t("settings_other.set_aria2")}
      </AppButton>
      <Heading my="$2">{t("settings_other.qbittorrent")}</Heading>
      <SimpleGrid gap="$2" columns={{ "@initial": 1, "@md": 2 }}>
        <Item
          {...settings().find((i) => i.key === "qbittorrent_url")!}
          value={qbitUrl()}
          onChange={(str) => setQbitUrl(str)}
        />
        <Item
          {...settings().find((i) => i.key === "qbittorrent_seedtime")!}
          value={qbitSeedTime()}
          onChange={(str) => setQbitSeedTime(str)}
        />
      </SimpleGrid>
      <AppButton
        my="$2"
        loading={setQbitLoading()}
        onClick={async () => {
          const resp = await setQbit()
          handleResp(resp, (data) => {
            notify.success(data)
          })
        }}
      >
        {t("settings_other.set_qbit")}
      </AppButton>
      <Heading my="$2">{t("settings_other.transmission")}</Heading>
      <SimpleGrid gap="$2" columns={{ "@initial": 1, "@md": 2 }}>
        <Item
          {...settings().find((i) => i.key === "transmission_uri")!}
          value={transmissionUrl()}
          onChange={(str) => setTransmissionUrl(str)}
        />
        <Item
          {...settings().find((i) => i.key === "transmission_seedtime")!}
          value={transmissionSeedTime()}
          onChange={(str) => setTransmissionSeedTime(str)}
        />
      </SimpleGrid>
      <AppButton
        my="$2"
        loading={setTransmissionLoading()}
        onClick={async () => {
          const resp = await setTransmission()
          handleResp(resp, (data) => {
            notify.success(data)
          })
        }}
      >
        {t("settings_other.set_transmission")}
      </AppButton>
      <Heading my="$2">{t("settings_other.115")}</Heading>
      <FormControl w="$full" display="flex" flexDirection="column">
        <FormLabel for="115_temp_dir" display="flex" alignItems="center">
          {t(`settings.115_temp_dir`)}
        </FormLabel>
        <FolderChooseInput
          id="115_temp_dir"
          value={pan115TempDir()}
          onChange={(path) => set115TempDir(path)}
        />
      </FormControl>
      <AppButton
        my="$2"
        loading={set115Loading()}
        onClick={async () => {
          const resp = await set115()
          handleResp(resp, (data) => {
            notify.success(data)
          })
        }}
      >
        {t("settings_other.set_115")}
      </AppButton>
      <Heading my="$2">{t("settings_other.pikpak")}</Heading>
      <FormControl w="$full" display="flex" flexDirection="column">
        <FormLabel for="pikpak_temp_dir" display="flex" alignItems="center">
          {t(`settings.pikpak_temp_dir`)}
        </FormLabel>
        <FolderChooseInput
          id="pikpak_temp_dir"
          value={pikpakTempDir()}
          onChange={(path) => setPikPakTempDir(path)}
        />
      </FormControl>
      <AppButton
        my="$2"
        loading={setPikPakLoading()}
        onClick={async () => {
          const resp = await setPikPak()
          handleResp(resp, (data) => {
            notify.success(data)
          })
        }}
      >
        {t("settings_other.set_pikpak")}
      </AppButton>
      <Heading my="$2">{t("settings_other.thunder")}</Heading>
      <FormControl w="$full" display="flex" flexDirection="column">
        <FormLabel for="thunder_temp_dir" display="flex" alignItems="center">
          {t(`settings.thunder_temp_dir`)}
        </FormLabel>
        <FolderChooseInput
          id="thunder_temp_dir"
          value={thunderTempDir()}
          onChange={(path) => setThunderTempDir(path)}
        />
      </FormControl>
      <AppButton
        my="$2"
        loading={setThunderLoading()}
        onClick={async () => {
          const resp = await setThunder()
          handleResp(resp, (data) => {
            notify.success(data)
          })
        }}
      >
        {t("settings_other.set_thunder")}
      </AppButton>
      <Heading my="$2">{t("settings.token")}</Heading>
      <AppInput value={token()} readOnly />
      <HStack my="$2" spacing="$2">
        <AppButton
          onClick={() => {
            copy(token())
          }}
        >
          {t("settings_other.copy_token")}
        </AppButton>
        <AppButton
          colorScheme="danger"
          loading={resetTokenLoading()}
          onClick={async () => {
            const resp = await resetToken()
            handleResp(resp, (data) => {
              notify.success(t("settings_other.reset_token_success"))
              setToken(data)
            })
          }}
        >
          {t("settings_other.reset_token")}
        </AppButton>
      </HStack>
    </MaybeLoading>
  )
}

export default OtherSettings
