import * as THREE from "three"

import type { Dimensions, Pitch } from "../types"

/**
 * Five stacked ribbons ahead of the playhead, previewing the upcoming melody.
 * The innermost ribbon only appears while a note is active.
 * Ported from the original demo's js/vis/snake.js (THREE.Geometry -> BufferGeometry).
 */
export class Snake {
  private readonly SNAKE_HEIGHTS = [70, 50, 30, 10, 5]
  private readonly SNAKE_COLORS = [0x3b1829, 0x691f31, 0xbb3234, 0xec6042, 0xffc7bb]
  private readonly numSnakePoints = 30

  private readonly snakes: THREE.Mesh[] = []
  private readonly positions: THREE.BufferAttribute[] = []
  private dimensions!: Dimensions
  private origHalfX = 0

  init(container: THREE.Object3D, dimensions: Dimensions): void {
    this.dimensions = dimensions
    this.origHalfX = dimensions.halfX

    for (let s = 0; s < 5; s++) {
      const material = new THREE.MeshBasicMaterial({
        color: this.SNAKE_COLORS[s],
        wireframe: false,
      })
      const geometry = new THREE.PlaneGeometry(
        dimensions.halfX,
        this.SNAKE_HEIGHTS[s],
        this.numSnakePoints - 1,
        1,
      )
      const snake = new THREE.Mesh(geometry, material)
      snake.position.x = 0.5 * dimensions.halfX
      snake.position.z = 1 + s
      container.add(snake)
      this.snakes.push(snake)
      this.positions.push(geometry.getAttribute("position") as THREE.BufferAttribute)
    }
  }

  resize(dimensions: Dimensions): void {
    this.dimensions = dimensions
    for (let s = 0; s < this.snakes.length; s++) {
      this.snakes[s].position.x = 0.5 * dimensions.halfX
      this.snakes[s].scale.x = dimensions.halfX / this.origHalfX
    }
  }

  update(pitchRange: number, pitches: Pitch[]): void {
    for (let s = 0; s < this.snakes.length; s++) {
      const height = this.SNAKE_HEIGHTS[s]
      const pos = this.positions[s]

      for (let i = 0; i < this.numSnakePoints; i++) {
        const sample = pitches[i]
        const p = -0.5 * pitchRange + (sample ? sample.pitch : 0.5) * pitchRange
        const active = sample && sample.active ? 1 : 0
        // Only the innermost ribbon (index 4) is gated by note activity.
        const mult = s == 4 ? active : 1

        pos.setY(i, height * 0.5 * mult + p)
        pos.setY(i + this.numSnakePoints, 0 - height * 0.5 * mult + p)
      }

      pos.needsUpdate = true
    }
  }
}
