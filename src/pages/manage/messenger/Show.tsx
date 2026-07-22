import { AppHeading as Heading } from "~/components/ui/Typography"
import { Message } from "./Messenger"

import { AppImage as Image } from "~/components/ui/Image"

export const StringShow = (props: Message) => {
  return <Heading>{props.content}</Heading>
}

export const ImageShow = (props: Message) => {
  return <Image src={props.content} />
}
