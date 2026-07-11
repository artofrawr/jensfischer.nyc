import * as THREE from "three"

import type { MidiManager } from "../midi/midi-manager"
import type { Dimensions, Pitch, SoundData } from "../types"
import { Bubbles } from "./bubbles"
import { Curves } from "./curves"
import { Glow } from "./glow"
import { Grid } from "./grid"
import { ProgressBar } from "./progress-bar"
import { Snake } from "./snake"
import { Sparkler } from "./sparkler"
import { Stars } from "./stars"
import { Trail } from "./trail"

/**
 * Owns the three.js scene and drives every visualizer each frame. Refactored
 * from the original demo's js/managers/visuals.js to render into a supplied
 * mount element (rather than document.body) and to size itself from that
 * element, so it works both inline and fullscreen.
 */
export class VisualizationManager {
  loaded = true

  private mount!: HTMLElement
  private renderer!: THREE.WebGLRenderer
  private scene!: THREE.Scene
  private camera!: THREE.PerspectiveCamera
  private clock!: THREE.Clock
  private container!: THREE.Object3D
  private tanFOV = 0
  private readonly initialHeight = 810

  private readonly dimensions: Dimensions = {
    width: 0,
    height: 0,
    halfX: 0,
    halfY: 0,
    xScale: 0.667,
    yScale: 0.667,
    mousePercX: 0.5,
    mousePercY: 0.5,
  }

  private readonly pitchRange = 300
  private readonly songState = 0
  private volumes: number[] = []
  private pitchesPast: number[] = []
  private oldPitch = 0

  private readonly bubbles = new Bubbles()
  private readonly grid = new Grid()
  private readonly glow = new Glow()
  private readonly progressbar = new ProgressBar()
  private readonly stars = new Stars()
  private readonly sparkler = new Sparkler()
  private readonly snake = new Snake()
  private readonly curves = new Curves()
  private readonly trail = new Trail()

  private resizeObserver: ResizeObserver | null = null
  private readonly onPointerMove = (e: PointerEvent | MouseEvent): void => {
    const rect = this.mount.getBoundingClientRect()
    if (rect.width === 0 || rect.height === 0) return
    this.dimensions.mousePercX = (e.clientX - rect.left) / rect.width
    this.dimensions.mousePercY = (e.clientY - rect.top) / rect.height
  }
  private readonly onTouchMove = (e: TouchEvent): void => {
    if (e.touches.length === 0) return
    e.preventDefault()
    const rect = this.mount.getBoundingClientRect()
    if (rect.width === 0 || rect.height === 0) return
    this.dimensions.mousePercX = (e.touches[0].clientX - rect.left) / rect.width
    this.dimensions.mousePercY = (e.touches[0].clientY - rect.top) / rect.height
  }

  init(mount: HTMLElement): void {
    this.mount = mount

    this.clock = new THREE.Clock()
    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.setClearColor(0x000000, 1)
    this.renderer.domElement.style.display = "block"
    this.renderer.domElement.style.width = "100%"
    this.renderer.domElement.style.height = "100%"
    mount.appendChild(this.renderer.domElement)

    this.scene = new THREE.Scene()

    const w = mount.clientWidth || 1
    const h = mount.clientHeight || 1
    this.camera = new THREE.PerspectiveCamera(30, w / h, 1, 2000)
    this.camera.position.set(0, 0, 1000)
    this.camera.lookAt(this.scene.position)
    this.scene.add(this.camera)

    this.tanFOV = Math.tan(((Math.PI / 180) * this.camera.fov) / 2)

    this.recomputeDimensions()

    this.container = new THREE.Object3D()

    this.bubbles.init(this.container, this.dimensions)
    this.grid.init(this.container, this.dimensions)
    this.glow.init(this.container, this.dimensions)
    this.progressbar.init(this.container, this.dimensions, false)
    this.stars.init(this.container, this.dimensions)
    this.sparkler.init(this.container, this.dimensions)
    this.snake.init(this.container, this.dimensions)
    this.curves.init(this.container, this.dimensions)
    this.trail.init(this.container, this.dimensions)

    this.scene.add(this.container)

    this.resizeObserver = new ResizeObserver(() => this.resizeCanvas())
    this.resizeObserver.observe(mount)
    mount.addEventListener("pointermove", this.onPointerMove)
    mount.addEventListener("touchmove", this.onTouchMove, { passive: false })

    this.resizeCanvas()
  }

  drawProgressBar(midiManager: MidiManager): void {
    this.progressbar.drawEvents(midiManager)
  }

  private recomputeDimensions(): void {
    const w = this.mount.clientWidth || 1
    const h = this.mount.clientHeight || 1
    this.dimensions.width = w * this.dimensions.xScale
    this.dimensions.height = h * this.dimensions.yScale
    this.dimensions.halfX = 0.5 * this.dimensions.width
    this.dimensions.halfY = 0.5 * this.dimensions.height
  }

  private resizeCanvas(): void {
    const w = this.mount.clientWidth || 1
    const h = this.mount.clientHeight || 1

    this.recomputeDimensions()

    this.camera.aspect = w / h
    this.camera.fov =
      (360 / Math.PI) * Math.atan(this.tanFOV * (h / this.initialHeight))
    this.camera.updateProjectionMatrix()
    this.camera.lookAt(this.scene.position)

    this.renderer.setSize(w, h, false)

    this.bubbles.resize(this.dimensions)
    this.grid.resize(this.dimensions)
    this.glow.resize(this.dimensions)
    this.stars.resize(this.dimensions)
    this.sparkler.resize(this.dimensions)
    this.snake.resize(this.dimensions)
    this.curves.resize(this.dimensions)
    this.trail.resize(this.dimensions)

    this.renderer.render(this.scene, this.camera)
  }

  render(
    progress: number,
    volVoice: number,
    volMusic: number,
    _freqs: SoundData["music"],
    pitches: Pitch[],
  ): void {
    const delta = this.clock.getDelta()

    this.volumes.unshift(volVoice)
    if (this.volumes.length > 500) this.volumes = this.volumes.slice(0, 200)

    const newPitch = this.oldPitch + (pitches[0].pitch - this.oldPitch) * 0.1
    this.oldPitch = newPitch
    const active = pitches[0].active ? 1 : 0

    this.pitchesPast.unshift(newPitch)
    if (this.pitchesPast.length > 200) this.pitchesPast = this.pitchesPast.slice(0, 100)

    this.bubbles.update(volMusic, this.songState)
    this.stars.update()
    this.sparkler.update(delta, this.dimensions, this.songState)
    this.snake.update(this.pitchRange, pitches)
    this.curves.update(this.pitchRange, this.pitchesPast, this.volumes)
    this.trail.update(
      this.dimensions,
      this.pitchRange,
      this.pitchesPast,
      this.volumes,
      this.songState,
      active,
    )
    this.progressbar.update(progress)

    this.renderer.render(this.scene, this.camera)
  }

  dispose(): void {
    this.resizeObserver?.disconnect()
    if (this.mount) {
      this.mount.removeEventListener("pointermove", this.onPointerMove)
      this.mount.removeEventListener("touchmove", this.onTouchMove)
    }
    this.scene?.traverse((obj) => {
      const mesh = obj as THREE.Mesh
      if (mesh.geometry) mesh.geometry.dispose()
      const material = mesh.material
      if (Array.isArray(material)) material.forEach((m) => m.dispose())
      else if (material) material.dispose()
    })
    if (this.renderer) {
      this.renderer.dispose()
      this.renderer.forceContextLoss()
      this.renderer.domElement.remove()
    }
  }
}
