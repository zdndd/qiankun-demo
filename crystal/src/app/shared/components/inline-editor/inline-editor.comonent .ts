import { Component, ViewChild, ViewChildren, Input, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

import { ContenteditableModel } from '../../directives/contenteditable';

const EDITOR_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => InlineEditorComponent),
    multi: true,
};

@Component({
    selector: 'inline-editor',
    providers: [EDITOR_VALUE_ACCESSOR],
    template: `
        <div
            [(contenteditableModel)]="value"
            [ngClass]="_classList"
            role="textbox"
            contenteditable="true"
            [debounce]="debounce"
            (contenteditableModelChange)="onContenteditableModelChange($event)"
        ></div>
    `,
    styles: [
        `
            :host ::ng-deep {
            }
        `,
    ],
})
export class InlineEditorComponent implements ControlValueAccessor {
    _value = '';
    _classList = {};
    @Input() debounce: string = '100';
    @Input() className: string = '';
    @ViewChild(ContenteditableModel, { static: true }) contenteditableModel: ContenteditableModel;

    constructor() {}

    focus() {
        this.contenteditableModel.doFocus();
    }

    ngOnInit() {
        if (this.className) {
            var splits = this.className.split(' ');
            for (var i = 0; i < splits.length; i++) {
                this._classList[splits[i]] = true;
            }
        }
    }

    get value(): any {
        return this._value;
    }
    @Input()
    set value(v) {
        if (v !== this._value) {
            this._value = v;
            this.onChange(v);
        }
    }

    onContenteditableModelChange(evt) {
        this.onTouched();
        this.onChange(evt);
    }

    /**
     * Implements ControlValueAccessor
     */
    writeValue(value: any) {
        this._value = value;
        if (this.contenteditableModel.instance) {
            this.contenteditableModel.instance.setData(value);
        }
    }
    onChange(_: any) {
    }
    onTouched() {}
    registerOnChange(fn: any) {
        this.onChange = fn;
    }
    registerOnTouched(fn: any) {
        this.onTouched = fn;
    }
}
