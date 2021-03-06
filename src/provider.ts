import { createProvider } from 'fit-html';
import { applyMiddleware, compose, createStore, combineReducers, Store } from 'redux';
import thunk from 'redux-thunk';
import {
    reducer as routerReducer, middleware as routerMiddleware, enhancer as routerEnhancer,
    initRouting
} from './routing';
import { Location } from '@mraerino/redux-little-router-reactless';
import middlewares from './middlewares';
import { devToolsEnhancer } from 'redux-devtools-extension/logOnlyInProduction';
import { appReducer, AppState, initialState as initialAppState } from './reducer';
import {formReducer, StateWithForm} from "./util/forms";

export interface State extends AppState, StateWithForm {
    router?: Location
}

export const initialState: State = {
    ...initialAppState,
    forms: {}
};

// Create redux store
const store = createStore(
    combineReducers({
        router: routerReducer,
        forms: formReducer,
        ...appReducer
    }),
    initialState,
    compose(routerEnhancer, applyMiddleware(thunk, routerMiddleware, ...middlewares), devToolsEnhancer({}))
);
store.dispatch(initRouting());

const Provider = createProvider(store);
customElements.define('redux-provider', Provider);
