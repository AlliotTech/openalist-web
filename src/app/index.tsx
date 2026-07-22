import { ErrorBoundary, Suspense, type JSXElement } from "solid-js"
import { Error } from "~/components/Base"
import { FullScreenLoading } from "~/components/FullLoading"
import { AppToastRegion } from "~/components/ui/ToastRegion"
import { AppColorModeProvider } from "~/components/ui/ColorMode"
import App from "./App"
import "./theme.css"

const Index = (props: { children?: JSXElement }) => {
  return (
    <AppColorModeProvider>
      <ErrorBoundary
        fallback={(err) => {
          console.error("error", err)
          return <Error msg={`System error: ${err}`} h="100vh" />
        }}
      >
        <Suspense fallback={<FullScreenLoading />}>
          <App>{props.children}</App>
        </Suspense>
        <AppToastRegion />
      </ErrorBoundary>
    </AppColorModeProvider>
  )
}

export { Index }
