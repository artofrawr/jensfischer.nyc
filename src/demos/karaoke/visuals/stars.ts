import * as THREE from "three"

import type { Dimensions } from "../types"

/**
 * Slow parallax starfield drifting left.
 * Ported from the original demo's js/vis/stars.js.
 */
export class Stars {
  private readonly numStars = 300
  private readonly stars: THREE.Mesh[] = []
  private readonly starSpeed: number[] = []
  private dimensions!: Dimensions

  init(container: THREE.Object3D, dimensions: Dimensions): void {
    this.dimensions = dimensions

    for (let i = 0; i < this.numStars; i++) {
      const material = new THREE.MeshBasicMaterial({
        color: 0x8d4300,
        wireframe: false,
        transparent: true,
      })
      material.opacity = 0.4 + Math.random() * 0.4

      const geometry = new THREE.PlaneGeometry(2, 2)
      const star = new THREE.Mesh(geometry, material)
      star.position.x = -dimensions.halfX + Math.random() * dimensions.width
      star.position.y = -dimensions.halfY + Math.random() * dimensions.height
      star.position.z = 0
      container.add(star)

      this.starSpeed.push(material.opacity)
      this.stars.push(star)
    }
  }

  update(): void {
    for (let b = 0; b < this.stars.length; b++) {
      const star = this.stars[b]
      const speed = this.starSpeed[b] * 3
      star.position.x -= speed
      if (star.position.x < 0 - this.dimensions.halfX - speed) {
        star.position.x = this.dimensions.halfX
      }
    }
  }

  resize(dimensions: Dimensions): void {
    this.dimensions = dimensions
  }
}
