import {
    Component,
    HostListener,
    NgZone,
    ChangeDetectorRef,
    ApplicationRef,
    EventEmitter,
    ElementRef,
    ViewChild,
    Output,
    OnInit,
    Injector,
    ViewContainerRef,
    Renderer2,
    ComponentFactoryResolver,
    ComponentRef,
    ChangeDetectionStrategy,
    ComponentFactory,
    Input,
    TemplateRef,
} from '@angular/core';
import * as _ from 'lodash';
import { Router, ActivatedRoute } from '@angular/router';
import { DataState } from '../../../../../constants/app.constants';
import { TranslateService } from '@ngx-translate/core';
import { SelectAbilityComponent } from '../../../components/select-ability/select-ability.component';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { ChooseType } from '../../../../../constants/app.constants';
import { CmpService } from '../../../components/service/component.service';
import { KNXDataService } from '../../../../../core/knxdata.service';
import { ConclusionCommonComponent } from '../../../components/conclusion-common/conclusion-common.component';
import { isThisISOWeek } from 'date-fns';

@Component({
    selector: 'conclusion',
    changeDetection: ChangeDetectionStrategy.Default,
    templateUrl: './conclusion.component.html',
    styleUrls: ['./conclusion.component.less'],
})
export class ConclusionComponent implements OnInit {
    checkData = {
        tabid: 6, //页签Id ,
        modelid: null, //模型id
        autotabid: '', //选择的方法value
        sourcetabinfo: '', //数据库记录上次选择的方法id
        conclusionList: [],
    };
    @ViewChild(ConclusionCommonComponent, { static: true })
    private conclusionCommonComponent: ConclusionCommonComponent;
    listOfOption = [
        { label: this.translateService.instant('Frequency Analysis'), value: '2' },
        { label: this.translateService.instant('Distribution Analysis'), value: '3' },
        { label: this.translateService.instant('Weight Analysis'), value: '4' },
    ];
    selectListValue = null;
    temporaryValue = null;
    autotabidArr = [];
    isDelete = false;
    isSelect = false;
    constructor(
        public cmpService: CmpService,
        public translateService: TranslateService,
        public modalService: NzModalService,
        public dataService: KNXDataService,
        private messageService: NzMessageService,
        public activatedRoute: ActivatedRoute,
    ) {}

    ngOnInit() {
        this.checkData.modelid = this.activatedRoute.parent.snapshot.params.modelid;
    }

    // 获取已选能力
    getcheckData(values) {
        // console.log(values, 'getcheckData');

        this.checkData = values;

        const tempArr = [];
        if (
            !this.isDelete &&
            !this.isSelect &&
            this.checkData.sourcetabinfo != null &&
            this.checkData.sourcetabinfo.length > 0
        ) {
            let arr = this.checkData.sourcetabinfo.split(',');
            arr.forEach((key, index) => {
                this.listOfOption.forEach((item) => {
                    if (item.value == key) {
                        tempArr.push(item);
                    }
                });
            });
            this.selectListValue = tempArr;
            this.temporaryValue = this.selectListValue;
        }
    }

    // 选择能力
    showSelectModal() {
        this.cmpService.popupAbilitySelectDialogNew(
            {
                conclusionList: this.checkData['conclusionList'],
                chooseType: ChooseType.generalPercentage,
                isDisabled: false,
                modelid: Number(this.checkData.modelid),
            },
            (data) => {
                // console.log(data,'data-cb');
                const params = {
                    tabid: Number(this.checkData.tabid), //页签Id ,
                    modelid: Number(this.checkData.modelid), //模型id
                    lstabilityproportion: data,
                };
                this.dataService.insertModelConclusion(params).subscribe((res) => {
                    if (res.errorcode === 0) {
                        this.conclusionCommonComponent.getLoadData(false);
                        // this.messageService.success(res.message);
                    } else {
                        this.messageService.error(res.message);
                    }
                });
            },
        );
    }

    //删除方法时刷新结论
    modelChange(event) {
        if (
            this.temporaryValue != null &&
            this.temporaryValue.length > 0 &&
            this.temporaryValue.length > event.length
        ) {
            this.isDelete = true;
            this.isSelect = false;
            this.autotabidArr = event.map((item) => item.value);
            this.checkData.autotabid = this.autotabidArr.join(',');
        }
        this.temporaryValue = event;
    }

    // 选择方法时select失去焦点（点击空白处）刷新结论
    refreshConclusion() {
        this.isSelect = true;
        this.isDelete = false;
        this.temporaryValue = this.selectListValue;
        if (this.selectListValue != null && this.selectListValue.length > 0) {
            this.autotabidArr = this.selectListValue.map((item) => item.value);
            this.checkData.autotabid = this.autotabidArr.join(',');
        }
    }

    //更新结论
    updatetModal() {
        let autoTabid = '';
        if (this.checkData.autotabid === '') {
            autoTabid = this.checkData.sourcetabinfo;
        } else {
            autoTabid = this.checkData.autotabid;
        }
        this.conclusionCommonComponent.getLoadDataByLeadershipInterview(true, autoTabid);
    }
}
