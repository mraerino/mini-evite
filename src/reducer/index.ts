import eventReducer, { EventState, initialState as initialEvent } from "./event";
import userReducer, { UserState, initialState as initialUser } from "./user";
export { EventState, UserState };

export interface AppState {
    event: EventState,
    user: UserState
}
export const initialState: AppState = {
    event: initialEvent,
    user: initialUser
};

export const appReducer = {
    event: eventReducer,
    user: userReducer
};

export default appReducer;
