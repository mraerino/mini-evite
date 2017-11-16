import { connect, html } from './util/defaults';
import { TemplateResult } from "lit-html";
import { views, resultSelector } from "./routing";
import { initAuth } from "./actions/auth-data";
import "./provider"
import "./util/firebase";
import "./views/view-home";
import "./views/view-event";
import "@polymer/paper-styles/color";

const viewMap = (view: views, props): TemplateResult => {
    return {
        [views.home]: html`<view-home></view-home>`,
        [views.event]: html`<view-event></view-event>`,
        [views.invite]: html`<p>Invite: ${props.inviteId}</p>`,
        [views.notFound]: html`<p>Not found!</p>`
    }[view];
};

const AppBase = connect(
    state => ({
        view: resultSelector(state, 'view', views.notFound)
    }),
    {},
    props => html`
    <style>
      :host {
        --primary: var(--google-blue-500);
        font-family: 'Roboto', sans-serif;

        display: flex;
        flex-direction: column;
        background-image: url('https://source.unsplash.com/S2YssLw97l4/1000');
        background-size: cover;
        background-position: center;
        min-height: 100vh;
      }

      header {
        margin-bottom: 20px;
      }

      h1 {
        font-family: 'Yellowtail', cursive;
        margin: 10px 30px;
        color: white;
        opacity: 0.8;
        font-size: 50px;
        text-align: left;
      }

      main {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
    </style>

    <header>
        <h1>Mini Evite</h1>
    </header>

    <main>
        ${viewMap(props.view, props)}
    </main>
    `
);

class AppView extends AppBase {
    connectedCallback() {
        super.connectedCallback();
        this.getStore().dispatch(initAuth());
    }
}

customElements.define('app-shell', AppView);
