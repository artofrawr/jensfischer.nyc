import * as THREE from "three"

import { ASSET_BASE, demoState } from "../state"
import type { Dimensions } from "../types"
import { TextureAnimator } from "./texture-animator"

/**
 * The player's cursor: an animated bengal-light sprite that emits fairy dust,
 * both scaling with pitch accuracy (how close soundPitch is to 1).
 * Ported from the original demo's js/vis/sparkler.js.
 */
export class Sparkler {
  private readonly numParticles = 150
  private container!: THREE.Object3D
  private sparkler!: THREE.Mesh
  private sparklerAnim!: TextureAnimator
  private sparkleTexture!: THREE.Texture

  private readonly fairyDust: THREE.Mesh[] = []
  private readonly geoms: THREE.BufferGeometry[] = []
  private readonly matrs: THREE.Material[] = []
  private readonly speeds: number[] = []
  private readonly scales: number[] = []
  private oldPos = 0

  init(container: THREE.Object3D, _dimensions: Dimensions): void {
    this.container = container

    const loader = new THREE.TextureLoader()
    const runnerTexture = loader.load(`${ASSET_BASE}/images/bengalSeq2.png`)
    this.sparkleTexture = loader.load(`${ASSET_BASE}/images/sparkle.png`)

    // texture, #horiz, #vert, #total, frame duration (ms)
    this.sparklerAnim = new TextureAnimator(runnerTexture, 4, 4, 16, 30)

    const runnerMaterial = new THREE.MeshBasicMaterial({
      map: runnerTexture,
      transparent: true,
      depthTest: false,
    })
    const runnerGeometry = new THREE.PlaneGeometry(200, 200, 1, 1)
    this.sparkler = new THREE.Mesh(runnerGeometry, runnerMaterial)
    this.sparkler.position.z = 10
    container.add(this.sparkler)
  }

  resize(_dimensions: Dimensions): void {
    /* sparkler is positioned from the pointer each frame; nothing to do */
  }

  update(delta: number, dimensions: Dimensions, songState: number): void {
    let accuracy =
      demoState.soundPitch > 1
        ? (1.2 - demoState.soundPitch) / 0.2
        : (demoState.soundPitch - 0.8) / 0.2
    if (accuracy < 0) accuracy = 0
    if (accuracy > 0.9) accuracy = 1
    accuracy = accuracy * accuracy * accuracy

    this.sparkler.scale.x =
      this.sparkler.scale.y =
      this.sparkler.scale.z =
        0.5 + 0.5 * accuracy

    const newposition =
      songState == 0
        ? dimensions.halfY - dimensions.height * dimensions.mousePercY
        : (dimensions.halfY - dimensions.height * dimensions.mousePercX) *
          (dimensions.width / dimensions.height)

    this.sparklerAnim.update(1000 * delta)
    this.sparkler.position.y = newposition

    const diff = this.oldPos - newposition
    this.oldPos = newposition
    let newRot = diff * 2
    if (newRot < -90) newRot = -90
    if (newRot > 90) newRot = 90
    this.sparkler.rotation.z = -newRot * (Math.PI / 180)

    // spawn a new dust particle if under the accuracy-scaled cap
    if (this.fairyDust.length < this.numParticles * accuracy) {
      const material = new THREE.MeshBasicMaterial({
        map: this.sparkleTexture,
        wireframe: false,
        blending: THREE.AdditiveBlending,
        transparent: true,
      })
      material.opacity = 0.2 + Math.random() * 0.2

      const geometry = new THREE.PlaneGeometry(21, 21)
      const star = new THREE.Mesh(geometry, material)
      star.position.x = 0
      star.position.y = this.sparkler.position.y - 15 + Math.random() * 30
      star.position.z = this.sparkler.position.z + 0.1
      star.scale.x = star.scale.y = star.scale.z = 0.3 + 1.7 * Math.random()
      this.container.add(star)

      this.fairyDust.push(star)
      this.geoms.push(geometry)
      this.matrs.push(material)
      this.speeds.push(6 + 8 * Math.random())
      this.scales.push(star.scale.x)
    }

    // move particles left; recycle those that leave the screen
    for (let b = this.fairyDust.length - 1; b >= 0; b--) {
      const bubble = this.fairyDust[b]
      bubble.position.x -= this.speeds[b]
      bubble.scale.x =
        bubble.scale.y =
        bubble.scale.z =
          this.scales[b] * (1 - bubble.position.x / -200)

      if (bubble.position.x <= -200) {
        const matr = this.matrs[b]
        const geom = this.geoms[b]
        this.fairyDust.splice(b, 1)
        this.matrs.splice(b, 1)
        this.geoms.splice(b, 1)
        this.speeds.splice(b, 1)
        this.scales.splice(b, 1)
        this.container.remove(bubble)
        geom.dispose()
        matr.dispose()
      }
    }
  }
}
