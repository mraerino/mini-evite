import firebase from "../util/firebase";
import {ThunkAction} from "redux-thunk";
import {State} from "../provider";
import {ActionTypes} from "./types";
import {paramSelector} from "../routing";
import {requireAuth} from "../util/auth";

export type EventDataActions =
    | FetchEventResultAction

export interface EventDataInterface {
    name: String,
    times: {
        starts_at: Date,
        ends_at: Date,
        full_day: boolean
    },
    location: {
        address?: String,
        gmaps_url?: String,
        name: String
    }
}
export type EventData = EventDataInterface | {};

let dataUnsubscribe: (() => void) | null = null;
export function fetchEvent(): ThunkAction<void, State, void> {
    return (dispatch, getState) => {
        requireAuth().then(() => {
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
        });
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
