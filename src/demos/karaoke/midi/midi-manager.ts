/**
 * Loads and parses the vocal MIDI track, then exposes the melody as a series of
 * normalised pitch targets sampled by song progress.
 * Ported from the original demo's js/managers/midi.js.
 */
import type { Pitch } from "../types"
import { parseMidiFile, type MidiFileData } from "./midi-file"

interface NoteEvent {
  type: "on" | "off"
  note: number
  ticks: number
}

interface Note {
  note: number
  notePerc: number
  start: number
  startPerc: number
  end: number
  endPerc: number
}

export class MidiManager {
  loaded = false

  private readonly file: string
  private midiFile: MidiFileData | null = null

  private trackStates: { nextEventIndex: number; ticksToNextEvent: number | null }[] = []
  private beatsPerMinute = 116
  private ticksPerBeat = 0
  private nextEventInfo: { ticksToEvent: number; event: MidiFileData["tracks"][number][number]; track: number } | null = null
  private finished = false

  private events: NoteEvent[] = []
  private notes: Note[] = []
  private totalTicks = 0
  private noteLow: number | null = null
  private noteHigh: number | null = null
  private midiDuration = 0

  constructor(midiFile: string) {
    this.file = midiFile
  }

  init(duration: number): void {
    this.midiDuration = duration
    this.loadRemote(this.file, (data) => {
      this.midiFile = parseMidiFile(data)
      this.afterLoad()
      this.loaded = true
    })
  }

  private loadRemote(path: string, callback: (data: string) => void): void {
    const fetch = new XMLHttpRequest()
    fetch.open("GET", path)
    fetch.overrideMimeType("text/plain; charset=x-user-defined")
    fetch.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        /* munge response into a binary string */
        const t = this.responseText || ""
        const ff: string[] = []
        const mx = t.length
        for (let z = 0; z < mx; z++) {
          ff[z] = String.fromCharCode(t.charCodeAt(z) & 255)
        }
        callback(ff.join(""))
      }
    }
    fetch.send()
  }

  getPitchFor(perc: number): Pitch {
    let pitch = 0.5
    let isActive = false

    for (let i = this.notes.length - 1; i >= 0; i--) {
      const oNote = this.notes[i]
      if (oNote.startPerc <= perc && oNote.endPerc >= perc) {
        pitch = oNote.notePerc
        isActive = true
      } else if (oNote.startPerc >= perc) {
        pitch = oNote.notePerc
        isActive = false
      }
    }

    return { pitch, active: isActive }
  }

  getEvents(): NoteEvent[] {
    return this.events
  }

  getNoteLow(): number | null {
    return this.noteLow
  }

  getNoteHigh(): number | null {
    return this.noteHigh
  }

  getTotalTicks(): number {
    return this.totalTicks
  }

  private afterLoad(): void {
    const midiFile = this.midiFile!
    this.ticksPerBeat = midiFile.header.ticksPerBeat

    for (let i = 0; i < midiFile.tracks.length; i++) {
      this.trackStates[i] = {
        nextEventIndex: 0,
        ticksToNextEvent: midiFile.tracks[i].length
          ? midiFile.tracks[i][0].deltaTime
          : null,
      }
    }

    while (this.finished == false) {
      this.getNextEvent()
      if (this.nextEventInfo) this.handleEvent()
    }

    this.totalTicks =
      this.beatsPerMinute * (this.midiDuration / 60) * this.ticksPerBeat

    this.parseEventArray()
  }

  private parseEventArray(): void {
    let lastNote: number | undefined
    let onEvt: NoteEvent | undefined

    for (let i = 0; i < this.events.length; i++) {
      const e = this.events[i]
      if (e.type == "on") {
        onEvt = e
        lastNote = e.note
      } else if (e.note == lastNote && onEvt) {
        const nPerc =
          (e.note - this.noteLow!) / (this.noteHigh! - this.noteLow!)
        this.notes.push({
          note: e.note,
          notePerc: nPerc,
          start: onEvt.ticks,
          startPerc: onEvt.ticks / this.totalTicks,
          end: e.ticks,
          endPerc: e.ticks / this.totalTicks,
        })
      }
    }
  }

  private getNextEvent(): void {
    const midiFile = this.midiFile!
    let ticksToNextEvent: number | null = null
    let nextEventTrack: number | null = null
    let nextEventIndex: number | null = null

    for (let i = 0; i < this.trackStates.length; i++) {
      const state = this.trackStates[i]
      if (
        state.ticksToNextEvent != null &&
        (ticksToNextEvent == null || state.ticksToNextEvent < ticksToNextEvent)
      ) {
        ticksToNextEvent = state.ticksToNextEvent
        nextEventTrack = i
        nextEventIndex = state.nextEventIndex
      }
    }

    if (nextEventTrack != null && nextEventIndex != null) {
      /* consume event from that track */
      const nextEvent = midiFile.tracks[nextEventTrack][nextEventIndex]

      if (midiFile.tracks[nextEventTrack][nextEventIndex + 1]) {
        this.trackStates[nextEventTrack].ticksToNextEvent! +=
          midiFile.tracks[nextEventTrack][nextEventIndex + 1].deltaTime
      } else {
        this.trackStates[nextEventTrack].ticksToNextEvent = null
      }
      this.trackStates[nextEventTrack].nextEventIndex += 1

      /* advance timings on all tracks by ticksToNextEvent */
      for (let i = 0; i < this.trackStates.length; i++) {
        if (this.trackStates[i].ticksToNextEvent != null) {
          this.trackStates[i].ticksToNextEvent! -= ticksToNextEvent!
        }
      }

      this.nextEventInfo = {
        ticksToEvent: ticksToNextEvent!,
        event: nextEvent,
        track: nextEventTrack,
      }
    } else {
      this.nextEventInfo = null
      this.finished = true
    }
  }

  private handleEvent(): void {
    const event = this.nextEventInfo!.event
    this.totalTicks += this.nextEventInfo!.ticksToEvent

    switch (event.type) {
      case "meta":
        if (event.subtype == "setTempo" && event.microsecondsPerBeat) {
          this.beatsPerMinute = 60000000 / event.microsecondsPerBeat
        }
        break

      case "channel":
        if (event.subtype == "noteOn" && event.noteNumber != null) {
          if (this.noteLow == null || event.noteNumber < this.noteLow)
            this.noteLow = event.noteNumber
          if (this.noteHigh == null || event.noteNumber > this.noteHigh)
            this.noteHigh = event.noteNumber
          this.events.push({
            type: "on",
            note: event.noteNumber,
            ticks: this.totalTicks,
          })
        } else if (event.subtype == "noteOff" && event.noteNumber != null) {
          this.events.push({
            type: "off",
            note: event.noteNumber,
            ticks: this.totalTicks,
          })
        }
        break
    }
  }
}
