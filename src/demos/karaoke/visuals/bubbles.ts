import * as THREE from "three"

import type { Dimensions } from "../types"

/**
 * Drifting translucent circles that scale with the music volume.
 * Ported from the original demo's js/vis/bubbles.js.
 */
export class Bubbles {
  private readonly numBubbles = 50
  private readonly bubbles: THREE.Mesh[] = []
  private readonly bubblesSpeed: number[] = []
  private readonly colors = [0x3b1829, 0x691f31, 0xbb3234, 0xec6042]
  private dimensions!: Dimensions

  init(container: THREE.Object3D, dimensions: Dimensions): void {
    this.dimensions = dimensions

    for (let i = 0; i < this.numBubbles; i++) {
      const material = new THREE.MeshBasicMaterial({
        color: this.colors[Math.round(Math.random() * (this.colors.length - 1))],
        wireframe: false,
        transparent: true,
      })
      material.opacity = 0.2 + Math.random() * 0.6

      const w = Math.random() * 10 + 5
      const geometry = new THREE.CircleGeometry(w, 15)
      const bubble = new THREE.Mesh(geometry, material)
      bubble.position.x = -dimensions.halfX + Math.random() * dimensions.width
      bubble.position.y = -dimensions.halfY + Math.random() * dimensions.height
      bubble.position.z = Math.random() * 100
      container.add(bubble)

      this.bubblesSpeed.push(w)
      this.bubbles.push(bubble)
    }
  }

  update(volMusic: number, songState: number): void {
    for (let b = 0; b < this.bubbles.length; b++) {
      const bubble = this.bubbles[b]
      const speed = this.bubblesSpeed[b] * 0.75
      bubble.position.x -= speed
      bubble.scale.x = bubble.scale.y = bubble.scale.z = 1 + 2 * volMusic

      if (bubble.position.x < 0 - this.dimensions.halfX - speed) {
        bubble.position.x = this.dimensions.halfX
      }

      if (songState == 1) {
        bubble.rotation.x = -25 * (Math.PI / 180)
        bubble.rotation.y = -25 * (Math.PI / 180)
      }
    }
  }

  resize(dimensions: Dimensions): void {
    this.dimensions = dimensions
  }
}
