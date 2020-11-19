import { Component, Input, forwardRef, ChangeDetectorRef } from '@angular/core';
import {
    FormGroup,
    ControlValueAccessor,
    NG_VALUE_ACCESSOR,
    ValidatorFn,
    NG_VALIDATORS,
    AbstractControl,
    ValidationErrors,
} from '@angular/forms';
import { VXDialogService } from '../service/dialog.service';
import { Subject, Subscription } from 'rxjs';
import { UploadFile } from 'ng-zorro-antd';
import { TranslateService } from '@ngx-translate/core';

const FORM_POSITION_PICKER_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => VxUploaderPickerComponent),
    multi: true,
};

@Component({
    selector: 'vx-uploader-picker',
    providers: [FORM_POSITION_PICKER_VALUE_ACCESSOR],
    template: `
        <div class="input-icon" [ngClass]="{ 'view-mode': config?.isViewMode }">
            <a (click)="openPicker()" *ngIf="!config?.isViewMode"><i class="vx-icon-wenjian"></i></a>
            <input
                [title]="config.isViewMode ? label : ''"
                [ngStyle]="{ cursor: label ? 'pointer' : '' }"
                (click)="openAttachment()"
                type="text"
                placeholder="{{ placeholder }}"
                readonly
                [(ngModel)]="label"
            />
        </div>
    `,
})
export class VxUploaderPickerComponent implements ControlValueAccessor {
    private _label = '';
    private _value = '';
    private _setValueObserver: Subscription;
    private _fileList: UploadFile[] = [];
    placeholder = '';
    @Input() config;
    constructor(
        public translateService: TranslateService,
        public cd: ChangeDetectorRef,
        public dialogService: VXDialogService,
    ) {}

    ngOnInit() {
        if (!this.config.isViewMode) this.placeholder = this.translateService.instant('Please Choose', { field: '' });
    }

    get label() {
        return this._label;
    }

    set label(val) {
        this._label = val;
    }

    openPicker() {
        var setValue = new Subject<UploadFile[]>();
        this._setValueObserver = setValue.subscribe((data: UploadFile[]) => {
            var avaialbles = data.filter((item) => {
                return item.status == 'done' && item.response;
            });
            this._fileList = data;
            var fileNames = avaialbles.map((item) => {
                return item.response.filename;
            });
            this._label = fileNames.join(',');

            var values = avaialbles.map((item) => {
                return item.response.filename + '__file__' + item.response.path;
            });
            console.log(values.join(','));
            this.valueChange(values.join(','));
            this.cd.detectChanges();
        });

        this.dialogService.uploaderPicker(setValue, this._fileList, {
            title: this.translateService.instant('Select the file'),
            width: '650px',
        });
    }

    private onTouched: any = () => {};
    private valueChange: any = (value: any) => {};

    writeValue(value: any) {
        this._fileList = [];
        if (value) {
            const splitValues = value.split(',') as string[];
            splitValues.forEach((value: string) => {
                let fileInfo = value.split('__file__');
                if (fileInfo[0] != '' && fileInfo[1] != '') {
                    this._fileList.push({
                        name: fileInfo[0],
                        response: {
                            filename: fileInfo[0],
                            path: fileInfo[1],
                        },
                        uid: 'xxxxx',
                        status: 'done',
                        size: 1100000,
                        type: 'png',
                    });
                }
            });

            var fileNames = this._fileList.map((item) => {
                return item.name;
            });

            this._label = fileNames.join(',');
        }
    }

    registerOnChange(fn: any) {
        this.valueChange = fn;
    }

    registerOnTouched(fn: any) {
        this.onTouched = fn;
    }

    openAttachment() {
        console.log(this._fileList);
        if (this._fileList.length > 0) {
            if (this._fileList[0].response && this._fileList[0].response.path) {
                // let attachUrl =
                //     this.configService.get('ATTACHMENT_URL') + this._fileList[0].response.path;
                // console.log(attachUrl);
                // window.open(attachUrl);
            }
        }
    }

    ngOnDestroy() {
        if (this._setValueObserver) {
            this._setValueObserver.unsubscribe();
        }
    }
}
