import { HStack, Text, VStack } from "@hope-ui/solid"
import { AppInput } from "~/components/ui/Input"
import { createDisclosure } from "~/hooks/disclosure"
import { useFetch, usePath, useRouter, useT } from "~/hooks"
import { bus, fsArchiveDecompress, handleRespWithNotifySuccess } from "~/utils"
import { batch, createSignal, onCleanup } from "solid-js"
import { ModalFolderChoose } from "~/components"
import { selectedObjs } from "~/store"
import { AppCheckbox } from "~/components/ui/Checkbox"

export const Decompress = () => {
  const t = useT()
  const { isOpen, onOpen, onClose } = createDisclosure()
  const [loading, ok] = useFetch(fsArchiveDecompress)
  const { pathname } = useRouter()
  const { refresh } = usePath()
  const [innerPath, setInnerPath] = createSignal("")
  const [archivePass, setArchivePass] = createSignal("")
  const [cacheFull, setCacheFull] = createSignal(true)
  const [putIntoNewDir, setPutIntoNewDir] = createSignal(false)
  const handler = (name: string) => {
    if (name === "decompress") {
      batch(() => {
        setCacheFull(true)
        setInnerPath("/")
        setArchivePass("")
      })
      onOpen()
    }
  }
  const extractHandler = (args: string) => {
    const { inner, pass } = JSON.parse(args)
    batch(() => {
      setCacheFull(false)
      setInnerPath(inner)
      setArchivePass(pass)
    })
    onOpen()
  }
  bus.on("tool", handler)
  bus.on("extract", extractHandler)
  onCleanup(() => {
    bus.off("tool", handler)
    bus.off("extract", extractHandler)
  })
  const header = () => {
    if (innerPath() === "/") {
      return t("home.toolbar.choose_dst_folder")
    }
    return t("home.toolbar.archive.extract_header", { path: innerPath() })
  }
  const getPathAndName = () => {
    let path = pathname()
    if (innerPath() === "/") {
      return { path: path, name: selectedObjs().map((o) => o.name) }
    } else {
      let idx = path.lastIndexOf("/")
      return { path: path.slice(0, idx), name: [path.slice(idx + 1)] }
    }
  }
  return (
    <ModalFolderChoose
      header={header()}
      opened={isOpen()}
      onClose={onClose}
      loading={loading()}
      onSubmit={async (dst) => {
        const { path, name } = getPathAndName()
        const resp = await ok(
          path,
          dst,
          name,
          archivePass(),
          innerPath(),
          cacheFull(),
          putIntoNewDir(),
        )
        handleRespWithNotifySuccess(resp, () => {
          refresh()
          onClose()
        })
      }}
    >
      <VStack spacing="$1" alignItems="flex-start">
        <HStack width="100%" spacing="$1">
          <Text size="sm" css={{ whiteSpace: "nowrap" }}>
            {t(`home.toolbar.decompress-pass`)}
          </Text>
          <AppInput
            value={archivePass()}
            onInput={(e: any) => setArchivePass(e.target.value as string)}
            size="sm"
            flexGrow="1"
          />
        </HStack>
        <AppCheckbox checked={cacheFull()} onChange={setCacheFull}>
          {t(`home.toolbar.decompress-cache-full`)}
        </AppCheckbox>
        <AppCheckbox checked={putIntoNewDir()} onChange={setPutIntoNewDir}>
          {t(`home.toolbar.decompress-put-into-new`)}
        </AppCheckbox>
        <div />
      </VStack>
    </ModalFolderChoose>
  )
}
