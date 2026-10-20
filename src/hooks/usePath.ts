import axios, { Canceler } from "axios"
import {
  appendObjs,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  password,
  ObjStore,
  State,
  getPagination,
  objStore,
  getHistoryKey,
  hasHistory,
  recoverHistory,
  clearHistory,
  me,
} from "~/store"
import {
  fsGet,
  fsList,
  handleRespWithoutNotify,
  log,
  notify,
  pathJoin,
} from "~/utils"
import { useFetch } from "./useFetch"
import { useRouter } from "./useRouter"

let first_fetch = true

let cancelObj: Canceler
let cancelList: Canceler

const IsDirRecord: Record<string, boolean> = {}
let globalPage = 1
let globalHasMore = false
let globalHasMoreKnown = false
export const getGlobalPage = () => {
  return globalPage
}
export const setGlobalPage = (page: number) => {
  globalPage = page
  // console.log("setGlobalPage", globalPage)
}
export const resetGlobalPage = () => {
  setGlobalPage(1)
}
export const usePath = () => {
  const { pathname, to, searchParam } = useRouter()

  const perPageFromQuery = () => {
    const value = parseInt(searchParam("per_page") ?? "", 10)
    if (Number.isFinite(value) && value > 0) {
      return value
    }
    return undefined
  }

  const clampPerPage = (size?: number) => {
    if (pagination.type === "all") {
      return -1
    }
    const querySize = perPageFromQuery()
    const raw =
      typeof size === "number" && Number.isFinite(size)
        ? size
        : pagination.type === "pagination"
          ? querySize ?? pagination.size
          : pagination.size
    const fallback = raw || DEFAULT_PAGE_SIZE
    return Math.min(MAX_PAGE_SIZE, Math.max(1, fallback))
  }
  const [, getObj] = useFetch((path: string) =>
    fsGet(
      path,
      password(),
      new axios.CancelToken((c) => {
        cancelObj = c
      }),
    ),
  )
  const pagination = getPagination()
  if (pagination.type === "pagination") {
    setGlobalPage(parseInt(searchParam("page") ?? "") || 1)
  }
  const [, getObjs] = useFetch(
    (arg?: {
      path: string
      index?: number
      size?: number
      force?: boolean
    }) => {
      const page = {
        index: arg?.index,
        size: arg?.size,
      }
      // setSearchParams(page);
      return fsList(
        arg?.path,
        password(),
        page.index,
        page.size,
        arg?.force,
        new axios.CancelToken((c) => {
          cancelList = c
        }),
      )
    },
  )
  // set a path must be a dir
  const setPathAs = (path: string, dir = true, push = false) => {
    if (push) {
      path = pathJoin(pathname(), path)
    }
    if (dir) {
      IsDirRecord[path] = true
    } else {
      delete IsDirRecord[path]
    }
  }

  // record is second time password is wrong
  let retry_pass = false
  // handle pathname change
  // if confirm current path is dir, fetch List directly
  // if not, fetch get then determine if it is dir or file
  const handlePathChange = (
    path: string,
    index?: number,
    rp?: boolean,
    force?: boolean,
    size?: number,
  ) => {
    cancelObj?.()
    cancelList?.()
    retry_pass = rp ?? false
    ObjStore.setErr("")
    if (hasHistory(path, index)) {
      log(`handle [${getHistoryKey(path, index)}] from history`)
      return recoverHistory(path, index)
    } else if (IsDirRecord[path]) {
      log(`handle [${getHistoryKey(path, index)}] as folder`)
      return handleFolder(path, index, size, undefined, force)
    } else {
      log(`handle [${getHistoryKey(path, index)}] as obj`)
      return handleObj(path, index, size)
    }
  }

  // handle enter obj that don't know if it is dir or file
  const handleObj = async (path: string, index?: number, size?: number) => {
    ObjStore.setState(State.FetchingObj)
    const resp = await getObj(path)
    handleRespWithoutNotify(
      resp,
      (data) => {
        ObjStore.setObj(data)
        ObjStore.setProvider(data.provider)
        if (data.is_dir) {
          setPathAs(path)
          handleFolder(path, index, size)
        } else {
          ObjStore.setReadme(data.readme)
          ObjStore.setHeader(data.header)
          ObjStore.setRelated(data.related ?? [])
          ObjStore.setRawUrl(data.raw_url)
          ObjStore.setState(State.File)
        }
      },
      handleErr,
    )
  }

  // change enter a folder or turn page or load more
  const handleFolder = async (
    path: string,
    index?: number,
    size?: number,
    append = false,
    force?: boolean,
  ) => {
    const requestPage = index && index > 0 ? index : 1
    const requestPerPage = clampPerPage(size)
    ObjStore.setState(append ? State.FetchingMore : State.FetchingObjs)
    const resp = await getObjs({
      path,
      index: requestPage,
      size: requestPerPage,
      force,
    })
    handleRespWithoutNotify(
      resp,
      (data) => {
        const responsePage =
          typeof data.page === "number" && data.page > 0
            ? data.page
            : requestPage
        const responsePerPage =
          typeof data.per_page === "number" && data.per_page > 0
            ? data.per_page
            : requestPerPage
        const filteredTotal = data.filtered_total ?? data.total ?? 0
        const hasMore =
          typeof data.has_more === "boolean"
            ? data.has_more
            : responsePerPage > 0 &&
              responsePage * responsePerPage < filteredTotal
        globalHasMore = hasMore
        globalHasMoreKnown = true
        setGlobalPage(responsePage)
        if (append) {
          appendObjs(data.content)
        } else {
          ObjStore.setObjs(data.content ?? [])
        }
        ObjStore.setTotal(filteredTotal)
        ObjStore.setReadme(data.readme)
        ObjStore.setHeader(data.header)
        ObjStore.setWrite(data.write)
        ObjStore.setProvider(data.provider)
        ObjStore.setState(State.Folder)
      },
      handleErr,
    )
  }

  const handleErr = (msg: string, code?: number) => {
    if (code === 403) {
      ObjStore.setState(State.NeedPassword)
      if (retry_pass) {
        notify.error(msg)
      }
    } else {
      const basePath = me().base_path
      if (
        first_fetch &&
        basePath != "/" &&
        pathname().includes(basePath) &&
        msg.endsWith("object not found")
      ) {
        first_fetch = false
        to(pathname().replace(basePath, ""))
        return
      }
      if (code === undefined || code >= 0) {
        ObjStore.setErr(msg)
      }
    }
  }
  const loadMore = () => {
    if (!globalHasMoreKnown || !globalHasMore) {
      return Promise.resolve()
    }
    return handleFolder(pathname(), globalPage + 1, undefined, true)
  }
  return {
    handlePathChange: handlePathChange,
    setPathAs: setPathAs,
    refresh: async (retry_pass?: boolean, force?: boolean) => {
      const path = pathname()
      clearHistory(path, globalPage)
      globalHasMore = false
      globalHasMoreKnown = false
      resetGlobalPage()
      ObjStore.setObjs([])
      ObjStore.setTotal(0)
      const perPage = clampPerPage()
      await handlePathChange(path, 1, retry_pass, force ?? true, perPage)
      window.scroll({ top: 0, behavior: "smooth" })
    },
    loadMore: loadMore,
    allLoaded: () =>
      globalHasMoreKnown
        ? !globalHasMore
        : globalPage >= Math.ceil(objStore.total / pagination.size),
  }
}
