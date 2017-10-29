import { Element as PolymerElement } from "../node_modules/@polymer/polymer/polymer-element.js";

export class EviStart extends PolymerElement {
  static get template() {
    return `
    [[ eventData.name ]]
    `;
  }
}

customElements.define("evi-start", EviStart);
