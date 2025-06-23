import { Box, useColorModeValue } from "@hope-ui/solid"
import CornerBottom from "./CornerBottom"
import CornerTop from "./CornerTop"

const LoginBg = () => {
  // 渐变色
  const gradient = useColorModeValue(
    "linear-gradient(135deg, #a9c6ff 0%,rgb(233, 154, 211) 100%)",
    "linear-gradient(135deg, #062b74 0%, #1a2980 100%)",
  )

  // 柔和光斑点缀
  const spots = [
    {
      style: {
        position: "absolute",
        top: "10%",
        left: "15%",
        width: "300px",
        height: "300px",
        background: "radial-gradient(circle, #fff6 0%, #fff0 70%)",
        filter: "blur(40px)",
        opacity: 0.7,
        pointerEvents: "none",
      },
    },
    {
      style: {
        position: "absolute",
        bottom: "15%",
        right: "10%",
        width: "250px",
        height: "250px",
        background: "radial-gradient(circle, #a9c6ff88 0%, #fff0 80%)",
        filter: "blur(30px)",
        opacity: 0.5,
        pointerEvents: "none",
      },
    },
  ]

  return (
    <Box
      bg={gradient()}
      pos="fixed"
      top="0"
      left="0"
      overflow="hidden"
      zIndex="-1"
      w="100vw"
      h="100vh"
    >
      {/* 柔和光斑 */}
      {spots.map((spot) => (
        <Box style={spot.style} />
      ))}

      {/* 玻璃拟态半透明层 */}
      <Box
        pos="absolute"
        top="0"
        left="0"
        w="100vw"
        h="100vh"
        style={{
          background: "rgba(255,255,255,0.15)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          pointerEvents: "none",
        }}
      />

      {/* 角落装饰 */}
      <Box
        pos="absolute"
        right={{
          "@initial": "-100px",
          "@sm": "-300px",
        }}
        top={{
          "@initial": "-1170px",
          "@sm": "-900px",
        }}
      >
        <CornerTop />
      </Box>
      <Box
        pos="absolute"
        left={{
          "@initial": "-100px",
          "@sm": "-200px",
        }}
        bottom={{
          "@initial": "-760px",
          "@sm": "-400px",
        }}
      >
        <CornerBottom />
      </Box>
    </Box>
  )
}

export default LoginBg
