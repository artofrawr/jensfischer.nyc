import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react"

/**
 * The palette is carried over verbatim from the previous Tailwind/shadcn setup
 * so the migration is a pure swap of styling engine, not of design.
 *
 * Breakpoints, spacing, font sizes and radii are aligned to the Tailwind scale
 * the components were authored against (Chakra's spacing/font scales already
 * match Tailwind; only `sm` and the radii needed adjusting).
 */
const config = defineConfig({
  cssVarsPrefix: "jf",
  theme: {
    breakpoints: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    tokens: {
      fonts: {
        body: { value: "var(--font-sans)" },
        heading: { value: "var(--font-sans)" },
        headline: { value: "var(--font-headline)" },
        mono: { value: "var(--font-mono)" },
      },
      radii: {
        // shadcn's --radius: 0.625rem scale
        sm: { value: "0.375rem" },
        md: { value: "0.5rem" },
        lg: { value: "0.625rem" },
        xl: { value: "0.875rem" },
      },
      colors: {
        // Fixed (non-inverting) values, used by the footer which stays dark in
        // both color modes, and as raw values for overlays.
        ink: { value: "oklch(0.145 0 0)" },
        paper: { value: "oklch(1 0 0)" },
        // Tailwind's zinc scale, kept for the code block chrome.
        zinc: {
          50: { value: "#fafafa" },
          100: { value: "#f4f4f5" },
          200: { value: "#e4e4e7" },
          300: { value: "#d4d4d8" },
          400: { value: "#a1a1aa" },
          500: { value: "#71717a" },
          600: { value: "#52525b" },
          700: { value: "#3f3f46" },
          800: { value: "#27272a" },
          900: { value: "#18181b" },
          950: { value: "#09090b" },
        },
      },
      sizes: {
        header: { value: "56px" },
        sidebar: { value: "272px" },
        toc: { value: "272px" },
        prose: { value: "65ch" },
      },
    },
    // Chakra pairs its font sizes with fixed line-height lengths and adds
    // tracking to the large sizes. Tailwind uses unitless ratios and no
    // tracking, which also changes what descendants inherit — so the text
    // styles are redefined here with Tailwind's exact values.
    // letterSpacing is reset explicitly because theme values merge.
    textStyles: {
      xs: { value: { fontSize: "xs", lineHeight: 1.3333333 } },
      sm: { value: { fontSize: "sm", lineHeight: 1.4285714 } },
      md: { value: { fontSize: "md", lineHeight: 1.5 } },
      lg: { value: { fontSize: "lg", lineHeight: 1.5555556 } },
      xl: { value: { fontSize: "xl", lineHeight: 1.4 } },
      "2xl": { value: { fontSize: "2xl", lineHeight: 1.3333333 } },
      "3xl": { value: { fontSize: "3xl", lineHeight: 1.2 } },
      "4xl": {
        value: {
          fontSize: "4xl",
          lineHeight: 1.1111111,
          letterSpacing: "normal",
        },
      },
      "5xl": {
        value: { fontSize: "5xl", lineHeight: 1, letterSpacing: "normal" },
      },
      "6xl": {
        value: { fontSize: "6xl", lineHeight: 1, letterSpacing: "normal" },
      },
      "7xl": {
        value: { fontSize: "7xl", lineHeight: 1, letterSpacing: "normal" },
      },
      "8xl": { value: { fontSize: "8xl", lineHeight: 1 } },
      "9xl": { value: { fontSize: "9xl", lineHeight: 1 } },
      label: {
        value: { fontSize: "sm", lineHeight: 1.4285714, fontWeight: "medium" },
      },
    },
    semanticTokens: {
      colors: {
        // Chakra's own primitives, remapped onto the shadcn palette so the
        // built-in components inherit the site's look.
        bg: {
          DEFAULT: {
            value: { _light: "oklch(1 0 0)", _dark: "oklch(0.145 0 0)" },
          },
          muted: {
            value: { _light: "oklch(0.97 0 0)", _dark: "oklch(0.269 0 0)" },
          },
          subtle: {
            value: { _light: "oklch(0.97 0 0)", _dark: "oklch(0.269 0 0)" },
          },
          emphasized: {
            value: { _light: "oklch(0.97 0 0)", _dark: "oklch(0.371 0 0)" },
          },
          panel: {
            value: { _light: "oklch(1 0 0)", _dark: "oklch(0.205 0 0)" },
          },
          inverted: {
            value: { _light: "oklch(0.145 0 0)", _dark: "oklch(1 0 0)" },
          },
        },
        fg: {
          DEFAULT: {
            value: { _light: "oklch(0.145 0 0)", _dark: "oklch(0.985 0 0)" },
          },
          muted: {
            value: { _light: "oklch(0.556 0 0)", _dark: "oklch(0.708 0 0)" },
          },
          subtle: {
            value: { _light: "oklch(0.708 0 0)", _dark: "oklch(0.556 0 0)" },
          },
          inverted: {
            value: { _light: "oklch(0.985 0 0)", _dark: "oklch(0.145 0 0)" },
          },
        },
        border: {
          DEFAULT: {
            value: {
              _light: "oklch(0.922 0 0)",
              _dark: "oklch(1 0 0 / 10%)",
            },
          },
          muted: {
            value: {
              _light: "oklch(0.922 0 0)",
              _dark: "oklch(1 0 0 / 10%)",
            },
          },
          subtle: {
            value: {
              _light: "oklch(0.922 0 0)",
              _dark: "oklch(1 0 0 / 10%)",
            },
          },
        },

        // shadcn-named aliases, kept so the migrated markup reads the same way
        // it did before.
        background: {
          value: { _light: "oklch(1 0 0)", _dark: "oklch(0.145 0 0)" },
        },
        foreground: {
          value: { _light: "oklch(0.145 0 0)", _dark: "oklch(0.985 0 0)" },
        },
        card: {
          DEFAULT: {
            value: { _light: "oklch(1 0 0)", _dark: "oklch(0.205 0 0)" },
          },
          foreground: {
            value: { _light: "oklch(0.145 0 0)", _dark: "oklch(0.985 0 0)" },
          },
        },
        popover: {
          DEFAULT: {
            value: { _light: "oklch(1 0 0)", _dark: "oklch(0.205 0 0)" },
          },
          foreground: {
            value: { _light: "oklch(0.145 0 0)", _dark: "oklch(0.985 0 0)" },
          },
        },
        primary: {
          DEFAULT: {
            value: { _light: "oklch(0.205 0 0)", _dark: "oklch(0.87 0 0)" },
          },
          foreground: {
            value: { _light: "oklch(0.985 0 0)", _dark: "oklch(0.205 0 0)" },
          },
        },
        secondary: {
          DEFAULT: {
            value: { _light: "oklch(0.97 0 0)", _dark: "oklch(0.269 0 0)" },
          },
          foreground: {
            value: { _light: "oklch(0.205 0 0)", _dark: "oklch(0.985 0 0)" },
          },
        },
        muted: {
          DEFAULT: {
            value: { _light: "oklch(0.97 0 0)", _dark: "oklch(0.269 0 0)" },
          },
          foreground: {
            value: { _light: "oklch(0.556 0 0)", _dark: "oklch(0.708 0 0)" },
          },
        },
        accent: {
          DEFAULT: {
            value: { _light: "oklch(0.97 0 0)", _dark: "oklch(0.371 0 0)" },
          },
          foreground: {
            value: { _light: "oklch(0.205 0 0)", _dark: "oklch(0.985 0 0)" },
          },
        },
        destructive: {
          value: {
            _light: "oklch(0.58 0.22 27)",
            _dark: "oklch(0.704 0.191 22.216)",
          },
        },
        input: {
          value: { _light: "oklch(0.922 0 0)", _dark: "oklch(1 0 0 / 15%)" },
        },
        ring: {
          value: { _light: "oklch(0.708 0 0)", _dark: "oklch(0.556 0 0)" },
        },
      },
    },
  },
  globalCss: {
    "*, *::before, *::after": {
      borderColor: "border",
      outlineColor: "ring/50",
      // Chakra opts every element into Inter's "cv11" stylistic set, which
      // changes glyph shapes; reset it to keep type identical to before.
      fontFeatureSettings: "normal",
    },
    "html, body": {
      overscrollBehavior: "none",
      bg: "background",
      color: "foreground",
      fontFamily: "body",
      // Chakra's preflight sets optimizeLegibility, which changes kerning.
      textRendering: "auto",
    },

    /* Shiki dual-theme color resolution */
    ".shiki, .shiki span": { color: "var(--shiki-light)" },
    ".dark .shiki, .dark .shiki span": { color: "var(--shiki-dark)" },

    /* Line numbers via CSS counter on .line spans */
    ".shiki code": {
      counterReset: "step",
      counterIncrement: "step 0",
      display: "grid",
    },
    ".shiki code .line": { display: "inline-block", width: "100%" },
    ".shiki code .line::before": {
      content: "counter(step)",
      counterIncrement: "step",
      display: "inline-block",
      width: "1.75rem",
      marginRight: "1.25rem",
      textAlign: "right",
      color: "fg.muted",
      opacity: 0.5,
      userSelect: "none",
    },

    /* Client logo grid — cells keep a fixed 5:3 box and center their logo */
    ".client-logos": {
      borderTop: "1px solid",
      borderLeft: "1px solid",
      borderColor: "border",
    },
    ".client-logos div": {
      position: "relative",
      display: "block",
      borderRight: "1px solid",
      borderBottom: "1px solid",
      borderColor: "border",
      paddingBottom: "60%",
    },
    ".client-logos div img": {
      position: "absolute",
      top: "50%",
      left: "50%",
      height: "auto",
      transform: "translate(-50%, -50%)",
    },
    ".dark .client-logos div img": { filter: "invert(1)" },
  },
})

export const system = createSystem(defaultConfig, config)
