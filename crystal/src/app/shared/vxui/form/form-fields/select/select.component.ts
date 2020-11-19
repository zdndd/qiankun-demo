import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {TranslateService} from "@ngx-translate/core";

@Component({
    selector: 'form-field-select',
    template: `
   <ng-container [formGroup]="group">
   <select [title]="_config.isViewMode?txtValue:''" class="form-control" style="width: 100%;" [formControlName]="_config.id" id="{{_config.id}}">
   <option
   *ngFor="let option of _config.dataSource"
    value="{{option.value}}">
    {{option.label}}
    </option>
    </select>
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
export class SelectFieldComponent {
    txtValue = "";

    @Input() group;
    _config;

  constructor(public translateService: TranslateService) {}
    @Input()
    public set config(val) {
        let valClone = Object.assign({}, val)
        let dataSource = valClone.dataSource || [];
        dataSource.forEach(element => {
        let valClone = Object.assign({}, val)
            if(element["value"]==valClone.value){
                this.txtValue = element["label"];
            }
        });
        if(val.isViewMode){
            //查看模式
        }else{
            valClone.placeholder = val.placeholder || this.translateService.instant('Please Choose', { field: '' });
        }
        this._config = valClone
    }
}
