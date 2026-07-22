import "./display.css"

const token = (value: string | undefined, group: string) =>
  value?.startsWith("$") ? `var(--hope-${group}-${value.slice(1)})` : value

export const AppSkeleton = (props: {
  w?: string
  h?: string
  rounded?: string
}) => (
  <div
    aria-hidden="true"
    class="app-skeleton"
    style={{
      width: token(props.w, "sizes"),
      height: token(props.h, "sizes"),
      "border-radius": token(props.rounded, "radii"),
    }}
  />
)

export const AppDivider = () => <hr class="app-divider" />
