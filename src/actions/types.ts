import { ActionTypes as RouteTypes } from "./route";

export enum ActionTypeKeys {
    SET_VIEW = "SET_VIEW"
}

export type ActionTypes =
    | RouteTypes;
