import { ActionTypes, ActionTypeKeys } from '../actions/types';
import { views } from "../actions/route";
import { combineReducers, Reducer } from "redux";

export interface RoutingState {
    view: views,
    params: Object
}

export interface State {
    routing: RoutingState
}

export const initialState: State = {
    routing: {
        view: views.notFound,
        params: {}
    }
};

const reducer: Reducer<State> = combineReducers({
    routing: (state: RoutingState, action: ActionTypes): RoutingState => {
        switch(action.type) {
            case ActionTypeKeys.SET_VIEW:
                return {
                    ...state,
                    view: action.payload.view,
                    params: action.payload.params
                };
            default:
                return state || initialState.routing;
        }
    }
});
export default reducer;
