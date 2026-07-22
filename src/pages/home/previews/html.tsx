import { Show, createSignal } from "solid-js"
import { BoxWithFullScreen, EncodingSelect, MaybeLoading } from "~/components"
import { useFetchText, useParseText } from "~/hooks"

function Html(props: { children?: string | ArrayBuffer }) {
  const [encoding, setEncoding] = createSignal<string>("utf-8")
  const { isString, text } = useParseText(props.children)
  return (
    <BoxWithFullScreen w="$full" h="70vh" pos="relative">
      <iframe
        style={{
          width: "100%",
          height: "100%",
          "border-radius": "var(--hope-radii-lg)",
          "box-shadow": "var(--hope-shadows-md)",
        }}
        srcdoc={text(encoding())}
      />
      <Show when={!isString}>
        <EncodingSelect
          encoding={encoding()}
          setEncoding={setEncoding}
          referenceText={props.children}
        />
      </Show>
    </BoxWithFullScreen>
  )
}

const HtmlPreview = () => {
  const [content] = useFetchText()

  return (
    <MaybeLoading loading={content.loading}>
      <Html>{content()?.content}</Html>
    </MaybeLoading>
  )
}

export default HtmlPreview
