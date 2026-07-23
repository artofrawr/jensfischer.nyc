"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import NextLink from "next/link"
import { usePathname } from "next/navigation"
import { MenuIcon, XIcon } from "lucide-react"
import {
  Box,
  Flex,
  chakra,
  type BoxProps,
  type FlexProps,
  type HTMLChakraProps,
} from "@chakra-ui/react"

import { PageContainer } from "@/components/ui/page-container"

const Link = chakra(NextLink)

function SiteHeader({ children, ...props }: BoxProps) {
  return (
    <chakra.header
      data-slot="site-header"
      position="sticky"
      top={0}
      zIndex={50}
      w="full"
      borderBottomWidth="1px"
      bg="background/70"
      backdropFilter="blur(12px)"
      css={{
        "@supports (backdrop-filter: blur(0px))": { bg: "background/80" },
      }}
      {...props}
    >
      <PageContainer px={6}>
        <Flex h="header" align="center" gap={4}>
          {children}
        </Flex>
      </PageContainer>
    </chakra.header>
  )
}

function SiteHeaderLogo({
  href = "/",
  children,
  ...props
}: React.ComponentProps<typeof Link>) {
  return (
    <Link
      href={href}
      display="flex"
      flexShrink={0}
      alignItems="center"
      gap={2}
      fontWeight="semibold"
      letterSpacing="tight"
      color="foreground"
      transition="opacity 0.15s ease"
      _hover={{ opacity: 0.8 }}
      {...props}
    >
      {children}
    </Link>
  )
}

function SiteHeaderNav({ children, ...props }: BoxProps) {
  return (
    <chakra.nav
      data-slot="site-header-nav"
      ml="auto"
      display={{ base: "none", md: "flex" }}
      alignItems="center"
      gap={1}
      {...props}
    >
      {children}
    </chakra.nav>
  )
}

function SiteHeaderNavLink({
  href,
  exact = false,
  children,
  ...props
}: React.ComponentProps<typeof Link> & { href: string; exact?: boolean }) {
  const pathname = usePathname()
  const isActive = exact ? pathname === href : pathname.startsWith(href)

  return (
    <Link
      href={href}
      display="inline-flex"
      alignItems="center"
      borderRadius="md"
      px={3}
      py={1.5}
      textStyle="sm"
      fontWeight="medium"
      transition="all 0.15s ease"
      color={isActive ? "foreground" : "muted.foreground"}
      _hover={{ bg: "muted", color: "foreground" }}
      {...props}
    >
      {children}
    </Link>
  )
}

function SiteHeaderActions({ children, ...props }: FlexProps) {
  return (
    <Flex data-slot="site-header-actions" align="center" gap={1} {...props}>
      {children}
    </Flex>
  )
}

export const MobileNavContext = React.createContext<{ close: () => void }>({
  close: () => {},
})

function SiteHeaderMobileNav({
  children,
  ...props
}: React.PropsWithChildren<HTMLChakraProps<"button">>) {
  const [open, setOpen] = React.useState(false)

  // Prevent body scroll when menu is open
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  return (
    <>
      <chakra.button
        onClick={() => setOpen(true)}
        display={{ base: "inline-flex", md: "none" }}
        alignItems="center"
        justifyContent="center"
        borderRadius="md"
        p={1.5}
        color="muted.foreground"
        cursor="pointer"
        _hover={{ bg: "muted", color: "foreground" }}
        aria-label="Open menu"
        {...props}
      >
        <MenuIcon size={20} />
      </chakra.button>
      {open &&
        createPortal(
          <Box
            position="fixed"
            inset={0}
            zIndex={50}
            display="flex"
            flexDirection="column"
            bg="background"
            animationName="fade-in"
            animationDuration="150ms"
          >
            <PageContainer px={6}>
              <Flex h="header" align="center" justify="space-between">
                <chakra.span
                  textStyle="sm"
                  fontWeight="semibold"
                  color="foreground"
                >
                  Menu
                </chakra.span>
                <chakra.button
                  onClick={() => setOpen(false)}
                  display="inline-flex"
                  alignItems="center"
                  justifyContent="center"
                  borderRadius="md"
                  p={1.5}
                  color="muted.foreground"
                  cursor="pointer"
                  _hover={{ bg: "muted", color: "foreground" }}
                  aria-label="Close menu"
                >
                  <XIcon size={20} />
                </chakra.button>
              </Flex>
            </PageContainer>
            <Box borderTopWidth="1px" />
            <MobileNavContext.Provider value={{ close: () => setOpen(false) }}>
              <PageContainer px={6} pt={6}>
                {children}
              </PageContainer>
            </MobileNavContext.Provider>
          </Box>,
          document.body,
        )}
    </>
  )
}

function SiteHeaderMobileNavLink({
  href,
  exact = false,
  children,
  ...props
}: React.ComponentProps<typeof Link> & { href: string; exact?: boolean }) {
  const pathname = usePathname()
  const { close } = React.use(MobileNavContext)
  const isActive = exact ? pathname === href : pathname.startsWith(href)

  return (
    <Link
      href={href}
      onClick={close}
      display="flex"
      alignItems="center"
      py={2}
      textStyle="2xl"
      fontWeight="medium"
      transition="color 0.15s ease"
      color={isActive ? "foreground" : "muted.foreground"}
      _hover={{ color: "foreground" }}
      {...props}
    >
      {children}
    </Link>
  )
}

export {
  SiteHeader,
  SiteHeaderLogo,
  SiteHeaderNav,
  SiteHeaderNavLink,
  SiteHeaderActions,
  SiteHeaderMobileNav,
  SiteHeaderMobileNavLink,
}
