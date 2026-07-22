import { Heading, Text, useColorModeValue } from "@hope-ui/solid"
import {
  AppFlex as Flex,
  AppHStack as HStack,
  AppVStack as VStack,
} from "~/components/ui/Stack"
import { AppButton } from "~/components/ui/Button"
import { AppInput } from "~/components/ui/Input"
import { useRouter, useT } from "~/hooks"
import { JSXElement } from "solid-js"

type PasswordProps = {
  title: string
  password: () => string
  setPassword: (s: string) => void
  enterCallback: () => void
  children?: JSXElement
}

const Password = (props: PasswordProps) => {
  const t = useT()
  const { back } = useRouter()
  return (
    <VStack
      w={{
        "@initial": "$full",
        "@md": "$lg",
      }}
      p="$8"
      spacing="$3"
      alignItems="start"
    >
      <Heading>{props.title}</Heading>
      <AppInput
        type="password"
        value={props.password()}
        background={useColorModeValue("$neutral3", "$neutral2")()}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            props.enterCallback()
          }
        }}
        onInput={(e) => props.setPassword(e.currentTarget.value)}
      />
      <HStack w="$full" justifyContent="space-between">
        <Flex
          fontSize="$sm"
          color="$neutral10"
          direction={{ "@initial": "column", "@sm": "row" }}
          columnGap="$1"
        >
          {props.children}
        </Flex>
        <HStack spacing="$2">
          <AppButton colorScheme="neutral" onClick={back}>
            {t("global.back")}
          </AppButton>
          <AppButton onClick={() => props.enterCallback()}>
            {t("global.ok")}
          </AppButton>
        </HStack>
      </HStack>
    </VStack>
  )
}
export default Password
