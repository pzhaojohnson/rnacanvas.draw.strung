import { distance } from '@rnacanvas/points';

import { direction } from '@rnacanvas/points';

export class LineMock {
  static connecting(point1, point2) {
    let domNode = document.createElementNS('http://www.w3.org/2000/svg', 'line');

    domNode.setAttribute('x1', `${point1.x}`);
    domNode.setAttribute('y1', `${point1.y}`);
    domNode.setAttribute('x2', `${point2.x}`);
    domNode.setAttribute('y2', `${point2.y}`);

    return new LineMock(domNode);
  }

  constructor(domNode) {
    // an SVG line element
    this.domNode = domNode;
  }

  get x1() {
    return Number.parseFloat(this.domNode.getAttribute('x1'));
  }

  get y1() {
    return Number.parseFloat(this.domNode.getAttribute('y1'));
  }

  get x2() {
    return Number.parseFloat(this.domNode.getAttribute('x2'));
  }

  get y2() {
    return Number.parseFloat(this.domNode.getAttribute('y2'));
  }

  get point1() {
    return { x: this.x1, y: this.y1 };
  }

  get point2() {
    return { x: this.x2, y: this.y2 };
  }

  get length() {
    return distance(this.point1, this.point2);
  }

  get direction() {
    return direction(this.point1, this.point2);
  }

  atLength(length) {
    let x = length < 0 ? (
      this.point1.x
    ) : length > this.length ? (
      this.point2.x
    ) : (
      this.point1.x + (length * Math.cos(this.direction))
    );

    let y = length < 0 ? (
      this.point1.y
    ) : length > this.length ? (
      this.point2.y
    ) : (
      this.point1.y + (length * Math.sin(this.direction))
    );

    let direction = this.direction;

    return { x, y, direction };
  }

  addEventListener = jest.fn();
}
