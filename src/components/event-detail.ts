import {connect, html} from "../util/defaults";
import {paramSelector} from "../routing";

const EventDetail = connect(
    state => ({
        eventId: paramSelector(state, "slug")
    }),
    {},
    props => html`
    <p>ID: ${props.eventId}</p>
    `
);
customElements.define('event-detail', EventDetail);
