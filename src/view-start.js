import { Element as PolymerElement } from "../node_modules/@polymer/polymer/polymer-element.js";
import "./component-new.js";

export class ViewStart extends PolymerElement {
  static get template() {
    return `
    <component-new></component-new>
    `;
  }
}

customElements.define("view-start", ViewStart);
