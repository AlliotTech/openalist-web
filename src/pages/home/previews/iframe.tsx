import { BoxWithFullScreen } from "~/components/Base"
import { objStore } from "~/store"
import { AppIcon as Icon } from "~/components/ui/Icon"
import { convertURL, hoverColor } from "~/utils"
import { Component, createMemo } from "solid-js"
import { useLink } from "~/hooks"
import { TbOutlineExternalLink } from "solid-icons/tb"

const IframePreview = (props: { scheme: string }) => {
  const { currentObjLink } = useLink()
  const iframeSrc = createMemo(() => {
    return convertURL(props.scheme, {
      raw_url: objStore.raw_url,
      name: objStore.obj.name,
      d_url: currentObjLink(true),
      ts: true,
    })
  })
  return (
    <BoxWithFullScreen w="$full" h="70vh">
      <iframe style={{ width: "100%", height: "100%" }} src={iframeSrc()} />
      <Icon
        pos="absolute"
        right="$2"
        bottom="$10"
        aria-label="Open in new tab"
        as={TbOutlineExternalLink}
        onClick={() => {
          window.open(iframeSrc(), "_blank")
        }}
        cursor="pointer"
        rounded="$md"
        bgColor={hoverColor()}
        p="$1"
        boxSize="$7"
      />
    </BoxWithFullScreen>
  )
}

export const generateIframePreview = (scheme: string): Component => {
  return () => {
    return <IframePreview scheme={scheme} />
  }
}
