import { connect, html } from "../util/defaults";
import "../components/event-detail";

const ViewEvent = connect(
    state => ({}),
    {},
    props => html`
    <event-detail></event-detail>
    `
);
customElements.define('view-event', ViewEvent);
