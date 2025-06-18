import { globalCss, HopeThemeConfig } from "@hope-ui/solid"
import { hoverColor } from "~/utils"

const theme: HopeThemeConfig = {
  initialColorMode: "system",
  lightTheme: {
    colors: {
      background: "#fafbfc",
    },
  },
  components: {
    Button: {
      baseStyle: {
        root: {
          rounded: "$lg",
          _active: {
            transform: "scale(.95)",
            transition: "0.2s",
          },
          _focus: {
            boxShadow: "unset",
          },
        },
      },
      defaultProps: {
        root: {
          colorScheme: "info",
          variant: "subtle",
        },
      },
    },
    IconButton: {
      defaultProps: {
        colorScheme: "info",
        variant: "subtle",
      },
    },
    Input: {
      baseStyle: {
        input: {
          rounded: "$lg",
          _focus: {
            boxShadow: "unset",
            borderColor: "$info8",
          },
        },
      },
      defaultProps: {
        input: {
          variant: "filled",
        },
      },
    },
    Textarea: {
      baseStyle: {
        rounded: "$lg",
        _focus: {
          boxShadow: "unset",
          borderColor: "$info8",
        },
        resize: "vertical",
        wordBreak: "break-all",
      },
      defaultProps: {
        variant: "filled",
      },
    },
    Select: {
      baseStyle: {
        trigger: {
          rounded: "$lg",
          _focus: {
            boxShadow: "unset",
            borderColor: "$info8",
          },
        },
        content: {
          border: "none",
          rounded: "$lg",
        },
        optionIndicator: {
          color: "$info10",
        },
      },
      defaultProps: {
        root: {
          variant: "filled",
        },
      },
    },
    Checkbox: {
      defaultProps: {
        root: {
          colorScheme: "info",
          variant: "filled",
        },
      },
    },
    Switch: {
      defaultProps: {
        root: {
          colorScheme: "info",
        },
      },
    },
    Menu: {
      baseStyle: {
        content: {
          rounded: "$md",
          minW: "unset",
          border: "unset",
        },
        item: {
          rounded: "$md",
          py: "$1",
        },
      },
    },
    Notification: {
      baseStyle: {
        root: {
          rounded: "$lg",
          border: "unset",
        },
      },
    },
    Alert: {
      baseStyle: {
        root: {
          rounded: "$lg",
        },
      },
    },
    Anchor: {
      baseStyle: {
        rounded: "$lg",
        px: "$1_5",
        py: "$1",
        _hover: {
          bgColor: hoverColor(),
          textDecoration: "none",
        },
        _focus: {
          boxShadow: "unset",
        },
        _active: { transform: "scale(.95)", transition: "0.1s" },
      },
    },
    Modal: {
      baseStyle: {
        content: {
          rounded: "$lg",
        },
      },
    },
  },
}

export const globalStyles = globalCss({
  "*": {
    margin: 0,
    padding: 0,
  },
  html: {
    fontFamily: `-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol" !important`,
    scrollBehavior: "smooth",
    "-webkit-font-smoothing": "antialiased",
    "-moz-osx-font-smoothing": "grayscale",
  },
  body: {
    fontFeatureSettings: '"kern" 1, "liga" 1, "calt" 1',
    lineHeight: "1.6",
  },
  "#root": {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    minHeight: "100vh",
  },
  ".hope-breadcrumb__list": {
    flexWrap: "wrap",
    rowGap: "0 !important",
  },
  ".lightgallery-container": {
    "& .lg-backdrop": {
      zIndex: "$popover",
      backdropFilter: "blur(8px)",
    },
    "& .lg-outer": {
      zIndex: "calc($popover + 10)",
    },
  },
  ".viselect-selection-area": {
    background: "rgba(59, 130, 246, 0.1)",
    border: "2px solid rgba(59, 130, 246, 0.3)",
    borderRadius: "8px",
    backdropFilter: "blur(4px)",
  },
  ".viselect-container": {
    userSelect: "none",
    "& .viselect-item": {
      "-webkit-user-drag": "none",
      transition: "all 0.2s ease",
      "& img": {
        "-webkit-user-drag": "none",
      },
    },
  },
  // 优化表格样式
  table: {
    borderCollapse: "collapse",
    width: "100%",
    borderRadius: "$lg",
    overflow: "hidden",
    boxShadow:
      "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
  },
  "th, td": {
    padding: "$3",
    textAlign: "left",
    borderBottom: "1px solid $neutral4",
  },
  th: {
    backgroundColor: "$neutral2",
    fontWeight: "600",
    fontSize: "$sm",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  "tr:hover": {
    backgroundColor: "$neutral2",
  },
  // 优化代码块样式
  pre: {
    borderRadius: "$lg",
    padding: "$4",
    overflow: "auto",
    backgroundColor: "$neutral2",
    border: "1px solid $neutral4",
    fontSize: "$sm",
    lineHeight: "1.6",
  },
  code: {
    backgroundColor: "$neutral2",
    padding: "$1 $2",
    borderRadius: "$sm",
    fontSize: "0.875em",
    fontFamily:
      "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
  },
  "pre code": {
    backgroundColor: "transparent",
    padding: "0",
  },
  // 优化列表样式
  "ul, ol": {
    paddingLeft: "$6",
  },
  li: {
    marginBottom: "$2",
  },
  // 优化引用样式
  blockquote: {
    borderLeft: "4px solid $info8",
    paddingLeft: "$4",
    marginLeft: "0",
    marginRight: "0",
    fontStyle: "italic",
    backgroundColor: "$neutral2",
    borderRadius: "$md",
    padding: "$4",
  },
  // 优化分割线样式
  hr: {
    border: "none",
    height: "1px",
    backgroundColor: "$neutral4",
    margin: "$6 0",
  },
  // 响应式优化
  "@media (max-width: 768px)": {
    html: {
      fontSize: "14px",
    },
    table: {
      fontSize: "$xs",
    },
    "th, td": {
      padding: "$2",
    },
  },
})

export { theme }
