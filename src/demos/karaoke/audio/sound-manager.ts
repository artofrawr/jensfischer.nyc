/**
 * Plays the instrumental + vocal tracks, exposes frequency analysis, and applies
 * a real-time pitch shift to the vocals driven by `demoState.soundPitch`.
 * Ported from the original demo's js/managers/sound.js.
 *
 * Source nodes are one-shot, so they are (re)created in start(), which lets the
 * demo replay without a full page reload (the original did window.location.reload).
 */
import { demoState } from "../state"
import type { SoundData } from "../types"
import { BufferLoader } from "./buffer-loader"

export class SoundManager {
  loaded = false
  isPlaying = false

  private duration = 0
  private startedOn = 0

  private analyserMusic: AnalyserNode | null = null
  private analyserNodeMusic: ScriptProcessorNode | null = null
  private analyserVoice: AnalyserNode | null = null
  private analyserNodeVoice: ScriptProcessorNode | null = null

  private pitchNodeVocal: ScriptProcessorNode | null = null
  private pitchNodeInstrumental: ScriptProcessorNode | null = null

  private buffers: AudioBuffer[] = []
  private audioInstrumental: AudioBufferSourceNode | null = null
  private audioVocal: AudioBufferSourceNode | null = null

  constructor(
    private readonly audioCtx: AudioContext,
    private readonly files: string[],
  ) {}

  /** Build the persistent analysis/pitch graph and load the audio buffers. */
  init(): void {
    // Silent script-processor sinks that keep the analysers pulling.
    this.analyserNodeMusic = this.audioCtx.createScriptProcessor(2048, 1, 1)
    this.analyserNodeMusic.connect(this.audioCtx.destination)
    this.analyserNodeVoice = this.audioCtx.createScriptProcessor(2048, 1, 1)
    this.analyserNodeVoice.connect(this.audioCtx.destination)

    this.analyserMusic = this.audioCtx.createAnalyser()
    this.analyserMusic.smoothingTimeConstant = 0.3
    this.analyserMusic.fftSize = 512
    this.analyserMusic.connect(this.analyserNodeMusic)

    this.analyserVoice = this.audioCtx.createAnalyser()
    this.analyserVoice.smoothingTimeConstant = 0.3
    this.analyserVoice.fftSize = 512
    this.analyserVoice.connect(this.analyserNodeVoice)

    // Pitch processor for the vocals — resamples the buffer by soundPitch.
    this.pitchNodeVocal = this.audioCtx.createScriptProcessor(8192, 1, 1)
    this.pitchNodeVocal.onaudioprocess = (ev: AudioProcessingEvent) => {
      const inp = ev.inputBuffer.getChannelData(0)
      const out = ev.outputBuffer.getChannelData(0)
      const l = inp.length
      for (let i = 0; i < l; i++) {
        let a = Math.floor(i * demoState.soundPitch)
        if (a >= l) a = l - (a - l) - 1
        out[i] = inp[a]
      }
    }

    // Pitch processor for the instrumental — always identity, but kept in the
    // graph so the processing latency matches and the tracks stay in sync.
    this.pitchNodeInstrumental = this.audioCtx.createScriptProcessor(8192, 1, 1)
    this.pitchNodeInstrumental.onaudioprocess = (ev: AudioProcessingEvent) => {
      const inp = ev.inputBuffer.getChannelData(0)
      const out = ev.outputBuffer.getChannelData(0)
      const l = inp.length
      for (let i = 0; i < l; i++) {
        let a = Math.floor(i)
        if (a >= l) a = l - (a - l) - 1
        out[i] = inp[a]
      }
    }

    this.pitchNodeVocal.connect(this.audioCtx.destination)
    this.pitchNodeInstrumental.connect(this.audioCtx.destination)

    const bufferLoader = new BufferLoader(
      this.audioCtx,
      this.files,
      (bufferList) => {
        this.buffers = bufferList
        this.duration = bufferList[0].duration * 1000
        this.loaded = true
      },
    )
    bufferLoader.load()
  }

  /** (Re)create the source nodes and begin playback from the start. */
  start(): void {
    this.audioInstrumental = this.audioCtx.createBufferSource()
    this.audioInstrumental.buffer = this.buffers[0]
    this.audioInstrumental.loop = false

    this.audioVocal = this.audioCtx.createBufferSource()
    this.audioVocal.buffer = this.buffers[1]
    this.audioVocal.loop = false

    this.audioVocal.connect(this.analyserVoice!)
    this.audioInstrumental.connect(this.analyserMusic!)
    this.audioVocal.connect(this.pitchNodeVocal!)
    this.audioInstrumental.connect(this.pitchNodeInstrumental!)

    this.isPlaying = true
    this.audioInstrumental.start(0)
    this.audioVocal.start(0)
    this.startedOn = performance.now()
  }

  /** Song progress, 0..1. */
  getProgress(): number {
    return (performance.now() - this.startedOn) / this.duration
  }

  getByteFrequencyData(): SoundData {
    const arrayMusic = new Uint8Array(this.analyserMusic!.frequencyBinCount)
    this.analyserMusic!.getByteFrequencyData(arrayMusic)
    const arrayVoice = new Uint8Array(this.analyserVoice!.frequencyBinCount)
    this.analyserVoice!.getByteFrequencyData(arrayVoice)
    return { voice: arrayVoice, music: arrayMusic }
  }

  stop(): void {
    this.isPlaying = false
    try {
      this.audioInstrumental?.stop()
      this.audioVocal?.stop()
    } catch {
      /* sources may not have been started */
    }
    this.audioInstrumental?.disconnect()
    this.audioVocal?.disconnect()
  }

  dispose(): void {
    this.stop()
    this.pitchNodeVocal && (this.pitchNodeVocal.onaudioprocess = null)
    this.pitchNodeInstrumental &&
      (this.pitchNodeInstrumental.onaudioprocess = null)
    this.analyserMusic?.disconnect()
    this.analyserVoice?.disconnect()
    this.analyserNodeMusic?.disconnect()
    this.analyserNodeVoice?.disconnect()
    this.pitchNodeVocal?.disconnect()
    this.pitchNodeInstrumental?.disconnect()
  }
}
