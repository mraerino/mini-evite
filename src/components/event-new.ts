import {connect, html} from "../util/defaults";
import "@polymer/paper-button/paper-button";
import "@polymer/paper-card/paper-card";
import "@polymer/paper-item/paper-icon-item";
import "@polymer/paper-item/paper-item-body";
import "@polymer/paper-input/paper-input";
import "@polymer/paper-input/paper-textarea";
import "@polymer/iron-icon/iron-icon";
import "@polymer/iron-icons/iron-icons";
import "@polymer/paper-toggle-button/paper-toggle-button";
import "@webcomponents/shadycss/entrypoints/apply-shim";
import "@polymer/polymer/lib/elements/custom-style";

const EventNew = connect(
    state => {
    },
    {},
    props => html`
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
      
      .description {
        align-items: flex-start;
        padding-top: 5px;
      }
      
      .description iron-icon {
        margin-top: 10px;
      }
      
      .card-actions {
        display: flex;
        justify-content: flex-end;
        background-color: var(--primary);
      }
      
      .card-actions paper-button {
        color: white;
      }
    </style>
    <custom-style>
        <style>
          .card-heading paper-input {
            --paper-input-container-input: {
              color: white;
              font-size: 24px;
            }
            --paper-input-container-label: {
              color: rgba(255,255,255,0.8);
              font-size: 24px;
            }
            --paper-input-container-underline: {
              border-bottom-color: rgba(255,255,255,0.8);
            }
            --paper-input-container-underline-focus: {
              border-bottom-color: white;
            }
          }
        </style>
    </custom-style>

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
          <paper-icon-item class="description">
            <iron-icon icon="subject" slot="item-icon"></iron-icon>
            <paper-item-body>
              <paper-textarea label="Beschreibung" no-label-float></paper-textarea>
            </paper-item-body>
          </paper-icon-item>
        </div>
      </div>
      <div class="card-actions">
        <paper-button>Erstellen</paper-button>
      </div>
    </paper-card>
    `
);
customElements.define('event-new', EventNew);
