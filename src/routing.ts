import { routerForBrowser, initializeCurrentLocation, Routes } from "@mraerino/redux-little-router-reactless";
import { ThunkAction } from "redux-thunk";
import { State } from "./provider";

export enum views {
    home,
    event,
    invite,
    notFound
}

const routes: Routes = {
    '/': {
        view: views.home,
        title: "Home"
    },
    '/:slug': {
        view: views.event,
        title: "Event"
    },
    '/:slug/:inviteId': {
        view: views.invite,
        title: "Invite"
    },
};

export const {
    reducer,
    middleware,
    enhancer
} = routerForBrowser({ routes });

export function initRouting(): ThunkAction<void, State, void> {
    return (dispatch, getState) => {
        console.log("dispatching init action");
        const initialLocation = getState().router;
        dispatch(initializeCurrentLocation(initialLocation));
    }
}

export function paramSelector(state: State, key: string, fallback: string = ""): string {
    return state && state.router && state.router.params && key in state.router.params ? state.router.params[key] : fallback;
}

export function resultSelector(state: State, key: string, fallback: any = {}): any {
    return state && state.router && state.router.result && key in state.router.result ? state.router.result[key] : fallback;
}
