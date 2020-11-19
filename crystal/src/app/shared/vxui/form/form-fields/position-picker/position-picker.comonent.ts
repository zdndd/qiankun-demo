import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'form-field-postiion-picker',
    template: `
   <ng-container  [formGroup]="group">
   <vx-postiion-picker [formControlName]="config.id"></vx-postiion-picker>
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
export class PositionPickerFieldComponent {
    @Input() config;
    @Input() group;
}
