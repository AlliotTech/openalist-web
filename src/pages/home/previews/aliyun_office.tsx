import { AppBox as Box } from "~/components/ui/Layout"
import { FullLoading } from "~/components/FullLoading"
import { useFetch, useRouter } from "~/hooks"
import { password } from "~/store"
import { PResp } from "~/types"
import { handleResp, r } from "~/utils"
import { createSignal, onCleanup, Show } from "solid-js"

const officeSdkUrl =
  "https://g.alicdn.com/IMM/office-js/1.1.5/aliyun-web-office-sdk.min.js"
let officeSdkLoading: Promise<void> | undefined

const loadOfficeSdk = () => {
  if (typeof aliyun !== "undefined") return Promise.resolve()
  if (officeSdkLoading) return officeSdkLoading

  officeSdkLoading = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script")
    script.src = officeSdkUrl
    script.async = true
    script.dataset.aliyunOfficeSdk = "true"
    script.onload = () => resolve()
    script.onerror = () => {
      script.remove()
      officeSdkLoading = undefined
      reject(new Error("failed to load Aliyun Office SDK"))
    }
    document.head.appendChild(script)
  })
  return officeSdkLoading
}

const AliDocPreview = () => {
  const { pathname } = useRouter()
  const [initializing, setInitializing] = createSignal(true)
  let disposed = false
  const [loading, post] = useFetch(
    (): PResp<{ access_token: string; preview_url: string }> =>
      r.post("/fs/other", {
        path: pathname(),
        password: password(),
        method: "doc_preview",
      }),
  )
  const init = async () => {
    const [resp] = await Promise.all([post(), loadOfficeSdk()])
    if (disposed) return
    handleResp(resp, (data) => {
      const mount = document.querySelector("#office-preview")
      if (!mount) return
      const docOptions = aliyun.config({
        mount,
        url: data.preview_url,
      })
      docOptions.setToken({ token: data.access_token })
    })
  }
  void init()
    .catch((error) =>
      console.error("failed to initialize office preview", error),
    )
    .finally(() => setInitializing(false))
  onCleanup(() => {
    disposed = true
  })
  return (
    <Box w="$full" h="70vh" pos="relative">
      <Box w="$full" h="$full" id="office-preview" />
      <Show when={loading() || initializing()}>
        <Box
          pos="absolute"
          top="0"
          right="0"
          bottom="0"
          left="0"
          bgColor="$background"
        >
          <FullLoading />
        </Box>
      </Show>
    </Box>
  )
}

export default AliDocPreview
