"use client"

import NextLink from "next/link"
import NextImage from "next/image"
import { ArrowRightIcon } from "lucide-react"
import { chakra } from "@chakra-ui/react"

/**
 * `chakra()` is a client-only factory, so styled elements have to be created in
 * a "use client" module before server components can render them. Everything
 * here is a plain styled host element — no behavior, no state.
 */
export const Link = chakra(NextLink)
export const NextImg = chakra(NextImage)
export const ArrowRight = chakra(ArrowRightIcon)

export const A = chakra("a")
export const H1 = chakra("h1")
export const H2 = chakra("h2")
export const H3 = chakra("h3")
export const H4 = chakra("h4")
export const P = chakra("p")
export const Span = chakra("span")
export const Strong = chakra("strong")
export const Ul = chakra("ul")
export const Ol = chakra("ol")
export const Li = chakra("li")
export const Blockquote = chakra("blockquote")
export const Hr = chakra("hr")
export const Table = chakra("table")
export const Tr = chakra("tr")
export const Th = chakra("th")
export const Td = chakra("td")
export const Code = chakra("code")
export const Img = chakra("img")
export const Svg = chakra("svg")
export const Section = chakra("section")
export const Header = chakra("header")
export const Footer = chakra("footer")
export const Main = chakra("main")
