/* @refresh reload */
import { Route, Router } from "@solidjs/router"
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

const ManageRoute = (props: { children?: JSXElement }) => (
  <Protected>
    <Manage>{props.children}</Manage>
  </Protected>
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
      <Route path={joinBase("/@manage/*")} component={ManageRoute}>
        {manageRoutes.map((route) => (
          <Route path={route.to!} component={route.component} />
        ))}
      </Route>
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
