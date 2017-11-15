import Navigo from 'navigo';
import { ThunkAction } from 'redux-thunk';
import { ActionTypeKeys } from './types';
import { State } from "../reducer/main";

console.debug("Loading routing. See if duplication");

export type ActionTypes =
    | SetViewAction;

export enum views {
    home,
    event,
    invite,
    notFound
}

const router = new Navigo(location.origin);
export function initRouting(): ThunkAction<void, State, void> {
    return dispatch => {
        router
            .on({
                '/': () => dispatch(setView(views.home)),
                '/:slug': params => dispatch(setView(views.event, params)),
                '/:slug/:inviteId': params => dispatch(setView(views.invite, params)),
            })
            .notFound(() => dispatch(setView(views.notFound)))
            .resolve();
    };
}

export interface SetViewAction {
    type: ActionTypeKeys.SET_VIEW,
    payload: {
        view: views,
        params: Object
    }
}
function setView(view: views, params = {}): SetViewAction {
    return {
        type: ActionTypeKeys.SET_VIEW,
        payload: { view, params }
    }
}

export function navigateTo(path): ThunkAction<void, State, void> {
    return () => {
        router.navigate(path);
    }
}
