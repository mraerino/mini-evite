import {directive, DirectiveFn, NodePart, Part, TemplateInstance, TemplateResult} from "lit-html";
import {FitFormElementProps, FitForm, FitFormDispatchers} from "./forms";
import {PaperInputBehaviorImpl} from "@polymer/paper-input/paper-input-behavior.js";

export interface StateKeepingPart extends NodePart {
    previousValue: any;
}

export interface PaperInputElement extends HTMLInputElement {
    behaviors: any[],
    invalid: boolean
}

const InputFocusedMap = new WeakMap();
const InputValueMap = new WeakMap();
const getFixedHandler = (handler: (e: CustomEvent) => void) => {
    return (e: CustomEvent): void => {
        const former = InputFocusedMap.get(e.target) || false;
        if(e.detail.value === former) {
            return;
        }
        InputFocusedMap.set(e.target, e.detail.value);

        if(e.detail.value === true) {
            return;
        }

        const oldVal = InputValueMap.get(e.target) || "";
        const {value} = e.target as HTMLInputElement;
        if(value === oldVal) {
            return;
        }
        InputValueMap.set(e.target, value);
        handler(e);
    }
};

export const isPaperInput = elem => elem.behaviors && elem.behaviors.indexOf(PaperInputBehaviorImpl) !== -1;
export const decorateInput = (
    literal: TemplateResult,
    name: string,
    props: FitFormElementProps<any, any>
): DirectiveFn => directive((part: StateKeepingPart) => {
    const previous = part.previousValue || {};

    const instance: TemplateInstance = previous.template !== literal.template
        ? new TemplateInstance(literal.template, part.instance._partCallback)
        : previous.instance;

    let element: PaperInputElement = previous.element;
    if(previous.instance !== instance) {
        const fragment: DocumentFragment = instance._clone();
        if(fragment.childNodes.length > 1) {
            throw new Error("Decorated template can have only one child node");
        }
        element = fragment.childNodes[0] as PaperInputElement;
        if(!isPaperInput(element)) {
            throw new Error("Can only decorate Polymer Elements implementing PaperInputBehavior");
        }
    }

    instance.update(literal.values);

    if(previous.element !== element || previous.name !== name) {
        element.setAttribute('name', name);
        if(previous.name) {
            element.removeEventListener(
                'focused-changed',
                getFixedHandler(e => props.form.handle(e, (e.target as HTMLInputElement).value, previous.name))
            );
        }
        element.addEventListener(
            'focused-changed',
            getFixedHandler(e => props.form.handle(e, (e.target as HTMLInputElement).value, name))
        );
    }

    const value = name in props.form.fields
        ? props.form.fields[name].inputValue
        : previous.value;
    if(previous.value !== value) {
        element.value = String(value);
        element.invalid = !props.form.fields[name].valid;
    }

    part.previousValue = {
        instance,
        element,
        name,
        value,
        template: literal.template
    };

    part.setValue(element);
    return element;
});

export default decorateInput;
