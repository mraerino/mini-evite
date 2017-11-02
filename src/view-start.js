import { Element as PolymerElement } from "../node_modules/@polymer/polymer/polymer-element.js";

export class ViewStart extends PolymerElement {
  static get template() {
    return `
    Hallo Welt
    `;
  }
}

customElements.define("view-start", ViewStart);
