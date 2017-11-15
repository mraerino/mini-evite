import { Element as PolymerElement } from "../node_modules/@polymer/polymer/polymer-element.js";
import { importHref } from "../node_modules/@polymer/polymer/lib/utils/import-href.js";
import "../node_modules/@polymer/paper-item/paper-icon-item.js";
import "../node_modules/@polymer/paper-item/paper-item-body.js";
import "../node_modules/@polymer/iron-icon/iron-icon.js";
import "../node_modules/@polymer/iron-icons/iron-icons.js";
import "../node_modules/@polymer/paper-card/paper-card.js";
import "../node_modules/@polymer/paper-button/paper-button.js";
import "../node_modules/@polymer/paper-input/paper-input.js";
import "../node_modules/@polymer/paper-toggle-button/paper-toggle-button.js";

export class ComponentNew extends PolymerElement {
  constructor() {
    super();
  }

  static get template() {
    return `
    <style>
      :host {
        display: block;
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
      }
      
      paper-card {
        display: block;
      }
      
      .card-heading {
        padding: 15px;
        background-color: var(--primary);
      }
      
      .card-heading paper-input {
        --paper-input-container-input: {
          color: white;
          font-size: 24px;
        };
        --paper-input-container-label: {
          color: rgba(255,255,255,0.8);
          font-size: 24px;
        };
        --paper-input-container-underline: {
          border-bottom-color: rgba(255,255,255,0.8);
        };
        --paper-input-container-underline-focus: {
          border-bottom-color: white;
        };
      }
      
      .datetime paper-item-body {
        display: flex;
        min-height: 26px;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
      }
      
      #toggle-fullday {
        margin-left: auto;
        padding: 3px;
      }
      
      .datetime label {
        flex: 1;
      }
      
      .datetime paper-input {
        flex: 3;
        margin-left: 30px;
      }
    </style>

    <paper-card id="eventDetails">
      <div class="card-heading">
        <paper-input no-label-float label="Event Title"></paper-input>
      </div>
      <div class="card-content">
        <div role="listbox">
          <paper-icon-item class="datetime">
            <iron-icon icon="schedule" slot="item-icon"></iron-icon>
            <paper-item-body>
                <label for="toggle-fullday">Ganztägig</label>
                <paper-toggle-button id="toggle-fullday"></paper-toggle-button>              
            </paper-item-body>
          </paper-icon-item>
          <paper-icon-item class="datetime">
            <paper-item-body>
                <label>Von</label>
                <paper-input label="DD.MM.YYYY" no-label-float></paper-input>
                <paper-input label="HH:MM" no-label-float></paper-input>
            </paper-item-body>
          </paper-icon-item>
          <paper-icon-item class="datetime">
            <paper-item-body>
                <label>Bis</label>
                <paper-input label="DD.MM.YYYY" no-label-float></paper-input>
                <paper-input label="HH:MM" no-label-float></paper-input>
            </paper-item-body>
          </paper-icon-item>
          <paper-icon-item>
            <iron-icon icon="room" slot="item-icon">
            </iron-icon>
            <paper-item-body>
              <paper-input label="Location" no-label-float></paper-input>
            </paper-item-body>
          </paper-icon-item>
        </div>
      </div>
    </paper-card>
    `;
  }
}

customElements.define('component-new', ComponentNew);
