export class DrawingElementMock {
  constructor() {
    this.domNode = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  }

  get centerX() {
    return Number.parseFloat(this.domNode.getAttribute('cx'));
  }

  set centerX(centerX) {
    this.domNode.setAttribute('cx', `${centerX}`);
  }

  get centerY() {
    return Number.parseFloat(this.domNode.getAttribute('cy'));
  }

  set centerY(centerY) {
    this.domNode.setAttribute('cy', `${centerY}`);
  }

  direction = 0;
}
