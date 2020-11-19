import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'form-field-time',
    template: `
   <ng-container [formGroup]="group">
   <vx-time [disable]="config.disabled" [placeholder]="config.placeholder" [formControlName]="config.id"></vx-time>
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
export class TimeFieldComponent {
    @Input() config;
    @Input() group;
}
