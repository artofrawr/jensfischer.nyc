import { chakra } from "@chakra-ui/react"

const Button = chakra("button", {
  base: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    whiteSpace: "nowrap",
    borderRadius: "md",
    textStyle: "sm",
    fontWeight: "medium",
    transition: "all 0.15s ease",
    outline: "none",
    flexShrink: 0,
    cursor: "pointer",
    _focusVisible: {
      borderColor: "ring",
      boxShadow: "0 0 0 3px var(--jf-colors-ring)",
    },
    _disabled: { pointerEvents: "none", opacity: 0.5 },
    "& svg": { pointerEvents: "none", flexShrink: 0, boxSize: 4 },
  },
  variants: {
    variant: {
      default: {
        bg: "primary",
        color: "primary.foreground",
        boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        _hover: { bg: "primary/90" },
      },
      destructive: {
        bg: "destructive",
        color: "white",
        boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        _hover: { bg: "destructive/90" },
      },
      outline: {
        borderWidth: "1px",
        borderColor: "border",
        bg: "background",
        boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        _hover: { bg: "accent", color: "accent.foreground" },
      },
      secondary: {
        bg: "secondary",
        color: "secondary.foreground",
        boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        _hover: { bg: "secondary/80" },
      },
      ghost: {
        _hover: { bg: "accent", color: "accent.foreground" },
      },
      link: {
        color: "primary",
        textUnderlineOffset: "4px",
        _hover: { textDecoration: "underline" },
      },
    },
    size: {
      default: { h: 9, px: 4, py: 2 },
      sm: { h: 8, gap: 1.5, borderRadius: "md", px: 3 },
      lg: { h: 10, borderRadius: "md", px: 6 },
      icon: { boxSize: 9 },
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
})

export { Button }
