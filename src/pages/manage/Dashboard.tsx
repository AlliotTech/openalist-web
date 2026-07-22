import { AppHeading as Heading } from "~/components/ui/Typography"

import { AppCenter as Center } from "~/components/ui/Stack"
import { useManageTitle } from "~/hooks"

const Dashboard = () => {
  useManageTitle("manage.sidemenu.dashboard")
  return (
    <Center h="$full">
      <Heading>Dashboard</Heading>
    </Center>
  )
}

export default Dashboard
