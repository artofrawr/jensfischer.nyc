import * as THREE from "three"

import { demoState } from "../state"
import type { Dimensions } from "../types"
import { easeInOutSine } from "./ease"

/**
 * The player's own pitch trail behind the sparkler: five ribbons whose height
 * tracks volume and whose colour dims as the player drifts off pitch. This is
 * also where the core game mechanic lives — it writes demoState.soundPitch based
 * on how far the pointer is from the target melody line.
 * Ported from the original demo's js/vis/trail.js. The original coloured whole
 * faces via THREE.FaceColors; modern three uses per-vertex colours (a smooth
 * horizontal gradient rather than hard per-face steps).
 */
export class Trail {
  private readonly SNAKE_HEIGHTS_SMALL = [30, 20, 10, 5, 3]
  private readonly SNAKE_HEIGHTS = [70, 50, 30, 10, 5]
  private readonly MULTIS = [6, 5, 4, 2, 1]

  // per-ribbon normal / off-pitch colours (indexed like SNAKE_HEIGHTS).
  // COLOR_NORM mirrors the Snake's SNAKE_COLORS so an on-pitch trail matches the
  // upcoming melody exactly. (The original hardcoded ribbon 2's green as 57,
  // a typo for the snake's 0xbb3234 = 50; corrected here so left/right match.)
  private readonly COLOR_NORM = [
    [59 / 255, 24 / 255, 41 / 255], // 0x3b1829
    [105 / 255, 31 / 255, 49 / 255], // 0x691f31
    [187 / 255, 50 / 255, 52 / 255], // 0xbb3234
    [236 / 255, 96 / 255, 66 / 255], // 0xec6042
    [255 / 255, 199 / 255, 187 / 255], // 0xffc7bb
  ]
  private readonly COLOR_OFF = [
    [12 / 255, 5 / 255, 8 / 255],
    [21 / 255, 6 / 255, 10 / 255],
    [37 / 255, 10 / 255, 10 / 255],
    [47 / 255, 19 / 255, 13 / 255],
    [51 / 255, 40 / 255, 37 / 255],
  ]

  private readonly numSnakePoints = 60
  private readonly snakes: THREE.Mesh[] = []
  private readonly positionsAttr: THREE.BufferAttribute[] = []
  private readonly colorsAttr: THREE.BufferAttribute[] = []
  // Scratch colour used to convert the sRGB palette into the renderer's working
  // (linear) space, so the trail matches the snake's hex-defined colours.
  private readonly scratch = new THREE.Color()
  private dimensions!: Dimensions
  private origHalfX = 0

  // rolling history buffers (newest at index 0)
  private readonly positions: number[] = []
  private readonly accuracies: number[] = []
  private readonly actives: number[] = []
  private readonly pitchesTop: number[] = []
  private readonly pitchesBot: number[] = []

  init(container: THREE.Object3D, dimensions: Dimensions): void {
    this.dimensions = dimensions
    this.origHalfX = dimensions.halfX

    for (let s = 0; s < 5; s++) {
      const material = new THREE.MeshBasicMaterial({
        vertexColors: true,
        wireframe: false,
      })
      const geometry = new THREE.PlaneGeometry(
        dimensions.halfX,
        this.SNAKE_HEIGHTS_SMALL[s],
        this.numSnakePoints - 1,
        1,
      )

      const vertexCount = geometry.getAttribute("position").count
      const colorArray = new Float32Array(vertexCount * 3)
      const base = new THREE.Color().setRGB(
        this.COLOR_NORM[s][0],
        this.COLOR_NORM[s][1],
        this.COLOR_NORM[s][2],
        THREE.SRGBColorSpace,
      )
      for (let v = 0; v < vertexCount; v++) {
        colorArray[v * 3] = base.r
        colorArray[v * 3 + 1] = base.g
        colorArray[v * 3 + 2] = base.b
      }
      geometry.setAttribute("color", new THREE.BufferAttribute(colorArray, 3))

      const snake = new THREE.Mesh(geometry, material)
      snake.position.x = -0.5 * dimensions.halfX
      snake.position.z = 1 + s
      container.add(snake)

      this.snakes.push(snake)
      this.positionsAttr.push(geometry.getAttribute("position") as THREE.BufferAttribute)
      this.colorsAttr.push(geometry.getAttribute("color") as THREE.BufferAttribute)
    }
  }

  resize(dimensions: Dimensions): void {
    this.dimensions = dimensions
    for (let s = 0; s < this.snakes.length; s++) {
      this.snakes[s].position.x = -0.5 * dimensions.halfX
      this.snakes[s].scale.x = dimensions.halfX / this.origHalfX
    }
  }

  update(
    dimensions: Dimensions,
    pitchRange: number,
    pitchesPast: number[],
    volumes: number[],
    songState: number,
    active: number,
  ): void {
    this.dimensions = dimensions
    this.actives.unshift(active)

    const target = pitchesPast[0] ?? 0
    let currentY: number
    let accuracyPitch: number

    if (songState == 0) {
      currentY = dimensions.halfY - dimensions.height * dimensions.mousePercY
      const targetY = -0.5 * pitchRange + target * pitchRange
      this.accuracies.unshift((currentY - targetY) / dimensions.halfY)
      accuracyPitch = 1 + 0.2 * ((currentY - targetY) / dimensions.halfY)
    } else {
      currentY = dimensions.halfX - dimensions.width * dimensions.mousePercX
      const targetY = -0.5 * pitchRange + target * pitchRange
      this.accuracies.unshift((currentY - targetY) / dimensions.halfY)
      accuracyPitch = 1 + 0.2 * ((currentY - targetY) / dimensions.halfX)
    }

    const targetYAbs = -0.5 * pitchRange + target * pitchRange
    const accuracy = Math.abs(currentY - targetYAbs)

    demoState.soundPitch = accuracy > 30 ? accuracyPitch : 1
    this.render(volumes, songState)
  }

  private render(volumes: number[], songState: number): void {
    const newposition =
      songState == 0
        ? this.dimensions.halfY - this.dimensions.height * this.dimensions.mousePercY
        : (this.dimensions.halfY - this.dimensions.height * this.dimensions.mousePercX) *
          (this.dimensions.width / this.dimensions.height)

    const pitch = demoState.soundPitch
    let pitchMultTop: number
    let pitchMultBot: number
    if (pitch >= 0.9 && pitch <= 1.1) {
      pitchMultTop = 1
      pitchMultBot = 1
    } else {
      pitchMultTop =
        pitch <= 0.9 ? ((pitch - 0.5) / 0.5) * 0.3 : ((1.5 - pitch) / 0.5) * 0.5
      pitchMultBot =
        pitch >= 1.1 ? ((1.5 - pitch) / 0.5) * 0.3 : ((pitch - 0.5) / 0.5) * 0.5
    }

    this.positions.unshift(newposition)
    this.pitchesTop.unshift(pitchMultTop)
    this.pitchesBot.unshift(pitchMultBot)

    const n = this.numSnakePoints
    for (let i = n - 1; i >= 0; i--) {
      const count = n - 1 - i
      const p = this.positions[count] ?? newposition
      const pMultiTop = this.pitchesTop[count] ?? 1
      const pMultiBot = this.pitchesBot[count] ?? 1
      const easeMult = count < 10 ? easeInOutSine(count, 0, 1, 10) : 1
      const vol = volumes[count] ?? 0

      for (let s = 0; s < 5; s++) {
        let newY = this.SNAKE_HEIGHTS[s] * 0.5 + vol * this.MULTIS[s] * easeMult * 40
        if (!newY || newY < this.SNAKE_HEIGHTS_SMALL[s]) {
          newY = this.SNAKE_HEIGHTS_SMALL[s] * 0.5
        }
        // innermost ribbon (index 4) only shows while a note was active
        const gate = s == 4 ? (this.actives[count] ?? 0) : 1
        const pos = this.positionsAttr[s]
        pos.setY(i, p + newY * pMultiTop * gate)
        pos.setY(i + n, p - newY * pMultiBot * gate)
      }
    }

    // colour each column by how far off pitch the player was at that moment
    for (let c = 0; c < n; c++) {
      const accuracy = Math.min(1, Math.abs(this.accuracies[n - 1 - c] ?? 0))
      for (let s = 0; s < 5; s++) {
        const norm = this.COLOR_NORM[s]
        const off = this.COLOR_OFF[s]
        // Interpolate in sRGB (as the original did), then convert to the
        // renderer's working (linear) space so on-pitch colours are identical
        // to the snake's hex-defined ribbons.
        this.scratch.setRGB(
          norm[0] + (off[0] - norm[0]) * accuracy,
          norm[1] + (off[1] - norm[1]) * accuracy,
          norm[2] + (off[2] - norm[2]) * accuracy,
          THREE.SRGBColorSpace,
        )
        const colorAttr = this.colorsAttr[s]
        colorAttr.setXYZ(c, this.scratch.r, this.scratch.g, this.scratch.b)
        colorAttr.setXYZ(c + n, this.scratch.r, this.scratch.g, this.scratch.b)
      }
    }

    for (let s = 0; s < 5; s++) {
      this.positionsAttr[s].needsUpdate = true
      this.colorsAttr[s].needsUpdate = true
    }
  }
}
