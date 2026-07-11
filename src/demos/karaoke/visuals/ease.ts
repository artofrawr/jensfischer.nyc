/** Penner ease-in-out sine, as used throughout the original visualizers. */
export function easeInOutSine(t: number, b: number, c: number, d: number): number {
  return (-c / 2) * (Math.cos((Math.PI * t) / d) - 1) + b
}
