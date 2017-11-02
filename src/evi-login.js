import {Element as PolymerElement} from "../node_modules/@polymer/polymer/polymer-element.js";
import { GestureEventListeners } from "../node_modules/@polymer/polymer/lib/mixins/gesture-event-listeners.js"
import "../node_modules/@polymer/paper-button/paper-button.js";

export class EviLogin extends GestureEventListeners(PolymerElement) {
  constructor() {
    super();
  }

  connectedCallback() {
    this._provider = new firebase.auth.GoogleAuthProvider();
  }

  static get properties() {
    return {}
  }

  static get template() {
    return `
    <paper-button on-tap="login">
      Login with Google
    </paper-button>
    `;
  }

  login() {
    firebase.auth().signInWithRedirect(this._provider);
  }
}

customElements.define('evi-login', EviLogin);
