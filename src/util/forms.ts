import {FitElement} from "fit-html";
import {Action, Dispatch} from "redux";
import {TemplateResult} from "lit-html";
import {ThunkAction} from "redux-thunk";
import {ThunkDispatch} from "../actions/types";

export const enum FormActionTypes {
    FORM_INPUT_CHANGED = 'FORM_INPUT_CHANGED',
    FORM_VALIDATE_ALL = 'FORM_VALIDATE_ALL',
    FORM_RESET = 'FORM_RESET',
    FORM_INIT = 'FORM_INIT'
}

export type FormActions =
    | FormInitAction
    | FormResetAction
    | FormInputChangedAction
    | FormValidateAllAction;

export type InputValue = string | boolean | number;
export interface FormTransformResult {
    inputValue?: InputValue,
    storedValue?: any,
    valid: boolean
}
export interface FormField {
    inputValue: InputValue,
    storedValue: any,
    valid: boolean
}
export interface FitForm {
    fields: {
        [k: string]: FormField
    },
    valid: boolean,
}

export interface FitFormState {
    [k: string]: FitForm
}

export interface StateWithForm {
    forms: FitFormState
}

export interface FormInitAction extends Action {
    type: FormActionTypes.FORM_INIT,
    payload: string
}
export function initForm(id: string): FormInitAction {
    return {
        type: FormActionTypes.FORM_INIT,
        payload: id
    }
}

export interface FormInputChangedAction extends Action {
    type: FormActionTypes.FORM_INPUT_CHANGED,
    payload: {
        formId: string,
        fieldName: string,
        value: InputValue
    }
}
export function handleEvent(value: InputValue, formId: string, fieldName: string): FormInputChangedAction {
    return {
        type: FormActionTypes.FORM_INPUT_CHANGED,
        payload: {
            formId,
            fieldName,
            value
        }
    };
}

export interface FormValidateAllAction extends Action {
    type: FormActionTypes.FORM_VALIDATE_ALL
    payload: {
        formId: string,
        values: SerializedValues
    }
}
export type SerializedValues = { [k: string]: InputValue };
export function validateAll(formId: string, values: SerializedValues): FormValidateAllAction {
    return {
        type: FormActionTypes.FORM_VALIDATE_ALL,
        payload: {
            formId,
            values
        }
    };
}

export interface FormResetAction extends Action {
    type: FormActionTypes.FORM_RESET,
    payload: string
}
export function resetForm(id: string): FormResetAction {
    return {
        type: FormActionTypes.FORM_RESET,
        payload: id
    }
}

export function submitForm<S>(id: string, values: SerializedValues, action: Action | ThunkAction<void, S, void>): ThunkAction<void, S, void> {
    return (dispatch: ThunkDispatch<void, S, void>) => {
        dispatch(validateAll(id, values));
        dispatch(action);
    }
}

export interface FormTransformer {
    [k: string]: (value: InputValue) => FormTransformResult
}
const forms: { [id: string]: FormTransformer } = {};

export function formSelector(id: string) {
    return (state: StateWithForm): FitForm => {
        if(!(id in state.forms)) {
            throw new Error("Fatal: Form not found in state");
        }

        return state.forms[id];
    }
}

export interface FitFormDispatchers<S> {
    handle(e: Event, value: InputValue, name?: string): void
    submit(action: Action | ThunkAction<void, S, void>): void
}
export function formActionSelector<S, P, OP>(id: string, dispatch: Dispatch<S>, hostElement: FitFormElement<S, P, OP>): FitFormDispatchers<S> {
    return {
        handle(e: Event, value: InputValue, name: string = "") {
            const fieldName = name || (e.currentTarget as HTMLInputElement).name || "";
            if(fieldName === "") {
                throw new Error("FieldName for input event could not be determined");
            }
            dispatch(handleEvent(value, id, fieldName));
        },
        submit(action) {
            const elem = hostElement.shadowRoot || hostElement;
            const values = Object.keys(forms[id]).reduce((acc, key): SerializedValues => {
                acc[key] = (
                    elem.querySelector(`[name=${key}]`) as HTMLInputElement || { value: "" }
                ).value || "";
                return acc;
            }, {});
            dispatch(submitForm<S>(id, values, action));
        }
    }
}

function registerForm<S>(id: string, transformer: FormTransformer, dispatch: Dispatch<S>): void {
    if(id in forms) {
        return;
    }

    forms[id] = transformer;
    dispatch(initForm(id));
}

export type FitFormElementProps<P, S> = P & { form: FitForm & FitFormDispatchers<S> };
export interface FitFormElement<S, P, OP> extends FitElement<S, P, OP> {
    templateFunction: (props: FitFormElementProps<P, S>) => TemplateResult;

    getProps(ownProps: OP): FitFormElementProps<P, S>;
}
export function withForm<S, P, OP>(id: string, transformer: FormTransformer, base: FitElement<S, P, OP>): FitFormElement<S, P, OP> {
    return class extends base {
        connectedCallback() {
            super.connectedCallback();
            registerForm<S>(id, transformer, this.getStore().dispatch);
        }

        getProps(ownProps = {} as OP): FitFormElementProps<P, S> {
            const props = super.getProps(ownProps);
            const state = this.getStore().getState();
            return Object.assign({},
                props,
                {
                    form: {
                        ...formSelector(id)(state as any),
                        ...formActionSelector<S, P, OP>(id, this.getStore().dispatch, this)
                    }
                }
            );
        }
    } as any
}

export const initialTransformResult: FormTransformResult = {
    inputValue: "",
    storedValue: "",
    valid: true
};

function allValid(fields: { [k: string]: FormTransformResult }) {
    return Object.keys(fields).every(key => fields[key].valid);
}

function augmentTransformResult(transform: (value: InputValue) => FormTransformResult, value: InputValue): FormField {
    const input = transform !== undefined
        ? transform(value)
        : { valid: true } as FormTransformResult;
    const inputValue = input.inputValue || value;
    return {
        inputValue,
        storedValue: input.valid ? inputValue : "",
        ...input
    };
}

export function formReducer(state: FitFormState = {}, action: FormActions): FitFormState {
    if(action.type === FormActionTypes.FORM_INIT || action.type === FormActionTypes.FORM_RESET) {
        const formId = action.payload;
        if(!(formId in forms)) {
            console.warn("Tried to init form without transformer");
            return state;
        }
        if(formId in state && action.type === FormActionTypes.FORM_INIT) {
            return state; // not overwriting existing forms
        }
        return {
            ...state,
            [formId]: {
                fields: Object.keys(forms[formId]).reduce((acc, key: string): { [k: string]: FormTransformResult } => {
                    acc[key] = initialTransformResult;
                    return acc;
                }, {}),
                valid: true
            }
        }
    }

    if(action.type === FormActionTypes.FORM_INPUT_CHANGED) {
        const { formId, fieldName, value } = action.payload;
        if(!(formId in forms)) {
            console.warn("Change on form without transformer");
            return state;
        }
        const form = forms[formId];
        if(!(fieldName in form)) {
            console.warn("Change on form missing field transformer");
        }
        const output = augmentTransformResult(form[fieldName], value);

        // dirty checking
        const formerValue = fieldName in state[formId].fields
            ? state[formId].fields[fieldName].inputValue
            : null;
        if(formerValue === output.inputValue) {
            return state;
        }

        const fields = {
            ...state[formId].fields,
            [fieldName]: output
        };
        return {
            ...state,
            [formId]: {
                ...state[formId],
                fields,
                valid: allValid(fields)
            }
        }
    }

    if(action.type === FormActionTypes.FORM_VALIDATE_ALL) {
        const { formId, values } = action.payload;
        if(!(formId in forms)) {
            console.warn("Change on form without transformer");
            return state;
        }
        const form = forms[formId];
        const fields = Object.keys(values).reduce((acc, key) => {
            acc[key] = augmentTransformResult(form[key], values[key]);
            return acc;
        }, {});
        return {
            ...state,
            [formId]: {
                ...state[formId],
                fields,
                valid: allValid(fields)
            }
        }
    }

    return state;
}
