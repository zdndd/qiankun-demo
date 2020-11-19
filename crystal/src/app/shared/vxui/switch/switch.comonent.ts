import { Component, Input, forwardRef } from '@angular/core';
import { FormGroup, ControlValueAccessor, NG_VALUE_ACCESSOR, ValidatorFn, NG_VALIDATORS, AbstractControl, ValidationErrors } from '@angular/forms';


const FORM_SWITCH_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => VxSwitchComponent),
    multi: true
};


@Component({
    selector: 'vx-switch',
    providers: [FORM_SWITCH_VALUE_ACCESSOR],
    template: `
  <div class="switch" *ngIf="_checked" (click)="toggle()">
        <span class="switch-on">ON</span>
        <span class="switch-off switch-dot switch-dot-40"></span>
	</div>
   <div class="switch switch-pink" *ngIf="!_checked" (click)="toggle()">
        <span class="switch-on switch-dot"></span>
        <span class="switch-off">OFF</span>
	</div>
  `
})
export class VxSwitchComponent implements ControlValueAccessor {

    private onTouched: any = () => { }
    private valueChange: any = (value: any) => { }
    _checked = false;
    toggle() {
        this._checked = !this._checked
        this.valueChange(this._checked)
    }

    writeValue(value: any) {
        if(typeof(value)=="undefined"){
            value = false;
        }
        this._checked = value;
        this.valueChange(this._checked)

    }

    registerOnChange(fn: any) {
        this.valueChange = fn;
    }

    registerOnTouched(fn: any) {
        this.onTouched = fn
    }
}
