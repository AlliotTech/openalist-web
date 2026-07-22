import {
  Component,
  lazy,
  Show,
  createEffect,
  createMemo,
  createSignal,
  onCleanup,
  Switch,
  Match,
  on,
} from "solid-js"
import { Dynamic } from "solid-js/web"
import { layout } from "~/store"
import { ContextMenu } from "./context-menu"
import { Pager } from "./Pager"
import { useLink, useT } from "~/hooks"
import { objStore } from "~/store"
import { ObjType } from "~/types"
import { bus } from "~/utils"
import type { LightGallery } from "lightgallery/lightgallery"

const ListLayout = lazy(() => import("./List"))
const GridLayout = lazy(() => import("./Grid"))
const ImageLayout = lazy(() => import("./Images"))

const SearchLoader = () => {
  const [component, setComponent] =
    createSignal<Component<{ defaultIsOpen?: boolean }>>()
  let loading: Promise<void> | undefined
  let disposed = false

  const stopListening = () => {
    bus.off("tool", toolHandler)
    document.removeEventListener("keydown", keyHandler)
  }
  const load = () => {
    if (component() || loading) return
    loading = import("./Search")
      .then(({ Search }) => {
        if (disposed) return
        stopListening()
        setComponent(() => Search)
      })
      .catch((error) => {
        console.error("failed to load search", error)
      })
      .finally(() => {
        loading = undefined
      })
  }
  const toolHandler = (name: string) => {
    if (name === "search") load()
  }
  const keyHandler = (event: KeyboardEvent) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
      event.preventDefault()
      load()
    }
  }

  bus.on("tool", toolHandler)
  document.addEventListener("keydown", keyHandler)
  onCleanup(() => {
    disposed = true
    stopListening()
  })

  return (
    <Show when={component()} keyed>
      {(Search) => <Dynamic component={Search} defaultIsOpen />}
    </Show>
  )
}

const Folder = () => {
  const { rawLink } = useLink()
  const images = createMemo(() =>
    objStore.objs.filter((obj) => obj.type === ObjType.IMAGE),
  )

  let dynamicGallery: LightGallery | undefined
  let galleryLoading: Promise<LightGallery | undefined> | undefined
  let galleryVersion = 0
  let disposed = false
  const initGallery = async () => {
    const version = galleryVersion
    const [
      { default: lightGallery },
      { default: lgThumbnail },
      { default: lgZoom },
      { default: lgRotate },
      { default: lgAutoplay },
      { default: lgFullscreen },
    ] = await Promise.all([
      import("lightgallery"),
      import("lightgallery/plugins/thumbnail"),
      import("lightgallery/plugins/zoom"),
      import("lightgallery/plugins/rotate"),
      import("lightgallery/plugins/autoplay"),
      import("lightgallery/plugins/fullscreen"),
      import("lightgallery/css/lightgallery-bundle.css"),
    ])
    if (disposed || version !== galleryVersion) return
    dynamicGallery = lightGallery(document.createElement("div"), {
      addClass: "lightgallery-container",
      dynamic: true,
      thumbnail: true,
      plugins: [lgZoom, lgThumbnail, lgRotate, lgAutoplay, lgFullscreen],
      dynamicEl: images().map((obj) => {
        const raw = rawLink(obj, true)
        return {
          src: raw,
          thumb: obj.thumb === "" ? raw : obj.thumb,
          subHtml: `<h4>${obj.name}</h4>`,
        }
      }),
    })
    return dynamicGallery
  }
  const getGallery = () => {
    if (dynamicGallery) return Promise.resolve(dynamicGallery)
    if (!galleryLoading) {
      galleryLoading = initGallery().catch((error) => {
        galleryLoading = undefined
        console.error("failed to load image gallery", error)
        return undefined
      })
    }
    return galleryLoading
  }
  createEffect(
    on(images, () => {
      galleryVersion += 1
      dynamicGallery?.destroy()
      dynamicGallery = undefined
      galleryLoading = undefined
    }),
  )
  const galleryHandler = (name: string) => {
    void getGallery().then((gallery) => {
      gallery?.openGallery(images().findIndex((obj) => obj.name === name))
    })
  }
  bus.on("gallery", galleryHandler)
  onCleanup(() => {
    disposed = true
    bus.off("gallery", galleryHandler)
    dynamicGallery?.destroy()
  })
  const t = useT()
  return (
    <>
      <Switch>
        <Match when={layout() === "list"}>
          <ListLayout />
        </Match>
        <Match when={layout() === "grid"}>
          <GridLayout />
        </Match>
        <Match when={layout() === "image"}>
          <ImageLayout images={images()} />
        </Match>
      </Switch>
      <Pager />
      <SearchLoader />
      <ContextMenu />
    </>
  )
}

export default Folder
