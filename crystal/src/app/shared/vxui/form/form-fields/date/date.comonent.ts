import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'form-field-date',
    template: `
   <ng-container [formGroup]="group">
   <vx-datetime [disable]="config.disabled" [placeholder]="config.placeholder" [formControlName]="config.id" [format]="'YYYY/MM/DD'"></vx-datetime>
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
export class DateFieldComponent {
    @Input() config;
    @Input() group;
}
