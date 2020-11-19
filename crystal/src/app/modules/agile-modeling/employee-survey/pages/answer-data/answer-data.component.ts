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
import { Router, ActivatedRoute } from '@angular/router';
import { _HttpClient } from '../../../../../core/net/http.client';
import { VXDialogService } from '../../../../../shared/vxui/service/dialog.service';
import { TranslateService } from '@ngx-translate/core';
@Component({
    selector: 'answer-data',
    changeDetection: ChangeDetectionStrategy.Default,
    templateUrl: './answer-data.component.html',
    styleUrls: ['./answer-data.component.less'],
})
export class AnswerDataComponent implements OnInit, AfterViewInit {
    tableData: any[] = [];
    loading = true;
    editId = null;
    modelId = '';
    columns = [];

    // 删除功能
    isHoverDeleteIcon = false;
    indexTrHover = -1;
    removeBtnCloseTimeoutId;
    private _rowRemoveOverlayRef: OverlayRef;
    @ViewChild('tableBody', { read: ElementRef , static: true }) tableBody: ElementRef;
    @ViewChild('rowRemoveTemplate',{static: true}) rowRemovePortals: TemplatePortalDirective;
    constructor(
        public activatedRoute: ActivatedRoute,
        public http_: _HttpClient,
        public cd: ChangeDetectorRef,
        public overlay: Overlay,
        public dialogService: VXDialogService,
        public translateService: TranslateService,
    ) {}

    ngOnInit() {
        this.modelId = this.activatedRoute.parent.snapshot.params.modelid;
    }

    loadData(cb?) {
        this.loading = true;
        this.http_
            .get('/abilitymodel/GetEmployeeSurveyList?ModelId=' + this.modelId)
            .subscribe((data: any) => {
                this.tableData = data.employeesurverylist;
                this.columns = data.columns;
                this.loading = false;
                if (cb) {
                    cb();
                }
            });
    }

    ngAfterViewInit() {
        this.loadData(() => {});
    }

    importHandler() {}

    exportHandler() {}

    addRowHandler() {
        this.tableData.push({
            id: 100,
            sort: 0,
            objectname: 'ffff',
            scene: 'ffff',
            abilitya: {
                abilityid: 0,
                abilityname: 'xxxxx',
            },
            abilityb: {
                abilityid: 0,
                abilityname: 'xxxxx',
            },
            abilityc: {
                abilityid: 0,
                abilityname: 'xxxxxx',
            },
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
            if (index !== this.indexTrHover || this.isHoverDeleteIcon) return;
            this.closeRowRemoveOverlay();
            this.removeBtnCloseTimeoutId = null;
        }, 200);
    }

    showRowRemoveOverlay(index) {
        this.indexTrHover = index;
        if(index%2 == 0){
            index = index;
        }else{
            index = index - 1;
        }
        const targetRowElement = this.tableBody.nativeElement.querySelectorAll('tr')[index];
        const targetRowEle = targetRowElement.querySelectorAll('td')[0];
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
            .top(`${rect.top + 18}px`);


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
        // POST /api/v{api-version}/abilitymodel/DelEmployeeSurvyeData
        // 删除员工调研数据
        const params = {
            ModelId: this.modelId,
            EmployeeId: item.employeeid,
        };
        this.dialogService
            .confirm(this.translateService.instant('Confirm delete the line'))
            .then(() => {
                this.http_.post(`/abilitymodel/DelEmployeeSurvyeData?ModelId=${params.ModelId}&EmployeeId=${params.EmployeeId}`, params).subscribe(() => {
                    this.isHoverDeleteIcon=false;
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
