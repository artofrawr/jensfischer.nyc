"use client"

import * as React from "react"
import { Maximize2, Minimize2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
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
    <div
      ref={containerRef}
      className={cn(
        "select-none overflow-hidden bg-black",
        immersive ? "fixed inset-0 z-[100]" : "relative aspect-video w-full",
        className,
      )}
    >
      <div
        ref={mountRef}
        className={cn(
          "absolute inset-0 touch-none",
          phase === "playing" && "cursor-none",
        )}
      />

      {/* Fullscreen toggle */}
      <button
        type="button"
        onClick={toggleFullscreen}
        aria-label={immersive ? "Exit fullscreen" : "Enter fullscreen"}
        className="absolute right-3 top-3 z-10 bg-black/40 p-2 text-white/90 backdrop-blur-sm transition-colors hover:bg-black/70 hover:text-white"
      >
        {immersive ? (
          <Minimize2 className="size-4" />
        ) : (
          <Maximize2 className="size-4" />
        )}
      </button>

      {/* Loader / start overlay */}
      {overlayVisible && (
        <div className="absolute inset-0 z-[5] flex flex-col items-center justify-center gap-5 bg-black/55 px-6 text-center ">
          <div className="flex flex-col gap-1.5">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#ffc7bb]">
              Web Audio API + WebGL
            </p>
            <h3 className="text-2xl font-medium text-white">Karaoke</h3>
            <p className="max-w-xs text-sm text-white/70">
              Move your cursor up and down to match the staff lines and hit the
              right pitch. Sound on, please.
            </p>
          </div>

          {phase === "loading" ? (
            <p className="animate-pulse font-mono text-sm tracking-widest text-white/80">
              LOADING…
            </p>
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
        </div>
      )}
    </div>
  )
}
