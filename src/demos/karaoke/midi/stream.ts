/**
 * Wrapper for accessing a binary string through sequential reads.
 * Ported from the original demo's js/midi/stream.js.
 */
export interface MidiStream {
  eof(): boolean
  read(length: number): string
  readInt32(): number
  readInt16(): number
  readInt8(signed?: boolean): number
  readVarInt(): number
}

export function createStream(str: string): MidiStream {
  let position = 0

  function read(length: number): string {
    const result = str.slice(position, position + length)
    position += length
    return result
  }

  /* read a big-endian 32-bit integer */
  function readInt32(): number {
    const result =
      (str.charCodeAt(position) << 24) +
      (str.charCodeAt(position + 1) << 16) +
      (str.charCodeAt(position + 2) << 8) +
      str.charCodeAt(position + 3)
    position += 4
    return result
  }

  /* read a big-endian 16-bit integer */
  function readInt16(): number {
    const result =
      (str.charCodeAt(position) << 8) + str.charCodeAt(position + 1)
    position += 2
    return result
  }

  /* read an 8-bit integer */
  function readInt8(signed?: boolean): number {
    let result = str.charCodeAt(position)
    if (signed && result > 127) result -= 256
    position += 1
    return result
  }

  function eof(): boolean {
    return position >= str.length
  }

  /* read a MIDI-style variable-length integer (big-endian, 7 bits per byte,
     top bit signifies that another byte follows) */
  function readVarInt(): number {
    let result = 0
    while (true) {
      const b = readInt8()
      if (b & 0x80) {
        result += b & 0x7f
        result <<= 7
      } else {
        return result + b
      }
    }
  }

  return { eof, read, readInt32, readInt16, readInt8, readVarInt }
}
