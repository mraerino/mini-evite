import { push, replace, go, goBack, goForward, replaceRoutes, initializeCurrentLocation } from "redux-little-router-reactless";
import {EventDataActions} from "./event-data";
import {UserDataActions} from "./auth-data";

export enum ActionTypes {
    USER_DATA_RESULT = "USER_DATA_RESULT",
    FETCH_EVENT_RESULT = "FETCH_EVENT_RESULT"
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
    | RouterActions
    | EventDataActions
    | UserDataActions;
