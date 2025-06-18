import { Anchor, HStack, VStack, Text } from "@hope-ui/solid"
import { Link } from "@solidjs/router"
import { AnchorWithBase } from "~/components"
import { useT } from "~/hooks"
import { me } from "~/store"
import { UserMethods } from "~/types"

export const Footer = () => {
  const t = useT()
  return (
    <VStack
      class="footer"
      w="$full"
      py="$6"
      borderTop="1px solid"
      borderColor="$neutral4"
      bgColor="$background"
      transition="all 0.3s ease"
    >
      <HStack spacing="$3" alignItems="center">
        <Anchor
          href="https://github.com/AlliotTech/openalist"
          external
          transition="all 0.2s ease"
          _hover={{
            transform: "translateY(-1px)",
            color: "$info9",
          }}
        >
          {t("home.footer.powered_by")}
        </Anchor>
        <Text color="$neutral7" fontSize="$sm">
          |
        </Text>
        <AnchorWithBase
          as={Link}
          href={UserMethods.is_guest(me()) ? "/@login" : "/@manage"}
          transition="all 0.2s ease"
          _hover={{
            transform: "translateY(-1px)",
            color: "$info9",
          }}
        >
          {t(UserMethods.is_guest(me()) ? "login.login" : "home.footer.manage")}
        </AnchorWithBase>
      </HStack>
    </VStack>
  )
}
