import { useColorModeValue } from "~/components/ui/ColorMode"
import { AppBox as Box } from "~/components/ui/Layout"
import { createMemo, Show, createResource, lazy, on, Suspense } from "solid-js"
import { FullLoading, MaybeLoading } from "~/components/FullLoading"
import { useLink } from "~/hooks/useLink"
import { useRouter } from "~/hooks/useRouter"
import { objStore, State } from "~/store/obj"
import { getSettingBool } from "~/store/settings"
import { fetchText } from "~/utils/api"

const Markdown = lazy(() => import("~/components/Markdown"))

export function Readme(props: {
  files: string[]
  fromMeta: keyof typeof objStore
}) {
  const cardBg = useColorModeValue("white", "$neutral3")
  const { proxyLink } = useLink()
  const { pathname } = useRouter()
  const readme = createMemo(
    on(
      () => objStore.state,
      () => {
        if (
          ![State.FetchingMore, State.Folder, State.File].includes(
            objStore.state,
          )
        ) {
          return ""
        }
        if ([State.FetchingMore, State.Folder].includes(objStore.state)) {
          const obj = objStore.objs.find((item) =>
            props.files.find(
              (file) => file.toLowerCase() === item.name.toLowerCase(),
            ),
          )
          if (obj) {
            return proxyLink(obj, true)
          }
        }
        if (
          objStore[props.fromMeta] &&
          typeof objStore[props.fromMeta] === "string"
        ) {
          return objStore[props.fromMeta] as string
        }
        return ""
      },
    ),
  )
  const fetchContent = async (readme: string) => {
    let res = {
      content: readme as string | ArrayBuffer,
    }
    if (/^https?:\/\//g.test(readme)) {
      res = await fetchText(readme)
    }
    return res
  }
  const [content] = createResource(readme, fetchContent)
  return (
    <Show when={getSettingBool("readme_autorender") && readme()}>
      <Box w="$full" rounded="$xl" p="$4" bgColor={cardBg()} shadow="$lg">
        <MaybeLoading loading={content.loading}>
          <Suspense fallback={<FullLoading />}>
            <Markdown
              children={content()?.content}
              readme
              toc={props.fromMeta === "readme"}
            />
          </Suspense>
        </MaybeLoading>
      </Box>
    </Show>
  )
}
