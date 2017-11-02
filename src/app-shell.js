import { Element as PolymerElement } from "../node_modules/@polymer/polymer/polymer-element.js";
import Navigo from "../node_modules/navigo/src/index.js";
import "../node_modules/@polymer/paper-styles/color.js";
import "../node_modules/@polymer/iron-pages/iron-pages.js";

import firebaseConfig from "../firebase.config.js";
import "./view-start.js";
import "./view-single.js";
import "./view-login.js";

export class AppShell extends PolymerElement {
  constructor() {
    super();

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    // Create Routing
    const rx = arg => {
      return (params => {
        params = params || {};
        this.setProperties({
          routeParams: params,
          currentView: arg
        });
      });
    };

    this._router = new Navigo(location.origin)
      .on({
        '/': rx('start'),
        '/login': rx('login'),
        '/:eventId': rx('event-single'),
      })
      .notFound(rx("404"));
  }

  connectedCallback() {
    super.connectedCallback();

    // Initialize Firebase
    firebase.auth().getRedirectResult().catch(err => console.log("Login/Signup failed with", err));

    // resolve route
    this._router.resolve();
  }

  static get properties() {
    return {
      currentView: {
        type: String
      },
      routeParams: {
        type: Object
      }
    };
  }

  static get template() {
    return `
    <style>
      @import url('https://fonts.googleapis.com/css?family=Roboto:400,700');
    
      :host {
        --primary: var(--google-blue-500);
        font-family: 'Roboto', sans-serif;
      }
    </style>
    <iron-pages selected="[[ currentView ]]" attr-for-selected="view">
      <view-start view="start"></view-start>
      <view-login view="login"></view-login>
      <view-single view="event-single" event-id="[[ routeParams.eventId ]]"></view-single>
    </iron-pages>
    `
  }
}

customElements.define("app-shell", AppShell);
