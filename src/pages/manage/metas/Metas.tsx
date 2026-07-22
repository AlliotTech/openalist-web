import { Box } from "@hope-ui/solid"
import { AppHStack as HStack, AppVStack as VStack } from "~/components/ui/Stack"
import "~/components/ui/table.css"
import { AppButton } from "~/components/ui/Button"
import { createSignal, For } from "solid-js"
import {
  useFetch,
  useListFetch,
  useManageTitle,
  useRouter,
  useT,
} from "~/hooks"
import { handleResp, notify, r } from "~/utils"
import { Meta, PageResp, PEmptyResp } from "~/types"
import { DeletePopover } from "../common/DeletePopover"
import { Wether } from "~/components"

const Metas = () => {
  const t = useT()
  useManageTitle("manage.sidemenu.metas")
  const { to } = useRouter()
  const [getMetasLoading, getMetas] = useFetch((): Promise<PageResp<Meta>> =>
    r.get("/admin/meta/list"),
  )
  const [metas, setMetas] = createSignal<Meta[]>([])
  const refresh = async () => {
    const resp: PageResp<Meta> = await getMetas()
    handleResp(resp, (data) => setMetas(data.content))
  }
  refresh()

  const [deleting, deleteMeta] = useListFetch((id: number): PEmptyResp =>
    r.post(`/admin/meta/delete?id=${id}`),
  )
  return (
    <VStack spacing="$2" alignItems="start" w="$full">
      <HStack spacing="$2">
        <AppButton
          colorScheme="accent"
          loading={getMetasLoading()}
          onClick={refresh}
        >
          {t("global.refresh")}
        </AppButton>
        <AppButton
          onClick={() => {
            to("/@manage/metas/add")
          }}
        >
          {t("global.add")}
        </AppButton>
      </HStack>
      <Box w="$full" overflowX="auto">
        <table class="app-table--dense app-table--hover">
          <thead>
            <tr>
              <For each={["path", "password", "write"]}>
                {(title) => <th>{t(`metas.${title}`)}</th>}
              </For>
              <th>{t("global.operations")}</th>
            </tr>
          </thead>
          <tbody>
            <For each={metas()}>
              {(meta) => (
                <tr>
                  <td>{meta.path}</td>
                  <td>{meta.password}</td>
                  <td>
                    <Wether yes={meta.write} />
                  </td>
                  {/* <Td>{meta.hide}</Td> */}
                  <td>
                    <HStack spacing="$2">
                      <AppButton
                        onClick={() => {
                          to(`/@manage/metas/edit/${meta.id}`)
                        }}
                      >
                        {t("global.edit")}
                      </AppButton>
                      <DeletePopover
                        name={meta.path}
                        loading={deleting() === meta.id}
                        onClick={async () => {
                          const resp = await deleteMeta(meta.id)
                          handleResp(resp, () => {
                            notify.success(t("global.delete_success"))
                            refresh()
                          })
                        }}
                      />
                    </HStack>
                  </td>
                </tr>
              )}
            </For>
          </tbody>
        </table>
      </Box>
    </VStack>
  )
}

export default Metas
