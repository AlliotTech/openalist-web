import { VStack, Heading, HStack, Text, Badge, Box } from "@hope-ui/solid"
import { AppButton, AppIconButton } from "~/components/ui/Button"
import { AppInput } from "~/components/ui/Input"
import { AppProgress } from "~/components/ui/Loading"
import { createSignal, For, Show, onMount, onCleanup } from "solid-js"
import { usePath, useRouter, useT } from "~/hooks"
import { getMainColor } from "~/store"
import {
  RiDocumentFolderUploadFill,
  RiDocumentFileUploadFill,
} from "solid-icons/ri"
import { getFileSize, notify, pathJoin } from "~/utils"
import { asyncPool } from "~/utils/async_pool"
import { createStore } from "solid-js/store"
import { UploadFileProps, StatusBadge } from "./types"
import { File2Upload, traverseFileTree } from "./util"
import { SelectWrapper } from "~/components"
import { getUploads } from "./uploads"
import { AppCheckbox } from "~/components/ui/Checkbox"

const UploadFile = (props: UploadFileProps) => {
  const t = useT()
  return (
    <VStack
      w="$full"
      spacing="$1"
      rounded="$lg"
      border="1px solid $neutral7"
      alignItems="start"
      p="$2"
      _hover={{
        border: `1px solid ${getMainColor()}`,
      }}
    >
      <Text
        css={{
          wordBreak: "break-all",
        }}
      >
        {props.path}
      </Text>
      <HStack spacing="$2">
        <Badge colorScheme={StatusBadge[props.status]}>
          {t(`home.upload.${props.status}`)}
        </Badge>
        <Text>{getFileSize(props.speed)}/s</Text>
      </HStack>
      <AppProgress
        w="$full"
        trackColor="$info3"
        rounded="$full"
        value={props.progress}
        size="sm"
        color={getMainColor()}
      />
      <Text color="$danger10">{props.msg}</Text>
    </VStack>
  )
}

const Upload = () => {
  const t = useT()
  const { pathname } = useRouter()
  const { refresh } = usePath()
  const [drag, setDrag] = createSignal(false)
  const [uploading, setUploading] = createSignal(false)
  const [asTask, setAsTask] = createSignal(false)
  const [overwrite, setOverwrite] = createSignal(false)
  const [rapid, setRapid] = createSignal(true)
  const [uploadFiles, setUploadFiles] = createStore<{
    uploads: UploadFileProps[]
  }>({
    uploads: [],
  })
  const allDone = () => {
    return uploadFiles.uploads.every(({ status }) =>
      ["success", "error"].includes(status),
    )
  }
  let fileInput!: HTMLInputElement
  let folderInput!: HTMLInputElement
  const handleAddFiles = async (files: File[]) => {
    if (files.length === 0) return
    setUploading(true)
    for (const file of files) {
      const upload = File2Upload(file)
      setUploadFiles("uploads", (uploads) => [...uploads, upload])
    }
    for await (const ms of asyncPool(3, files, handleFile)) {
      console.log(ms)
    }
    refresh(undefined, true)
  }
  const setUpload = (path: string, key: keyof UploadFileProps, value: any) => {
    setUploadFiles("uploads", (upload) => upload.path === path, key, value)
  }
  const uploaders = getUploads()
  const [curUploader, setCurUploader] = createSignal(uploaders[0])
  const handleFile = async (file: File) => {
    const path = file.webkitRelativePath ? file.webkitRelativePath : file.name
    setUpload(path, "status", "uploading")
    const uploadPath = pathJoin(pathname(), path)
    try {
      const err = await curUploader().upload(
        uploadPath,
        file,
        (key, value) => {
          setUpload(path, key, value)
        },
        asTask(),
        overwrite(),
        rapid(),
      )
      if (!err) {
        setUpload(path, "status", "success")
        setUpload(path, "progress", 100)
      } else {
        setUpload(path, "status", "error")
        setUpload(path, "msg", err.message)
      }
    } catch (e: any) {
      console.error(e)
      setUpload(path, "status", "error")
      setUpload(path, "msg", e.message)
    }
  }
  onMount(() => {
    const handlePaste = async (e: ClipboardEvent) => {
      e.preventDefault()
      e.stopPropagation()
      const res: File[] = []
      const items = Array.from(e.clipboardData?.items ?? [])
      const files = Array.from(e.clipboardData?.files ?? [])
      let itemLength = items.length
      const folderEntries = []
      for (let i = 0; i < itemLength; i++) {
        const item = items[i]
        const entry = item.webkitGetAsEntry()
        if (entry?.isFile) {
          res.push(files[i])
        } else if (entry?.isDirectory) {
          folderEntries.push(entry)
        }
      }
      for (const entry of folderEntries) {
        const innerFiles = await traverseFileTree(entry)
        res.push(...innerFiles)
      }
      if (res.length > 0) {
        handleAddFiles(res)
      }
    }
    window.addEventListener("paste", handlePaste)
    onCleanup(() => window.removeEventListener("paste", handlePaste))
  })
  return (
    <VStack w="$full" pb="$2" spacing="$2">
      <Show
        when={!uploading()}
        fallback={
          <>
            <HStack spacing="$2">
              <AppButton
                colorScheme="accent"
                onClick={() => {
                  setUploadFiles("uploads", (_uploads) =>
                    _uploads.filter(
                      ({ status }) => !["success", "error"].includes(status),
                    ),
                  )
                  console.log(uploadFiles.uploads)
                }}
              >
                {t("home.upload.clear_done")}
              </AppButton>
              <Show when={allDone()}>
                <AppButton
                  onClick={() => {
                    setUploading(false)
                  }}
                >
                  {t("home.upload.back")}
                </AppButton>
              </Show>
            </HStack>
            <For each={uploadFiles.uploads}>
              {(upload) => <UploadFile {...upload} />}
            </For>
          </>
        }
      >
        <AppInput
          type="file"
          multiple
          ref={fileInput!}
          display="none"
          onChange={(e) => {
            // @ts-ignore
            handleAddFiles(Array.from(e.target.files ?? []))
          }}
        />
        <AppInput
          type="file"
          multiple
          // @ts-ignore
          webkitdirectory
          ref={folderInput!}
          display="none"
          onChange={(e) => {
            // @ts-ignore
            handleAddFiles(Array.from(e.target.files ?? []))
          }}
        />
        <VStack
          w="$full"
          justifyContent="center"
          border={`2px dashed ${drag() ? getMainColor() : "$neutral8"}`}
          rounded="$lg"
          onDragOver={(e: DragEvent) => {
            e.preventDefault()
            setDrag(true)
          }}
          onDragLeave={() => {
            setDrag(false)
          }}
          onDrop={async (e: DragEvent) => {
            e.preventDefault()
            e.stopPropagation()
            setDrag(false)
            const res: File[] = []
            const items = Array.from(e.dataTransfer?.items ?? [])
            const files = Array.from(e.dataTransfer?.files ?? [])
            let itemLength = items.length
            const folderEntries = []
            for (let i = 0; i < itemLength; i++) {
              const item = items[i]
              const entry = item.webkitGetAsEntry()
              if (entry?.isFile) {
                res.push(files[i])
              } else if (entry?.isDirectory) {
                folderEntries.push(entry)
              }
            }
            for (const entry of folderEntries) {
              const innerFiles = await traverseFileTree(entry)
              res.push(...innerFiles)
            }
            if (res.length === 0) {
              notify.warning(t("home.upload.no_files_drag"))
            }
            handleAddFiles(res)
          }}
          spacing="$4"
          // py="$4"
          h="$56"
        >
          <Show
            when={!drag()}
            fallback={<Heading>{t("home.upload.release")}</Heading>}
          >
            <Heading>{t("home.upload.upload-tips")}</Heading>
            <Box w="30%">
              <SelectWrapper
                value={curUploader().name}
                onChange={(name) => {
                  setCurUploader(
                    uploaders.find((uploader) => uploader.name === name)!,
                  )
                }}
                options={uploaders.map((uploader) => {
                  return {
                    label: uploader.name,
                    value: uploader.name,
                  }
                })}
              />
            </Box>
            <HStack spacing="$4">
              <AppIconButton
                compact
                size="xl"
                aria-label={t("home.upload.upload_folder")}
                colorScheme="accent"
                icon={<RiDocumentFolderUploadFill />}
                onClick={() => {
                  folderInput.click()
                }}
              />
              <AppIconButton
                compact
                size="xl"
                aria-label={t("home.upload.upload_files")}
                icon={<RiDocumentFileUploadFill />}
                onClick={() => {
                  fileInput.click()
                }}
              />
            </HStack>
            <HStack spacing="$4">
              <AppCheckbox checked={asTask()} onChange={setAsTask}>
                {t("home.upload.add_as_task")}
              </AppCheckbox>
              <AppCheckbox checked={overwrite()} onChange={setOverwrite}>
                {t("home.conflict_policy.overwrite_existing")}
              </AppCheckbox>
              <AppCheckbox checked={rapid()} onChange={setRapid}>
                {t("home.upload.try_rapid")}
              </AppCheckbox>
            </HStack>
          </Show>
        </VStack>
      </Show>
    </VStack>
  )
}

export default Upload
