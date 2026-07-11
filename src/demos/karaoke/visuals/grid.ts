import * as THREE from "three"

import type { Dimensions } from "../types"

/**
 * Dashed background grid (nine horizontal lines + one vertical).
 * Ported from the original demo's js/vis/grid.js.
 *
 * The original built the dashes with THREE.LinePieces — rendering the vertex
 * list as disconnected segments (pairs 0-1, 2-3, …). With vertices stepped every
 * 5 units (horizontal) / 10 units (vertical), that yields the on/off pattern; the
 * LineDashedMaterial was a no-op (computeLineDistances was never called). The
 * modern equivalent of LinePieces is THREE.LineSegments with a plain material.
 */
export class Grid {
  private readonly lineHor: THREE.LineSegments[] = []
  private lineVer!: THREE.LineSegments
  private dimensions!: Dimensions

  init(container: THREE.Object3D, dimensions: Dimensions): void {
    this.dimensions = dimensions

    for (let i = 0; i < 9; i++) {
      const points: THREE.Vector3[] = []
      for (let s = 0; s < 200; s++) {
        points.push(new THREE.Vector3(s * 5, 0, 0))
      }
      const geometry = new THREE.BufferGeometry().setFromPoints(points)
      const material = new THREE.LineBasicMaterial({ color: 0x691f31 })
      const line = new THREE.LineSegments(geometry, material)
      line.scale.x = dimensions.width / 1000
      line.position.x = 0 - dimensions.halfX
      line.position.y = -90 + i * 20
      container.add(line)
      this.lineHor.push(line)
    }

    const verPoints: THREE.Vector3[] = []
    for (let s = 0; s < 100; s++) {
      verPoints.push(new THREE.Vector3(0, s * 10, 0))
    }
    const verGeometry = new THREE.BufferGeometry().setFromPoints(verPoints)
    const verMaterial = new THREE.LineBasicMaterial({ color: 0x691f31 })
    this.lineVer = new THREE.LineSegments(verGeometry, verMaterial)
    this.lineVer.scale.y = dimensions.height / 1000
    this.lineVer.position.y = 0 - dimensions.halfY
    container.add(this.lineVer)
  }

  resize(dimensions: Dimensions): void {
    this.dimensions = dimensions

    for (let i = 0; i < this.lineHor.length; i++) {
      const line = this.lineHor[i]
      line.scale.x = dimensions.width / 1000
      line.position.x = -2.5 * line.scale.x - dimensions.halfX
    }

    this.lineVer.scale.y = dimensions.height / 1000
    this.lineVer.position.y = 0 - dimensions.halfY
  }
}
