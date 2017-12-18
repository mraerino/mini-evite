import firebase from "../util/firebase";
import {ThunkAction} from "redux-thunk";
import {State} from "../provider";
import {ActionTypes} from "./types";
import {paramSelector} from "../routing";
import {requireAuth} from "../util/auth";
import {EventData} from "../reducer/event";
import { DateTime as Luxon } from 'luxon';
import slugify from 'slugify';
import {push as navigateTo} from "@mraerino/redux-little-router-reactless/lib";
import shortid from 'shortid';

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

function parseDateTime(date: string, time: string) {
    const datetime = Luxon.fromString(date, "dd.MM.yyyy");
    const timeMatches = time.match(/^([0-2]?\d):([0-5]\d)$/);

    if(timeMatches === null || timeMatches.length < 3 || !datetime.isValid) {
        throw new Error("Invalid Parameters");
    }

    return datetime.set({ hour: timeMatches[1], minute: timeMatches[2] });
}

export function createEvent(): ThunkAction<Promise<void>, State, void> {
    return async (dispatch, getState) => {
        await requireAuth();

        const form = getState().forms['event-new'];
        if(!form.valid) {
            return;
        }

        const {fields} = form;
        const startDate = parseDateTime(fields.startDate.storedValue, fields.startTime.storedValue);
        const event: EventData = {
            name: fields.name.storedValue as string,
            location: {
                name: fields.location.storedValue as string
            },
            description: fields.description.storedValue as string,
            times: {
                starts_at: startDate.toJSDate(),
                ends_at: parseDateTime(fields.endDate.storedValue, fields.endTime.storedValue).toJSDate(),
                full_day: fields.fullDay.storedValue as boolean
            }
        };

        const slug = `${shortid()}-${startDate.toFormat("yyyy-MM-dd")}-${slugify(event.name)}`;

        await firebase.firestore().collection("events").doc(slug).set(event);

        dispatch(navigateTo(`/${slug}`, {}));
    }
}
