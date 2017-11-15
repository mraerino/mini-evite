import { connect, html } from './util/defaults';
import { createProvider, ProviderElement } from 'fit-html';
import { TemplateResult } from "lit-html";
import { applyMiddleware, createStore, Store } from 'redux';
import thunk from 'redux-thunk';
import reducer, { State, initialState } from './reducer/main';
import { initRouting, views } from "./actions/route";
import firebase from "@firebase/app";
import "./views/view-home";
import "@polymer/paper-styles/color";

import firebaseConfig from "../firebase.config.js";

// Create redux store
const store = createStore(
    reducer,
    initialState,
    applyMiddleware(thunk)
);
const Provider = createProvider(store);
customElements.define('redux-provider', Provider);

const viewMap = (view: views, props): TemplateResult => {
    return {
        [views.home]: html`<view-home></view-home>`,
        [views.event]: html`<p>Event: ${props.eventId}</p>`,
        [views.invite]: html`<p>Invite: ${props.inviteId}</p>`,
        [views.notFound]: html`<p>Not found!</p>`
    }[view];
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const AppBase = connect(
    state => ({
        view: state.routing.view,
        eventId: state.routing.params.slug || "",
        inviteId: state.routing.params.inviteId || ""
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
        this.getStore().dispatch(initRouting());
    }
}
customElements.define('app-shell', AppView);
