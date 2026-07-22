import { Box } from "@hope-ui/solid"
import { AppVStack as VStack } from "~/components/ui/Stack"
import Upload from "~/pages/home/uploads/Upload"

const Index = () => {
  return (
    <VStack justifyContent="center" h="100vh">
      <Box w="$md">
        <Upload />
      </Box>
    </VStack>
  )
}

export default Index
