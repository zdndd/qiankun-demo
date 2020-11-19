import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'form-field-radiobutton',
  template: `
    <ng-container [formGroup]="group">
      <label class="radio" *ngFor="let option of _config.dataSource">
        <input
          type="radio"
          [formControlName]="_config.id"
          name="{{ _config.id }}"
          value="{{ option.value }}"
        />{{ option.label }} <span class="radio-label"></span>
      </label>
    </ng-container>
  `,
  styles: [
    `
      :host ::ng-deep {
        display: block;
        width: 100%;
      }
    `
  ]
})
export class RadioFieldComponent {
  @Input() group;
  _config;
  constructor(public translateService: TranslateService) {}
  @Input()
  public set config(val) {
    let valClone = Object.assign({}, val);
    valClone.placeholder =
      val.placeholder || this.translateService.instant('Please Input', { field: '' });
    this._config = valClone;
  }
}
