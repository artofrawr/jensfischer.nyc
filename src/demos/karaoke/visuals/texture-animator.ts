import * as THREE from "three"

/**
 * Advances a sprite-sheet texture's offset over time to play a frame animation.
 * Ported from the original demo's js/vis/textureanimator.js.
 */
export class TextureAnimator {
  private currentDisplayTime = 0
  private currentTile = 0

  constructor(
    private readonly texture: THREE.Texture,
    private readonly tilesHorizontal: number,
    private readonly tilesVertical: number,
    private readonly numberOfTiles: number,
    private readonly tileDisplayDuration: number,
  ) {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(1 / this.tilesHorizontal, 1 / this.tilesVertical)
  }

  update(milliSec: number): void {
    this.currentDisplayTime += milliSec
    while (this.currentDisplayTime > this.tileDisplayDuration) {
      this.currentDisplayTime -= this.tileDisplayDuration
      this.currentTile++
      if (this.currentTile == this.numberOfTiles) this.currentTile = 0
      const currentColumn = this.currentTile % this.tilesHorizontal
      this.texture.offset.x = currentColumn / this.tilesHorizontal
      const currentRow = Math.floor(this.currentTile / this.tilesHorizontal)
      this.texture.offset.y = currentRow / this.tilesVertical
    }
  }
}
