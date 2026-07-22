// @ts-ignore
import { hljs } from "./highlight.js"
import { SolidMarkdown, type SolidMarkdownOptions } from "solid-markdown"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"
import "./markdown.css"
import { For, Show, createEffect, createMemo, createSignal, on } from "solid-js"
import { clsx } from "clsx"
import {
  AppList as List,
  AppListItem as ListItem,
} from "~/components/ui/Display"
import { AppAnchor as Anchor } from "~/components/ui/Typography"
import { AppBox as Box } from "~/components/ui/Layout"
import { useParseText, useRouter } from "~/hooks"
import { EncodingSelect } from "./EncodingSelect"
import once from "just-once"
import { pathDir, pathJoin, api, pathResolve } from "~/utils"
import { isMobile } from "~/utils/compatibility.js"
import { useScrollListener } from "~/pages/home/toolbar/BackTop.jsx"
import { Motion } from "solid-motionone"
import { getMainColor, me } from "~/store"
import { isTocDisabled, isTocVisible, setTocVisible } from "./markdown-state"

type TocItem = { indent: number; text: string; tagName: string; key: string }

const safeLinkSchemes = new Set(["http", "https", "mailto", "tel"])
const safeImageSchemes = new Set(["http", "https", "blob"])

function getUriScheme(uri: string) {
  return uri
    .trim()
    .match(/^([a-z][a-z\d+.-]*):/i)?.[1]
    .toLowerCase()
}

function transformLinkUri(uri: string) {
  const scheme = getUriScheme(uri)
  return !scheme || safeLinkSchemes.has(scheme) ? uri : ""
}

function transformImageUri(uri: string) {
  const scheme = getUriScheme(uri)
  if (!scheme || safeImageSchemes.has(scheme)) return uri
  if (/^data:image\/(?:avif|bmp|gif|jpe?g|png|webp);/i.test(uri.trim())) {
    return uri
  }
  return ""
}

type MarkdownAstNode = {
  position?: { start?: unknown; end?: unknown }
  children?: MarkdownAstNode[]
}

function normalizeMarkdownPositions() {
  return (tree: MarkdownAstNode) => {
    const visit = (node: MarkdownAstNode) => {
      if (node.position && (!node.position.start || !node.position.end)) {
        delete node.position
      }
      node.children?.forEach(visit)
    }
    visit(tree)
  }
}

function MarkdownToc(props: {
  disabled?: boolean
  markdownRef: HTMLDivElement
}) {
  if (props.disabled) return null
  if (isMobile) return null

  const [tocList, setTocList] = createSignal<TocItem[]>([])

  useScrollListener(
    () => setTocVisible(window.scrollY > 100 && tocList().length > 1),
    { immediate: true },
  )

  createEffect(() => {
    const $markdown = props.markdownRef.querySelector(".markdown-body")
    if (!$markdown) return

    /**
     * iterate elements of markdown body to find h1~h6
     * and put them into a list by order
     */
    const iterator = document.createNodeIterator(
      $markdown,
      NodeFilter.SHOW_ELEMENT,
      {
        acceptNode(node) {
          if (/h1|h2|h3/i.test(node.nodeName)) {
            return NodeFilter.FILTER_ACCEPT
          }
          return NodeFilter.FILTER_REJECT
        },
      },
    )

    const items: TocItem[] = []
    let $next = iterator.nextNode()
    let minLevel = 6

    while ($next) {
      const level = Number($next.nodeName.match(/h(\d)/i)![1])
      if (level < minLevel) minLevel = level

      items.push({
        indent: level, // initial indent for following compute
        text: $next.textContent!,
        tagName: $next.nodeName.toLowerCase(),
        key: ($next as Element).getAttribute("key")!,
      })

      $next = iterator.nextNode()
    }

    setTocList(
      items.map((item) => ({
        ...item,
        // reset the indent of item to remove whitespace
        indent: item.indent - minLevel,
      })),
    )
  })

  const handleAnchor = (item: TocItem) => {
    const $target = props.markdownRef.querySelector(
      `${item.tagName}[key=${item.key}]`,
    )
    if (!$target) return

    // the top of target should scroll to the bottom of nav
    const $nav = document.querySelector(".nav")
    let navBottom = $nav?.getBoundingClientRect().bottom ?? 0
    if (navBottom < 0) navBottom = 0

    const offsetY = $target.getBoundingClientRect().y
    window.scrollBy({ behavior: "smooth", top: offsetY - navBottom })
  }

  const initialOffsetX = "calc(100% - 20px)"
  const [offsetX, setOffsetX] = createSignal<number | string>(initialOffsetX)

  return (
    <Show when={!isTocDisabled() && isTocVisible()}>
      <Box
        as={Motion.div}
        initial={{ x: 999 }}
        animate={{ x: offsetX() }}
        onMouseEnter={() => setOffsetX(0)}
        onMouseLeave={() => setOffsetX(initialOffsetX)}
        zIndex="$overlay"
        pos="fixed"
        right="$6"
        top="$6"
      >
        <Box
          mt="$5"
          p="$2"
          shadow="$outline"
          rounded="$lg"
          bgColor="white"
          _dark={{ bgColor: "$neutral3" as any }}
        >
          <List maxH="60vh" overflowY="auto">
            <For each={tocList()}>
              {(item) => (
                <ListItem pl={15 * item.indent} m={4}>
                  <Anchor
                    color={getMainColor()}
                    onClick={() => handleAnchor(item)}
                  >
                    {item.text}
                  </Anchor>
                </ListItem>
              )}
            </For>
          </List>
        </Box>
      </Box>
    </Show>
  )
}

const insertKatexCSS = once(() => {
  const link = document.createElement("link")
  link.rel = "stylesheet"
  link.href =
    "https://registry.npmmirror.com/katex/0.16.11/files/dist/katex.min.css"
  document.head.appendChild(link)
})

const insertMermaidJS = once(() => {
  const script = document.createElement("script")
  script.src =
    "https://registry.npmmirror.com/mermaid/11/files/dist/mermaid.min.js"
  document.body.appendChild(script)
})

export function Markdown(props: {
  children?: string | ArrayBuffer
  class?: string
  ext?: string
  readme?: boolean
  toc?: boolean
}) {
  const [encoding, setEncoding] = createSignal<string>("utf-8")
  const [show, setShow] = createSignal(true)
  const { isString, text } = useParseText(props.children)
  const convertToMd = (content: string) => {
    if (!props.ext || props.ext.toLocaleLowerCase() === "md") {
      return content
    }
    return "```" + props.ext + "\n" + content + "\n```"
  }
  const { pathname } = useRouter()
  const md = createMemo(() => {
    let content = convertToMd(text(encoding()))
    content = content.replace(/!\[.*?\]\((.*?)\)/g, (match) => {
      const name = match.match(/!\[(.*?)\]\(.*?\)/)![1]
      let url = match.match(/!\[.*?\]\((.*?)\)/)![1]
      // 检查是否为 base64 编码的图片
      if (url.startsWith("data:image/")) {
        return match // 如果是 base64 编码的图片，直接返回原标签
      }
      if (
        url.startsWith("http://") ||
        url.startsWith("https://") ||
        url.startsWith("//")
      ) {
        return match
      }
      if (url.startsWith("/")) {
        url = `${api}/d${url}`
      } else {
        url = `${api}/d${pathJoin(
          me().base_path,
          pathResolve(props.readme ? pathname() : pathDir(pathname()), url),
        )}`
      }
      const ans = `![${name}](${url})`
      console.log(ans)
      return ans
    })
    return content
  })
  const baseRemarkPlugins: SolidMarkdownOptions["remarkPlugins"] = [remarkGfm]
  const baseRehypePlugins: SolidMarkdownOptions["rehypePlugins"] = [
    rehypeRaw,
    normalizeMarkdownPositions,
  ]
  const [remarkPlugins, setRemarkPlugins] = createSignal(baseRemarkPlugins)
  const [rehypePlugins, setRehypePlugins] = createSignal(baseRehypePlugins)
  let renderVersion = 0
  createEffect(
    on(md, async (content) => {
      const version = ++renderVersion
      setShow(false)
      if (/\$\$[\s\S]+?\$\$|\$[^$\n]+?\$/.test(content)) {
        const [{ default: remarkMath }, { default: rehypeKatex }] =
          await Promise.all([import("remark-math"), import("rehype-katex")])
        if (version !== renderVersion) return
        insertKatexCSS()
        setRemarkPlugins([remarkGfm, remarkMath])
        setRehypePlugins([rehypeRaw, rehypeKatex, normalizeMarkdownPositions])
      } else {
        setRemarkPlugins(baseRemarkPlugins)
        setRehypePlugins(baseRehypePlugins)
      }
      insertMermaidJS()
      setTimeout(() => {
        setShow(true)
        hljs.highlightAll()
        window.mermaid &&
          window.mermaid.run({
            querySelector: ".language-mermaid",
          })
        window.onMDRender && window.onMDRender()
      })
    }),
  )
  const [markdownRef, setMarkdownRef] = createSignal<HTMLDivElement>()
  return (
    <Box
      ref={(r: HTMLDivElement) => setMarkdownRef(r)}
      class="markdown"
      pos="relative"
      w="$full"
    >
      <Show when={show()}>
        <SolidMarkdown
          class={clsx("markdown-body", props.class)}
          remarkPlugins={remarkPlugins()}
          rehypePlugins={rehypePlugins()}
          transformLinkUri={transformLinkUri}
          transformImageUri={transformImageUri}
          children={md()}
        />
      </Show>
      <Show when={!isString}>
        <EncodingSelect
          encoding={encoding()}
          setEncoding={setEncoding}
          referenceText={props.children}
        />
      </Show>
      <MarkdownToc disabled={!props.toc} markdownRef={markdownRef()!} />
    </Box>
  )
}

export default Markdown
