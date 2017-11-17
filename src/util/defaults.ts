import { connect as fitConnect, withExtended, FitElement } from 'fit-html';
import { bindActionCreators } from 'redux';
export { html } from "fit-html/dist/with-extended";

export function connect<S, P, OP = {}>(stateToProps, actions, template): FitElement<S, P, OP> {
    return withExtended(fitConnect(
        stateToProps,
        dispatch => bindActionCreators(actions, dispatch),
        template
    ));
}
