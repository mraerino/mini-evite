import {directive, DirectiveFn, NodePart, Part, TemplateInstance, TemplateResult} from "lit-html";
import {FitFormElementProps, FitForm, FitFormDispatchers} from "./forms";
import {PaperInputBehaviorImpl} from "@polymer/paper-input/paper-input-behavior.js";

export interface StateKeepingPart extends Part {
    previousValue: any;
}

export interface PaperInputElement extends HTMLInputElement {
    behaviors: any[],
    invalid: boolean
}

export const isPaperInput = elem => elem.behaviors && elem.behaviors.indexOf(PaperInputBehaviorImpl) !== -1;
export const decorateInput = (
    literal: TemplateResult,
    name: string,
    props: FitFormElementProps<{}>
): DirectiveFn => directive((part: NodePart & StateKeepingPart) => {
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
                'change',
                e => props.form.handle(e, (e.target as HTMLInputElement).value, previous.name)
            );
        }
        element.addEventListener(
            'change',
            e => props.form.handle(e, (e.target as HTMLInputElement).value, name)
        );
    }

    const value = props.form.fields[name].inputValue;
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
