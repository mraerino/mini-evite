import {Action, ActionTypes} from "../actions/types";

export interface EventDataInterface {
    name: string,
    times: {
        starts_at: Date,
        ends_at: Date,
        full_day: boolean
    },
    location: {
        address?: string,
        gmaps_url?: string,
        name: string
    },
    description: string,
    created_by: string,
}
export type EventData = EventDataInterface | null;

export interface EventState {
    current: EventData
}

export const initialState: EventState = {
    current: null
};

export const emptyEvent: EventDataInterface = {
    name: "",
    location: {
        name: ""
    },
    times: {
        starts_at: new Date(0),
        ends_at: new Date(0),
        full_day: false
    },
    description: "",
    created_by: "",
};

export default function eventReducer(
    state: EventState = initialState,
    action: Action
): EventState {
    if(action.type === ActionTypes.FETCH_EVENT_CHANGED) {
        return {
            ...state,
            current: action.payload
        };
    }
    return state;
}
