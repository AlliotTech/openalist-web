import { AppCenter as Center } from "~/components/ui/Stack"
import { JSXElement, mergeProps, Show } from "solid-js"
import { getMainColor } from "~/store"
import { AppSpinner, type AppSpinnerProps } from "~/components/ui/Loading"
export const FullScreenLoading = () => {
  return (
    <Center h="100vh">
      <AppSpinner
        thickness="4px"
        speed="0.65s"
        emptyColor="$neutral4"
        color={getMainColor()}
        size="xl"
      />
    </Center>
  )
}

export const FullLoading = (props: {
  py?: string
  size?: string
  thickness?: number
  ref?: any
}) => {
  const merged = mergeProps(
    {
      py: "$8",
      size: "xl",
      thickness: 4,
    },
    props,
  )
  return (
    <Center ref={props.ref} h="$full" w="$full" py={merged.py}>
      <AppSpinner
        thickness={`${merged.thickness}px`}
        speed="0.65s"
        emptyColor="$neutral4"
        color={getMainColor()}
        size={merged.size as any}
      />
    </Center>
  )
}

export const MaybeLoading = (props: {
  children?: JSXElement
  loading: boolean
}) => {
  return (
    <Show when={!props.loading} fallback={<FullLoading />}>
      {props.children}
    </Show>
  )
}

export const CenterLoading = (props: AppSpinnerProps) => {
  return (
    <Center w="$full" h="$full">
      <AppSpinner color={getMainColor()} {...props} />
    </Center>
  )
}
