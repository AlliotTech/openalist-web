import { AppHeading as Heading } from "~/components/ui/Typography"
import { useColorModeValue } from "~/components/ui/ColorMode"
import { AppIcon as Icon } from "~/components/ui/Icon"
import { AppBox as Box } from "~/components/ui/Layout"
import { AppCenter as Center, AppFlex as Flex } from "~/components/ui/Stack"
import { SwitchColorMode } from "./SwitchColorMode"
import { mergeProps, Show } from "solid-js"
import { AiOutlineFullscreen, AiOutlineFullscreenExit } from "solid-icons/ai"
import { hoverColor } from "~/utils/const"
import { AppSelect } from "~/components/ui/Select"
import { createDisclosure } from "~/hooks/disclosure"

export const Error = (props: {
  msg: string
  disableColor?: boolean
  h?: string
}) => {
  const merged = mergeProps(
    {
      h: "$full",
    },
    props,
  )
  return (
    <Center h={merged.h} p="$4" flexDirection="column">
      <Box
        rounded="$xl"
        px="$6"
        py="$8"
        bgColor={useColorModeValue("white", "$neutral3")()}
        shadow="0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
        border="1px solid"
        borderColor="$neutral4"
        transition="all 0.3s ease"
        _hover={{
          transform: "translateY(-2px)",
          boxShadow:
            "0 20px 40px -10px rgba(0, 0, 0, 0.15), 0 10px 20px -5px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Heading
          css={{
            wordBreak: "break-all",
            textAlign: "center",
          }}
          fontSize="$lg"
          color="$neutral11"
        >
          {props.msg}
        </Heading>
        <Show when={!props.disableColor}>
          <Flex mt="$4" justifyContent="center">
            <SwitchColorMode />
          </Flex>
        </Show>
      </Box>
    </Center>
  )
}

export const BoxWithFullScreen = (props: Parameters<typeof Box>[0]) => {
  const { isOpen, onToggle } = createDisclosure()
  return (
    <Box
      pos={isOpen() ? "fixed" : "relative"}
      w={isOpen() ? "100vw" : props.w}
      h={isOpen() ? "100vh" : props.h}
      top={0}
      left={0}
      zIndex={1}
      transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
      css={{
        "backdrop-filter": isOpen() ? "blur(10px)" : undefined,
      }}
    >
      {props.children}
      <Icon
        pos="absolute"
        right="$3"
        bottom="$3"
        aria-label="toggle fullscreen"
        as={isOpen() ? AiOutlineFullscreenExit : AiOutlineFullscreen}
        onClick={onToggle}
        cursor="pointer"
        rounded="$lg"
        bgColor={hoverColor()}
        p="$1_5"
        boxSize="$8"
        transition="all 0.2s ease"
        _hover={{
          transform: "scale(1.1)",
          bgColor: "$neutral4" as any,
        }}
        _active={{
          transform: "scale(0.95)",
        }}
      />
    </Box>
  )
}

export function SelectWrapper<T extends string | number>(props: {
  value: T
  onChange: (v: T) => void
  options: {
    value: T
    label?: string
  }[]
  alwaysShowBorder?: boolean
  size?: "xs" | "sm" | "md" | "lg"
  variant?: "filled" | "outline"
  w?: string
}) {
  return (
    <AppSelect
      value={props.value}
      onChange={props.onChange}
      options={props.options.map((option) => ({
        value: option.value,
        label: option.label ?? option.value.toString(),
      }))}
      size={props.size}
      variant={props.variant}
      class={props.alwaysShowBorder ? "app-select--bordered" : undefined}
      style={{
        width: props.w
          ? props.w.startsWith("$")
            ? `var(--hope-sizes-${props.w.slice(1)})`
            : props.w
          : "100%",
      }}
    />
  )
}
