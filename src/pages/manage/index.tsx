import { useColorModeValue } from "@hope-ui/solid"
import { AppBox as Box } from "~/components/ui/Layout"
import {
  AppCenter as Center,
  AppFlex as Flex,
  AppHStack as HStack,
} from "~/components/ui/Stack"
import { FullLoading, SwitchColorMode, SwitchLanguageWhite } from "~/components"
import { useT, useTitle } from "~/hooks"
import { Header } from "./Header"
import { SideMenu } from "./SideMenu"
import { side_menu_items } from "./sidemenu_items"
import { JSXElement, Suspense } from "solid-js"

const Manage = (props: { children: JSXElement }) => {
  const t = useT()
  useTitle(() => t("manage.title"))
  return (
    <Box
      css={{
        "--hope-colors-background": "var(--hope-colors-loContrast)",
      }}
      bgColor="$background"
      w="$full"
    >
      <Header />
      <Flex w="$full" h="calc(100vh - 64px)">
        <Box
          display={{ "@initial": "none", "@sm": "block" }}
          w="$56"
          h="$full"
          shadow="$md"
          bgColor={useColorModeValue("$background", "$neutral2")()}
          overflowY="auto"
        >
          <SideMenu items={side_menu_items} />
          <Center>
            <HStack spacing="$4" p="$2" color="$neutral11">
              <SwitchLanguageWhite />
              <SwitchColorMode />
            </HStack>
          </Center>
        </Box>
        <Box
          w={{
            "@initial": "$full",
            "@sm": "calc(100% - 14rem)",
          }}
          p="$4"
          overflowY="auto"
        >
          <Suspense fallback={<FullLoading />}>{props.children}</Suspense>
        </Box>
      </Flex>
    </Box>
  )
}

export default Manage
