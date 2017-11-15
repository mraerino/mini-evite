import { push, replace, go, goBack, goForward, replaceRoutes, initializeCurrentLocation } from "redux-little-router-reactless";

export enum ActionTypes {
}

export type RouterActions =
    | typeof push
    | typeof replace
    | typeof go
    | typeof goBack
    | typeof goForward
    | typeof replaceRoutes
    | typeof initializeCurrentLocation;

export type Actions =
    | RouterActions;
