import { createProvider } from 'fit-html';
import { applyMiddleware, compose, createStore, combineReducers, Store } from 'redux';
import thunk from 'redux-thunk';
import {
    reducer as routerReducer, middleware as routerMiddleware, enhancer as routerEnhancer,
    initRouting
} from './routing';
import { Location } from 'redux-little-router-reactless';
import { devToolsEnhancer } from 'redux-devtools-extension/logOnlyInProduction';

export interface State {
    router?: Location
}

export const initialState: State = {
};

// Create redux store
const store = createStore(
    combineReducers({
        router: routerReducer
    }),
    initialState,
    compose(routerEnhancer, applyMiddleware(thunk, routerMiddleware), devToolsEnhancer({}))
);
store.dispatch(initRouting());

const Provider = createProvider(store);
customElements.define('redux-provider', Provider);
