import { Element as PolymerElement } from "../node_modules/@polymer/polymer/polymer-element.js";
import "../node_modules/@polymer/paper-item/paper-icon-item.js";
import "../node_modules/@polymer/paper-item/paper-item-body.js";
import "../node_modules/@polymer/iron-icon/iron-icon.js";
import "../node_modules/@polymer/iron-icons/iron-icons.js";
import "../node_modules/@polymer/iron-icons/social-icons.js";
import "../node_modules/@polymer/paper-card/paper-card.js";
import "../node_modules/@polymer/paper-button/paper-button.js";

export class ViewSingle extends PolymerElement {
  constructor() {
    super();

    this._db = firebase.firestore;
    this._eventSub = null;
  }

  static get properties() {
    return {
      eventId: {
        type: String,
        observer: 'setupListeners'
      },
      eventData: {
        type: Object
      }
    }
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
      
      paper-icon-item#guest_avatars {
        --paper-item-icon: {
          align-self: flex-start;
          margin-top: 15px;
        };
      }
      
      #eventDetails {
        --paper-card-header: {
          background-color: var(--primary);
        };
        --paper-card-header-color: white;
        margin-bottom: 40px;
      }
      
      .avatar {
        border-radius: 50%;
        height: 50px;
      }
      
      .card-actions {
        display: flex;
        justify-content: flex-end;
      }
      
      .card-actions p {
        margin: 0 auto 0 0;
        align-self: center;
      }
      
      .card-actions paper-button {
        min-width: 0;
      }

      .card-actions paper-button[selected] {
        color: var(--primary);
      }
    </style>
    <paper-card heading="[[ eventData.name ]]" id="eventDetails">
      <div class="card-content">
        <div role="listbox">
          <paper-icon-item>
            <iron-icon icon="schedule" slot="item-icon"></iron-icon>
            <paper-item-body>
              [[ eventData.starts_at ]]
            </paper-item-body>
          </paper-icon-item>
          <paper-icon-item>
            <iron-icon icon="room" slot="item-icon">
            </iron-icon>
            <paper-item-body two-line>
              <div>[[ eventData.location.name ]]</div>
              <div secondary>[[ eventData.location.address ]]</div>
            </paper-item-body>
          </paper-icon-item>
          <paper-icon-item id="guest_avatars">
            <iron-icon icon="social:group" slot="item-icon">
            </iron-icon>
            <paper-item-body>
                <p>3 guests</p>
                <div class="avatars">
                  <img class="avatar" src="https://loremflickr.com/100/100?1" />
                  <img class="avatar" src="https://loremflickr.com/100/100?2" />
                  <img class="avatar" src="https://loremflickr.com/100/100?3" />
                </div>
            </paper-item-body>
          </paper-icon-item>
        </div>
      </div>
      <div class="card-actions">
        <p>RSVP</p>
        <paper-button selected>Yes</paper-button>
        <paper-button>Maybe</paper-button>
        <paper-button>No</paper-button>
      </div>
    </paper-card>
    
    <h2>Discussion</h2>
    <paper-card>
      <div class="card-content"></div>
    </paper-card>
    `;
  }

  setupListeners(eventId) {
    if(this._eventSub) {
      this._eventSub.unsubscribe();
      this._eventSub = null;
    }

    if(!eventId) {
      return;
    }

    this._eventSub = this._db().collection("events").doc(eventId)
      .onSnapshot(snap => this.eventData = snap.exists ? snap.data() : {});
  }
}

customElements.define("view-single", ViewSingle);
