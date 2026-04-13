# Installation

With `npm`:

```
npm install @rnacanvas/draw.strung
```

# Usage

All exports of this package can be accessed as named imports.

```javascript
// an example import
import { StrungElement } from '@rnacanvas/draw.strung';
```

## `class StrungElement`

A strung element
(e.g., a triangle strung on a bond).

```javascript
var triangle = Triangle.create();

// any bond (e.g., a primary or secondary bond)
var owner;

// will move with the parent bond
var strungElement = new StrungElement(triangle, owner);

// the point of connection on the line of the parent bond
// (relative to the midpoint of the bond)
strungElement.lineX = 25;

// displacement from the line of the parent bond
strungElement.displacementX = 10;
strungElement.displacementY = 20;
```

For an element to be "stringable",
it must fulfill the following interfaces.

```typescript
interface DrawingElement {
  /**
   * The DOM node corresponding to the drawing element.
   */
  readonly domNode: SVGElement;
}
```

```typescript
interface Centerable {
  /**
   * Center X coordinate.
   */
  centerX: number;

  /**
   * Center Y coordinate.
   */
  centerY: number;
}
```

Stringable elements may optionally fulfill `Directed` interface below
if they have direction associated with them
(e.g., triangles, rectangles).

```typescript
interface Directed {
  /**
   * Direction angle (in radians).
   */
  direction: number;
}
```

### `readonly owner`

The element owning a strung element
(e.g., a primary or secondary bond).

```javascript
var rectangle = Rectangle.create();

// any bond (e.g., a primary or secondary bond)
var owner;

var strungElement = new StrungElement(rectangle, owner);

strungElement.owner === owner; // true
```

Owner elements must fulfill the `Linear` interface below.

```typescript
interface Linear {
  readonly length: number;

  /**
   * Returns information regarding a point at a given length along the line.
   */
  atLength(length: number): {
    // X coordinate
    readonly x: number;

    // Y coordinate
    readonly y: number;

    // direction angle (in radians)
    readonly direction: number;
  };

  /**
   * For listening for when the owner element moves.
   */
  addEventListener(name: 'change', listener: () => void): void;
}
```

Owner elements must also fulfill the `DrawingElement` interface below
(which is implemented by all RNAcanvas drawing elements).

```typescript
interface DrawingElement {
  readonly domNode: SVGElement;
}
```

### `readonly domNode`

The DOM node corresponding to the strung element.

Is the same as the DOM node corresponding to the wrapped "stringable" element.

```javascript
var circle = Circle.create();

// any bond (e.g., a primary or secondary bond)
var owner;

var strungElement = new StrungElement(circle, owner);

strungElement.domNode === circle.domNode; // true
```

### `lineX`

The length along the owner element (relative to the midpoint of the owner)
at which the strung element is attached.

```javascript
var text = Text.create('A');

// any bond (e.g., a primary or secondary bond)
var owner;

var strungElement = new StrungElement(text, owner);

// place at the midpoint of the owner bond
strungElement.lineX = 0;

// place 10 pixels past the midpoint of the owner bond
strungElement.lineX = 10;

// place 10 pixels before the midpoint of the owner bond
strungElement.lineX = -10;
```

### `displacementMagnitude`

The magnitude of the strung element's displacement from the line of its owner element.

```javascript
var circle = Circle.create();

// any bond (e.g., a primary or secondary bond)
var owner;

var strungElement = new StrungElement(circle, owner);

// place at the midpoint of the owner bond
strungElement.lineX = 0;

// place 10 pixels away from the midpoint of the owner bond
// (at a 90 degree angle)
strungElement.displacementMagnitude = 10;
strungElement.displacementDirection = Math.PI / 2;
```

### `displacementDirection`

The direction (in radians) of the strung element's displacement from the line of its owner element.

<b>Note that displacement X component is expressed relative to the direction of the owner element line
at the point where the strung element is attached.</b>

```javascript
var circle = Circle.create();

// any bond (e.g., a primary or secondary bond)
var owner;

var strungElement = new StrungElement(circle, owner);

// place at the midpoint of the owner bond
strungElement.lineX = 0;

// place 10 pixels away from the midpoint of the owner bond
// (at a 90 degree angle)
strungElement.displacementMagnitude = 10;
strungElement.displacementDirection = Math.PI / 2;
```

### `displacementX`

The X component of the strung element's displacement from the line of its owner element.

<b>Note that displacement X component is expressed relative to the direction of the owner element line
at the point where the strung element is attached.</b>

```javascript
var triangle = Triangle.create();

// any bond (e.g., a primary or secondary bond)
var owner;

var strungElement = new StrungElement(triangle, owner);

// place at the midpoint of the owner bond
strungElement.lineX = 0;

// place 10 pixels away from the midpoint of the owner bond
// (at a 90 degree angle)
strungElement.displacementX = 10 / 2**0.5;
strungElement.displacementY = 10 / 2**0.5;
```

### `displacementY`

The Y component of the strung element's displacement from the line of its owner element.

<b>Note that displacement Y component is expressed relative to the direction of the owner element line
at the point where the strung element is attached.</b>

```javascript
var triangle = Triangle.create();

// any bond (e.g., a primary or secondary bond)
var owner;

var strungElement = new StrungElement(triangle, owner);

// place at the midpoint of the owner bond
strungElement.lineX = 0;

// place 10 pixels away from the midpoint of the owner bond
// (at a 90 degree angle)
strungElement.displacementX = 10 / 2**0.5;
strungElement.displacementY = 10 / 2**0.5;
```

### `drag()`

Move the strung element by the specified X and Y amounts.

<b>X and Y amounts are expressed in absolute terms
(i.e., not relative to the owner element line).</b>

```javascript
var rectangle = Rectangle.create();

// any bond (e.g., a primary or secondary bond)
var owner;

var strungElement = new StrungElement(rectangle, owner);

// place at the midpoint of the owner bond
strungElement.lineX = 0;

strungElement.displacementX = 0;
strungElement.dispalcementY = 0;

// owner bond direction is 45 degrees
owner.direction; // Math.PI / 4

// drag at a 90 degree angle to the direction of the owner bond
strungElement.drag(10, -10);

strungElement.displacementX; // 10 * 2**0.5
strungElement.displacementY; // 0
```

Often times elements are dragged as part of a group.

If the owner element of a strung element is part of this group,
then the displacement of a strung element should not be modified
(i.e., the strung element should be allowed to move with its owner element).

To accomplish this behavior, one can make use of the `dragGroup` option
when invoking the `drag()` method.

```javascript
var rectangle = Rectangle.create();

// any bond (e.g., a primary or secondary bond)
var owner;

var strungElement = new StrungElement(rectangle, owner);

strungElement.displacementX = 0;
strungElement.dispalcementY = 0;

// includes the owner bond
var dragGroup = {
  has: ele => ele === owner || ele === owner.domNode,
};

strungElement.drag(10, -10, { dragGroup });

// displacement not changed
strungElement.displacementX; // 0
strungElement.dispalcementY; // 0
```

Drag groups must fulfill the following interface.

```typescript
interface DrawingElementsCollection {
  /**
   * Should return true for either a drawing element itself
   * or its corresponding DOM node.
   */
  has(ele: DrawingElement | Node): boolean;
}
```
