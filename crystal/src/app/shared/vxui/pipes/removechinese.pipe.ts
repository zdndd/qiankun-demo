import { Directive, HostListener, Attribute, ElementRef } from '@angular/core';
import { Validator, NG_VALIDATORS, AbstractControl, NgControl } from '@angular/forms';

//  providers: [{provide: NG_VALIDATORS, useExisting: RemoveSpaceDirective, multi: true}]

@Directive({
    selector: '[remove-chinese]',
})
export class RemoveChineseDirective {
    @HostListener('input', ['$event'])
    oninputHandler(event) {
        let oldValue = event.target.value;
        // oldValue = oldValue.replace(/^[\u3220-\uFA29]+$/g, '');
        oldValue = oldValue.replace(/([^\u0000-\u00FF])/g, function($) {
            return '';
        });

        this.control.control.setValue(oldValue);
    }

    constructor(public element: ElementRef, public control: NgControl) {}

    validate(control: AbstractControl) {
        return null;
        // try {
        //     // const isWhitespace = (control.value || '').trim().length === 0;
        //     let hasSpace = control.value.match(/\s/g);
        //     const isValid = !hasSpace;
        //     return isValid ? null : { whitespace: true };
        // } catch (err) {
        //     return null;
        // }
    }
}
