"use client"

import * as React from "react"
import { Maximize2, Minimize2 } from "lucide-react"
import { Box, Flex, Text, chakra } from "@chakra-ui/react"

import { Button } from "@/components/ui/button"
import type { KaraokeEngine } from "./engine"

type Phase = "loading" | "ready" | "playing" | "done"

// Vendor-prefixed Fullscreen API surface (Safari).
type FullscreenElement = HTMLElement & {
  webkitRequestFullscreen?: () => Promise<void> | void
}
type FullscreenDocument = Document & {
  webkitFullscreenElement?: Element | null
  webkitExitFullscreen?: () => Promise<void> | void
}

export function KaraokeDemo({ className }: { className?: string }) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const mountRef = React.useRef<HTMLDivElement>(null)
  const engineRef = React.useRef<KaraokeEngine | null>(null)

  const [phase, setPhase] = React.useState<Phase>("loading")
  const [isFullscreen, setIsFullscreen] = React.useState(false)
  // Fallback used only when the native Fullscreen API is unavailable.
  const [expanded, setExpanded] = React.useState(false)

  // Boot the engine on mount. three.js is imported dynamically so it never runs
  // during server rendering and only loads once this component is on screen.
  React.useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    let engine: KaraokeEngine | null = null
    let cancelled = false

    void import("./engine").then(({ KaraokeEngine }) => {
      if (cancelled) return
      engine = new KaraokeEngine(mount, {
        onReady: () => setPhase("ready"),
        onComplete: () => setPhase("done"),
      })
      engineRef.current = engine
      engine.init()
    })

    return () => {
      cancelled = true
      engine?.dispose()
      engineRef.current = null
    }
  }, [])

  // Keep local state in sync with the browser's fullscreen state (covers the
  // user pressing Esc or the system F11, which the API drives directly).
  React.useEffect(() => {
    const onChange = () => {
      const doc = document as FullscreenDocument
      const fsElement =
        document.fullscreenElement ?? doc.webkitFullscreenElement
      setIsFullscreen(fsElement === containerRef.current)
    }
    document.addEventListener("fullscreenchange", onChange)
    document.addEventListener("webkitfullscreenchange", onChange)
    return () => {
      document.removeEventListener("fullscreenchange", onChange)
      document.removeEventListener("webkitfullscreenchange", onChange)
    }
  }, [])

  // Escape only needs manual handling for the CSS fallback; native fullscreen
  // exits on Escape by itself.
  React.useEffect(() => {
    if (!expanded) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setExpanded(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [expanded])

  const toggleFullscreen = () => {
    const el = containerRef.current as FullscreenElement | null
    if (!el) return
    const doc = document as FullscreenDocument

    const request = el.requestFullscreen ?? el.webkitRequestFullscreen
    const exit = document.exitFullscreen ?? doc.webkitExitFullscreen
    const active = document.fullscreenElement ?? doc.webkitFullscreenElement

    if (!request) {
      // No Fullscreen API — fall back to filling the viewport.
      setExpanded((v) => !v)
      return
    }

    if (active) {
      void exit?.call(document)
    } else {
      // Rejections (e.g. blocked gesture) fall back to the CSS approach.
      void Promise.resolve(request.call(el)).catch(() => setExpanded(true))
    }
  }

  const handleStartClick = () => {
    engineRef.current?.start()
    setPhase("playing")
  }

  const immersive = isFullscreen || expanded
  const overlayVisible = phase !== "playing"

  return (
    <Box
      ref={containerRef}
      className={className}
      userSelect="none"
      overflow="hidden"
      bg="black"
      {...(immersive
        ? { position: "fixed", inset: 0, zIndex: 100 }
        : { position: "relative", aspectRatio: "wide", w: "full" })}
    >
      <Box
        ref={mountRef}
        position="absolute"
        inset={0}
        touchAction="none"
        cursor={phase === "playing" ? "none" : undefined}
      />

      {/* Fullscreen toggle */}
      <chakra.button
        type="button"
        onClick={toggleFullscreen}
        aria-label={immersive ? "Exit fullscreen" : "Enter fullscreen"}
        position="absolute"
        right={3}
        top={3}
        zIndex={10}
        bg="black/40"
        p={2}
        color="white/90"
        cursor="pointer"
        backdropFilter="blur(4px)"
        transition="background-color 0.15s ease, color 0.15s ease"
        _hover={{ bg: "black/70", color: "white" }}
      >
        {immersive ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
      </chakra.button>

      {/* Loader / start overlay */}
      {overlayVisible && (
        <Flex
          position="absolute"
          inset={0}
          zIndex={5}
          direction="column"
          align="center"
          justify="center"
          gap={5}
          bg="black/55"
          px={6}
          textAlign="center"
        >
          <Flex direction="column" gap={1.5}>
            <Text
              fontFamily="mono"
              textStyle="xs"
              textTransform="uppercase"
              letterSpacing="0.2em"
              color="#ffc7bb"
            >
              Web Audio API + WebGL
            </Text>
            <chakra.h3 textStyle="2xl" fontWeight="medium" color="white">
              Karaoke
            </chakra.h3>
            <Text maxW="xs" textStyle="sm" color="white/70">
              Move your cursor up and down to match the staff lines and hit the
              right pitch. Sound on, please.
            </Text>
          </Flex>

          {phase === "loading" ? (
            <Text
              animation="pulse"
              fontFamily="mono"
              textStyle="sm"
              letterSpacing="widest"
              color="white/80"
            >
              LOADING…
            </Text>
          ) : (
            <Button
              type="button"
              variant="secondary"
              size="lg"
              onClick={handleStartClick}
            >
              {phase === "done" ? "PLAY AGAIN" : "START"}
            </Button>
          )}
        </Flex>
      )}
    </Box>
  )
}
