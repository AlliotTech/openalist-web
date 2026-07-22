import { Button, createDisclosure } from "@hope-ui/solid"
import { createSignal, lazy, onCleanup, Show, Suspense } from "solid-js"
import { FullLoading } from "~/components"
import { useT, useDownload } from "~/hooks"
import { getSettingBool, me } from "~/store"
import { UserMethods } from "~/types"
import { bus } from "~/utils"
import { CenterIcon } from "./Icon"
import { AppMenu } from "~/components/ui/Menu"
import {
  AppModal,
  AppModalBody,
  AppModalContent,
  AppModalFooter,
  AppModalHeader,
  AppModalOverlay,
} from "~/components/ui/Modal"

export const Download = () => {
  const t = useT()
  const { batchDownloadSelected, sendToAria2, playlistDownloadSelected } =
    useDownload()
  return (
    <AppMenu placement="top" gutter={10}>
      <AppMenu.Trigger
        as={CenterIcon}
        class="app-menu__trigger"
        name="download"
      />
      <AppMenu.Portal>
        <AppMenu.Content class="app-menu__content">
          <AppMenu.Item class="app-menu__item" onSelect={batchDownloadSelected}>
            {t("home.toolbar.batch_download")}
          </AppMenu.Item>
          <Show
            when={
              UserMethods.is_admin(me()) || getSettingBool("package_download")
            }
          >
            <AppMenu.Item
              class="app-menu__item"
              onSelect={() => {
                bus.emit("tool", "package_download")
              }}
            >
              {t("home.toolbar.package_download")}
            </AppMenu.Item>
            <AppMenu.Item
              class="app-menu__item"
              onSelect={playlistDownloadSelected}
            >
              {t("home.toolbar.playlist_download")}
            </AppMenu.Item>
          </Show>
          <AppMenu.Item class="app-menu__item" onSelect={sendToAria2}>
            {t("home.toolbar.send_aria2")}
          </AppMenu.Item>
        </AppMenu.Content>
      </AppMenu.Portal>
    </AppMenu>
  )
}

const PackageDownload = lazy(() => import("./PackageDownload"))

export const PackageDownloadModal = () => {
  const t = useT()
  const handler = (name: string) => {
    if (name === "package_download") {
      if (!getSettingBool("package_download")) return
      onOpen()
    }
  }
  bus.on("tool", handler)
  onCleanup(() => {
    bus.off("tool", handler)
  })
  const { isOpen, onOpen, onClose } = createDisclosure()
  const [show, setShow] = createSignal("pre_tips")
  return (
    <AppModal
      blockScrollOnMount={false}
      opened={isOpen()}
      onClose={onClose}
      closeOnOverlayClick={false}
      closeOnEsc={false}
      // size={{
      //   "@initial": "xs",
      //   "@md": "md",
      // }}
    >
      <AppModalOverlay />
      <AppModalContent>
        <AppModalHeader>{t("home.toolbar.package_download")}</AppModalHeader>
        <Suspense fallback={<FullLoading />}>
          <Show
            when={show() === "pre_tips"}
            fallback={<PackageDownload onClose={onClose} />}
          >
            <AppModalBody>
              <p>{t("home.toolbar.pre_package_download-tips")}</p>
            </AppModalBody>
            <AppModalFooter>
              <Button onClick={onClose} colorScheme="neutral">
                {t("global.cancel")}
              </Button>
              <Button
                colorScheme="info"
                onClick={() => {
                  setShow("package_download")
                }}
              >
                {t("global.confirm")}
              </Button>
            </AppModalFooter>
          </Show>
        </Suspense>
      </AppModalContent>
    </AppModal>
  )
}
