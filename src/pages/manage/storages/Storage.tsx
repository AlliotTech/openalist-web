import { Badge, Text, useColorModeValue } from "@hope-ui/solid"
import { AppBox as Box } from "~/components/ui/Layout"
import { AppHStack as HStack, AppVStack as VStack } from "~/components/ui/Stack"
import { AppButton } from "~/components/ui/Button"
import { useFetch, useRouter, useT } from "~/hooks"
import { getMainColor } from "~/store"
import { PEmptyResp, Storage } from "~/types"
import { handleResp, handleRespWithNotifySuccess, notify, r } from "~/utils"
import { DeletePopover } from "../common/DeletePopover"

interface StorageProps {
  storage: Storage
  refresh: () => void
}

function StorageOp(props: StorageProps) {
  const t = useT()
  const { to } = useRouter()
  const [deleteLoading, deleteStorage] = useFetch((): PEmptyResp =>
    r.post(`/admin/storage/delete?id=${props.storage.id}`),
  )
  const [enableOrDisableLoading, enableOrDisable] = useFetch((): PEmptyResp =>
    r.post(
      `/admin/storage/${props.storage.disabled ? "enable" : "disable"}?id=${
        props.storage.id
      }`,
    ),
  )
  return (
    <>
      <AppButton
        onClick={() => {
          to(`/@manage/storages/edit/${props.storage.id}`)
        }}
      >
        {t("global.edit")}
      </AppButton>
      <AppButton
        loading={enableOrDisableLoading()}
        colorScheme={props.storage.disabled ? "success" : "warning"}
        onClick={async () => {
          const resp = await enableOrDisable()
          handleRespWithNotifySuccess(resp, () => {
            props.refresh()
          })
        }}
      >
        {t(`global.${props.storage.disabled ? "enable" : "disable"}`)}
      </AppButton>
      <DeletePopover
        name={props.storage.mount_path}
        loading={deleteLoading()}
        onClick={async () => {
          const resp = await deleteStorage()
          handleResp(resp, () => {
            notify.success(t("global.delete_success"))
            props.refresh()
          })
        }}
      />
    </>
  )
}

export function StorageGridItem(props: StorageProps) {
  const t = useT()
  return (
    <VStack
      w="$full"
      spacing="$2"
      rounded="$lg"
      border="1px solid $neutral7"
      background={useColorModeValue("$neutral2", "$neutral3")()}
      // alignItems="start"
      p="$3"
      _hover={{
        border: `1px solid ${getMainColor()}`,
      }}
    >
      <HStack spacing="$2">
        <Text
          fontWeight="$medium"
          css={{
            wordBreak: "break-all",
          }}
        >
          {props.storage.mount_path}
        </Text>
        <Badge colorScheme="info">
          {t(`drivers.drivers.${props.storage.driver}`)}
        </Badge>
      </HStack>
      <HStack>
        <Text>{t("storages.common.status")}:&nbsp;</Text>
        <Box
          css={{ "word-break": "break-all" }}
          overflowX="auto"
          innerHTML={props.storage.status}
        />
      </HStack>
      <Text css={{ wordBreak: "break-all" }}>{props.storage.remark}</Text>
      <HStack spacing="$2">
        <StorageOp {...props} />
      </HStack>
    </VStack>
  )
}

export function StorageListItem(props: StorageProps) {
  const t = useT()
  return (
    <tr>
      <td>{props.storage.mount_path}</td>
      <td>{t(`drivers.drivers.${props.storage.driver}`)}</td>
      <td>{props.storage.order}</td>
      <td>{props.storage.status}</td>
      <td>{props.storage.remark}</td>
      <td>
        <HStack spacing="$2">
          <StorageOp {...props} />
        </HStack>
      </td>
    </tr>
  )
}
