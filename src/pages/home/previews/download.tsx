import { Image } from "@hope-ui/solid"
import { AppHStack as HStack } from "~/components/ui/Stack"
import { AppButton, AppIconButton } from "~/components/ui/Button"
import { Popover } from "@kobalte/core/popover"
import { useCopyLink, useT } from "~/hooks"
import { objStore } from "~/store"
import { FileInfo } from "./info"
import { OpenWith } from "../file/open-with"
import { createSignal, Show } from "solid-js"
import { BsQrCode } from "solid-icons/bs"
import QRCode from "qrcode"
import "~/components/ui/popover.css"

export const Download = (props: { openWith?: boolean }) => {
  const t = useT()
  const { copyCurrentRawLink } = useCopyLink()
  const [qrUrl, setQrUrl] = createSignal("")
  QRCode.toDataURL(objStore.raw_url, {
    type: "image/jpeg",
    scale: 2,
  }).then((url) => setQrUrl(url))
  const [pinned, setPinned] = createSignal(false)
  const [hover, setHover] = createSignal(false)
  return (
    <FileInfo>
      <HStack spacing="$2">
        <AppButton
          colorScheme="accent"
          onClick={() => copyCurrentRawLink(true)}
        >
          {t("home.toolbar.copy_link")}
        </AppButton>
        <AppButton as="a" href={objStore.raw_url} target="_blank">
          {t("home.preview.download")}
        </AppButton>
        <Popover
          open={pinned() || hover()}
          onOpenChange={setPinned}
          gutter={8}
          placement="top"
        >
          <Popover.Trigger
            as={AppIconButton}
            icon={<BsQrCode />}
            aria-label="QRCode"
            colorScheme="success"
            onClick={() => {
              setPinned(!pinned())
            }}
            onMouseOver={() => setHover(true)}
            onMouseOut={() => setHover(false)}
          />
          <Popover.Portal>
            <Popover.Content class="app-popover__content app-popover__content--fit">
              <Popover.Arrow class="app-popover__arrow" />
              <div class="app-popover__body">
                <Image
                  maxWidth="300px"
                  src={qrUrl()}
                  alt="QR Code of download link"
                  objectFit="cover"
                />
              </div>
            </Popover.Content>
          </Popover.Portal>
        </Popover>
      </HStack>
      <Show when={props.openWith}>
        <OpenWith />
      </Show>
    </FileInfo>
  )
}

export default Download
