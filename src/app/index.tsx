import { HopeProvider } from "@hope-ui/solid"
import { ErrorBoundary, Suspense, type JSXElement } from "solid-js"
import { Error, FullScreenLoading } from "~/components"
import { AppToastRegion } from "~/components/ui/ToastRegion"
import App from "./App"
import { globalStyles, theme } from "./theme"

const Index = (props: { children?: JSXElement }) => {
  globalStyles()
  return (
    <HopeProvider config={theme}>
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
    </HopeProvider>
  )
}

export { Index }
