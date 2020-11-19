import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Map } from 'immutable';
import { NzModalRef, NzModalService, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '../../../../../core/net/http.client';
import {
    NgForm,
    NgModel,
    FormBuilder,
    FormGroup,
    FormArray,
    NG_VALUE_ACCESSOR,
    FormControl,
    ControlValueAccessor,
    Validators,
} from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { PrettyScrollDirective } from '../../../../../shared/vxui/directives/pretty-scroll-directive';
function onlyBlankSpace(control: FormControl): any {
    const noteValueLen = control.value.replace(/\s/g, '').length;
    return noteValueLen < 1 ? { isBlank: true } : null;
}
@Component({
    selector: 'app-modal-add-column',
    templateUrl: './add-column.component.html',
    host: {
        '[class.common-popup]': 'true',
    },
    styleUrls: ['./add-column.component.less'],
})
export class AddColumnComponent implements OnInit {
    selectedColumn = null;
    avaiableColumns: any[];
    public columnsArray: FormArray = null;
    @Input() columnData: any[];
    @Input() modelId = null;
    @Input() tabId = null;

    @ViewChild(PrettyScrollDirective, { static: true }) scrollDirective: PrettyScrollDirective;
    enabledTransform = false;
    enabledTransformResult = false;
    mapList = [];
    constructor(
        private fb: FormBuilder,
        public translateService: TranslateService,
        private http: _HttpClient,
        private messageService: NzMessageService,
        private modal: NzModalRef,
    ) {
        this.columnsArray = this.fb.array([]);
    }
    ngOnInit() {
        this.http
            .get('/abilitycustomfield/GetInterViewColumns?ModelId=' + this.modelId + '&TabId=' + this.tabId)
            .subscribe((res: any[]) => {
                this.mapList = res;
                this.makeFormArray();
            });
    }

    makeFormArray() {
        this.mapList.forEach((element, index) => {
            let formGroup: FormGroup = this.fb.group({
                columnname: [element.columnname, [Validators.required, onlyBlankSpace]],
                fieldcode: [element.fieldcode],
            });
            this.columnsArray.push(formGroup);
        });
    }

    addRow() {
        let formGroup: FormGroup = this.fb.group({
            columnname: ['', [Validators.required, onlyBlankSpace]],
            fieldcode: [''],
        });
        this.columnsArray.push(formGroup);
    }

    delRow(index, event) {
        event.stopPropagation();
        event.preventDefault();
        this.columnsArray.removeAt(index);
    }

    chooseAll() {
        if (!this.enabledTransformResult) {
            this.enabledTransform = true;
        }
    }

    enabledTransformChange() {
        setTimeout(() => {
            if (!this.enabledTransform) {
                this.enabledTransformResult = false;
            }
        }, 0);
    }

    valid() {
        // console.log(this.columnsArray);
        if (!this.columnsArray.valid) {
            this.messageService.error(this.translateService.instant('To ensure that each is required'));
            return false;
        }
        return this.columnsArray.valid;
    }

    getData() {
        return this.columnsArray.value;
    }

    save() {}
}
