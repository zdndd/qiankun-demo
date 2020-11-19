import { ComponentFactoryResolver, ComponentRef, ComponentFactory, Directive, Input, OnChanges, OnInit, Type, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TextFieldComponent } from './form-fields/input/text.comonent';
import { NumberFieldComponent } from './form-fields/input/number.comonent';
import { LangFieldComponent } from './form-fields/input/lang.comonent';
import { DateFieldComponent } from './form-fields/date/date.comonent';
import { DateTimeFieldComponent } from './form-fields/date/date-time.comonent';
import { TimeFieldComponent } from './form-fields/date/time.comonent';
import { YearFieldComponent } from './form-fields/date/year.comonent';
import { MonthFieldComponent } from './form-fields/date/month.comonent';

import { SwitchFieldComponent } from './form-fields/switch/switch.comonent';
import { SelectFieldComponent } from './form-fields/select/select.component';
import { RadioFieldComponent } from './form-fields/radio/radio.component';
import { CheckboxFieldComponent } from './form-fields/checkbox/checkbox.comonent';
import { PositionPickerFieldComponent } from './form-fields/position-picker/position-picker.comonent';
import { UploaderFieldComponent } from './form-fields/uploader/uploader.comonent';

const dynamicComponents: any = {
  text: TextFieldComponent,
  lang:LangFieldComponent,
  int:NumberFieldComponent,
  float:NumberFieldComponent,
  textarea: TextFieldComponent,
  date:DateFieldComponent,
  year:YearFieldComponent,
  month:MonthFieldComponent,
  datetime:DateTimeFieldComponent,
  time:TimeFieldComponent,
  switch:SwitchFieldComponent,
  select:SelectFieldComponent,
  radio:RadioFieldComponent,
  checkbox:CheckboxFieldComponent,
  uploader:UploaderFieldComponent,
  positionpicker:PositionPickerFieldComponent
};

@Directive({
  selector: '[dynamicField]'
})
export class DynamicFieldDirective implements OnChanges, OnInit {
  @Input()
  config;

  @Input()
  group: FormGroup;
  component: ComponentRef<any>;

  constructor(
    private resolver: ComponentFactoryResolver,
    private container: ViewContainerRef
  ) {}

  ngOnChanges() {
    if (this.component) {
      this.component.instance.config = this.config;
      this.component.instance.group = this.group;
    }
  }

  ngOnInit() {
      this.container.clear();
      if (!dynamicComponents[this.config.type]) {
        const supportedTypes = Object.keys(dynamicComponents).join(', ');
        throw new Error(
          `Trying to use an unsupported type (${this.config.type}).
          Supported types: ${supportedTypes}`
        );
      }
      const component:ComponentFactory<any>  = this.resolver.resolveComponentFactory<any>(dynamicComponents[this.config.type]);
      this.component = this.container.createComponent(component);
      this.component.instance.config = this.config;
      this.component.instance.group = this.group;

  }

  ngOnDestroy() {
   this.component.destroy();
  }
}
