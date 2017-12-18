import { push, replace, go, goBack, goForward, replaceRoutes, initializeCurrentLocation } from "@mraerino/redux-little-router-reactless";
import {EventDataActions} from "./event-data";
import {UserDataActions} from "./auth-data";
import {ThunkAction} from "redux-thunk";

export const enum ActionTypes {
    USER_DATA_CHANGED = "USER_DATA_CHANGED",
    FETCH_EVENT_CHANGED = "FETCH_EVENT_CHANGED"
}

export type RouterActions =
    | typeof push
    | typeof replace
    | typeof go
    | typeof goBack
    | typeof goForward
    | typeof replaceRoutes
    | typeof initializeCurrentLocation;

export type Action =
    | RouterActions
    | EventDataActions
    | UserDataActions;

export type ThunkDispatch<R, S, E> = (action: Action | ThunkAction<R, S, E>) => void;
