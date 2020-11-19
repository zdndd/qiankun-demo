import { Component,Input,forwardRef,ContentChild, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, ControlValueAccessor, NG_VALUE_ACCESSOR, ValidatorFn, NG_VALIDATORS, AbstractControl, ValidationErrors } from '@angular/forms';
import * as Moment from 'moment';
declare var $:any;
import {I18NService} from "../../../core/i18n/i18n.service"

const DATETIME_INPUT_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => VxDateTimeComponent),
  multi: true
};


@Component({
  selector: 'vx-datetime',
  providers: [DATETIME_INPUT_VALUE_ACCESSOR],
  template: `
  <div class="date-picker">
    <div class="input-icon">
        <i class="vx-icon-riqi" (click)="showPicker()"></i>
        <input class="form-control" *ngIf="disable" disabled  [(ngModel)]="_value" placeholder="{{placeholder}}"  #inputEle type="text">
        <input class="form-control" *ngIf="!disable"  readonly="readonly" [(ngModel)]="_value" placeholder="{{placeholder}}"  #inputEle type="text">
        <i class="vx-icon-other-delete3"></i>
    </div>
  </div>

  `
})
export class VxDateTimeComponent implements ControlValueAccessor {

    constructor(private i18nService:I18NService){

    }

    private onTouched: any = () => { }
    private valueChange: any = (value: any) => { }
     _value = "";
     @Input() format = "YYYY/MM/DD HH:mm"
     @Input() placeholder = ""
     @Input() disable = false;
     @ViewChild("inputEle", { static: true }) inputEle:ElementRef;

     ngOnInit(){
         if(!this.placeholder){
            if(this.format == "YYYY/MM/DD HH:mm")
                this.placeholder = "____/__/__ __:__";
            else if(this.format == "YYYY")
                this.placeholder = "____";
            else if(this.format == "YYYY/MM")
                this.placeholder = "____/__";
            else
                this.placeholder = "____/__/__";
         }
     }

     writeValue(value: any) {
         if(value){
            this._value = Moment(value).format(this.format);
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
         let self = this;
        let datetimepicker = $(this.inputEle.nativeElement).datetimepicker({
            keepInvalid: true,
            useCurrent: false,
            inline: false,
            toolbarPlacement: 'bottom',
            widgetPositioning:{
                vertical:"auto"
            },
            ignoreReadonly: true,
            showTodayButton: false,
            showClose: false,
            locale: this.i18nService.currentLang == "en"?"":"zh-cn",
            format: this.format,
            widgetParent: 'body',
            sideBySide: true,
            extraFormats: [this.format],
            dateMask: '____/__/__ __:__',
            minDate: '1900/01/11',
            maxDate: '9000/01/01',
            todayActive: "true"
        });

        $(this.inputEle.nativeElement).on('dp.show', function() {
            var datepicker = $('body').find('.bootstrap-datetimepicker-widget:last');
            var parent = datepicker.parent()
            var parentPos = parent.offset()
            var width = datepicker.outerWidth();
            var parentWid = parent.width();
            var position = $(this).offset();

            if (datepicker.hasClass('bottom')) {
              console.log($(this).width())
              console.log($(this).offset())
              var top = $(this).offset().top + $(this).outerHeight();
              var left = $(this).offset().left;
              datepicker.css({
                'top': top + 'px',
                'bottom': 'auto',
                'left': left + 'px'
              });
            }
            else if (datepicker.hasClass('top')) {
              var top:any = $(this).offset().top - datepicker.outerHeight();
              var left = $(this).offset().left;
              datepicker.css({
                'top': top + 'px',
                'bottom': 'auto',
                'left': left + 'px'
              });
            }
            console.log("====")
            console.log(parentWid)
            console.log(position,width)
            console.log(position.left + 15 +  width,parentPos.left + parentWid)
            if (position.left + 15+ width > parentPos.left + parentWid ) {
                var newLeft = position.left + $(this).width()+20 - width ;
                datepicker.addClass('pull-right');
                datepicker.css({left: newLeft});
            }


        });

        $(this.inputEle.nativeElement).on('dp.change', (event) => {
            this.writeValue(event.date)
        });

    }

    showPicker(){
        //$(this.inputEle.nativeElement).data("DateTimePicker").show();
    }





    registerOnChange(fn: any) {
      this.valueChange = fn;
    }

    registerOnTouched(fn: any) {
      this.onTouched = fn
    }
}
