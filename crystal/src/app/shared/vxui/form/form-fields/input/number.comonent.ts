import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'form-field-input-number',
    template: `
   <ng-container *ngIf="config.type=='int'" [formGroup]="group">
   <vx-input-number [placeholder]="_config?.placeholder"  style="width: 100%;"   [formControlName]="config.id"></vx-input-number>
  </ng-container>
  <ng-container *ngIf="config.type=='float'" [formGroup]="group">
   <vx-input-number [maxLength]="_config.maxLength" [decimalNumber]="_config.precision" [isFloat]="true" [placeholder]="_config?.placeholder"  style="width: 100%;"   [formControlName]="config.id"></vx-input-number>
  </ng-container>
  `,
  styles: [
    `
:host ::ng-deep{
    display:block;
    width:100%;
}
`
]
})
export class NumberFieldComponent {
    constructor(public translateService:TranslateService){

    }

    _config;
    @Input() 
    set config(val){
        //证书默认长度为6位
        val.precision = val.precision || 0; //默认不限制
        val.min = val.min || 0; 
        val.max = val.max || 999999999; 
        
        val.maxLength =  val.maxLength || 0;
        val.precision =  val.precision || 0;



        if(val.isViewMode){
            //查看模式
        }else{
            val.placeholder = val.placeholder || this.translateService.instant("Please Input",{"field":val.label});
        }
        if(val.disabled){
            val.placeholder = "";
        }
        this._config = val;
    }

    get config(){
        return this._config
    }

    @Input() group;
}
