import type { Linear } from './Linear';

import type { Point } from './Point';

import { distance } from '@rnacanvas/points';

import { average } from '@rnacanvas/math';

export const Line = {
  matching(line: Linear) {
    return {
      /**
       * Performs binary search to find the length on the line closest to the provided point.
       *
       * Might not work correctly for certain (relatively rare) cases of curved lines.
       */
      closestLength(point: Point): LineCoordinate {
        // 15 iterations seems to work well usually
        const iterations = 15;

        let x1 = 0;
        let x2 = line.length;

        for (let i = 0; i < iterations; i++) {
          let d1 = distance(point, line.atLength(x1));
          let d2 = distance(point, line.atLength(x2));

          if (d1 < d2) {
            x2 = average([x1, x2]);
          } else {
            x1 = average([x1, x2]);
          }
        }

        return average([x1, x2]);
      }
    };
  },
};

export type LineCoordinate = number;
