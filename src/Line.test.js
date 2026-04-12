/**
 * @jest-environment jsdom
 */

import { Line } from './Line';

import { LineMock } from './LineMock';

describe('`const Line`', () => {
  test('`matching()`', () => {
    // a line going from bottom-left to top-right
    var line = LineMock.connecting({ x: -10, y: -2 }, { x: 20, y: 45 });

    // the two end points
    expect(Line.matching(line).closestLength({ x: -10, y: -2 })).toBeCloseTo(0);
    expect(Line.matching(line).closestLength({ x: 20, y: 45 })).toBeCloseTo(55.758407437802596);

    // within the middle of the line
    expect(Line.matching(line).closestLength(line.atLength(22))).toBeCloseTo(22);
    expect(Line.matching(line).closestLength(line.atLength(48))).toBeCloseTo(48);
    expect(Line.matching(line).closestLength(line.atLength(7))).toBeCloseTo(7);

    // close to the middle of the line
    var point = {
      x: line.atLength(19).x + ((-6) * Math.cos(line.direction + (Math.PI / 2))),
      y: line.atLength(19).y + ((-6) * Math.sin(line.direction + (Math.PI / 2))),
    };

    expect(Line.matching(line).closestLength(point)).toBeCloseTo(19);

    // closest to point 1
    expect(Line.matching(line).closestLength({ x: -12, y: -5 })).toBeCloseTo(0);

    // closest to point 2
    expect(Line.matching(line).closestLength({ x: 24, y: 52 })).toBeCloseTo(55.758407437802596);

    // a line going from bottom-right to top-left
    var line = LineMock.connecting({ x: 12, y: 6 }, { x: -50, y: 15 });

    // the two end points
    expect(Line.matching(line).closestLength({ x: 12, y: 6 })).toBeCloseTo(0);
    expect(Line.matching(line).closestLength({ x: -50, y: 15 })).toBeCloseTo(62.64982043070834);

    // within the middle of the line
    expect(Line.matching(line).closestLength(line.atLength(25))).toBeCloseTo(25);
    expect(Line.matching(line).closestLength(line.atLength(50))).toBeCloseTo(50);
    expect(Line.matching(line).closestLength(line.atLength(3))).toBeCloseTo(3);

    // close to the middle of the line
    var point = {
      x: line.atLength(12).x + (5 * Math.cos(line.direction - (Math.PI / 2))),
      y: line.atLength(12).y + (5 * Math.sin(line.direction - (Math.PI / 2))),
    };

    expect(Line.matching(line).closestLength(point)).toBeCloseTo(12);

    // closest to point 1
    expect(Line.matching(line).closestLength({ x: 15, y: 3 })).toBeCloseTo(0);

    // closest to point 2
    expect(Line.matching(line).closestLength({ x: -51, y: 20 })).toBeCloseTo(62.64982043070834);

    // a line with length of zero
    var line = LineMock.connecting({ x: 11, y: 16 }, { x: 11, y: 16 });

    expect(Line.matching(line).closestLength({ x: 11, y: 16 })).toBeCloseTo(0);
    expect(Line.matching(line).closestLength({ x: 5, y: -2 })).toBeCloseTo(0);
    expect(Line.matching(line).closestLength({ x: 25, y: 106 })).toBeCloseTo(0);
  });
});
