import {
    Component,
    ViewChild,
    ElementRef,
    Optional,
    Inject,
    ChangeDetectionStrategy,
    Input,
    forwardRef,
    ChangeDetectorRef,
    Output,
    EventEmitter,
} from '@angular/core';
import {
    FormGroup,
    ControlValueAccessor,
    NG_VALUE_ACCESSOR,
    ValidatorFn,
    NG_VALIDATORS,
    AbstractControl,
    ValidationErrors,
} from '@angular/forms';
import { Subject, Subscription, fromEvent, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';
import * as _ from 'lodash';

import {
    CdkConnectedOverlay,
    CdkOverlayOrigin,
    ConnectedOverlayPositionChange,
    ConnectionPositionPair,
} from '@angular/cdk/overlay';

const FORM_INPUT_NUMBER_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => VxInputNumberComponent),
    multi: true,
};
@Component({
    selector: 'vx-input-number',
    providers: [FORM_INPUT_NUMBER_VALUE_ACCESSOR],
    changeDetection: ChangeDetectionStrategy.Default,
    template: `
        <input
            nz-input
            (blur)="onBlur($event)"
            [placeholder]="placeholder"
            (input)="onInputChange($event)"
            class="form-control"
            [ngModel]="displayValue"
            type="text"
            [disabled]="disabled"
        />
    `,
})
export class VxInputNumberComponent implements ControlValueAccessor {
    displayValue: string | number;
    @Input() decimalNumber: number = 0; //保留小数位数,默认不限制
    @Input() isFloat: boolean = false;
    @Input() maxLength: number = 0;
    @Input() placeholder: string = '';
    @Input() allowMinus: boolean = true;
    @Input() disabled;
    @Output() weight: EventEmitter<any> = new EventEmitter();
    @Output() committeescore: EventEmitter<any> = new EventEmitter();
    constructor(
        public elementRef: ElementRef,
        public cd: ChangeDetectorRef,
        @Optional() @Inject(DOCUMENT) private _document: any,
    ) {}

    ngAfterViewInit() {}

    onBlur(event) {
        this.weight.emit(event.target.value);
        this.committeescore.emit(event.target.value);
        if (isNaN(parseFloat(event.target.value))) {
            event.target.value = '';
            this._valueChange('');
        } else {
            event.target.value = parseFloat(event.target.value);
            this._valueChange(parseFloat(event.target.value));
        }
    }

    onInputChange(event: any) {
        let oldValue = event.target.value;
        if (this.isFloat) {
            if (this.allowMinus) {
                oldValue = oldValue.replace(/[^\d-\.]/g, '');
            } else {
                oldValue = oldValue.replace(/[^\d\.]/g, '');
            }
            let newValue = '';
            if (oldValue == '.') {
                newValue = '';
            } else if (oldValue.indexOf('.') >= 0) {
                let splitArr = oldValue.split('.');
                if (this.decimalNumber > 0) {
                    newValue = splitArr[0] + '.' + splitArr[1].substr(0, this.decimalNumber);
                } else {
                    newValue = splitArr[0] + '.' + splitArr[1].substr(0);
                }
            } else {
                if (this.maxLength) newValue = oldValue.substr(0, this.maxLength);
                else newValue = oldValue;
            }
            // if (newValue.substr(0, 1) == '0' && newValue.substr(1, 1) != '.') {
            //     newValue = '0';
            // }
            if (this.maxLength > 0) {
                if (oldValue.indexOf('.') >= 0) {
                    newValue = newValue.substr(0, this.maxLength + 1);
                } else {
                    newValue = newValue.substr(0, this.maxLength);
                }
            }
            event.target.value = newValue;
            // this._valueChange(Number(newValue))
        } else {
            oldValue = oldValue.replace(/[^\d]/g, '');
            let newValue = oldValue.substr(0, 8); //整数固定6位长度限制
            if (isNaN(parseFloat(newValue))) event.target.value = '';
            else event.target.value = Number(newValue);
        }
    }

    _onTouched: any = () => {};
    _valueChange: any = (value: any) => {};

    ngOnInit() {}

    writeValue(value: any) {
        this.displayValue = value;
    }

    registerOnChange(fn: any) {
        this._valueChange = fn;
    }

    registerOnTouched(fn: any) {
        this._onTouched = fn;
    }

    onValueChange(index, model) {}

    ngOnDestroy() {}
}
