import { Component,Input,forwardRef,ContentChild, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, ControlValueAccessor, NG_VALUE_ACCESSOR, ValidatorFn, NG_VALIDATORS, AbstractControl, ValidationErrors } from '@angular/forms';
import * as Moment from 'moment';
declare var $:any;

const TIME_INPUT_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => VxTimeComponent),
  multi: true
};


@Component({
  selector: 'vx-time',
  providers: [TIME_INPUT_VALUE_ACCESSOR],
  template: `
  <div class="time-picker">
    <div class="input-icon">
        <i class="vx-icon-time"></i>
        <input *ngIf="disable" disabled mask="HH:mm" [(ngModel)]="_value" placeholder="{{placeholder}}"  #inputEle type="text" class="form-control">
        <input *ngIf="!disable"  readonly="readonly" mask="HH:mm" [(ngModel)]="_value" placeholder="{{placeholder}}"  #inputEle type="text" class="form-control">
    </div>
  </div>

  `
})
export class VxTimeComponent implements ControlValueAccessor {

    private onTouched: any = () => { }
    private valueChange: any = (value: any) => { }
     _value = "";
     @Input() format = "YYYY/MM/DD HH:mm"
     @Input() placeholder = ""
     @Input() disable = false;
     @ViewChild("inputEle", { static: true }) inputEle:ElementRef;

     ngOnInit(){
         if(!this.placeholder){
            this.placeholder = "__:__";
         }
     }

     writeValue(value: any) {
         if(value){
            this._value = value
            this.valueChange(this._value)
         }


     }

     onValueChange(newValue){
       this.valueChange(newValue)

     }

     _onChange(newValue){
       this.valueChange(newValue)

     }


     ngAfterViewInit(){
         setTimeout(()=>{
            $(this.inputEle.nativeElement).timepicker({
                showMeridian: false,
                defaultTime:false,
                orientation: {
                    x: 'auto',
                    y: 'top'
                }
            });

         },0)

        $(this.inputEle.nativeElement).on('changeTime.timepicker', (event) => {
            console.log(event.time)
            this.writeValue(event.time.value)
        });

    }

    ngOnDestroy(){

    }





    registerOnChange(fn: any) {
      this.valueChange = fn;
    }

    registerOnTouched(fn: any) {
      this.onTouched = fn
    }
}
