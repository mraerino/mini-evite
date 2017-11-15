import { connect as fitConnect, withExtended, FitElement } from 'fit-html';
import { bindActionCreators } from 'redux';
export { html } from "fit-html/dist/with-extended";

export function connect(stateToProps, actions, template) {
    return withExtended(fitConnect(
        stateToProps,
        dispatch => bindActionCreators(actions, dispatch),
        template
    ));
}
