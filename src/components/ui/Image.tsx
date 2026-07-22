import {
  createSignal,
  Show,
  splitProps,
  type JSX,
  type ParentProps,
} from "solid-js"
import "./image.css"

const token = (value: string | undefined, group: string) =>
  value?.startsWith("$") ? `var(--hope-${group}-${value.slice(1)})` : value

export type AppImageProps = ParentProps<
  Omit<JSX.ImgHTMLAttributes<HTMLImageElement>, "style"> & {
    style?: JSX.CSSProperties
    fallback?: JSX.Element
    boxSize?: string
    w?: string
    h?: string
    maxW?: string
    maxH?: string
    maxWidth?: string
    m?: string
    mr?: string
    rounded?: string
    shadow?: string
    objectFit?: JSX.CSSProperties["object-fit"]
    transition?: string
    _hover?: { transform?: string }
  }
>

export const AppImage = (props: AppImageProps) => {
  const [failed, setFailed] = createSignal(false)
  const [local, others] = splitProps(props, [
    "class",
    "style",
    "children",
    "fallback",
    "boxSize",
    "w",
    "h",
    "maxW",
    "maxH",
    "maxWidth",
    "m",
    "mr",
    "rounded",
    "shadow",
    "objectFit",
    "transition",
    "_hover",
    "onError",
  ])
  const onError: JSX.EventHandlerUnion<HTMLImageElement, ErrorEvent> = (
    event,
  ) => {
    setFailed(true)
    if (typeof local.onError === "function") local.onError(event)
  }
  return (
    <Show when={!failed()} fallback={local.fallback}>
      <img
        {...others}
        onError={onError}
        class={`app-image${local._hover ? " app-image--hover" : ""}${local.class ? ` ${local.class}` : ""}`}
        style={{
          ...(local.style ?? {}),
          width: token(local.boxSize ?? local.w, "sizes"),
          height: token(local.boxSize ?? local.h, "sizes"),
          "max-width": token(local.maxW ?? local.maxWidth, "sizes"),
          "max-height": token(local.maxH, "sizes"),
          margin: token(local.m, "space"),
          "margin-right": token(local.mr, "space"),
          "border-radius": token(local.rounded, "radii"),
          "box-shadow": token(local.shadow, "shadows"),
          "object-fit": local.objectFit,
          transition: local.transition,
          "--app-image-hover-transform": local._hover?.transform,
        }}
      />
    </Show>
  )
}
