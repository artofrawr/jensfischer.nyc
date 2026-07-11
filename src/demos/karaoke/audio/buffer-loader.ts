/**
 * Loads and decodes a list of audio files into AudioBuffers.
 * Ported from the original demo's js/libs/buffer-loader.js (modern fetch/decode).
 */
export class BufferLoader {
  private readonly bufferList: AudioBuffer[] = []
  private loadCount = 0

  constructor(
    private readonly context: AudioContext,
    private readonly urlList: string[],
    private readonly onload: (bufferList: AudioBuffer[]) => void,
  ) {}

  private async loadBuffer(url: string, index: number): Promise<void> {
    try {
      const response = await fetch(url)
      const arrayBuffer = await response.arrayBuffer()
      const buffer = await this.context.decodeAudioData(arrayBuffer)
      this.bufferList[index] = buffer
      if (++this.loadCount == this.urlList.length) {
        this.onload(this.bufferList)
      }
    } catch (error) {
      console.error("BufferLoader: failed to load", url, error)
    }
  }

  load(): void {
    for (let i = 0; i < this.urlList.length; ++i) {
      void this.loadBuffer(this.urlList[i], i)
    }
  }
}
