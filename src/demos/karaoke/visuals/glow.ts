import * as THREE from "three"

import { ASSET_BASE } from "../state"
import type { Dimensions } from "../types"

/**
 * Additive glow plane pinned to the right edge, behind the sparkler.
 * Ported from the original demo's js/vis/glow.js.
 */
export class Glow {
  private glow!: THREE.Mesh
  private material!: THREE.MeshBasicMaterial
  private dimensions!: Dimensions

  init(container: THREE.Object3D, dimensions: Dimensions): void {
    this.dimensions = dimensions
    const texture = new THREE.TextureLoader().load(`${ASSET_BASE}/images/glow.png`)
    this.material = new THREE.MeshBasicMaterial({
      map: texture,
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthTest: false,
    })
    this.material.opacity = 0

    const geometry = new THREE.PlaneGeometry(900, 918, 1, 1)
    this.glow = new THREE.Mesh(geometry, this.material)
    this.glow.position.x = dimensions.halfX - 900 * 0.5
    container.add(this.glow)
  }

  resize(dimensions: Dimensions): void {
    this.material.opacity = 0.5
    this.dimensions = dimensions
    this.glow.position.x = dimensions.halfX - 900 * 0.5
  }
}
