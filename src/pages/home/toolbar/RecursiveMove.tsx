import { AppHStack as HStack } from "~/components/ui/Stack"
import { AppButton } from "~/components/ui/Button"
import {
  AppModal,
  AppModalBody,
  AppModalContent,
  AppModalFooter,
  AppModalHeader,
  AppModalOverlay,
} from "~/components/ui/Modal"
import { createDisclosure } from "~/hooks/disclosure"
import { ModalFolderChoose } from "~/components/FolderTree"
import { useFetch, usePath, useRouter, useT } from "~/hooks"
import {
  bus,
  fsRecursiveMove,
  handleRespWithNotifySuccess,
  type RecursiveMoveConflictPolicy,
} from "~/utils"
import { createSignal, onCleanup } from "solid-js"
import { AppSelect } from "~/components/ui/Select"

export const RecursiveMove = () => {
  const {
    isOpen: isConfirmModalOpen,
    onOpen: openConfirmModal,
    onClose: closeConfirmModal,
  } = createDisclosure()
  const { isOpen, onOpen, onClose } = createDisclosure()
  const [loading, ok] = useFetch(fsRecursiveMove)
  const { pathname } = useRouter()
  const { refresh } = usePath()
  const [conflictPolicy, setConflictPolicy] =
    createSignal<RecursiveMoveConflictPolicy>("cancel")
  const handler = (name: string) => {
    if (name === "recursiveMove") {
      openConfirmModal()
      setConflictPolicy("cancel")
    }
  }
  bus.on("tool", handler)
  onCleanup(() => {
    bus.off("tool", handler)
  })
  const t = useT()
  return (
    <>
      <AppModal
        blockScrollOnMount={false}
        opened={isConfirmModalOpen()}
        onClose={() => closeConfirmModal()}
        size={{
          "@initial": "xs",
          "@md": "md",
        }}
      >
        <AppModalOverlay />
        <AppModalContent>
          <AppModalHeader>{t("home.toolbar.recursive_move")}</AppModalHeader>
          <AppModalBody>
            <p>{t("home.toolbar.recursive_move_directory-tips")}</p>
          </AppModalBody>
          <AppModalFooter>
            <AppButton
              onClick={() => closeConfirmModal()}
              colorScheme="neutral"
            >
              {t("global.cancel")}
            </AppButton>
            <AppButton
              onClick={() => {
                closeConfirmModal()
                onOpen()
              }}
              colorScheme="danger"
            >
              {t("global.confirm")}
            </AppButton>
          </AppModalFooter>
        </AppModalContent>
      </AppModal>

      <ModalFolderChoose
        header={t("home.toolbar.choose_dst_folder")}
        opened={isOpen()}
        onClose={onClose}
        loading={loading()}
        footerSlot={
          <HStack mr="auto" flex="0.8" spacing="$1">
            <AppSelect
              value={conflictPolicy()}
              onChange={(value) => setConflictPolicy(value)}
              options={[
                {
                  value: "cancel",
                  label: t("home.conflict_policy.cancel_if_exists"),
                },
                {
                  value: "overwrite",
                  label: t("home.conflict_policy.overwrite_existing"),
                },
                {
                  value: "skip",
                  label: t("home.conflict_policy.skip_existing"),
                },
              ]}
            />
          </HStack>
        }
        onSubmit={async (dst) => {
          const resp = await ok(pathname(), dst, conflictPolicy())
          handleRespWithNotifySuccess(resp, () => {
            refresh()
            onClose()
          })
        }}
      />
    </>
  )
}
