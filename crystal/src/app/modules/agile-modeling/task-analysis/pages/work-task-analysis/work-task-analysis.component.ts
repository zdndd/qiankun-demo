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
import { _HttpClient } from '../../../../../core/net/http.client';
import { Router, ActivatedRoute } from '@angular/router';
import { CdkDragDrop, moveItemInArray, CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
declare var $;
import { NzInputDirective } from 'ng-zorro-antd';
import { ComponentPortal, TemplatePortalDirective } from '@angular/cdk/portal';
import { ConnectionPositionPair, OverlayConfig, OverlayRef, Overlay } from '@angular/cdk/overlay';
import { VXDialogService } from '../../../../../shared/vxui/service/dialog.service';
import { TranslateService } from '@ngx-translate/core';
import { CmpService } from '../../../components/service/component.service';
import { ChooseType } from '../../../../../constants/app.constants';

@Component({
    selector: 'work-task-analysis',
    templateUrl: './work-task-analysis.component.html',
    styleUrls: ['./work-task-analysis.component.less'],
})
export class WorkTaskAnalysisComponent implements OnInit {
    tableData: any[] = [];
    loading = true;
    modelId = '';
    editId = null;
    removeBtnCloseTimeoutId;
    lastRemoveRowIndex = -1;
    dragging = false;
    private _rowRemoveOverlayRef: OverlayRef;

    @ViewChild('rowRemoveTemplate', { static: false }) rowRemovePortals: TemplatePortalDirective;
    @ViewChild(NzInputDirective, { read: ElementRef, static: false }) inputElement: ElementRef;

    @HostListener('window:click', ['$event'])
    handleClick(e: MouseEvent): void {
        if (this.editId && this.inputElement && this.inputElement.nativeElement !== e.target) {
            if (this.editId) {
                // const [index, type] = this.editId.split('_');
                // const rowData = this.tableData[parseInt(index)];
                // const postData = {
                //     id: rowData.id,
                //     modelid: this.modelId,
                //     objectname: rowData.objectname,
                //     scene: rowData.scene,
                //     abilitya: rowData.abilitya ? rowData.abilitya.abilityid : 0,
                //     abilityb: rowData.abilityb ? rowData.abilityb.abilityid : 0,
                //     abilityc: rowData.abilityc ? rowData.abilityc.abilityid : 0,
                // };
                // this.http_
                //     .post('/abilitycustomfield/AddTaskAnalysis', postData)
                //     .subscribe(res => {});
                this.addTask(this.editId);
            }
            this.editId = null;
        }
    }

    addTask(editId) {
        const [index, type] = editId.split('_');
        const rowData = this.tableData[parseInt(index)];
        const postData = {
            id: rowData.id,
            modelid: this.modelId,
            objectname: rowData.objectname,
            scene: rowData.scene,
            abilitya: rowData.abilitya ? rowData.abilitya.abilityid : 0,
            abilityb: rowData.abilityb ? rowData.abilityb.abilityid : 0,
            abilityc: rowData.abilityc ? rowData.abilityc.abilityid : 0,
        };
        this.http_.post('/abilitycustomfield/AddTaskAnalysis', postData).subscribe(res => {});
    }

    constructor(
        public cmpService: CmpService,
        public activatedRoute: ActivatedRoute,
        public dialogService: VXDialogService,
        public translateService: TranslateService,
        public overlay: Overlay,
        public http_: _HttpClient,
        public cd: ChangeDetectorRef,
    ) {}

    ngOnInit() {
        this.modelId = this.activatedRoute.parent.snapshot.params.modelid;
    }

    loadData(cb?) {
        this.loading = true;
        this.http_.get('/abilitycustomfield/getTaskAnalysis?modelId=' + this.modelId).subscribe((data: any) => {
            this.tableData = data;
            this.loading = false;
            if (cb) {
                cb();
            }
        });
    }

    ngAfterViewInit() {
        this.loadData(() => {
            this.initSortTable();
        });
    }

    initSortTable() {
        const self = this;
        this.dragging = false;
        setTimeout(() => {
            $('#table1').tableDnD({
                onDragClass: 'myDragClass',
                dragHandle: '.dragHandler',
                onDrop: function(table, row) {
                    if (!self.dragging) {
                        self.dragging = true;
                    }
                    const rows = table.rows;
                    const idList = [];
                    for (let i = 0; i < rows.length; i++) {
                        idList.push(rows[i].id);
                    }
                    self.http_
                        .post('/abilitycustomfield/setTaskAnalysisSort?ModelId=' + self.modelId, {
                            lstid: idList,
                        })
                        .subscribe(() => {
                            self.loadData(() => {
                                self.initSortTable();
                            });
                        });
                },
                onDragStart: function(table, row) {
                    self.closeRowRemoveOverlay();
                    // self.dragging = true;
                },
            });
        }, 100);
    }

    addRowHandler() {
        // this.tableData.push({
        //     id: 100,
        //     sort: 0,
        //     objectname: 'ffff',
        //     scene: 'ffff',
        //     abilitya: {
        //         abilityid: 0,
        //         abilityname: 'xxxxx',
        //     },
        //     abilityb: {
        //         abilityid: 0,
        //         abilityname: 'xxxxx',
        //     },
        //     abilityc: {
        //         abilityid: 0,
        //         abilityname: 'xxxxxx',
        //     },
        // });
        // this.initSortTable();
        const postData = {
            id: 0,
            modelid: this.modelId,
            objectname: '',
            scene: '',
            abilitya: 0,
            abilityb: 0,
            abilityc: 0,
        };
        this.http_.post('/abilitycustomfield/AddTaskAnalysis', postData).subscribe(res => {
            this.loadData(() => {
                this.initSortTable();
            });
        });
    }

    exportHandler() {}

    importHandler() {}

    reset(celldata, type) {
        const selectData = [];
        if (type == 'a') {
            if (celldata.abilitya) {
                selectData.push({
                    id: String(celldata.abilitya.abilityid),
                    name: '',
                });
            }
        } else if (type == 'b') {
            if (celldata.abilityb) {
                selectData.push({
                    id: String(celldata.abilityb.abilityid),
                    name: '',
                });
            }
        } else {
            if (celldata.abilityc) {
                selectData.push({
                    id: String(celldata.abilityc.abilityid),
                    name: '',
                });
            }
        }

        this.cmpService.popupAbilitySelectDialogNew(
            {
                conclusionList: selectData,
                chooseType: ChooseType.generalSingle,
                isDisabled: false,
                modelid: Number(this.modelId),
            },
            (data: string[]) => {
                if (data.length > 0) {
                    const selectId = data[0];
                    if (!selectId) {
                        return;
                    }
                    const postData = {
                        id: celldata.id,
                        modelid: this.modelId,
                        objectname: celldata.objectname,
                        scene: celldata.scene,
                        abilitya: celldata.abilitya ? celldata.abilitya.abilityid : 0,
                        abilityb: celldata.abilityb ? celldata.abilityb.abilityid : 0,
                        abilityc: celldata.abilityc ? celldata.abilityc.abilityid : 0,
                    };
                    if (type == 'a') {
                        postData.abilitya = Number(selectId);
                    } else if (type == 'b') {
                        postData.abilityb = Number(selectId);
                    } else {
                        postData.abilityc = Number(selectId);
                    }
                    this.http_.post('/abilitycustomfield/AddTaskAnalysis', postData).subscribe(() => {
                        this.loadData(() => {
                            this.initSortTable();
                        });
                    });
                }
            },
        );
    }

    startEdit(id: string, event: MouseEvent): void {
        event.preventDefault();
        event.stopPropagation();
        let currentId = id.split('_')[0];
        let oldId = String(this.editId).split('_')[0];
        if (this.editId !== null && currentId !== oldId) {
            // console.log('执行', this.editId)
            this.addTask(this.editId);
        }
        this.editId = id;
    }

    mouseoverCell(event: any, rowData: any, index) {
        if (!this.dragging) {
            this.lastRemoveRowIndex = index;
            const rows = $('#table1 tr');
            if (this.removeBtnCloseTimeoutId) {
                clearTimeout(this.removeBtnCloseTimeoutId);
                this.removeBtnCloseTimeoutId = null;
            }
            this.showRowRemoveOverlay(rows[index]);
        }
    }

    mouseoutCell(event: any, rowData: any, index) {
        this.startRemoveBtnCloseTimeout();
    }

    startRemoveBtnCloseTimeout() {
        if (this.removeBtnCloseTimeoutId) {
            clearTimeout(this.removeBtnCloseTimeoutId);
            this.removeBtnCloseTimeoutId = null;
        }
        this.removeBtnCloseTimeoutId = setTimeout(() => {
            this.closeRowRemoveOverlay();
            this.removeBtnCloseTimeoutId = null;
        }, 200);
    }

    showRowRemoveOverlay(targetRowEle: any) {
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

    removeBtnMouseEnter() {
        if (this.removeBtnCloseTimeoutId) {
            clearTimeout(this.removeBtnCloseTimeoutId);
            this.removeBtnCloseTimeoutId = null;
        }
    }

    removeBtnMouseLeave() {
        this.startRemoveBtnCloseTimeout();
    }

    closeRowRemoveOverlay() {
        if (this._rowRemoveOverlayRef && this._rowRemoveOverlayRef.hasAttached()) {
            this._rowRemoveOverlayRef.dispose();
            this._rowRemoveOverlayRef = null;
        }
    }

    deleteRow() {
        this.dialogService
            .confirm(this.translateService.instant('Confirm delete the line'))
            .then(() => {
                this.http_
                    .get(
                        '/abilitycustomfield/DeleteTaskAnalysisRow?ModelId=' +
                            this.modelId +
                            '&RowId=' +
                            this.tableData[this.lastRemoveRowIndex].id,
                        {},
                    )
                    .subscribe(res => {
                        this.loadData(() => {
                            this.initSortTable();
                        });
                    });
            })
            .catch(() => {});
    }

    ngOnDestroy() {
        this.closeRowRemoveOverlay();
    }
}
