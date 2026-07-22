import { AppIcon as Icon } from "~/components/ui/Icon"
import { FiGithub, FiLogIn } from "solid-icons/fi"
import { BsMicrosoft } from "solid-icons/bs"
import { AiOutlineGoogle, AiOutlineDingtalk } from "solid-icons/ai"
import { base_path, changeToken, r } from "~/utils"
import { getSetting, getSettingBool } from "~/store"
import { useRouter } from "~/hooks"
import { onCleanup } from "solid-js"

const SSOLogin = () => {
  const ssoSignEnabled = getSettingBool("sso_login_enabled")
  const loginPlatform = getSetting("sso_login_platform")
  const usecompatibility = getSettingBool("sso_compatibility_mode")
  const { searchParam, to } = useRouter()
  const token = searchParam("token")
  const redirect = () => searchParam("redirect") || base_path || "/"
  if (token != undefined && token != "") {
    changeToken(token)
    to(decodeURIComponent(redirect()), true)
  }
  function messageEvent(event: MessageEvent) {
    const data = event.data
    if (data.token) {
      changeToken(data.token)
      to(decodeURIComponent(redirect()), true)
    }
  }
  window.addEventListener("message", messageEvent)
  onCleanup(() => {
    window.removeEventListener("message", messageEvent)
  })
  if (ssoSignEnabled) {
    const login = () => {
      const url = r.getUri() + "/auth/sso?method=sso_get_token"
      if (usecompatibility) {
        window.location.href = url
        return
      }
      window.open(url, "authPopup", "width=500,height=600")
    }
    let icon
    switch (loginPlatform) {
      case "Github":
        icon = FiGithub
        break
      case "Microsoft":
        icon = BsMicrosoft
        break
      case "Google":
        icon = AiOutlineGoogle
        break
      case "Dingtalk":
        icon = AiOutlineDingtalk
        break
      default:
        icon = FiLogIn
    }
    return (
      <Icon cursor="pointer" boxSize="$8" as={icon} p="$0_5" onclick={login} />
    )
  }
}

export { SSOLogin }
