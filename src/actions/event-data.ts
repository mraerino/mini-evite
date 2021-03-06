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
import {resetForm} from "../util/forms";

export type EventDataActions =
    | FetchEventResultAction

const getCollection = () => firebase.firestore().collection("events");

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

        dataUnsubscribe = getCollection().doc(eventId)
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

function parseDateTime(date: string, time: string, fullDay: boolean = false) {
    const datetime = Luxon.fromString(date, "dd.MM.yyyy");
    if(fullDay) {
        return datetime;
    }

    const timeMatches = time.match(/^([0-2]?\d):([0-5]\d)$/);

    if(timeMatches === null || timeMatches.length < 3 || !datetime.isValid) {
        throw new Error("Invalid Parameters");
    }

    return datetime.set({ hour: timeMatches[1], minute: timeMatches[2] });
}

export function createEvent(): ThunkAction<Promise<void>, State, void> {
    return async (dispatch, getState: () => State) => {
        await requireAuth();

        const form = getState().forms['event-new'];
        if(!form.valid) {
            return;
        }

        const {fields} = form;
        const startDate = parseDateTime(
            fields.startDate.storedValue,
            fields.startTime.storedValue,
            fields.fullDay.storedValue
        );
        const endDate = parseDateTime(
            fields.endDate.storedValue,
            fields.endTime.storedValue,
            fields.fullDay.storedValue
        );
        const event: EventData = {
            name: fields.name.storedValue as string,
            location: {
                name: fields.location.storedValue as string
            },
            description: fields.description.storedValue as string,
            times: {
                starts_at: startDate.toJSDate(),
                ends_at: endDate.toJSDate(),
                full_day: fields.fullDay.storedValue as boolean
            },
            created_by: getState().user.fromFirebase.uid,
        };

        const slug = `${shortid()}-${startDate.toFormat("yyyy-MM-dd")}-${slugify(event.name)}`;

        await getCollection().doc(slug).set(event);

        dispatch(navigateTo(`/${slug}`, {}));
        dispatch(resetForm('event-new'));
    }
}
