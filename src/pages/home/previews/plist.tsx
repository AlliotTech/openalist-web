import { AppButton } from "~/components/ui/Button"
import { createSignal } from "solid-js"
import { useT } from "~/hooks"
import { objStore } from "~/store"
import { FileInfo } from "./info"

const Plist = () => {
  const t = useT()
  const [installing, setInstalling] = createSignal(false)
  return (
    <FileInfo>
      <AppButton
        as="a"
        href={
          "itms-services://?action=download-manifest&url=" + objStore.raw_url
        }
        onClick={() => {
          setInstalling(true)
        }}
      >
        {t(`home.preview.${installing() ? "installing" : "install"}`)}
      </AppButton>
    </FileInfo>
  )
}

export default Plist
