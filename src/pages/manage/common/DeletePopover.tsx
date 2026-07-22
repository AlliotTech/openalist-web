import { Popover } from "@kobalte/core/popover"
import { HStack } from "@hope-ui/solid"
import { AppButton } from "~/components/ui/Button"
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
      <Popover.Trigger as={AppButton} colorScheme="danger">
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
              <AppButton onClick={() => setOpen(false)} colorScheme="neutral">
                {t("global.cancel")}
              </AppButton>
              <AppButton
                colorScheme="danger"
                loading={props.loading}
                onClick={() => {
                  setOpen(false)
                  props.onClick()
                }}
              >
                {t("global.confirm")}
              </AppButton>
            </HStack>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover>
  )
}
