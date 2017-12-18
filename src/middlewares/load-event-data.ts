import { LOCATION_CHANGED } from "@mraerino/redux-little-router-reactless";
import { fetchEvent } from "../actions/event-data";
import {paramSelector} from "../routing";

let lastSlug = "";
export default store => next => action => {
    if(action.type !== LOCATION_CHANGED) {
        return next(action);
    }

    const {slug} = action.payload.params;
    if(slug !== lastSlug) {
        lastSlug = slug;
        store.dispatch(fetchEvent());
    }

    return next(action);
}
