import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgModel } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { KNXDataService } from 'src/app/core/knxdata.service';
import { _HttpClient } from 'src/app/core/net/http.client';
import { SvTransferComponent } from 'src/app/shared/components/sv-transfer/sv-transfer.component';
import * as _ from 'lodash';
import { HomeService } from '../../../service/home.service';

@Component({
    selector: 'app-model-form',
    templateUrl: './model-form.component.html',
    styleUrls: ['./model-form.component.less'],
})
export class ModelFormComponent implements OnInit {
    projectName = '';
    remark = '';
    list = [];
    checkedList = [];

    @ViewChild('nameField',{static: true}) projectNameField: NgModel;
    @ViewChild(SvTransferComponent, { static: true }) transferComponent: SvTransferComponent;

    @Input() data: any;

    constructor(
        public dataService: KNXDataService,
        public homeService: HomeService,
        public translateService: TranslateService,
        private http: _HttpClient,
        private messageService: NzMessageService,
        private modal: NzModalRef,
    ) {}
    ngOnInit() {
        const params = {
            pagesize: 99999,
            pageindex: 1,
        };
        this.checkedList = this.data.list;
        this.homeService.getUserList(params).subscribe((res: any) => {
            // console.log('this.data===', this.data);
            this.list = res.map(item => ({
                key: item.userid,
                direction: 'left',
                title: item.username,
            }));
            this.initFormValues();
        });
        if (this.data.id) {
            this.homeService.getAbilityModel({ ModelId: this.data.id }).subscribe(res => {
                const { userlist = [], ...data } = res;
                this.checkedList = userlist.map(item => item.userid);
                this.projectName = data.modelname;
                this.remark = data.remark;
                this.initFormValues();
            });
        }
    }

    initFormValues() {
        // console.log('this.checkedList===', this.checkedList);
        this.list = this.list.map(item => {
            if (
                this.checkedList &&
                Array.isArray(this.checkedList) &&
                this.checkedList.includes(item.key)
            ) {
                item.direction = 'right';
            }

            return item;
        });
        this.remark = this.data.remark || this.remark;
        this.projectName = this.data.name || this.projectName;
    }
    getTitle = item =>
        this.translateService.instant('administrator') + `（已选<span>${item.length}</span>人)`;

    valid() {
        this.projectNameField.control.markAsTouched();
        this.projectNameField.control.markAsDirty();
        this.projectNameField.control.updateValueAndValidity();
        return this.projectNameField.control.valid;
    }

    getData() {
        const transferRightData = this.transferComponent.getData();
        const list: any[] = _.map(
            _.pullAllBy(transferRightData.right['all'], [], 'key'),
            item => item.key,
        );

        return {
            name: this.projectName,
            list,
            remark: this.remark,
        };
    }
}
