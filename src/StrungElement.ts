import type { Linear } from './Linear';

import { Line } from './Line';

import type { DrawingElement } from './DrawingElement';

import type { Centerable } from './Centerable';

import type { Directed } from './Directed';

import { distance, direction } from '@rnacanvas/points';

import type { DrawingElementsCollection } from './DrawingElementsCollection';

export class StrungElement {
  /**
   * Wrapped element.
   */
  readonly #element;

  constructor(element: DrawingElement & Centerable & Partial<Directed>, readonly owner: DrawingElement & Linear) {
    this.#element = element;

    if (!element.domNode.dataset.lineX) {
      this.#cacheLineX();
    }

    if (!element.domNode.dataset.displacementMagnitude || !element.domNode.dataset.displacementDirection) {
      this.#cacheDisplacement();
    }

    owner.addEventListener('change', () => this.#reposition());
  }

  #cacheLineX() {
    let centerPoint = { x: this.#element.centerX, y: this.#element.centerY };

    let midlength = this.owner.length / 2;

    // don't forget to calculate in relation to midlength
    this.#element.domNode.dataset.lineX = `${Line.matching(this.owner).closestLength(centerPoint) - midlength}`;
  }

  /**
   * This method assumes that line X has already been cached.
   */
  #cacheDisplacement() {
    let linePoint = this.#linePoint

    let centerPoint = { x: this.#element.centerX, y: this.#element.centerY };

    this.#element.domNode.dataset.displacementMagnitude = `${distance(linePoint, centerPoint)}`;

    // don't forget to normalize to line direction
    this.#element.domNode.dataset.displacementDirection = `${direction(linePoint, centerPoint) - linePoint.direction}`;
  }

  get domNode() {
    return this.#element.domNode;
  }

  get lineX(): number {
    let lineX: number;

    if (this.#element.domNode.dataset.lineX) {
      lineX = Number.parseFloat(this.#element.domNode.dataset.lineX);
    } else {
      lineX = 0;
    }

    if (!Number.isFinite(lineX)) {
      lineX = 0;
    }

    return lineX;
  }

  set lineX(lineX) {
    if (!Number.isFinite(lineX)) {
      console.error(`The specified line X coordinate is nonfinite: ${lineX}.`);
      return;
    }

    if (lineX < -(this.owner.length / 2)) {
      lineX = -(this.owner.length / 2);
    } else if (lineX > this.owner.length / 2) {
      lineX = this.owner.length / 2;
    }

    this.#element.domNode.dataset.lineX = `${lineX}`;

    this.#reposition();
  }

  /**
   * The point on the line at the line X coordinate for the strung element.
   */
  get #linePoint() {
    let midlength = this.owner.length / 2;

    // don't forget to calculate in relation to midlength
    return this.owner.atLength(midlength + this.lineX);
  }

  get displacementMagnitude(): number {
    let displacementMagnitude: number;

    if (this.#element.domNode.dataset.displacementMagnitude) {
      displacementMagnitude = Number.parseFloat(this.#element.domNode.dataset.displacementMagnitude);
    } else {
      displacementMagnitude = 0;
    }

    if (!Number.isFinite(displacementMagnitude)) {
      displacementMagnitude = 0;
    }

    return displacementMagnitude;
  }

  set displacementMagnitude(displacementMagnitude) {
    if (!Number.isFinite(displacementMagnitude)) {
      console.error(`The specified displacement magnitude is nonfinite: ${displacementMagnitude}.`);
      return;
    }

    this.#element.domNode.dataset.displacementMagnitude = `${displacementMagnitude}`;

    this.#reposition();
  }

  /**
   * In radians.
   */
  get displacementDirection(): number {
    let displacementDirection: number;

    if (this.#element.domNode.dataset.displacementDirection) {
      displacementDirection = Number.parseFloat(this.#element.domNode.dataset.displacementDirection);
    } else {
      displacementDirection = 0;
    }

    if (!Number.isFinite(displacementDirection)) {
      displacementDirection = 0;
    }

    return displacementDirection;
  }

  set displacementDirection(displacementDirection) {
    if (!Number.isFinite(displacementDirection)) {
      console.error(`The specified displacement direction is nonfinite: ${displacementDirection}.`);
      return;
    }

    this.#element.domNode.dataset.displacementDirection = `${displacementDirection}`;

    this.#reposition();
  }

  get displacementX(): number {
    return this.displacementMagnitude * Math.cos(this.displacementDirection);
  }

  set displacementX(displacementX) {
    if (!Number.isFinite(displacementX)) {
      console.error(`The specified displacement X component is nonfinite: ${displacementX}.`);
      return;
    }

    // cache before changing displacement components
    let displacementY = this.displacementY;

    this.displacementMagnitude = (displacementX**2 + displacementY**2)**0.5;

    this.displacementDirection = Math.atan2(displacementY, displacementX);
  }

  get displacementY() {
    return this.displacementMagnitude * Math.sin(this.displacementDirection);
  }

  set displacementY(displacementY) {
    if (!Number.isFinite(displacementY)) {
      console.error(`The specified displacement Y component is nonfinite: ${displacementY}.`);
      return;
    }

    // cache before changing displacement components
    let displacementX = this.displacementX;

    this.displacementMagnitude = (displacementX**2 + displacementY**2)**0.5;

    this.displacementDirection = Math.atan2(displacementY, displacementX);
  }

  #reposition() {
    let linePoint = this.#linePoint;

    // don't forget to normalize to line direction
    this.#element.centerX = linePoint.x + (this.displacementMagnitude * Math.cos(this.displacementDirection + linePoint.direction));
    this.#element.centerY = linePoint.y + (this.displacementMagnitude * Math.sin(this.displacementDirection + linePoint.direction));

    // if the element has a direction property
    if ('direction' in this.#element) {
      this.#element.direction = linePoint.direction;
    }
  }

  drag(x: number, y: number, options?: { dragGroup?: DrawingElementsCollection }): void {
    if (!Number.isFinite(x)) {
      console.error(`The specified drag X value is nonfinite: ${x}.`);
      return;
    } else if (!Number.isFinite(y)) {
      console.error(`The specified drag Y value is nonfinite: ${y}.`);
      return;
    }

    if (options?.dragGroup?.has(this.owner)) {
      // the strung element will move with its owner
      return;
    }

    let dragMagnitude = (x**2 + y**2)**0.5;

    let dragDirection = Math.atan2(y, x);

    let linePoint = this.#linePoint;

    // don't forget to normalize to line direction
    this.displacementX += dragMagnitude * Math.cos(dragDirection - linePoint.direction);
    this.displacementY += dragMagnitude * Math.sin(dragDirection - linePoint.direction);
  }
}
