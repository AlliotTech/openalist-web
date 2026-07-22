import { Popover } from "@kobalte/core/popover"
import { Button, HStack } from "@hope-ui/solid"
import { createSignal } from "solid-js"
import "~/components/ui/popover.css"
import { useT } from "~/hooks"

export interface DeletePopoverProps {
  name: string
  loading: boolean
  onClick: () => void
}

export const DeletePopover = (props: DeletePopoverProps) => {
  const t = useT()
  const [open, setOpen] = createSignal(false)
  return (
    <Popover open={open()} onOpenChange={setOpen} gutter={8} placement="bottom">
      <Popover.Trigger as={Button} colorScheme="danger">
        {t("global.delete")}
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content class="app-popover__content">
          <Popover.Arrow class="app-popover__arrow" />
          <Popover.Title class="app-popover__title">
            {t("global.delete_confirm", { name: props.name })}
          </Popover.Title>
          <div class="app-popover__body">
            <HStack spacing="$2">
              <Button onClick={() => setOpen(false)} colorScheme="neutral">
                {t("global.cancel")}
              </Button>
              <Button
                colorScheme="danger"
                loading={props.loading}
                onClick={() => {
                  setOpen(false)
                  props.onClick()
                }}
              >
                {t("global.confirm")}
              </Button>
            </HStack>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover>
  )
}
