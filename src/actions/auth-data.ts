import { firebase, firebaseNS } from "../util/firebase";
import {ThunkAction} from "redux-thunk";
import {State} from "../provider";
import {ActionTypes} from "./types";

export type UserDataActions =
    | UserDataResultAction;

let authUnsubscribe = () => {};
export function initAuth(): ThunkAction<void, State, void> {
    return dispatch => {
        authUnsubscribe();
        authUnsubscribe = firebase.auth().onAuthStateChanged(user => dispatch(userDataResult(user)));
    }
}

export interface UserDataResultAction {
    type: ActionTypes.USER_DATA_CHANGED,
    payload: firebaseNS.User | null
}
export function userDataResult(user: firebaseNS.User | null): UserDataResultAction {
    return {
        type: ActionTypes.USER_DATA_CHANGED,
        payload: user
    }
}
