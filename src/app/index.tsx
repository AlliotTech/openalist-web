import { HopeProvider, NotificationsProvider } from "@hope-ui/solid"
import { ErrorBoundary, Suspense, type JSXElement } from "solid-js"
import { Error, FullScreenLoading } from "~/components"
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
        <NotificationsProvider duration={3000}>
          <Suspense fallback={<FullScreenLoading />}>
            <App>{props.children}</App>
          </Suspense>
        </NotificationsProvider>
      </ErrorBoundary>
    </HopeProvider>
  )
}

export { Index }
