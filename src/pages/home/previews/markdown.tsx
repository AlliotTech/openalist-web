import { MaybeLoading } from "~/components/FullLoading"
import { Markdown } from "~/components/Markdown"
import { useFetchText } from "~/hooks"
import { objStore } from "~/store"
import { ext } from "~/utils"

const MdPreview = () => {
  const [content] = useFetchText()
  return (
    <MaybeLoading loading={content.loading}>
      <Markdown
        children={content()?.content}
        ext={ext(objStore.obj.name)}
        toc
      />
    </MaybeLoading>
  )
}

export default MdPreview
