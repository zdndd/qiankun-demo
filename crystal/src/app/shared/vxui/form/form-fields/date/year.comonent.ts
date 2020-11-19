import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'form-field-year',
    template: `
   <ng-container [formGroup]="group">
   <vx-datetime [disable]="config.disabled" [placeholder]="config.placeholder" [formControlName]="config.id" [format]="'YYYY'"></vx-datetime>
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
export class YearFieldComponent {
    @Input() config;
    @Input() group;
}
