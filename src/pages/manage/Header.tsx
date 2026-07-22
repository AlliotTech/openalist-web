import {
  Box,
  Center,
  Flex,
  Heading,
  HStack,
  IconButton,
  useColorModeValue,
} from "@hope-ui/solid"
import { createSignal } from "solid-js"
import { TiThMenu } from "solid-icons/ti"
import { IoExit } from "solid-icons/io"
import { SwitchColorMode, SwitchLanguageWhite } from "~/components"
import { useFetch, useRouter, useT } from "~/hooks"
import { SideMenu } from "./SideMenu"
import { side_menu_items } from "./sidemenu_items"
import { changeToken, handleResp, notify, r } from "~/utils"
import { PResp } from "~/types"
import { AppDrawer } from "~/components/ui/Drawer"

const [isOpen, setOpen] = createSignal(false)
const onOpen = () => setOpen(true)
const onClose = () => setOpen(false)
const [logOutReqLoading, logOutReq] = useFetch((): PResp<any> =>
  r.get("/auth/logout"),
)

const Header = () => {
  const t = useT()
  const { to } = useRouter()
  const logOut = async () => {
    handleResp(await logOutReq(), () => {
      changeToken()
      notify.success(t("manage.logout_success"))
      to(`/@login?redirect=${encodeURIComponent(location.pathname)}`)
    })
  }
  return (
    <Box
      as="header"
      position="sticky"
      top="0"
      left="0"
      right="0"
      zIndex="$sticky"
      height="64px"
      flexShrink={0}
      shadow="$md"
      p="$4"
      bgColor={useColorModeValue("$background", "$neutral2")()}
    >
      <Flex alignItems="center" justifyContent="space-between" h="$full">
        <HStack spacing="$2">
          <IconButton
            aria-label="menu"
            icon={<TiThMenu />}
            display={{ "@sm": "none" }}
            onClick={onOpen}
            size="sm"
          />
          <Heading
            fontSize="$xl"
            color="$info9"
            cursor="pointer"
            onClick={() => {
              to("/@manage")
            }}
          >
            {t("manage.title")}
          </Heading>
        </HStack>
        <HStack spacing="$1">
          <IconButton
            aria-label="logout"
            icon={<IoExit />}
            loading={logOutReqLoading()}
            onClick={logOut}
            size="sm"
          />
        </HStack>
      </Flex>
      <AppDrawer
        open={isOpen()}
        placement="left"
        onOpenChange={setOpen}
        title={t("manage.title")}
      >
        <SideMenu items={side_menu_items} />
        <Center>
          <HStack spacing="$4" p="$2" color="$neutral11">
            <SwitchLanguageWhite />
            <SwitchColorMode />
          </HStack>
        </Center>
      </AppDrawer>
    </Box>
  )
}

export { Header, onClose }
