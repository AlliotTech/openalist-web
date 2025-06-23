import { Center, VStack, Icon, Text } from "@hope-ui/solid"
import { Motion } from "solid-motionone"
import { useContextMenu } from "solid-contextmenu"
import { batch, Show } from "solid-js"
import { CenterLoading, LinkWithPush, ImageWithError } from "~/components"
import { usePath, useRouter, useUtil } from "~/hooks"
import { checkboxOpen, getMainColor, local, selectIndex } from "~/store"
import { ObjType, StoreObj } from "~/types"
import { bus, hoverColor } from "~/utils"
import { getIconByObj } from "~/utils/icon"
import { ItemCheckbox, useSelectWithMouse } from "./helper"

export const GridItem = (props: { obj: StoreObj; index: number }) => {
  const { isHide } = useUtil()
  if (isHide(props.obj)) {
    return null
  }
  const { setPathAs } = usePath()
  const objIcon = (
    <Icon
      color={getMainColor()}
      boxSize={`${parseInt(local["grid_item_size"]) - 30}px`}
      as={getIconByObj(props.obj)}
    />
  )
  const { show } = useContextMenu({ id: 1 })
  const { pushHref, to } = useRouter()
  const { openWithDoubleClick, toggleWithClick, restoreSelectionCache } =
    useSelectWithMouse()
  return (
    <Motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        width: "100%",
      }}
    >
      <VStack
        classList={{ selected: !!props.obj.selected }}
        class="grid-item viselect-item"
        data-index={props.index}
        w="$full"
        p="$2"
        spacing="$2"
        rounded="$lg"
        transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
        _hover={{
          transform: "translateY(-4px) scale(1.02)",
          boxShadow:
            "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        }}
        as={LinkWithPush}
        href={props.obj.name}
        cursor={
          openWithDoubleClick() || toggleWithClick() ? "default" : "pointer"
        }
        bgColor={props.obj.selected ? hoverColor() : undefined}
        on:dblclick={() => {
          if (!openWithDoubleClick()) return
          selectIndex(props.index, true, true)
          to(pushHref(props.obj.name))
        }}
        on:click={(e: MouseEvent) => {
          e.preventDefault()
          if (openWithDoubleClick()) return
          if (e.ctrlKey || e.metaKey || e.shiftKey) return
          if (!restoreSelectionCache()) return
          if (toggleWithClick())
            return selectIndex(props.index, !props.obj.selected)
          to(pushHref(props.obj.name))
        }}
        onMouseEnter={() => {
          setPathAs(props.obj.name, props.obj.is_dir, true)
        }}
        onContextMenu={(e: MouseEvent) => {
          batch(() => {
            selectIndex(props.index, true, true)
          })
          show(e, { props: props.obj })
        }}
      >
        <Center
          class="item-thumbnail"
          h={`${parseInt(local["grid_item_size"])}px`}
          w="$full"
          cursor={props.obj.type !== ObjType.IMAGE ? "inherit" : "pointer"}
          on:click={(e: MouseEvent) => {
            if (props.obj.type !== ObjType.IMAGE) return
            if (e.ctrlKey || e.metaKey || e.shiftKey) return
            if (!restoreSelectionCache()) return
            bus.emit("gallery", props.obj.name)
            e.preventDefault()
            e.stopPropagation()
          }}
          pos="relative"
          rounded="$md"
          overflow="hidden"
        >
          <Show when={checkboxOpen()}>
            <ItemCheckbox
              pos="absolute"
              left="$2"
              top="$2"
              zIndex="1"
              on:mousedown={(e: MouseEvent) => {
                e.stopPropagation()
              }}
              on:click={(e: MouseEvent) => {
                e.stopPropagation()
              }}
              checked={props.obj.selected}
              onChange={(e: any) => {
                selectIndex(props.index, e.target.checked)
              }}
            />
          </Show>
          <Show when={props.obj.thumb} fallback={objIcon}>
            <ImageWithError
              maxH="$full"
              maxW="$full"
              rounded="$md"
              shadow="$md"
              fallback={<CenterLoading size="lg" />}
              fallbackErr={objIcon}
              src={props.obj.thumb}
              loading="lazy"
              transition="transform 0.3s ease"
              _hover={{
                transform: "scale(1.05)",
              }}
            />
          </Show>
        </Center>
        <Text
          css={{
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            fontWeight: "500",
          }}
          w="$full"
          overflow="hidden"
          textAlign="center"
          fontSize="$sm"
          title={props.obj.name}
          color="$neutral11"
          transition="color 0.2s ease"
          _hover={{
            color: getMainColor(),
          }}
        >
          {props.obj.name}
        </Text>
      </VStack>
    </Motion.div>
  )
}
