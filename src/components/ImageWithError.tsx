import { AppImage as Image, type AppImageProps } from "~/components/ui/Image"
import { createSignal, JSXElement, Show } from "solid-js"

export const ImageWithError = (
  props: AppImageProps & {
    fallbackErr?: JSXElement
  },
) => {
  const [err, setErr] = createSignal(false)
  return (
    <Show when={!err()} fallback={props.fallbackErr}>
      <Image
        {...props}
        onError={() => {
          setErr(true)
        }}
      />
    </Show>
  )
}
