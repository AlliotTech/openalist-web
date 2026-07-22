import { splitProps, type JSX, type ParentProps } from "solid-js"
import "./grid.css"

const token = (value: string | number | undefined, group: string) => {
  if (typeof value === "number") return `${value}px`
  if (typeof value !== "string") return value
  return value.startsWith("$")
    ? `var(--hope-${group}-${value.slice(1)})`
    : value
}

type Columns = {
  "@initial"?: string | number
  "@md"?: string | number
  "@lg"?: string | number
}

type GridProps = ParentProps<
  Omit<JSX.HTMLAttributes<HTMLDivElement>, "style"> & {
    style?: JSX.CSSProperties
    css?: JSX.CSSProperties
    w?: string
    gap?: string
    columnGap?: string
    mb?: string
    transition?: string
    templateColumns?: string | Columns
    columns?: number | Columns
  }
>

const columnsValue = (value: string | number | undefined) =>
  typeof value === "number" ? `repeat(${value}, minmax(0, 1fr))` : value

export const AppGrid = (props: GridProps) => {
  const [local, others] = splitProps(props, [
    "class",
    "style",
    "css",
    "children",
    "w",
    "gap",
    "columnGap",
    "mb",
    "transition",
    "templateColumns",
    "columns",
  ])
  const responsive = () =>
    typeof local.templateColumns === "object" ||
    typeof local.columns === "object"
  const source = () => local.templateColumns ?? local.columns
  const at = (key: keyof Columns) => {
    const value = source()
    return columnsValue(typeof value === "object" ? value[key] : undefined)
  }
  return (
    <div
      {...others}
      class={`app-grid${responsive() ? " app-grid--responsive" : ""}${local.class ? ` ${local.class}` : ""}`}
      style={{
        ...(local.css ?? {}),
        ...(local.style ?? {}),
        display: "grid",
        width: token(local.w, "sizes"),
        gap: token(local.gap, "space"),
        "column-gap": token(local.columnGap, "space"),
        "margin-bottom": token(local.mb, "space"),
        transition: local.transition,
        "grid-template-columns":
          typeof source() === "object"
            ? at("@initial")
            : columnsValue(source() as any),
        "--app-grid-columns-md": at("@md"),
        "--app-grid-columns-lg": at("@lg"),
      }}
    >
      {local.children}
    </div>
  )
}

export const AppSimpleGrid = AppGrid

export const AppGridItem = (
  props: ParentProps<{
    color?: string
    textAlign?: JSX.CSSProperties["text-align"]
    css?: JSX.CSSProperties
  }>,
) => (
  <div
    style={{
      ...(props.css ?? {}),
      color: token(props.color, "colors"),
      "text-align": props.textAlign,
    }}
  >
    {props.children}
  </div>
)
