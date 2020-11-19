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
} from '@angular/core';
import * as _ from 'lodash';
import { Router, ActivatedRoute } from '@angular/router';
import { SelectAbilityComponent } from '../../../components/select-ability/select-ability.component';
import { TranslateService } from '@ngx-translate/core';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { abilityParam, ChooseType } from '../../../../../constants/app.constants';
import { CmpService } from '../../../components/service/component.service';
import { KNXDataService } from '../../../../../core/knxdata.service';
import { ConclusionCommonComponent } from '../../../components/conclusion-common/conclusion-common.component';
@Component({
    selector: 'conclusion',
    changeDetection: ChangeDetectionStrategy.Default,
    templateUrl: './conclusion.component.html',
    styleUrls: ['./conclusion.component.less'],
})
export class ConclusionComponent implements OnInit {
    checkData = {
        tabid: 15, //页签Id ,
        modelid: null, //模型id
        conclusionList: [],
    };
    @ViewChild(ConclusionCommonComponent, { static: true })
    private conclusionCommonComponent: ConclusionCommonComponent;
    constructor(
        public translateService: TranslateService,
        public modalService: NzModalService,
        public cmpService: CmpService,
        public dataService: KNXDataService,
        public activatedRoute: ActivatedRoute,
        private messageService: NzMessageService,
    ) {}

    ngOnInit() {
        this.checkData.modelid = this.activatedRoute.parent.snapshot.params.modelid;
    }

    // 获取已选能力
    getcheckData(values) {
        this.checkData = values;
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
            data => {
                const params = {
                    tabid: Number(this.checkData.tabid), //页签Id ,
                    modelid: Number(this.checkData.modelid), //模型id
                    lstabilityproportion: data,
                };
                this.dataService.insertModelConclusion(params).subscribe(res => {
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

    //更新结论
    updatetModal() {
        this.conclusionCommonComponent.getLoadData(true);
    }
}
