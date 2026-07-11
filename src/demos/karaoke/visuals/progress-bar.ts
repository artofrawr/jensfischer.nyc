import * as THREE from "three"

import type { MidiManager } from "../midi/midi-manager"
import type { Dimensions } from "../types"

/**
 * Song progress frame with a moving playhead and the melody plotted as ticks.
 * Ported from the original demo's js/vis/progressbar.js.
 *
 * Note: the VisualizationManager initialises this with `visible = false`, exactly
 * as the original did, so it is inert by default. It is kept for fidelity.
 */
export class ProgressBar {
  private readonly w = 500
  private readonly h = 40
  private progressBar!: THREE.Object3D
  private playHead!: THREE.Mesh
  private isVisible = false

  init(container: THREE.Object3D, dimensions: Dimensions, visible: boolean): void {
    this.isVisible = visible
    if (!this.isVisible) return

    this.progressBar = new THREE.Object3D()
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: false })

    const top = new THREE.Mesh(new THREE.PlaneGeometry(this.w, 3), material)
    top.position.x = 0.5 * this.w
    this.progressBar.add(top)

    const left = new THREE.Mesh(new THREE.PlaneGeometry(3, this.h), material)
    left.position.y = 0 - 0.5 * this.h
    this.progressBar.add(left)

    const right = new THREE.Mesh(new THREE.PlaneGeometry(3, this.h), material)
    right.position.x = this.w
    right.position.y = 0 - 0.5 * this.h
    this.progressBar.add(right)

    const bottom = new THREE.Mesh(new THREE.PlaneGeometry(this.w, 3), material)
    bottom.position.y = -this.h
    bottom.position.x = 0.5 * this.w
    this.progressBar.add(bottom)

    this.playHead = new THREE.Mesh(new THREE.PlaneGeometry(1, this.h + 12), material)
    this.playHead.position.y = -0.5 * this.h - 2
    this.playHead.position.x = 0.5 * this.w
    this.progressBar.add(this.playHead)

    this.progressBar.position.y = dimensions.halfY - 10
    this.progressBar.position.x = dimensions.halfX - this.w - 20
    this.progressBar.position.z = 10
    container.add(this.progressBar)
  }

  drawEvents(midiManager: MidiManager): void {
    if (!this.isVisible) return

    let lastNote: number | undefined
    let onEvt: { note: number; ticks: number } | undefined
    const events = midiManager.getEvents()
    const noteLow = midiManager.getNoteLow()!
    const noteHigh = midiManager.getNoteHigh()!
    const totalTicks = midiManager.getTotalTicks()

    for (let i = 0; i < events.length; i++) {
      const e = events[i]
      if (e.type == "on") {
        onEvt = e
        lastNote = e.note
      } else if (e.note == lastNote && onEvt) {
        const notePerc = (e.note - noteLow) / (noteHigh - noteLow)
        this.drawNote(onEvt, e, totalTicks, notePerc)
      }
    }
  }

  update(perc: number): void {
    if (!this.isVisible) return
    this.playHead.position.x = this.w * perc
  }

  private drawNote(
    onEvent: { note: number; ticks: number },
    offEvent: { ticks: number },
    totalTicks: number,
    notePerc: number,
  ): void {
    const onstart = (onEvent.ticks / totalTicks) * this.w
    const offstart = (offEvent.ticks / totalTicks) * this.w
    const width = offstart - onstart

    const material = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: false })
    const note = new THREE.Mesh(new THREE.PlaneGeometry(width, 2), material)
    note.position.y = -0.5 * this.h - 10 + notePerc * 20
    note.position.x = 0 + onstart
    this.progressBar.add(note)
  }
}
