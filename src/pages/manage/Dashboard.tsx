import { Heading } from "@hope-ui/solid"
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
