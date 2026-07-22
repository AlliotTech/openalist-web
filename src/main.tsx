/* @refresh reload */
import { Route, Router } from "@solidjs/router"
import { Dynamic } from "solid-js/web"
import { lazy, type JSXElement } from "solid-js"
import { render } from "solid-js/web"

import { Index } from "./app"
import { MustUser } from "./app/MustUser"
import { routes as manageRoutes } from "./pages/manage/routes"
import { joinBase } from "./utils/path"

const Home = lazy(() => import("~/pages/home/Layout"))
const Manage = lazy(() => import("~/pages/manage"))
const Login = lazy(() => import("~/pages/login"))
const Test = lazy(() => import("~/pages/test"))

const Protected = (props: { children: JSXElement }) => (
  <MustUser>{props.children}</MustUser>
)

declare global {
  interface Window {
    [key: string]: any
  }
}

declare module "solid-js" {
  namespace JSX {
    interface CustomEvents extends HTMLElementEventMap {}
    interface CustomCaptureEvents extends HTMLElementEventMap {}
  }
}

render(
  () => (
    <Router root={Index}>
      <Route path={joinBase("/@test")} component={Test} />
      <Route path={joinBase("/@login")} component={Login} />
      {manageRoutes.map((route) => (
        <Route
          path={joinBase("/@manage", route.to!)}
          component={() => (
            <Protected>
              <Manage>
                <Dynamic component={route.component} />
              </Manage>
            </Protected>
          )}
        />
      ))}
      <Route
        path="*"
        component={() => (
          <Protected>
            <Home />
          </Protected>
        )}
      />
    </Router>
  ),
  document.getElementById("root") as HTMLElement,
)
