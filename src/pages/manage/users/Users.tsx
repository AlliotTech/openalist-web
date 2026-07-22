import { AppBadge as Badge } from "~/components/ui/Display"
import { AppBox as Box } from "~/components/ui/Layout"
import { AppHStack as HStack, AppVStack as VStack } from "~/components/ui/Stack"
import "~/components/ui/table.css"
import { AppButton } from "~/components/ui/Button"
import { AppTooltip as Tooltip } from "~/components/ui/Tooltip"
import { createSignal, For } from "solid-js"
import {
  useFetch,
  useListFetch,
  useManageTitle,
  useRouter,
  useT,
} from "~/hooks"
import { handleResp, notify, r } from "~/utils"
import {
  UserPermissions,
  User,
  UserMethods,
  PPageResp,
  PEmptyResp,
} from "~/types"
import { DeletePopover } from "../common/DeletePopover"
import { Wether } from "~/components"

const Role = (props: { role: number }) => {
  const roles = [
    { name: "general", color: "info" },
    { name: "guest", color: "neutral" },
    { name: "admin", color: "accent" },
  ]
  return (
    <Badge colorScheme={roles[props.role].color as any}>
      {roles[props.role].name}
    </Badge>
  )
}

const Permissions = (props: { user: User }) => {
  const t = useT()
  const color = (can: boolean) => `$${can ? "success" : "danger"}9`
  return (
    <HStack spacing="$0_5">
      <For each={UserPermissions}>
        {(item, i) => (
          <Tooltip label={t(`users.permissions.${item}`)}>
            <Box
              boxSize="$2"
              rounded="$full"
              bg={color(UserMethods.can(props.user, i()))}
            ></Box>
          </Tooltip>
        )}
      </For>
    </HStack>
  )
}

const Users = () => {
  const t = useT()
  useManageTitle("manage.sidemenu.users")
  const { to } = useRouter()
  const [getUsersLoading, getUsers] = useFetch((): PPageResp<User> =>
    r.get("/admin/user/list"),
  )
  const [users, setUsers] = createSignal<User[]>([])
  const refresh = async () => {
    const resp = await getUsers()
    handleResp(resp, (data) => setUsers(data.content))
  }
  refresh()

  const [deleting, deleteUser] = useListFetch((id: number): PEmptyResp =>
    r.post(`/admin/user/delete?id=${id}`),
  )
  const [cancel_2faId, cancel_2fa] = useListFetch((id: number): PEmptyResp =>
    r.post(`/admin/user/cancel_2fa?id=${id}`),
  )
  return (
    <VStack spacing="$2" alignItems="start" w="$full">
      <HStack spacing="$2">
        <AppButton
          colorScheme="accent"
          loading={getUsersLoading()}
          onClick={refresh}
        >
          {t("global.refresh")}
        </AppButton>
        <AppButton
          onClick={() => {
            to("/@manage/users/add")
          }}
        >
          {t("global.add")}
        </AppButton>
      </HStack>
      <Box w="$full" overflowX="auto">
        <table class="app-table--dense app-table--hover">
          <thead>
            <tr>
              <For
                each={[
                  "username",
                  "base_path",
                  "role",
                  "permission",
                  "available",
                ]}
              >
                {(title) => <th>{t(`users.${title}`)}</th>}
              </For>
              <th>{t("global.operations")}</th>
            </tr>
          </thead>
          <tbody>
            <For each={users()}>
              {(user) => (
                <tr>
                  <td>{user.username}</td>
                  <td>{user.base_path}</td>
                  <td>
                    <Role role={user.role} />
                  </td>
                  <td>
                    <Permissions user={user} />
                  </td>
                  <td>
                    <Wether yes={!user.disabled} />
                  </td>
                  <td>
                    <HStack spacing="$2">
                      <AppButton
                        onClick={() => {
                          to(`/@manage/users/edit/${user.id}`)
                        }}
                      >
                        {t("global.edit")}
                      </AppButton>
                      <DeletePopover
                        name={user.username}
                        loading={deleting() === user.id}
                        onClick={async () => {
                          const resp = await deleteUser(user.id)
                          handleResp(resp, () => {
                            notify.success(t("global.delete_success"))
                            refresh()
                          })
                        }}
                      />
                      <AppButton
                        colorScheme="accent"
                        loading={cancel_2faId() === user.id}
                        onClick={async () => {
                          const resp = await cancel_2fa(user.id)
                          handleResp(resp, () => {
                            notify.success(t("users.cancel_2fa_success"))
                            refresh()
                          })
                        }}
                      >
                        {t("users.cancel_2fa")}
                      </AppButton>
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

export default Users
