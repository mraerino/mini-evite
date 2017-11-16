import eventReducer, { EventState } from "./event";
export { EventState };

export interface AppState {
    event: EventState
}
export const initialState: AppState = {
    event: {
        current: {}
    }
};

export const appReducer = {
    event: eventReducer
};

export default appReducer;
