import { connect, html } from "../util/defaults";
import "../components/event-new";

const ViewHome = connect(
    state => {

    },
    {},
    props => html`
    <h2>Welcome Home</h2>
    <event-new></event-new>
    `
);
customElements.define('view-home', ViewHome);
