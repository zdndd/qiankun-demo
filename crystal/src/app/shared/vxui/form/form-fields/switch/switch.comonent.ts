import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'form-field-switch',
    template: `
   <ng-container [formGroup]="group">
   <vx-switch [formControlName]="config.id" id="{{config.id}}"></vx-switch>
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
export class SwitchFieldComponent {
    @Input() config;
    @Input() group;
}
