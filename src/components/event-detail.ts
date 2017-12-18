import {connect, html} from "../util/defaults";
import {State} from "../provider";
import {emptyEvent, EventDataInterface} from "../reducer/event";
import "@webcomponents/shadycss/entrypoints/apply-shim";
import "@polymer/polymer/lib/elements/custom-style";
import "@polymer/paper-item/paper-icon-item";
import "@polymer/paper-item/paper-item-body";
import "@polymer/iron-icon/iron-icon";
import "@polymer/iron-icons/iron-icons";
import "@polymer/iron-icons/social-icons";
import "@polymer/paper-card/paper-card";
import "@polymer/paper-button/paper-button";

export interface viewProps {
    data: EventDataInterface
}

const EventDetail = connect(
    (state: State): viewProps => ({
        data: state.event.current || emptyEvent
    }),
    {},
    (props: viewProps) => html`
    <style>
      :host {
        display: block;
        max-width: 600px;
        margin: 0 auto;
      }

      paper-card {
        display: block;
      }

      .card-content {
        padding: 16px 0;
      }

      .avatar {
        border-radius: 50%;
        height: 50px;
        margin: 0 5px;
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
    <custom-style>
      <style>
        #guest_avatars {
          --paper-item-icon: {
            align-self: flex-start;
            margin-top: 15px;
          };
          padding-bottom: 16px;
        }

        #eventDetails {
          --paper-card-header: {
            background-color: var(--primary);
          };
          --paper-card-header-color: white;
          margin-bottom: 40px;
        }
      </style>
    </custom-style>
    <paper-card heading="${props.data.name}" id="eventDetails" elevation="4">
      <div class="card-content">
        <div role="listbox">
          <paper-icon-item>
            <iron-icon icon="schedule" slot="item-icon"></iron-icon>
            <paper-item-body>
              ${props.data.times.starts_at}
            </paper-item-body>
          </paper-icon-item>
          <paper-icon-item>
            <iron-icon icon="room" slot="item-icon">
            </iron-icon>
            <paper-item-body two-line>
              <div>${props.data.location.name}</div>
              <div secondary>${props.data.location.address}</div>
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
          ${props.data.description
            ? html`
                <paper-icon-item>
                  <iron-icon icon="subject" slot="item-icon">
                  </iron-icon>
                  <paper-item-body>
                      <p>${props.data.description}</p>
                  </paper-item-body>
                </paper-icon-item>`
            : null}
        </div>
      </div>
      <div class="card-actions">
        <p>RSVP</p>
        <paper-button selected>Yes</paper-button>
        <paper-button>Maybe</paper-button>
        <paper-button>No</paper-button>
      </div>
    </paper-card>
    `
);
customElements.define('event-detail', EventDetail);
