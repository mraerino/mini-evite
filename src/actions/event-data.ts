import firebase from "../util/firebase";
import {ThunkAction} from "redux-thunk";
import {State} from "../provider";
import {ActionTypes} from "./types";
import {paramSelector} from "../routing";
import {requireAuth} from "../util/auth";
import {EventData} from "../reducer/event";

export type EventDataActions =
    | FetchEventResultAction

let dataUnsubscribe: (() => void) | null = null;
export function fetchEvent(): ThunkAction<void, State, void> {
    return async (dispatch, getState) => {
        await requireAuth();

        // unregister former listener
        if(dataUnsubscribe) {
            dataUnsubscribe();
            dataUnsubscribe = null;
        }

        const eventId = paramSelector(getState(), 'slug');
        if(eventId === "") {
            return;
        }

        dataUnsubscribe = firebase.firestore().collection("events").doc(eventId)
            .onSnapshot(snap => dispatch(fetchEventResult(snap.exists ? snap.data() : {})));
    }
}

export interface FetchEventResultAction {
    type: ActionTypes.FETCH_EVENT_CHANGED,
    payload: EventData
}

export function fetchEventResult(data: EventData): FetchEventResultAction {
    return {
        type: ActionTypes.FETCH_EVENT_CHANGED,
        payload: data
    }
}
