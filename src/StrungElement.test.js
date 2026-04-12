/**
 * @jest-environment jsdom
 */

import { StrungElement } from './StrungElement';

import { DrawingElementMock } from './DrawingElementMock';

import { LineMock } from './LineMock';

import { distance } from '@rnacanvas/points';

var element = null;

var owner = null;

var strungElement = null;

beforeEach(() => {
  element = new DrawingElementMock();

  owner = LineMock.connecting({ x: 0, y: 0 }, { x: 1, y: 1 });

  strungElement = new StrungElement(element, owner);
});

afterEach(() => {
  element = null;

  owner = null;

  strungElement = null;
});

describe('`class StrungElement`', () => {
  test('`constructor()`', () => {
    var element = new DrawingElementMock();

    var owner = LineMock.connecting({ x: 0, y: 0 }, { x: 1, y: 1 });

    var strungElement = new StrungElement(element, owner);

    // stores reference to owner
    expect(strungElement.owner).toBe(owner);

    expect(owner).toBeTruthy();

    var owner = LineMock.connecting({ x: -10, y: 15 }, { x: 0, y: 35 });

    var linePoint = owner.atLength(6);

    element.centerX = linePoint.x;
    element.centerY = linePoint.y;

    // uncache
    element.domNode.dataset.lineX = '';

    var strungElement = new StrungElement(element, owner);

    // caches line X
    expect(Number.parseFloat(element.domNode.dataset.lineX) + (owner.length / 2)).toBeCloseTo(6);

    element.domNode.dataset.lineX = '50';

    var strungElement = new StrungElement(element, owner);

    // doesn't overwrite already cached line X
    expect(element.domNode.dataset.lineX).toBe('50');

    strungElement.displacementMagnitude = 27;
    strungElement.displacementDirection = Math.PI / 6;

    // uncache
    element.domNode.dataset.displacementMagnitude = '';
    element.domNode.dataset.displacementDirection = '';

    var strungElement = new StrungElement(element, owner);

    // caches displacement magnitude and direction
    expect(Number.parseFloat(element.domNode.dataset.displacementMagnitude)).toBeCloseTo(27);
    expect(Number.parseFloat(element.domNode.dataset.displacementDirection)).toBeCloseTo(Math.PI / 6);

    element.domNode.dataset.displacementMagnitude = '52';
    element.domNode.dataset.displacementDirection = '1.25';

    var strungElement = new StrungElement(element, owner);

    // doesn't overwrite already cached displacment magnitude and direction
    expect(element.domNode.dataset.displacementMagnitude).toBe('52');
    expect(element.domNode.dataset.displacementDirection).toBe('1.25');

    var element = new DrawingElementMock();

    var owner = LineMock.connecting({ x: -10, y: -50 }, { x: 200, y: 355 });

    expect(owner.direction).toBeCloseTo(1.092443895416239);

    element.centerX = 25;
    element.centerY = 12;

    owner.addEventListener = jest.fn();

    var strungElement = new StrungElement(element, owner);

    element.centerX = 100;
    element.centerY = 200;

    element.direction = 0;

    owner.addEventListener.mock.calls[0][1]();

    // repositioned the strung element (must have been listening for owner line movement)
    expect(element.centerX).toBeCloseTo(25);
    expect(element.centerY).toBeCloseTo(12);

    expect(element.direction).toBeCloseTo(1.092443895416239);

    delete element.direction;

    owner.addEventListener.mock.calls[0][1]();

    // doesn't set direction if the wrapped element doesn't have direction
    expect('direction' in element).toBe(false);
  });

  test('`get domNode()`', () => {
    expect(strungElement.domNode).toBe(element.domNode);

    expect(element.domNode).toBeTruthy();
  });

  test('`get lineX()`', () => {
    // when line X is cached
    element.domNode.dataset.lineX = '-2.85';
    expect(strungElement.lineX).toBe(-2.85);

    // when line X is not cached
    element.domNode.dataset.lineX = '';
    expect(strungElement.lineX).toBe(0);

    // when the cached line X value is nonfinite
    [NaN, Infinity, -Infinity, 'asdf'].forEach(value => {
      element.domNode.dataset.lineX = `${value}`;
      expect(strungElement.lineX).toBe(0);
    });
  });

  test('`set lineX()`', () => {
    strungElement.displacementMagnitude = 0;

    strungElement.lineX = -0.583;

    // updates cached value
    expect(element.domNode.dataset.lineX).toBe('-0.583')

    var linePoint = owner.atLength((owner.length / 2) + (-0.583));

    // repositions strung element
    expect(element.centerX).toBeCloseTo(linePoint.x);
    expect(element.centerY).toBeCloseTo(linePoint.y);

    expect(element.direction).toBeCloseTo(linePoint.direction);

    // clamps values greater than half the owner length
    strungElement.lineX = (owner.length / 2) + 0.1;
    expect(strungElement.lineX).toBeCloseTo(owner.length / 2);
    expect(strungElement.lineX).not.toBeCloseTo((owner.length / 2) + 0.1);

    strungElement.lineX = -(owner.length / 2) - 0.1;

    // clamps values less than negative half the owner length
    expect(strungElement.lineX).toBeCloseTo(-owner.length / 2);
    expect(strungElement.lineX).not.toBeCloseTo(-(owner.length / 2) - 0.1);

    // ignores nonfinite values
    [NaN, Infinity, -Infinity].forEach(value => {
      strungElement.lineX = value;

      // unchanged
      expect(strungElement.lineX).toBeCloseTo(-owner.length / 2);
    });
  });

  test('`get displacementMagnitude()`', () => {
    var element = new DrawingElementMock();

    var owner = LineMock.connecting({ x: 0, y: 0 }, { x: 1, y: 1 });

    var strungElement = new StrungElement(element, owner);

    // displacement magnitude is cached
    element.domNode.dataset.displacementMagnitude = '23.97';
    expect(strungElement.displacementMagnitude).toBe(23.97);

    // displacement magnitude is not cached
    element.domNode.dataset.displacementMagnitude = '';
    expect(strungElement.displacementMagnitude).toBe(0);

    // cached displacement magnitude is nonfinite
    [NaN, Infinity, -Infinity, 'asdf'].forEach(value => {
      element.domNode.dataset.displacementMagnitude = `${value}`;
      expect(strungElement.displacementMagnitude).toBe(0);
    });
  });

  test('`set displacementMagnitude()`', () => {
    var element = new DrawingElementMock();

    element.centerX = 1;
    element.centerY = 1;

    element.direction = 0;

    var owner = LineMock.connecting({ x: 0, y: 0 }, { x: 1, y: 1 });

    var strungElement = new StrungElement(element, owner);

    expect(strungElement.displacementMagnitude).toBeCloseTo(0);

    strungElement.displacementMagnitude = 2;

    // updates cached value
    expect(element.domNode.dataset.displacementMagnitude).toBe('2');

    let centerPoint = { x: element.centerX, y: element.centerY };

    // repositions strung element
    expect(distance({ x: 1, y: 1 }, centerPoint)).toBeCloseTo(2);

    expect(element.direction).toBeCloseTo(Math.PI / 4);

    // ignores nonfinite values
    [NaN, Infinity, -Infinity].forEach(value => {
      strungElement.displacementMagnitude = value;

      // unchanged
      expect(element.domNode.dataset.displacementMagnitude).toBe('2');

      // unchanged
      expect(distance({ x: 1, y: 1 }, centerPoint)).toBeCloseTo(2);
    });
  });

  test('`get displacementDirection()`', () => {
    var element = new DrawingElementMock();

    var owner = LineMock.connecting({ x: 0, y: 0 }, { x: 1, y: 1 });

    var strungElement = new StrungElement(element, owner);

    // displacement direction is cached
    element.domNode.dataset.displacementDirection = `${Math.PI / 3}`;
    expect(strungElement.displacementDirection).toBe(Math.PI / 3);

    // displacement direction is not cached
    element.domNode.dataset.displacementDirection = '';
    expect(strungElement.displacementDirection).toBe(0);

    // cached displacement direction is nonfinite
    [NaN, Infinity, -Infinity, 'asdf'].forEach(value => {
      element.domNode.dataset.displacementDirection = `${value}`;
      expect(strungElement.displacementDirection).toBe(0);
    });
  });

  test('`set displacementDirection()`', () => {
    var element = new DrawingElementMock();

    element.centerX = 1;
    element.centerY = 2;

    element.direction = 0;

    var owner = LineMock.connecting({ x: 0, y: 0 }, { x: 1, y: 1 });

    var strungElement = new StrungElement(element, owner);

    strungElement.displacementDirection -= Math.PI / 2;

    // updates cached value
    expect(Number.parseFloat(element.domNode.dataset.displacementDirection)).toBeCloseTo(-Math.PI / 4);

    // repositions the strung element
    expect(element.centerX).toBeCloseTo(2);
    expect(element.centerY).toBeCloseTo(1);

    expect(element.direction).toBeCloseTo(Math.PI / 4);

    // ignores nonfinite values
    [NaN, Infinity, -Infinity].forEach(value => {
      strungElement.displacementDirection = value;

      // unchanged
      expect(Number.parseFloat(element.domNode.dataset.displacementDirection)).toBeCloseTo(-Math.PI / 4);

      // unchanged
      expect(element.centerX).toBeCloseTo(2);
      expect(element.centerY).toBeCloseTo(1);
    });
  });

  test('`get displacementX()`', () => {
    strungElement.displacementMagnitude = 12;
    strungElement.displacementDirection = 2 * Math.PI / 3;

    expect(strungElement.displacementX).toBeCloseTo(12 * Math.cos(2 * Math.PI / 3));
  });

  test('`set displacementX()`', () => {
    strungElement.displacementMagnitude = 10;
    strungElement.displacementDirection = Math.PI / 6;

    strungElement.displacementX = 2;

    // updates displacement magnitude and direction
    expect(strungElement.displacementMagnitude).toBeCloseTo((2**2 + 5**2)**0.5);
    expect(strungElement.displacementDirection).toBeCloseTo(Math.atan2(5, 2));

    var linePoint = owner.atLength((owner.length / 2) + strungElement.lineX);
    var centerPoint = { x: element.centerX, y: element.centerY };

    // repositions the strung element
    expect(distance(linePoint, centerPoint)).toBeCloseTo((2**2 + 5**2)**0.5);

    expect(element.direction).toBeCloseTo(linePoint.direction);

    // ignores nonfinite values
    [NaN, Infinity, -Infinity].forEach(value => {
      strungElement.displacementX = value;

      var linePoint = owner.atLength((owner.length / 2) + strungElement.lineX);
      var centerPoint = { x: element.centerX, y: element.centerY };

      // unchanged
      expect(distance(linePoint, centerPoint)).toBeCloseTo((2**2 + 5**2)**0.5);
    });
  });

  test('`get displacementY()`', () => {
    strungElement.displacementMagnitude = 18;
    strungElement.displacementDirection = Math.PI / 3;

    expect(strungElement.displacementY).toBeCloseTo(18 * Math.sin(Math.PI / 3));
  });

  test('`set displacementY()`', () => {
    strungElement.displacementMagnitude = 10;
    strungElement.displacementDirection = Math.PI / 3;

    strungElement.displacementY = 2;

    // updates displacement magnitude and direction
    expect(strungElement.displacementMagnitude).toBeCloseTo((5**2 + 2**2)**0.5);
    expect(strungElement.displacementDirection).toBeCloseTo(Math.atan2(2, 5));

    var linePoint = owner.atLength((owner.length / 2) + strungElement.lineX);
    var centerPoint = { x: element.centerX, y: element.centerY };

    // repositions the strung element
    expect(distance(linePoint, centerPoint)).toBeCloseTo((5**2 + 2**2)**0.5);

    expect(element.direction).toBeCloseTo(linePoint.direction);

    // ignores nonfinite values
    [NaN, Infinity, -Infinity].forEach(value => {
      strungElement.displacementY = value;

      var linePoint = owner.atLength((owner.length / 2) + strungElement.lineX);
      var centerPoint = { x: element.centerX, y: element.centerY };

      // unchanged
      expect(distance(linePoint, centerPoint)).toBeCloseTo((5**2 + 2**2)**0.5);
    });
  });

  test('`drag()`', () => {
    var owner = LineMock.connecting({ x: 10, y: 11 }, { x: 50, y: 52 });

    var strungElement = new StrungElement(element, owner);

    strungElement.lineX = 3;

    strungElement.displacementX = 7;
    strungElement.displacementY = -2.5;

    expect(element.centerX).toBeCloseTo(38.77269339169631);
    expect(element.centerY).toBeCloseTo(36.91200985358379);

    element.direction = 0;

    expect(strungElement.displacementX).toBeCloseTo(7);
    expect(strungElement.displacementY).toBeCloseTo(-2.5);

    strungElement.drag(12, 2);

    // repositions strung element
    expect(element.centerX).toBeCloseTo(38.77269339169631 + 12);
    expect(element.centerY).toBeCloseTo(36.91200985358379 + 2);

    expect(element.direction).toBeCloseTo(0.7977432152416728);

    // updates displacement
    expect(strungElement.displacementX).not.toBeCloseTo(7);
    expect(strungElement.displacementY).not.toBeCloseTo(-2.5);

    strungElement.drag(12, 2, { dragGroup: { has: ele => ele === owner } });

    // unchanged (doesn't reposition the strung element if the drag group contains the owner element)
    expect(element.centerX).toBeCloseTo(38.77269339169631 + 12);
    expect(element.centerY).toBeCloseTo(36.91200985358379 + 2);

    expect(element.direction).toBeCloseTo(0.7977432152416728);

    strungElement.drag(12, 2, { dragGroup: { has: ele => ele !== owner } });

    // changed (checks if the drag group contains the owner element correctly)
    expect(element.centerX).toBeCloseTo(38.77269339169631 + 12 + 12);
    expect(element.centerY).toBeCloseTo(36.91200985358379 + 2 + 2);

    // direction is still the same
    expect(element.direction).toBeCloseTo(0.7977432152416728);

    [NaN, Infinity, -Infinity].forEach(value => {
      strungElement.drag(value, 2);
    });

    // unchanged (ignores nonfinite X values)
    expect(element.centerX).toBeCloseTo(38.77269339169631 + 12 + 12);
    expect(element.centerY).toBeCloseTo(36.91200985358379 + 2 + 2);

    expect(element.direction).toBeCloseTo(0.7977432152416728);

    [NaN, Infinity, -Infinity].forEach(value => {
      strungElement.drag(12, value);
    });

    // unchanged (ignores nonfinite Y values)
    expect(element.centerX).toBeCloseTo(38.77269339169631 + 12 + 12);
    expect(element.centerY).toBeCloseTo(36.91200985358379 + 2 + 2);

    expect(element.direction).toBeCloseTo(0.7977432152416728);
  });
});
