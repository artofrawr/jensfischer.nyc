import * as THREE from "three"

import type { Dimensions } from "../types"
import { easeInOutSine } from "./ease"

/**
 * Five nested line pairs trailing to the left, echoing past pitch + volume.
 * Ported from the original demo's js/vis/curves.js (THREE.Geometry -> BufferGeometry).
 */
export class Curves {
  private readonly numCurvePoints = 60
  private readonly CURVE_HEIGHTS = [70, 50, 30, 10, 5]
  private readonly CURVE_COLORS = [0x241921, 0x3b1829, 0x691f31, 0xbb3234, 0xec6042]
  private readonly MULTI_VOL = [6, 5, 4, 2, 1]

  private curvePoints: number[] = []
  private readonly posUp: THREE.BufferAttribute[] = []
  private readonly posDown: THREE.BufferAttribute[] = []
  private dimensions!: Dimensions

  init(container: THREE.Object3D, dimensions: Dimensions): void {
    this.dimensions = dimensions
    this.computePoints()

    for (let s = 0; s < 5; s++) {
      const material = new THREE.LineBasicMaterial({ color: this.CURVE_COLORS[s] })

      const upPoints: THREE.Vector3[] = []
      const downPoints: THREE.Vector3[] = []
      for (let c = 0; c < this.numCurvePoints; c++) {
        upPoints.push(new THREE.Vector3(this.curvePoints[c], 0.5 * this.CURVE_HEIGHTS[s], 1))
        downPoints.push(new THREE.Vector3(this.curvePoints[c], -0.5 * this.CURVE_HEIGHTS[s], 1))
      }

      const upGeometry = new THREE.BufferGeometry().setFromPoints(upPoints)
      const downGeometry = new THREE.BufferGeometry().setFromPoints(downPoints)
      container.add(new THREE.Line(upGeometry, material))
      container.add(new THREE.Line(downGeometry, material))

      this.posUp.push(upGeometry.getAttribute("position") as THREE.BufferAttribute)
      this.posDown.push(downGeometry.getAttribute("position") as THREE.BufferAttribute)
    }
  }

  private computePoints(): void {
    this.curvePoints = []
    const step = Math.ceil(this.dimensions.halfX / this.numCurvePoints)
    for (let i = 0; i < this.numCurvePoints; i++) {
      this.curvePoints.push(0 - step * i)
    }
  }

  resize(dimensions: Dimensions): void {
    this.dimensions = dimensions
    this.computePoints()

    for (let c = 0; c < this.posUp.length; c++) {
      for (let i = 0; i < this.numCurvePoints; i++) {
        this.posUp[c].setX(i, this.curvePoints[i])
        this.posDown[c].setX(i, this.curvePoints[i])
      }
      this.posUp[c].needsUpdate = true
      this.posDown[c].needsUpdate = true
    }
  }

  update(pitchRange: number, pitches: number[], volumes: number[]): void {
    for (let c = 0; c < this.posUp.length; c++) {
      const multiVol = this.MULTI_VOL[c]
      const up = this.posUp[c]
      const down = this.posDown[c]

      for (let i = 0; i < this.numCurvePoints; i++) {
        const p = -0.5 * pitchRange + (pitches[i] ?? 0) * pitchRange
        const vol = volumes[i] ?? 0
        const easeMult = i < 10 ? easeInOutSine(i, 0, 1, 10) : 1

        up.setY(i, this.CURVE_HEIGHTS[c] * 0.5 + p + vol * multiVol * easeMult * 40)
        down.setY(i, 0 - this.CURVE_HEIGHTS[c] * 0.5 + p - vol * multiVol * easeMult * 40)
      }

      up.needsUpdate = true
      down.needsUpdate = true
    }
  }
}
