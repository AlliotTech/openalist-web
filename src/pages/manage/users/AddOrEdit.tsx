import { Flex, Heading } from "@hope-ui/solid"
import { AppVStack as VStack } from "~/components/ui/Stack"
import {
  AppFormControl as FormControl,
  AppFormLabel as FormLabel,
} from "~/components/ui/Form"
import { AppButton } from "~/components/ui/Button"
import { AppInput } from "~/components/ui/Input"
import { MaybeLoading, FolderChooseInput } from "~/components"
import { useFetch, useRouter, useT } from "~/hooks"
import { handleResp, notify, r } from "~/utils"
import {
  PEmptyResp,
  PResp,
  Resp,
  User,
  UserMethods,
  UserPermissions,
} from "~/types"
import { createStore } from "solid-js/store"
import { For, Show } from "solid-js"
import { me, Me, setMe } from "~/store"
import { PublicKeys } from "./PublicKeys"
import { AppCheckbox } from "~/components/ui/Checkbox"

const Permission = (props: {
  can: boolean
  onChange: (val: boolean) => void
  name: string
}) => {
  const t = useT()
  return (
    <FormControl
      display="inline-flex"
      flexDirection="row"
      alignItems="center"
      gap="$2"
      rounded="$md"
      shadow="$md"
      p="$2"
      w="fit-content"
    >
      <FormLabel mb="0">{t(`users.permissions.${props.name}`)}</FormLabel>
      <AppCheckbox checked={props.can} onChange={props.onChange} />
    </FormControl>
  )
}

const AddOrEdit = () => {
  const t = useT()
  const { params, back } = useRouter()
  const { id } = params
  const [user, setUser] = createStore<User>({
    id: 0,
    username: "",
    password: "",
    base_path: "",
    role: 0,
    permission: 0,
    disabled: false,
    sso_id: "",
  })
  const [userLoading, loadUser] = useFetch((): PResp<User> =>
    r.get(`/admin/user/get?id=${id}`),
  )

  const initEdit = async () => {
    const resp = await loadUser()
    handleResp(resp, (data) => setUser(data))
  }
  if (id) {
    initEdit()
  }
  const [okLoading, ok] = useFetch((): PEmptyResp => {
    return r.post(`/admin/user/${id ? "update" : "create"}`, user)
  })
  return (
    <MaybeLoading loading={userLoading()}>
      <VStack w="$full" alignItems="start" spacing="$2">
        <Heading>{t(`global.${id ? "edit" : "add"}`)}</Heading>
        <Show when={!UserMethods.is_guest(user)}>
          <FormControl w="$full" display="flex" flexDirection="column" required>
            <FormLabel for="username" display="flex" alignItems="center">
              {t(`users.username`)}
            </FormLabel>
            <AppInput
              id="username"
              value={user.username}
              onInput={(e) => setUser("username", e.currentTarget.value)}
            />
          </FormControl>
          <FormControl w="$full" display="flex" flexDirection="column" required>
            <FormLabel for="password" display="flex" alignItems="center">
              {t(`users.password`)}
            </FormLabel>
            <AppInput
              id="password"
              type="password"
              placeholder="********"
              value={user.password}
              onInput={(e) => setUser("password", e.currentTarget.value)}
            />
          </FormControl>
        </Show>

        <FormControl w="$full" display="flex" flexDirection="column" required>
          <FormLabel for="base_path" display="flex" alignItems="center">
            {t(`users.base_path`)}
          </FormLabel>
          <FolderChooseInput
            id="base_path"
            value={user.base_path}
            onChange={(path) => setUser("base_path", path)}
            onlyFolder
          />
        </FormControl>
        <FormControl w="$full" required>
          <FormLabel display="flex" alignItems="center">
            {t(`users.permission`)}
          </FormLabel>
          <Flex w="$full" wrap="wrap" gap="$2">
            <For each={UserPermissions}>
              {(item, i) => (
                <Permission
                  name={item}
                  can={UserMethods.can(user, i())}
                  onChange={(val) => {
                    if (val) {
                      setUser("permission", (user.permission |= 1 << i()))
                    } else {
                      setUser("permission", (user.permission &= ~(1 << i())))
                    }
                  }}
                />
              )}
            </For>
          </Flex>
        </FormControl>
        <FormControl w="fit-content" display="flex">
          <AppCheckbox
            style={{ "white-space": "nowrap" }}
            id="disabled"
            onChange={(checked) => setUser("disabled", checked)}
            checked={user.disabled}
          >
            {t(`users.disabled`)}
          </AppCheckbox>
        </FormControl>
        <AppButton
          loading={okLoading()}
          onClick={async () => {
            const resp = await ok()
            // TODO maybe can use handleRespWithNotifySuccess
            handleResp(resp, async () => {
              notify.success(t("global.save_success"))
              if (user.username === me().username) {
                const meResp: Resp<Me> = await r.get("/me")
                handleResp(meResp, (data) => setMe(data))
              }
              back()
            })
          }}
        >
          {t(`global.${id ? "save" : "add"}`)}
        </AppButton>
        <Show when={id && !UserMethods.is_guest(user)}>
          <PublicKeys isMine={false} userId={parseInt(id!)} />
        </Show>
      </VStack>
    </MaybeLoading>
  )
}

export default AddOrEdit
