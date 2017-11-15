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
      @import url('https://fonts.googleapis.com/css?family=Roboto:400,700');
    
      :host {
        --primary: var(--google-blue-500);
        font-family: 'Roboto', sans-serif;
      }
    </style>
    <h1>Mini Evite</h1>
    ${viewMap(props.view, props)}
    `
);

class AppView extends AppBase {
    connectedCallback() {
        super.connectedCallback();
        this.getStore().dispatch(initAuth());
    }
}

customElements.define('app-shell', AppView);
