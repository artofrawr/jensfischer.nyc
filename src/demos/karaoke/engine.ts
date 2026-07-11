import { SoundManager } from "./audio/sound-manager"
import { MidiManager } from "./midi/midi-manager"
import { ASSET_BASE, demoState } from "./state"
import type { Pitch } from "./types"
import { VisualizationManager } from "./visuals/visualization-manager"

export interface EngineCallbacks {
  /** Fires once when every asset has loaded and the demo can be started. */
  onReady: () => void
  /** Fires when the song finishes playing. */
  onComplete: () => void
}

/**
 * Top-level orchestrator, replacing the original demo's global `Karaoke` in
 * js/main.js. Wires the managers together, runs the render loop, and owns
 * lifecycle so a React component can mount/unmount it cleanly.
 */
export class KaraokeEngine {
  private readonly audioCtx: AudioContext
  private readonly visManager = new VisualizationManager()
  private readonly midiManager = new MidiManager(`${ASSET_BASE}/sounds/lucky_vocals.mid`)
  private readonly soundManager: SoundManager

  private ticks = 0
  private rafId: number | null = null
  private readyInterval: number | null = null
  private notifiedReady = false
  private disposed = false

  constructor(
    private readonly mount: HTMLElement,
    private readonly callbacks: EngineCallbacks,
  ) {
    const Ctx =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext
    this.audioCtx = new Ctx()
    this.soundManager = new SoundManager(this.audioCtx, [
      `${ASSET_BASE}/sounds/lucky_shorter_intro_music.mp3`,
      `${ASSET_BASE}/sounds/lucky_shorter_intro_vocals.mp3`,
    ])
  }

  /** Begin loading all assets and wiring up the scene. */
  init(): void {
    this.visManager.init(this.mount)
    this.midiManager.init(70)
    this.soundManager.init()

    this.readyInterval = window.setInterval(() => {
      if (
        this.midiManager.loaded &&
        this.soundManager.loaded &&
        this.visManager.loaded &&
        !this.notifiedReady
      ) {
        this.notifiedReady = true
        if (this.readyInterval != null) window.clearInterval(this.readyInterval)
        this.readyInterval = null
        this.callbacks.onReady()
      }
    }, 300)
  }

  /** Start (or restart) playback from the beginning. */
  start(): void {
    if (this.disposed) return
    void this.audioCtx.resume()
    demoState.soundPitch = 1
    this.ticks = 0
    this.visManager.drawProgressBar(this.midiManager)
    this.soundManager.start()
    if (this.rafId != null) cancelAnimationFrame(this.rafId)
    this.renderLoop()
  }

  private renderLoop = (): void => {
    this.rafId = requestAnimationFrame(this.renderLoop)

    const progress = this.soundManager.getProgress()
    if (progress >= 1) {
      if (this.rafId != null) cancelAnimationFrame(this.rafId)
      this.rafId = null
      this.soundManager.stop()
      this.callbacks.onComplete()
      return
    }

    this.ticks++
    const progressPerTick = progress / this.ticks

    // sample the melody a little ahead of the playhead
    const pitches: Pitch[] = []
    for (let tick = 0; tick <= 30; tick++) {
      pitches.push(
        this.midiManager.getPitchFor(
          progress + progressPerTick * tick - 2 * progressPerTick,
        ),
      )
    }

    const soundData = this.soundManager.getByteFrequencyData()
    const volVoice = averageNormalised(soundData.voice)
    const volMusic = averageNormalised(soundData.music)

    this.visManager.render(progress, volVoice, volMusic, soundData.music, pitches)
  }

  dispose(): void {
    this.disposed = true
    if (this.rafId != null) cancelAnimationFrame(this.rafId)
    if (this.readyInterval != null) window.clearInterval(this.readyInterval)
    this.soundManager.dispose()
    this.visManager.dispose()
    void this.audioCtx.close()
  }
}

/** Mean of a byte-frequency array, normalised by its peak (0..1, NaN-safe). */
function averageNormalised(data: Uint8Array): number {
  let sum = 0
  let max = 0
  for (let i = 0; i < data.length; i++) {
    const v = data[i]
    if (v > max) max = v
    sum += v
  }
  return max > 0 ? sum / data.length / max : 0
}
