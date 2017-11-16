import {Action, ActionTypes} from "../actions/types";
import {firebaseNS} from "../util/firebase";

export type CurrentFirebaseUser = firebaseNS.User | null;

export interface UserState {
    fromFirebase: CurrentFirebaseUser
}

export const initialState: UserState = {
    fromFirebase: null
};

export default function userReducer(
    state: UserState = initialState,
    action: Action
): UserState {
    if(action.type === ActionTypes.USER_DATA_CHANGED) {
        return {
            ...state,
            fromFirebase: action.payload === null ? null : action.payload.toJSON()
        }
    }
    return state;
}
