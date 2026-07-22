import { getOwner, onCleanup, runWithOwner } from "solid-js"
import { useTitle } from "~/hooks/useTitle"
import { getSetting } from "~/store/settings"
import { notify } from "~/utils/notify"
import { Body } from "./Body"
import { Footer } from "./Footer"
import { Header } from "./header/Header"
import { Toolbar } from "./toolbar/Toolbar"

const Index = () => {
  useTitle(getSetting("site_title"))
  const announcement = getSetting("announcement")
  if (announcement) {
    const owner = getOwner()
    let active = true
    void import("~/components/Markdown")
      .then(({ Markdown }) => {
        if (active && owner) {
          runWithOwner(owner, () =>
            notify.render(<Markdown children={announcement} />),
          )
        }
      })
      .catch((error) => console.error("failed to load announcement", error))
    onCleanup(() => {
      active = false
    })
  }
  return (
    <>
      <Header />
      <Toolbar />
      <Body />
      <Footer />
    </>
  )
}

export default Index
