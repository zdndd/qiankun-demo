import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'form-field-input',
    template: `
  <ng-container *ngIf="config.type=='textarea'" [formGroup]="group">
        <textarea [title]="config.isViewMode && config.value?config.value:''" style="width: 100%;" maxlength="{{config.maxLength}}" class="form-control"  [formControlName]="config.id" placeholder="{{config.placeholder}}"></textarea>
  </ng-container>
   <ng-container *ngIf="config.type!='textarea'" [formGroup]="group">
        <input [title]="config.isViewMode && config.value?config.value:''" class="form-control" maxlength="{{config.maxLength}}" type="text" [formControlName]="config.id" id="{{config.id}}"  placeholder="{{config.placeholder}}">
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
export class TextFieldComponent {
    constructor(public translateService:TranslateService){

    }
    _config;
    @Input() 
    set config(val){
        val.maxLength = val.maxLength || 999999999; 
        if(val.isViewMode){
            //查看模式
        }else{
            val.placeholder = val.placeholder || this.translateService.instant("Please Input",{"field":val.label});
        }
        this._config = val;
    }

    get config(){
        return this._config
    }

    @Input() group;
}
