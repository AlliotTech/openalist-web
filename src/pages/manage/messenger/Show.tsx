import { Message } from "./Messenger"
import { Heading } from "@hope-ui/solid"
import { AppImage as Image } from "~/components/ui/Image"

export const StringShow = (props: Message) => {
  return <Heading>{props.content}</Heading>
}

export const ImageShow = (props: Message) => {
  return <Image src={props.content} />
}
