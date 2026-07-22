import { A as Link } from "@solidjs/router"
import {
  AppAnchor as Anchor,
  type AppAnchorProps,
} from "~/components/ui/Typography"
import { joinBase, encodePath } from "~/utils"
import { useRouter } from "~/hooks"
import { ComponentProps } from "solid-js"

export const LinkWithBase = (
  props: ComponentProps<typeof Link> & { encode?: boolean },
) => (
  <Link
    {...props}
    href={joinBase(props.encode ? encodePath(props.href) : props.href)}
  />
)

export const AnchorWithBase = (
  props: AppAnchorProps & { href: string; cancelBase?: boolean },
) => {
  const { cancelBase, ...anchorProps } = props
  return (
    <Anchor
      {...anchorProps}
      href={cancelBase ? props.href : joinBase(props.href)}
    />
  )
}

export const LinkWithPush = (props: ComponentProps<typeof LinkWithBase>) => {
  const { pushHref } = useRouter()
  return <LinkWithBase {...props} href={pushHref(props.href)} />
}
