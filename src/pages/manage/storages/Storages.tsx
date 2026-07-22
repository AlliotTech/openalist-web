import { Box, Grid } from "@hope-ui/solid"
import { AppHStack as HStack, AppVStack as VStack } from "~/components/ui/Stack"
import "~/components/ui/table.css"
import { AppButton } from "~/components/ui/Button"
import { createMemo, createSignal, For, Match, Show, Switch } from "solid-js"
import { useFetch, useManageTitle, useRouter, useT } from "~/hooks"
import { handleResp, notify, r } from "~/utils"
import { EmptyResp, PageResp, Resp, Storage } from "~/types"
import { StorageGridItem, StorageListItem } from "./Storage"
import { createStorageSignal } from "~/utils/storage"
import { AppSwitch } from "~/components/ui/Switch"
import { AppSelect } from "~/components/ui/Select"

const Storages = () => {
  const t = useT()
  useManageTitle("manage.sidemenu.storages")
  const { to } = useRouter()
  const [getStoragesLoading, getStorages] = useFetch(
    (): Promise<PageResp<Storage>> => r.get("/admin/storage/list"),
  )
  const [storages, setStorages] = createSignal<Storage[]>([])
  const refresh = async () => {
    const resp = await getStorages()
    handleResp(resp, (data) => setStorages(data.content))
  }
  const [drivers, setDrivers] = createSignal<string[]>([])
  const [selectedDrivers, setSelectedDrivers] = createSignal<string[]>([])
  const getDrivers = async () => {
    const resp: Resp<string[]> = await r.get("/admin/driver/names")
    handleResp(resp, (data) => setDrivers(data))
  }
  getDrivers()
  refresh()
  const loadAll = async () => {
    const resp: EmptyResp = await r.post("/admin/storage/load_all")
    handleResp(resp, () => {
      notify.success(t("storages.other.start_load_success"))
    })
  }
  const shownStorages = createMemo(() => {
    return storages().filter((storage) => {
      if (selectedDrivers().length === 0) {
        return true
      }
      return selectedDrivers().includes(storage.driver)
    })
  })
  const [layout, setLayout] = createStorageSignal(
    "storages-layout",
    "grid" as "grid" | "table",
  )
  return (
    <VStack spacing="$3" alignItems="start" w="$full">
      <HStack
        spacing="$2"
        gap="$2"
        w="$full"
        wrap={{
          "@initial": "wrap",
          "@md": "unset",
        }}
      >
        <AppButton
          colorScheme="accent"
          loading={getStoragesLoading()}
          onClick={refresh}
        >
          {t("global.refresh")}
        </AppButton>
        <AppButton
          onClick={() => {
            to("/@manage/storages/add")
          }}
        >
          {t("global.add")}
        </AppButton>
        <AppButton
          colorScheme="warning"
          loading={getStoragesLoading()}
          onClick={loadAll}
        >
          {t("storages.other.load_all")}
        </AppButton>
        <Show when={drivers().length > 0}>
          <AppSelect
            multiple
            value={selectedDrivers()}
            onChange={setSelectedDrivers}
            placeholder={t("storages.other.filter_by_driver")}
            options={drivers().map((item) => ({
              value: item,
              label: t(`drivers.drivers.${item}`),
            }))}
          />
        </Show>
        <AppSwitch
          checked={layout() === "table"}
          onChange={(checked) => {
            setLayout(checked ? "table" : "grid")
          }}
        >
          {t("storages.other.table_layout")}
        </AppSwitch>
      </HStack>
      <Switch>
        <Match when={layout() === "grid"}>
          <Grid
            w="$full"
            gap="$2_5"
            templateColumns={{
              "@initial": "1fr",
              "@lg": "repeat(auto-fill, minmax(324px, 1fr))",
            }}
          >
            <For each={shownStorages()}>
              {(storage) => (
                <StorageGridItem storage={storage} refresh={refresh} />
              )}
            </For>
          </Grid>
        </Match>
        <Match when={layout() === "table"}>
          <Box w="$full" overflowX="auto">
            <table class="app-table--dense app-table--hover">
              <thead>
                <tr>
                  <For
                    each={["mount_path", "driver", "order", "status", "remark"]}
                  >
                    {(title) => <th>{t(`storages.common.${title}`)}</th>}
                  </For>
                  <th>{t("global.operations")}</th>
                </tr>
              </thead>
              <tbody>
                <For each={shownStorages()}>
                  {(storage) => (
                    <StorageListItem storage={storage} refresh={refresh} />
                  )}
                </For>
              </tbody>
            </table>
          </Box>
        </Match>
      </Switch>
    </VStack>
  )
}

export default Storages
