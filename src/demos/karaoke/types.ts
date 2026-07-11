/** Shared types for the karaoke demo. */

/** Drawing-space dimensions, derived from the mount container's size. */
export interface Dimensions {
  width: number
  height: number
  halfX: number
  halfY: number
  xScale: number
  yScale: number
  /** Pointer position within the container, 0..1. */
  mousePercX: number
  mousePercY: number
}

/** A sampled pitch target from the MIDI melody. */
export interface Pitch {
  /** Normalised note height, 0..1. */
  pitch: number
  /** Whether a note is sounding at this moment. */
  active: boolean
}

/** Byte-frequency snapshots for the two audio tracks. */
export interface SoundData {
  voice: Uint8Array
  music: Uint8Array
}
