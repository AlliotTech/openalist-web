import { createSignal, JSXElement, Match, Switch } from "solid-js"
import { Error } from "~/components/Base"
import { FullScreenLoading } from "~/components/FullLoading"
import { useFetch } from "~/hooks/useFetch"
import { useT } from "~/hooks/useT"
import { Me, setMe } from "~/store/user"
import { PResp } from "~/types"
import { handleResp } from "~/utils/handle_resp"
import { r } from "~/utils/request"

const MustUser = (props: { children: JSXElement }) => {
  const t = useT()
  const [loading, data] = useFetch((): PResp<Me> => r.get("/me"))
  const [err, setErr] = createSignal<string>()
  ;(async () => {
    // const resp: Resp<User> = await data();
    handleResp(await data(), setMe, setErr)
  })()
  return (
    <Switch fallback={props.children}>
      <Match when={loading()}>
        <FullScreenLoading />
      </Match>
      <Match when={err() !== undefined}>
        <Error msg={t("home.get_current_user_failed") + err()} />
      </Match>
    </Switch>
  )
}

export { MustUser }
