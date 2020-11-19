import { Directive, HostListener, Attribute, ElementRef } from '@angular/core';
import { Validator, NG_VALIDATORS, AbstractControl, NgControl } from '@angular/forms';

//  providers: [{provide: NG_VALIDATORS, useExisting: RemoveSpaceDirective, multi: true}]

@Directive({
    selector: '[remove-spaces]',
})
export class RemoveSpaceDirective {
    @HostListener('keydown', ['$event'])
    handleKeyDown(event) {
        // console.log(event.key);
        let value: string = event.target.value;
        if (event.key.trim() == '+') {
            event.preventDefault();
        } else if (event.key.trim() == '-') {
            // if (value) {
            //     //只允许第一个字符为-
            //     event.preventDefault();
            // }
            // console.log(value);
            // try {
            //     let findIndex = value.indexOf('-');
            //     console.error(findIndex);
            //     if (findIndex >= 0) {
            //         event.preventDefault();
            //     }
            // } catch (e) {}
        }
    }

    @HostListener('keyup', ['$event'])
    handleKeyUp(event) {
        // let value: string = event.target.value;
        // let findIndex = value.indexOf('-');
        // console.log(value);
        // //this.control.control.setValue(value.replace(/(\s)*/g, ''));
        // this.control.control.setValue(value);
    }

    @HostListener('blur', ['$event'])
    oninputHandler(event) {
        let oldValue = event.target.value;
        this.control.control.setValue(Number(oldValue));
    }

    constructor(public element: ElementRef, public control: NgControl) {}

    validate(control: AbstractControl) {
        try {
            // const isWhitespace = (control.value || '').trim().length === 0;
            let hasSpace = control.value.match(/\s/g);
            const isValid = !hasSpace;
            return isValid ? null : { whitespace: true };
        } catch (err) {
            return null;
        }
    }
}
