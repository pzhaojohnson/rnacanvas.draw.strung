/**
 * Implemented by elements that form a line (e.g., a bond).
 *
 * The line can be straight or curved.
 */
export interface Linear {
  readonly length: number;

  /**
   * Returns information regarding the point along the line at the specified length.
   *
   * Returns information for the starting point of the line for negative lengths.
   *
   * Returns information for the end point of the line for lengths greater than the length of the line.
   */
  atLength(length: number): {
    /**
     * X coordinate.
     */
    readonly x: number;

    /**
     * Y coordinate.
     */
    readonly y: number;

    /**
     * The direction of the line at this point (in radians).
     */
    readonly direction: number;
  };

  addEventListener(name: 'change', listener: () => void): void;
}
