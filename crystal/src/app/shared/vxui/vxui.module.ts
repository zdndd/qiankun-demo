import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { OverlayModule } from '@angular/cdk/overlay';
import { ObserversModule } from '@angular/cdk/observers';

import { VXTableViewComponent } from './tableview/table-view.component';
import { VxCheckboxComponent } from './checkbox/checkbox.comonent';
import { VxDateTimeComponent } from './date/datetime.comonent';
import { VxTimeComponent } from './date/time.comonent';
import { VxSwitchComponent } from './switch/switch.comonent';
import { VxPaginationComponent } from './pagination/pagination.comonent';
import { VxInputLangComponent } from './input-lang/input-lang';

import { DynamicFieldDirective } from './form/dynamic-field.directive';
import { FormItemComponent } from './form/form-item.component';
import { FormViewComponent } from './form/form-view.component';
import { FormService } from './form/form.service';

import { VxInputNumberComponent } from './form/form-fields/input/input-number';
import { TextFieldComponent } from './form/form-fields/input/text.comonent';
import { NumberFieldComponent } from './form/form-fields/input/number.comonent';
import { DateFieldComponent } from './form/form-fields/date/date.comonent';
import { DateTimeFieldComponent } from './form/form-fields/date/date-time.comonent';
import { TimeFieldComponent } from './form/form-fields/date/time.comonent';
import { YearFieldComponent } from './form/form-fields/date/year.comonent';
import { MonthFieldComponent } from './form/form-fields/date/month.comonent';

import { SwitchFieldComponent } from './form/form-fields/switch/switch.comonent';
import { SelectFieldComponent } from './form/form-fields/select/select.component';
import { RadioFieldComponent } from './form/form-fields/radio/radio.component';
import { CheckboxFieldComponent } from './form/form-fields/checkbox/checkbox.comonent';
import { PositionPickerFieldComponent } from './form/form-fields/position-picker/position-picker.comonent';
import { UploaderFieldComponent } from './form/form-fields/uploader/uploader.comonent';
import { LangFieldComponent } from './form/form-fields/input/lang.comonent';

import { TranslateModule } from '@ngx-translate/core';

const FORM_FIELDS_COMPONENTS = [
    TextFieldComponent,
    NumberFieldComponent,
    DateFieldComponent,
    DateTimeFieldComponent,
    YearFieldComponent,
    MonthFieldComponent,
    TimeFieldComponent,
    SwitchFieldComponent,
    SelectFieldComponent,
    RadioFieldComponent,
    CheckboxFieldComponent,
    PositionPickerFieldComponent,
    UploaderFieldComponent,
    LangFieldComponent,
];

import { VxDialogAlertComponent } from './dialog/alert/alertcomponent';
import { VxDialogConfirmComponent } from './dialog/confirm/confirmcomponent';
import { PositionPickeDialogComponent } from './dialog/position-picker/position-picker.component';
import { FormDialogComponent } from './dialog/form/form-dailog.component';
import { UploaderPickeDialogComponent } from './dialog/uploader-picker/uploader-picker.component';
import { PasswordComponent } from './dialog/password/password.component';
import { ViewDialogComponent } from './dialog/view/view-dailog.component';
import { CroppieDialogComponent } from './dialog/croppie/croppie.component';

import { VxPositionPickerComponent } from './picker/position.comonent';
import { VxUploaderPickerComponent } from './picker/uploader.comonent';
import { VXDialogService } from './service/dialog.service';

import { SafeHtmlPipe } from './pipes/safehtml.pipe';
import { FloatInputDirective } from './pipes/floatInput.pipe';
import { RemoveHtmlPipe } from './pipes/removehtml.pipe';
import { RemoveSpaceDirective } from './pipes/removespace.pipe';
import { RemoveChineseDirective } from './pipes/removechinese.pipe';
import { PrettyScrollDirective } from './directives/pretty-scroll-directive';

const components = [
    DynamicFieldDirective,
    FormViewComponent,
    FormItemComponent,
    VxCheckboxComponent,
    VxDateTimeComponent,
    VxTimeComponent,
    VxInputLangComponent,
    VXTableViewComponent,
    VxSwitchComponent,
    VxDialogAlertComponent,
    VxDialogConfirmComponent,
    PositionPickeDialogComponent,
    VxPaginationComponent,
    FormDialogComponent,
    ViewDialogComponent,
    UploaderPickeDialogComponent,
    VxPositionPickerComponent,
    VxUploaderPickerComponent,
    PasswordComponent,
    CroppieDialogComponent,
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        TranslateModule,
        OverlayModule,
        ObserversModule,
        RouterModule,
        NgZorroAntdModule,
        ReactiveFormsModule,
    ],
    entryComponents: [
        VxDialogAlertComponent,
        FormDialogComponent,
        ViewDialogComponent,
        UploaderPickeDialogComponent,
        PositionPickeDialogComponent,
        VxDialogConfirmComponent,
        PasswordComponent,
        CroppieDialogComponent,
        ...FORM_FIELDS_COMPONENTS,
    ],
    declarations: [
        ...components,
        ...FORM_FIELDS_COMPONENTS,
        RemoveHtmlPipe,
        SafeHtmlPipe,
        VxInputNumberComponent,
        FloatInputDirective,
        RemoveChineseDirective,
        RemoveSpaceDirective,
        PrettyScrollDirective,
    ],
    providers: [VXDialogService, FormService],
    exports: [
        ...components,
        VxInputNumberComponent,
        FloatInputDirective,
        RemoveChineseDirective,
        PrettyScrollDirective,
        RemoveSpaceDirective,
    ],
})
export class VxUiModule {}
