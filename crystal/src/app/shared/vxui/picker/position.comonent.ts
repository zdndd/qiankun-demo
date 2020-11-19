import { Component, Input, forwardRef } from '@angular/core';
import { FormGroup, ControlValueAccessor, NG_VALUE_ACCESSOR, ValidatorFn, NG_VALIDATORS, AbstractControl, ValidationErrors } from '@angular/forms';
import {VXDialogService} from "../service/dialog.service"


const FORM_POSITION_PICKER_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => VxPositionPickerComponent),
    multi: true
};


@Component({
    selector: 'vx-postiion-picker',
    providers: [FORM_POSITION_PICKER_VALUE_ACCESSOR],
    template: `
    <div class="input-icon">
    <a (click)="openPicker()"><i class="vx-icon-tianjin"></i></a>
    <input type="text" placeholder="{{ 'Please Choose' | translate:{'field':''} }}" readonly [(ngModel)]="label">
</div>
  `
})
export class VxPositionPickerComponent implements ControlValueAccessor {

    private _label = "";
    private _value = "";
    constructor(public dialogService:VXDialogService){

    }

    get label(){
        return this._label
    }

    @Input()
    set label(val){
        this._label = val;
    }

    openPicker(){
        this.dialogService.positionPicker().then((data)=>{
            console.log(data)
            this._value = data[0]
            this._label = data[3]
            this.valueChange(this._value)
        }).catch(()=>{
            
        })
    }

    private onTouched: any = () => { }
    private valueChange: any = (value: any) => { }
   

    writeValue(value: any) {
       
    }

    registerOnChange(fn: any) {
        this.valueChange = fn;
    }

    registerOnTouched(fn: any) {
        this.onTouched = fn
    }
}
