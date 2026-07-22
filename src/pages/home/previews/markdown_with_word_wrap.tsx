import { MaybeLoading } from "~/components/FullLoading"
import { Markdown } from "~/components/Markdown"
import { useFetchText } from "~/hooks"

const MdPreview = () => {
  const [content] = useFetchText()
  return (
    <MaybeLoading loading={content.loading}>
      <Markdown class="word-wrap" children={content()?.content} toc />
    </MaybeLoading>
  )
}

export default MdPreview
