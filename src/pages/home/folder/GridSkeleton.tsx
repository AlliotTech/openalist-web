import { AppSkeleton as Skeleton } from "~/components/ui/Display"
import { AppGrid as Grid } from "~/components/ui/Grid"
import { For } from "solid-js"

const GridSkeleton = () => {
  return (
    <Grid
      w="$full"
      gap="$2"
      templateColumns="repeat(auto-fill, minmax(100px,1fr))"
    >
      <For each={Array.from({ length: 12 })}>
        {() => <Skeleton w="$full" h="$28" rounded="$lg" />}
      </For>
    </Grid>
  )
}

export default GridSkeleton
