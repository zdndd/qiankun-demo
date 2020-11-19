import { Component, Input,ViewChild, ElementRef } from '@angular/core';

@Component({
    selector: 'form-field-date-time',
    template: `
   <ng-container [formGroup]="group">
   <vx-datetime [disable]="config.disabled" [placeholder]="config.placeholder" [formControlName]="config.id" [format]="'YYYY/MM/DD HH:mm'"></vx-datetime>
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
export class DateTimeFieldComponent {
    @Input() config;
    @Input() group;
    ngOnInit(){
    }

   
}
