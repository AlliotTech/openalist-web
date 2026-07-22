import { AppButton } from "~/components/ui/Button"
import { createDisclosure } from "~/hooks/disclosure"
import {
  AppModal,
  AppModalBody,
  AppModalContent,
  AppModalFooter,
  AppModalHeader,
  AppModalOverlay,
} from "~/components/ui/Modal"
import { onCleanup } from "solid-js"
import { useFetch, usePath, useRouter, useT } from "~/hooks"
import { selectedObjs } from "~/store"
import { bus, fsRemove, handleRespWithNotifySuccess } from "~/utils"

export const Delete = () => {
  const t = useT()
  const { isOpen, onOpen, onClose } = createDisclosure()
  const [loading, ok] = useFetch(fsRemove)
  const { refresh } = usePath()
  const { pathname } = useRouter()
  const handler = (name: string) => {
    if (name === "delete") {
      onOpen()
    }
  }
  bus.on("tool", handler)
  onCleanup(() => {
    bus.off("tool", handler)
  })
  return (
    <AppModal
      blockScrollOnMount={false}
      opened={isOpen()}
      onClose={onClose}
      size={{
        "@initial": "xs",
        "@md": "md",
      }}
    >
      <AppModalOverlay />
      <AppModalContent>
        <AppModalHeader>{t("home.toolbar.delete")}</AppModalHeader>
        <AppModalBody>
          <p>{t("home.toolbar.delete-tips")}</p>
        </AppModalBody>
        <AppModalFooter>
          <AppButton onClick={onClose} colorScheme="neutral">
            {t("global.cancel")}
          </AppButton>
          <AppButton
            colorScheme="danger"
            loading={loading()}
            onClick={async () => {
              const resp = await ok(
                pathname(),
                selectedObjs().map((obj) => obj.name),
              )
              handleRespWithNotifySuccess(resp, () => {
                refresh()
                onClose()
              })
            }}
          >
            {t("global.confirm")}
          </AppButton>
        </AppModalFooter>
      </AppModalContent>
    </AppModal>
  )
}
