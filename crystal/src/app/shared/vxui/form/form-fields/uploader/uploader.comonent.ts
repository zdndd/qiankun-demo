import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'form-field-uploader',
    template: `
   <ng-container [formGroup]="group">
   <vx-uploader-picker [config]="config" [formControlName]="config.id"></vx-uploader-picker>
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
export class UploaderFieldComponent {
    @Input() config;
    @Input() group;
}
