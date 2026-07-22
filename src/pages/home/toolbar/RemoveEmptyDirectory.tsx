import { Button } from "@hope-ui/solid"
import { createDisclosure } from "~/hooks/disclosure"
import {
  AppModal,
  AppModalBody,
  AppModalContent,
  AppModalFooter,
  AppModalHeader,
  AppModalOverlay,
} from "~/components/ui/Modal"
import { useFetch, usePath, useRouter, useT } from "~/hooks"
import {
  bus,
  fsRemoveEmptyDirectory,
  handleRespWithNotifySuccess,
} from "~/utils"
import { onCleanup } from "solid-js"

export const RemoveEmptyDirectory = () => {
  const { isOpen, onOpen, onClose } = createDisclosure()
  const { pathname } = useRouter()
  const [loading, ok] = useFetch(fsRemoveEmptyDirectory)
  const { refresh } = usePath()
  const handler = (name: string) => {
    if (name === "removeEmptyDirectory") {
      onOpen()
    }
  }
  bus.on("tool", handler)
  onCleanup(() => {
    bus.off("tool", handler)
  })
  const t = useT()
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
        <AppModalHeader>
          {t("home.toolbar.remove_empty_directory")}
        </AppModalHeader>
        <AppModalBody>
          <p>{t("home.toolbar.remove_empty_directory-tips")}</p>
        </AppModalBody>
        <AppModalFooter>
          <Button onClick={onClose} colorScheme="neutral">
            {t("global.cancel")}
          </Button>
          <Button
            colorScheme="danger"
            loading={loading()}
            onClick={async () => {
              const resp = await ok(pathname())
              handleRespWithNotifySuccess(resp, () => {
                refresh()
                onClose()
              })
            }}
          >
            {t("global.confirm")}
          </Button>
        </AppModalFooter>
      </AppModalContent>
    </AppModal>
  )
}
