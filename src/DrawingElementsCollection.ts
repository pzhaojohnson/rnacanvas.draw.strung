import type { DrawingElement } from './DrawingElement';

export interface DrawingElementsCollection {
  /**
   * One can input either drawing element objects or corresponding DOM node objects
   * and check if they are part of the collection.
   */
  has(ele: DrawingElement | Node): boolean;
}
