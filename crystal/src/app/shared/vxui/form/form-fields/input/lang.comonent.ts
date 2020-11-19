import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'form-field-input-lang',
    template: `
  <ng-container  [formGroup]="group">
  <vx-input-lang [formControlName]="config.id"></vx-input-lang>
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
export class LangFieldComponent {
    _config;
    @Input() 
    set config(val){
        this._config = val;
    }

    get config(){
        return this._config
    }

    @Input() group;
}
