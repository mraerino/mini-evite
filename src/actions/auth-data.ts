import { firebase, firebaseNS } from "../util/firebase";
import {ThunkAction} from "redux-thunk";
import {State} from "../provider";
import {ActionTypes} from "./types";

export type UserDataActions =
    | UserDataResultAction;

export function initAuth(): ThunkAction<void, State, void> {
    return dispatch => {
        firebase.auth().signInAnonymously().catch(error => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error(errorMessage);
            // todo: dispatch as toast
        });

        firebase.auth().onAuthStateChanged(user => dispatch(userDataResult(user)));
    }
}

export interface UserDataResultAction {
    type: ActionTypes.USER_DATA_RESULT,
    payload: firebaseNS.auth.User | null
}
export function userDataResult(user: firebaseNS.auth.User | null): UserDataResultAction {
    return {
        type: ActionTypes.USER_DATA_RESULT,
        payload: user
    }
}
