import { firebase, firebaseNS } from "../util/firebase";
import {ThunkAction} from "redux-thunk";
import {State} from "../provider";
import {ActionTypes} from "./types";
import {CurrentFirebaseUser} from "../reducer/user";

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
    payload: CurrentFirebaseUser
}
export function userDataResult(user: CurrentFirebaseUser): UserDataResultAction {
    return {
        type: ActionTypes.USER_DATA_CHANGED,
        payload: user
    }
}
