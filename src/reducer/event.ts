import {Action, ActionTypes} from "../actions/types";

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

export interface EventState {
    current: EventData
}

export const initialState: EventState = {
    current: {}
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
