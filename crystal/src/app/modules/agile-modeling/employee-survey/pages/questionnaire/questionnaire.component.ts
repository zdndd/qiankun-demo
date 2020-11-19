import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortalDirective } from '@angular/cdk/portal';
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
    AfterViewInit,
} from '@angular/core';

import * as _ from 'lodash';
import { _HttpClient } from '../../../../../core/net/http.client';
import { Router, ActivatedRoute } from '@angular/router';
import { CdkDragDrop, moveItemInArray, CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
declare var $;
import { NzInputDirective, NzModalService } from 'ng-zorro-antd';
import { TranslateService } from '@ngx-translate/core';
import { NzMessageService, UploadFile } from 'ng-zorro-antd';
import { ChooseType } from '../../../../../constants/app.constants';
import { CmpService } from '../../../components/service/component.service';
import { GenerateLinkComponent } from '../../modal/generate-link/generate-link.component';
import { VXDialogService } from '../../../../../shared/vxui/service/dialog.service';
@Component({
    selector: 'questionnaire',
    changeDetection: ChangeDetectionStrategy.Default,
    templateUrl: './questionnaire.component.html',
    styleUrls: ['./questionnaire.component.less'],
})
export class QuestionnaireComponent implements OnInit, AfterViewInit {
    tableData: any[] = [];
    loading = true;
    editId = null;
    columns = [];
    linkValue = '';
    modelId = '';
    dropDownStyle = {
        'text-align': 'center',
    };

    // 删除功能
    isHoverDeleteIcon = false;
    indexTrHover = -1;
    removeBtnCloseTimeoutId;
    private _rowRemoveOverlayRef: OverlayRef;
    @ViewChild('tableBody', { read: ElementRef, static: true }) tableBody: ElementRef;
    @ViewChild('rowRemoveTemplate', { static: true }) rowRemovePortals: TemplatePortalDirective;
    constructor(
        public modalService: NzModalService,
        public activatedRoute: ActivatedRoute,
        public http_: _HttpClient,
        public translateService: TranslateService,
        public messageService: NzMessageService,
        public cd: ChangeDetectorRef,
        public cmpService: CmpService,
        public overlay: Overlay,
        public dialogService: VXDialogService,
    ) {}

    ngOnInit() {
        this.modelId = this.activatedRoute.parent.snapshot.params.modelid;
    }

    loadData(cb?) {
        this.loading = true;
        this.http_.get('/abilitymodel/GetModelSurveyList?ModelId=' + this.modelId).subscribe((data: any) => {
            this.tableData = data;
            if (this.tableData.length > 0) {
                this.columns = this.tableData[0].datasource;
            }

            this.loading = false;
            if (cb) {
                cb();
            }
        });
    }

    ngAfterViewInit() {
        this.loadData(() => {});
    }

    selectHandler() {
        let selectData = this.tableData.map((item) => {
            return {
                id: parseInt(item.id),
                name: item.abilityname,
            };
        });
        this.cmpService.popupAbilitySelectDialogNew(
            {
                conclusionList: selectData,
                chooseType: ChooseType.generalMultiple,
                isDisabled: true,
                modelid: Number(this.modelId),
            },
            (data: any[]) => {
                if (data.length > 0) {
                    this.http_
                        .post('/abilitymodel/SetEmployeeSurvey', {
                            modelid: this.modelId,
                            abilityids: data,
                        })
                        .subscribe(() => {
                            this.loadData();
                        });
                } else {
                    // this.messageService.error('请选择能力');
                }
            },
        );
    }

    exportHandler() {}

    importHandler() {}

    generateLinkHandler() {
        let modal = this.modalService.create({
            nzTitle: this.translateService.instant('Generate URL'),
            nzWidth: '800px',
            nzClosable: true,
            nzMaskClosable: false,
            nzZIndex: 1001,
            nzBodyStyle: { padding: '0px 10px 10px 10px' },
            nzWrapClassName: 'vertical-center-modal',
            nzContent: GenerateLinkComponent,
            nzFooter: null,
            nzOnOk: (data) => {},
            nzOnCancel: (data) => {},
            nzComponentParams: { modelId: this.modelId },
        });
    }

    click() {
        // console.log('clicl');
    }

    closeRowRemoveOverlay() {
        if (this._rowRemoveOverlayRef && this._rowRemoveOverlayRef.hasAttached()) {
            this._rowRemoveOverlayRef.dispose();
            this._rowRemoveOverlayRef = null;
        }
    }
    startRemoveBtnCloseTimeout(index) {
        if (this.removeBtnCloseTimeoutId) {
            clearTimeout(this.removeBtnCloseTimeoutId);
            this.removeBtnCloseTimeoutId = null;
        }
        this.removeBtnCloseTimeoutId = setTimeout(() => {
            // console.log(this.indexTrHover, 'remover new=', index);
            if (index !== this.indexTrHover || this.isHoverDeleteIcon) return;
            this.closeRowRemoveOverlay();
            this.removeBtnCloseTimeoutId = null;
        }, 200);
    }

    showRowRemoveOverlay(index) {
        this.indexTrHover = index;
        const targetRowEle = this.tableBody.nativeElement.querySelectorAll('tr')[index];
        if (!targetRowEle) {
            return;
        }
        // this.closeRowRemoveOverlay();
        // const rect = this.tableContainer.nativeElement.getBoundingClientRect();
        const rect = targetRowEle.getBoundingClientRect();
        if (!rect) {
            return;
        }
        const positionStrategy = this.overlay
            .position()
            .global()
            .width(`36px`)
            .left(`${rect.left - 36}px`)
            .top(`${rect.top}px`);

        if (this._rowRemoveOverlayRef) {
            this._rowRemoveOverlayRef.updatePositionStrategy(positionStrategy);
            this._rowRemoveOverlayRef.updatePosition();
        } else {
            const config = new OverlayConfig();
            config.hasBackdrop = false;
            config.scrollStrategy = this.overlay.scrollStrategies.noop();
            config.positionStrategy = positionStrategy;
            this._rowRemoveOverlayRef = this.overlay.create(config);
            this._rowRemoveOverlayRef.attach(this.rowRemovePortals);
        }
    }
    deleteRow() {
        const item = this.tableData[this.indexTrHover];
        // POST /api/v{api-version}/abilitymodel/DelEmployeeSurveyRow
        // 删除员工调研行
        const params = {
            modelid: this.modelId,
            abilityid: item.id,
        };
        this.dialogService
            .confirm(this.translateService.instant('Confirm delete the line'))
            .then(() => {
                this.http_.post('/abilitymodel/DelEmployeeSurveyRow', params).subscribe(() => {
                    this.isHoverDeleteIcon = false;
                    this.startRemoveBtnCloseTimeout(this.indexTrHover);
                    this.loadData();
                });
            })
            .catch(() => {});
    }
    removeBtnMouseEnter() {
        this.isHoverDeleteIcon = true;
    }
    removeBtnMouseLeave() {
        this.isHoverDeleteIcon = false;
        this.startRemoveBtnCloseTimeout(this.indexTrHover);
    }
}
