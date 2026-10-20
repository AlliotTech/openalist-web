import { AppText as Text } from "~/components/ui/Typography"

import { AppButton } from "~/components/ui/Button"
import { AppSelect } from "~/components/ui/Select"
import { AppHStack as HStack } from "~/components/ui/Stack"
import { createMemo, Match, onCleanup, onMount, Show, Switch } from "solid-js"
import { FullLoading } from "~/components/FullLoading"
import { Paginator } from "~/components/Paginator"
import { getGlobalPage, usePath, useRouter, useT } from "~/hooks"
import {
  clearHistory,
  DEFAULT_PAGE_SIZE,
  getPagination,
  MAX_PAGE_SIZE,
  objStore,
  State,
} from "~/store"

const Pagination = () => {
  const pagination = getPagination()
  const { pathname, searchParam, setSearchParams } = useRouter()
  const pageSizeOptions = [50, 100, 200, 300, 500].filter(
    (size) => size <= MAX_PAGE_SIZE,
  )
  const currentPerPage = createMemo(() => {
    const value = parseInt(searchParam("per_page") ?? "", 10)
    if (Number.isFinite(value) && value > 0) {
      return Math.min(MAX_PAGE_SIZE, value)
    }
    return pagination.size || DEFAULT_PAGE_SIZE
  })
  return (
    <HStack spacing="$2" flexWrap="wrap" justifyContent="center">
      <HStack spacing="$1">
        <Text size="sm">Per page</Text>
        <AppSelect
          size="sm"
          defaultValue={currentPerPage()}
          onChange={(value) => {
            const perPage = Number(value)
            clearHistory(pathname(), 1)
            setSearchParams({ page: 1, per_page: perPage })
          }}
          options={pageSizeOptions.map((size) => ({
            value: size,
            label: String(size),
          }))}
        />
      </HStack>
      <Show when={currentPerPage()} keyed>
        {(pageSize) => (
          <Paginator
            total={objStore.total}
            defaultCurrent={getGlobalPage()}
            defaultPageSize={pageSize}
            onChange={(page) => {
              clearHistory(pathname(), page)
              setSearchParams({ page, per_page: pageSize })
            }}
          />
        )}
      </Show>
    </HStack>
  )
}
const LoadMore = () => {
  const { loadMore, allLoaded } = usePath()
  const t = useT()
  return (
    <Show
      when={!allLoaded()}
      fallback={<Text fontStyle="italic">{t("home.no_more")}</Text>}
    >
      <AppButton onClick={loadMore}>{t("home.load_more")}</AppButton>
    </Show>
  )
}

const AutoLoadMore = () => {
  const { loadMore, allLoaded } = usePath()
  const t = useT()
  const ob = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        loadMore()
      }
    },
    {
      threshold: 0.1,
    },
  )
  let el!: HTMLDivElement
  onMount(() => {
    if (!allLoaded()) {
      ob.observe(el)
    }
  })
  onCleanup(() => {
    ob.disconnect()
  })
  return (
    <Show
      when={!allLoaded()}
      fallback={<Text fontStyle="italic">{t("home.no_more")}</Text>}
    >
      <FullLoading py="$2" size="md" thickness={3} ref={el!} />
    </Show>
  )
}

export const Pager = () => {
  const pagination = getPagination()
  return (
    <Switch>
      <Match when={objStore.state === State.FetchingMore}>
        <FullLoading py="$2" size="md" thickness={3} />
      </Match>
      <Match when={pagination.type === "pagination"}>
        <Pagination />
      </Match>
      <Match when={pagination.type === "load_more"}>
        <LoadMore />
      </Match>
      <Match when={pagination.type === "auto_load_more"}>
        <AutoLoadMore />
      </Match>
    </Switch>
  )
}
