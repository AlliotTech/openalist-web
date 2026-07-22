import { AppBox as Box } from "~/components/ui/Layout"
import { createEffect, onCleanup, onMount } from "solid-js"
import * as monaco from "monaco-editor"
import EditorWorker from "monaco-editor/editor/editor.worker?worker"
import CssWorker from "monaco-editor/language/css/css.worker?worker"
import HtmlWorker from "monaco-editor/language/html/html.worker?worker"
import JsonWorker from "monaco-editor/language/json/json.worker?worker"
import TsWorker from "monaco-editor/language/typescript/ts.worker?worker"

const markdownExtensions = new Set([
  "md",
  "markdown",
  "mdown",
  "mkdn",
  "mkd",
  "mdwn",
  "mdtxt",
  "mdtext",
])

export const editorLanguageForPath = (path?: string) => {
  const extension = path?.split(".").pop()?.toLowerCase()
  return extension && markdownExtensions.has(extension) ? "markdown" : undefined
}

;(self as any).MonacoEnvironment = {
  getWorker(_: string, label: string) {
    if (label === "json") return new JsonWorker()
    if (["css", "less", "scss"].includes(label)) return new CssWorker()
    if (["html", "handlebars", "razor"].includes(label)) return new HtmlWorker()
    if (["typescript", "javascript"].includes(label)) return new TsWorker()
    return new EditorWorker()
  },
}
export interface MonacoEditorProps {
  value: string
  onChange?: (value: string) => void
  theme: "vs" | "vs-dark"
  path?: string
  language?: string
}
export const MonacoEditorLoader = (props: MonacoEditorProps) => (
  <MonacoEditor {...props} />
)

export const MonacoEditor = (props: MonacoEditorProps) => {
  let monacoEditorDiv: HTMLDivElement
  let monacoEditor: monaco.editor.IStandaloneCodeEditor
  let model: monaco.editor.ITextModel
  onMount(() => {
    monacoEditor = monaco.editor.create(monacoEditorDiv!, {
      value: props.value,
      theme: props.theme,
    })
    model = monaco.editor.createModel(
      props.value,
      props.language ?? editorLanguageForPath(props.path),
      props.path ? monaco.Uri.parse(props.path) : undefined,
    )
    monacoEditor.setModel(model)
    monacoEditor.onDidChangeModelContent(() => {
      props.onChange?.(monacoEditor.getValue())
    })
  })
  createEffect(() => {
    monacoEditor.setValue(props.value)
  })

  createEffect(() => {
    monaco.editor.setTheme(props.theme)
  })
  onCleanup(() => {
    model && model.dispose()
    monacoEditor && monacoEditor.dispose()
  })
  return <Box w="$full" h="70vh" ref={monacoEditorDiv!} />
}
