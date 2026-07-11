/**
 * Parser for the Standard MIDI File format (depends on stream.ts).
 * Ported from the original demo's js/midi/midifile.js.
 */
import { createStream, type MidiStream } from "./stream"

export interface MidiEvent {
  deltaTime: number
  type: string
  subtype?: string
  noteNumber?: number
  velocity?: number
  microsecondsPerBeat?: number
  // The original parser attaches a variety of extra fields per event subtype;
  // consumers only read the ones declared above.
  [key: string]: unknown
}

export interface MidiHeader {
  formatType: number
  trackCount: number
  ticksPerBeat: number
}

export interface MidiFileData {
  header: MidiHeader
  tracks: MidiEvent[][]
}

interface Chunk {
  id: string
  length: number
  data: string
}

export function parseMidiFile(data: string): MidiFileData {
  function readChunk(stream: MidiStream): Chunk {
    const id = stream.read(4)
    const length = stream.readInt32()
    return { id, length, data: stream.read(length) }
  }

  let lastEventTypeByte: number

  function readEvent(stream: MidiStream): MidiEvent {
    const event: MidiEvent = { deltaTime: stream.readVarInt(), type: "" }
    let eventTypeByte = stream.readInt8()

    if ((eventTypeByte & 0xf0) == 0xf0) {
      /* system / meta event */
      if (eventTypeByte == 0xff) {
        /* meta event */
        event.type = "meta"
        const subtypeByte = stream.readInt8()
        const length = stream.readVarInt()
        switch (subtypeByte) {
          case 0x00:
            event.subtype = "sequenceNumber"
            event.number = stream.readInt16()
            return event
          case 0x01:
            event.subtype = "text"
            event.text = stream.read(length)
            return event
          case 0x02:
            event.subtype = "copyrightNotice"
            event.text = stream.read(length)
            return event
          case 0x03:
            event.subtype = "trackName"
            event.text = stream.read(length)
            return event
          case 0x04:
            event.subtype = "instrumentName"
            event.text = stream.read(length)
            return event
          case 0x05:
            event.subtype = "lyrics"
            event.text = stream.read(length)
            return event
          case 0x06:
            event.subtype = "marker"
            event.text = stream.read(length)
            return event
          case 0x07:
            event.subtype = "cuePoint"
            event.text = stream.read(length)
            return event
          case 0x20:
            event.subtype = "midiChannelPrefix"
            event.channel = stream.readInt8()
            return event
          case 0x2f:
            event.subtype = "endOfTrack"
            return event
          case 0x51:
            event.subtype = "setTempo"
            event.microsecondsPerBeat =
              (stream.readInt8() << 16) +
              (stream.readInt8() << 8) +
              stream.readInt8()
            return event
          case 0x54: {
            event.subtype = "smpteOffset"
            const hourByte = stream.readInt8()
            event.frameRate = { 0x00: 24, 0x20: 25, 0x40: 29, 0x60: 30 }[
              hourByte & 0x60
            ]
            event.hour = hourByte & 0x1f
            event.min = stream.readInt8()
            event.sec = stream.readInt8()
            event.frame = stream.readInt8()
            event.subframe = stream.readInt8()
            return event
          }
          case 0x58:
            event.subtype = "timeSignature"
            event.numerator = stream.readInt8()
            event.denominator = Math.pow(2, stream.readInt8())
            event.metronome = stream.readInt8()
            event.thirtyseconds = stream.readInt8()
            return event
          case 0x59:
            event.subtype = "keySignature"
            event.key = stream.readInt8(true)
            event.scale = stream.readInt8()
            return event
          case 0x7f:
            event.subtype = "sequencerSpecific"
            event.data = stream.read(length)
            return event
          default:
            event.subtype = "unknown"
            event.data = stream.read(length)
            return event
        }
      } else if (eventTypeByte == 0xf0) {
        event.type = "sysEx"
        event.data = stream.read(stream.readVarInt())
        return event
      } else if (eventTypeByte == 0xf7) {
        event.type = "dividedSysEx"
        event.data = stream.read(stream.readVarInt())
        return event
      } else {
        throw new Error("Unrecognised MIDI event type byte: " + eventTypeByte)
      }
    } else {
      /* channel event */
      let param1: number
      if ((eventTypeByte & 0x80) == 0) {
        /* running status - reuse lastEventTypeByte as the event type. */
        param1 = eventTypeByte
        eventTypeByte = lastEventTypeByte
      } else {
        param1 = stream.readInt8()
        lastEventTypeByte = eventTypeByte
      }
      const eventType = eventTypeByte >> 4
      event.channel = eventTypeByte & 0x0f
      event.type = "channel"
      switch (eventType) {
        case 0x08:
          event.subtype = "noteOff"
          event.noteNumber = param1
          event.velocity = stream.readInt8()
          return event
        case 0x09:
          event.noteNumber = param1
          event.velocity = stream.readInt8()
          event.subtype = event.velocity == 0 ? "noteOff" : "noteOn"
          return event
        case 0x0a:
          event.subtype = "noteAftertouch"
          event.noteNumber = param1
          event.amount = stream.readInt8()
          return event
        case 0x0b:
          event.subtype = "controller"
          event.controllerType = param1
          event.value = stream.readInt8()
          return event
        case 0x0c:
          event.subtype = "programChange"
          event.programNumber = param1
          return event
        case 0x0d:
          event.subtype = "channelAftertouch"
          event.amount = param1
          return event
        case 0x0e:
          event.subtype = "pitchBend"
          event.value = param1 + (stream.readInt8() << 7)
          return event
        default:
          throw new Error("Unrecognised MIDI event type: " + eventType)
      }
    }
  }

  const stream = createStream(data)
  const headerChunk = readChunk(stream)
  if (headerChunk.id != "MThd" || headerChunk.length != 6) {
    throw new Error("Bad .mid file - header not found")
  }
  const headerStream = createStream(headerChunk.data)
  const formatType = headerStream.readInt16()
  const trackCount = headerStream.readInt16()
  const timeDivision = headerStream.readInt16()

  if (timeDivision & 0x8000) {
    throw new Error("Expressing time division in SMTPE frames is not supported")
  }

  const header: MidiHeader = {
    formatType,
    trackCount,
    ticksPerBeat: timeDivision,
  }

  const tracks: MidiEvent[][] = []
  for (let i = 0; i < header.trackCount; i++) {
    tracks[i] = []
    const trackChunk = readChunk(stream)
    if (trackChunk.id != "MTrk") {
      throw new Error("Unexpected chunk - expected MTrk, got " + trackChunk.id)
    }
    const trackStream = createStream(trackChunk.data)
    while (!trackStream.eof()) {
      tracks[i].push(readEvent(trackStream))
    }
  }

  return { header, tracks }
}
