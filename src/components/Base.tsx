import {
  Box,
  Center,
  Flex,
  Heading,
  useColorModeValue,
  createDisclosure,
  Select,
  SelectContent,
  SelectIcon,
  SelectListbox,
  SelectOption,
  SelectOptionIndicator,
  SelectOptionText,
  SelectTrigger,
  SelectValue,
  Icon,
} from "@hope-ui/solid"
import { SwitchColorMode } from "./SwitchColorMode"
import { ComponentProps, For, mergeProps, Show } from "solid-js"
import { AiOutlineFullscreen, AiOutlineFullscreenExit } from "solid-icons/ai"
import { hoverColor } from "~/utils"

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
          size="lg"
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
        backdropFilter: isOpen() ? "blur(10px)" : undefined,
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
          bgColor: "$neutral4",
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
  w?: ComponentProps<typeof SelectTrigger>["w"]
}) {
  return (
    <Select size={props.size} value={props.value} onChange={props.onChange}>
      <SelectTrigger
        borderColor={props.alwaysShowBorder ? "$info5" : undefined}
        w={props.w}
        transition="all 0.2s ease"
        _hover={{
          borderColor: "$info6",
        }}
        _focus={{
          transform: "translateY(-1px)",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        <SelectValue />
        <SelectIcon />
      </SelectTrigger>
      <SelectContent>
        <SelectListbox>
          <For each={props.options}>
            {(item) => (
              <SelectOption
                value={item.value}
                transition="all 0.2s ease"
                _hover={{
                  transform: "translateX(2px)",
                }}
              >
                <SelectOptionText>{item.label ?? item.value}</SelectOptionText>
                <SelectOptionIndicator />
              </SelectOption>
            )}
          </For>
        </SelectListbox>
      </SelectContent>
    </Select>
  )
}
