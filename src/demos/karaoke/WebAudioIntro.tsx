"use client"

import * as React from "react"
import { Play, Square } from "lucide-react"
import { Box, Flex, chakra } from "@chakra-ui/react"

const NOTE_NAMES = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
]

/** Frequency + note name for a semitone offset from A4 (440 Hz). */
function describe(semitones: number): { freq: number; note: string } {
  const freq = 440 * Math.pow(2, semitones / 12)
  const midi = 69 + semitones // A4 = MIDI 69
  const note = NOTE_NAMES[((midi % 12) + 12) % 12] + (Math.floor(midi / 12) - 1)
  return { freq, note }
}

/**
 * A minimal Web Audio API playground: a play/stop button drives an oscillator,
 * and the slider bends its pitch in real time. Deliberately tiny — it introduces
 * the same "reshape audio as it plays" idea the karaoke demo is built on.
 */
export function WebAudioIntro({ className }: { className?: string }) {
  const [playing, setPlaying] = React.useState(false)
  const [semitones, setSemitones] = React.useState(0)

  const ctxRef = React.useRef<AudioContext | null>(null)
  const oscRef = React.useRef<OscillatorNode | null>(null)
  const gainRef = React.useRef<GainNode | null>(null)

  const getCtx = (): AudioContext => {
    if (!ctxRef.current) {
      const Ctx =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext
      ctxRef.current = new Ctx()
    }
    return ctxRef.current
  }

  const stop = React.useCallback(() => {
    const ctx = ctxRef.current
    const osc = oscRef.current
    const gain = gainRef.current
    if (ctx && osc && gain) {
      const now = ctx.currentTime
      gain.gain.cancelScheduledValues(now)
      gain.gain.setValueAtTime(gain.gain.value, now)
      gain.gain.linearRampToValueAtTime(0, now + 0.05) // release, avoids a click
      osc.stop(now + 0.06)
    }
    oscRef.current = null
    gainRef.current = null
    setPlaying(false)
  }, [])

  const start = () => {
    const ctx = getCtx()
    void ctx.resume() // required: audio can only start from a user gesture
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = "triangle"
    osc.frequency.value = 440
    osc.detune.value = semitones * 100 // 100 cents per semitone
    gain.gain.value = 0
    osc.connect(gain).connect(ctx.destination)

    const now = ctx.currentTime
    gain.gain.linearRampToValueAtTime(0.14, now + 0.02) // gentle attack
    osc.start()

    oscRef.current = osc
    gainRef.current = gain
    setPlaying(true)
  }

  const toggle = () => (playing ? stop() : start())

  const onSlider = (value: number) => {
    setSemitones(value)
    const ctx = ctxRef.current
    const osc = oscRef.current
    // Glide to the new pitch while playing, rather than jumping.
    if (ctx && osc)
      osc.detune.setTargetAtTime(value * 100, ctx.currentTime, 0.015)
  }

  React.useEffect(() => {
    return () => {
      try {
        oscRef.current?.stop()
      } catch {
        /* not started */
      }
      void ctxRef.current?.close()
    }
  }, [])

  const { freq, note } = describe(semitones)

  return (
    <chakra.figure
      className={className}
      my={8}
      display="flex"
      flexDirection={{ base: "column", sm: "row" }}
      alignItems={{ sm: "center" }}
      gap={4}
      borderRadius="xl"
      borderWidth="1px"
      borderColor="border"
      bg="card"
      p={5}
    >
      <chakra.button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Stop tone" : "Play tone"}
        aria-pressed={playing}
        display="flex"
        boxSize={12}
        flexShrink={0}
        alignItems="center"
        justifyContent="center"
        borderRadius="full"
        bg="primary"
        color="primary.foreground"
        cursor="pointer"
        transition="transform 0.15s ease"
        _hover={{ transform: "scale(1.05)" }}
        _active={{ transform: "scale(0.95)" }}
      >
        {playing ? (
          <Square size={16} fill="currentColor" />
        ) : (
          <Play
            size={20}
            fill="currentColor"
            style={{ transform: "translateX(0.125rem)" }}
          />
        )}
      </chakra.button>

      <Flex flex="1" direction="column" gap={2}>
        <Flex
          align="baseline"
          justify="space-between"
          fontFamily="mono"
          textStyle="xs"
          color="muted.foreground"
        >
          <span>Pitch</span>
          <Box as="span" fontVariantNumeric="tabular-nums">
            {semitones > 0 ? "+" : ""}
            {semitones} st · {note} · {Math.round(freq)} Hz
          </Box>
        </Flex>
        <chakra.input
          type="range"
          min={-12}
          max={12}
          step={1}
          value={semitones}
          onChange={(e) => onSlider(Number(e.target.value))}
          aria-label="Pitch in semitones"
          w="full"
          accentColor="primary"
        />
      </Flex>
    </chakra.figure>
  )
}
