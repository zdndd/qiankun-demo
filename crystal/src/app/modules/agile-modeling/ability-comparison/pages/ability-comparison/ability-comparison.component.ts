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
import { ChooseType } from '../../../../../constants/app.constants';
import { CmpService } from '../../../components/service/component.service';
import { NzModalRef, NzModalService, NzMessageService, UploadXHRArgs } from 'ng-zorro-antd';
import { KNXDataService } from '../../../../../core/knxdata.service';
@Component({
    selector: 'ability-comparison',
    changeDetection: ChangeDetectionStrategy.Default,
    templateUrl: './ability-comparison.component.html',
    styleUrls: ['./ability-comparison.component.less'],
})
export class AbilityComparisonComponent implements OnInit {
    tableData: any[] = [];
    loading = true;
    editId = null;
    modelId = '';
    columns = [];
    lastMouseOverRowIndex = -1;
    removeBtnCloseTimeoutId;

    private _rowRemoveOverlayRef: OverlayRef;

    @ViewChild('rowRemoveTemplate', { static: true }) rowRemovePortals: TemplatePortalDirective;
    @ViewChild(NzInputDirective, { read: ElementRef, static: true }) inputElement: ElementRef;

    @HostListener('window:click', ['$event'])
    handleClick(e: MouseEvent): void {
        if (this.editId && this.inputElement && this.inputElement.nativeElement !== e.target) {
            this.editId = null;
        }
    }

    constructor(
        private messageService: NzMessageService,
        public dialogService: VXDialogService,
        public activatedRoute: ActivatedRoute,
        public translateService: TranslateService,
        public overlay: Overlay,
        public http_: _HttpClient,
        public cd: ChangeDetectorRef,
        public cmpService: CmpService,
        public dataService: KNXDataService,
    ) {}

    ngOnInit() {
        this.modelId = this.activatedRoute.parent.snapshot.params.modelid;
    }

    loadData(cb?) {
        this.loading = true;
        this.http_.get('/abilitycustomfield/GetAbilityComparison?ModelId=' + this.modelId).subscribe((data: any) => {
            data = data || {};
            this.tableData = data.rows || [];
            this.columns = data.columns || [];
            this.tableData.forEach((row, row_index) => {
                row.datasource.forEach((column, index) => {
                    if (column.cellinfo.celltype == 0) {
                        let value = String(column.cellinfo.valuecode);
                        if (value != '0') {
                            if (Number(column.cellinfo.valuecode) <= 10) {
                                column.cellinfo.value1 = ['1000', value];
                            } else {
                                column.cellinfo.value1 = ['2000', value];
                            }
                        } else {
                            column.cellinfo.value1 = null;
                        }
                    } else {
                        if (column.cellinfo.valuecode == 0) {
                            column.cellinfo.value1 = '';
                        } else {
                            if (column.cellinfo.valuecode <= 10) column.cellinfo.value1 = column.cellinfo.valuecode;
                            else {
                                column.cellinfo.value1 = this.transformValue(column.cellinfo.valuecode);
                            }
                        }
                    }

                    // column.pickerOptions = this.makePickerOptions(index);
                    column.pickerOptions = this.makePickerOptionsNew(row_index, index);
                });
            });

            this.loading = false;
            if (cb) {
                cb();
            }
        });
    }

    transformValue(origin) {
        const map = {
            '11': '1',
            '12': '1/2',
            '13': '1/3',
            '14': '1/4',
            '15': '1/5',
            '16': '1/6',
            '17': '1/7',
            '18': '1/8',
            '19': '1/9',
            '20': '1/10',
        };
        return map[origin + ''] || '';
    }

    makePickerOptionsNew(row_index, index) {
        // console.log(index,this.columns[index],'--this.columns[index]-')
        if (index == 0) {
            return [];
        }
        const prevColumn = this.columns[row_index];
        const currColumn = this.columns[index];
        const pickerOptions = [
            {
                value: '1000',
                label: `${prevColumn.abilityname} > ${currColumn.abilityname}`,
                children: [
                    {
                        value: '1',
                        label: '差不多',
                        code: '1',
                        isLeaf: true,
                    },
                    {
                        value: '2',
                        label: '相对重要',
                        code: '2',
                        isLeaf: true,
                    },
                    {
                        value: '3',
                        label: '重要很多',
                        code: '3',
                        isLeaf: true,
                    },
                    // {
                    //     value: '4',
                    //     label: '4',
                    //     isLeaf: true,
                    // },
                    // {
                    //     value: '5',
                    //     label: '5',
                    //     isLeaf: true,
                    // },
                    // {
                    //     value: '6',
                    //     label: '6',
                    //     isLeaf: true,
                    // },
                    // {
                    //     value: '7',
                    //     label: '7',
                    //     isLeaf: true,
                    // },
                    // {
                    //     value: '8',
                    //     label: '8',
                    //     isLeaf: true,
                    // },
                    // {
                    //     value: '9',
                    //     label: '9',
                    //     isLeaf: true,
                    // },
                    // {
                    //     value: '10',
                    //     label: '10',
                    //     isLeaf: true,
                    // },
                ],
            },
            {
                value: '2000',
                label: `${prevColumn.abilityname} < ${currColumn.abilityname}`,
                children: [
                    {
                        value: '11',
                        label: '差不多',
                        code: '1',
                        isLeaf: true,
                    },
                    {
                        value: '12',
                        label: '相对重要',
                        code: '1/2',
                        isLeaf: true,
                    },
                    {
                        value: '13',
                        label: '重要很多',
                        code: '1/3',
                        isLeaf: true,
                    },
                    // {
                    //     value: '14',
                    //     label: '1/4',
                    //     isLeaf: true,
                    // },
                    // {
                    //     value: '15',
                    //     label: '1/5',
                    //     isLeaf: true,
                    // },
                    // {
                    //     value: '16',
                    //     label: '1/6',
                    //     isLeaf: true,
                    // },
                    // {
                    //     value: '17',
                    //     label: '1/7',
                    //     isLeaf: true,
                    // },
                    // {
                    //     value: '18',
                    //     label: '1/8',
                    //     isLeaf: true,
                    // },
                    // {
                    //     value: '19',
                    //     label: '1/9',
                    //     isLeaf: true,
                    // },
                    // {
                    //     value: '20',
                    //     label: '1/10',
                    //     isLeaf: true,
                    // },
                ],
            },
        ];
        return pickerOptions;
    }

    makePickerOptions(index) {
        console.log(index, this.columns[index], '--this.columns[index]-');
        if (index == 0) {
            return [];
        }
        let prevColumn = this.columns[index - 1];
        let currColumn = this.columns[index];
        let pickerOptions = [
            {
                value: '1000',
                label: `${prevColumn.abilityname} > ${currColumn.abilityname}`,
                children: [
                    {
                        value: '1',
                        label: '差不多',
                        code: '1',
                        isLeaf: true,
                    },
                    {
                        value: '2',
                        label: '相对重要',
                        code: '2',
                        isLeaf: true,
                    },
                    {
                        value: '3',
                        label: '重要很多',
                        code: '3',
                        isLeaf: true,
                    },
                    // {
                    //     value: '4',
                    //     label: '4',
                    //     isLeaf: true,
                    // },
                    // {
                    //     value: '5',
                    //     label: '5',
                    //     isLeaf: true,
                    // },
                    // {
                    //     value: '6',
                    //     label: '6',
                    //     isLeaf: true,
                    // },
                    // {
                    //     value: '7',
                    //     label: '7',
                    //     isLeaf: true,
                    // },
                    // {
                    //     value: '8',
                    //     label: '8',
                    //     isLeaf: true,
                    // },
                    // {
                    //     value: '9',
                    //     label: '9',
                    //     isLeaf: true,
                    // },
                    // {
                    //     value: '10',
                    //     label: '10',
                    //     isLeaf: true,
                    // },
                ],
            },
            {
                value: '2000',
                label: `${prevColumn.abilityname} < ${currColumn.abilityname}`,
                children: [
                    {
                        value: '11',
                        label: '差不多',
                        code: '1',
                        isLeaf: true,
                    },
                    {
                        value: '12',
                        label: '相对重要',
                        code: '1/2',
                        isLeaf: true,
                    },
                    {
                        value: '13',
                        label: '重要很多',
                        code: '1/3',
                        isLeaf: true,
                    },
                    // {
                    //     value: '14',
                    //     label: '1/4',
                    //     isLeaf: true,
                    // },
                    // {
                    //     value: '15',
                    //     label: '1/5',
                    //     isLeaf: true,
                    // },
                    // {
                    //     value: '16',
                    //     label: '1/6',
                    //     isLeaf: true,
                    // },
                    // {
                    //     value: '17',
                    //     label: '1/7',
                    //     isLeaf: true,
                    // },
                    // {
                    //     value: '18',
                    //     label: '1/8',
                    //     isLeaf: true,
                    // },
                    // {
                    //     value: '19',
                    //     label: '1/9',
                    //     isLeaf: true,
                    // },
                    // {
                    //     value: '20',
                    //     label: '1/10',
                    //     isLeaf: true,
                    // },
                ],
            },
        ];
        return pickerOptions;
    }

    ngAfterViewInit() {
        this.loadData(() => {});
    }

    onChanges(values: any, cellinfo, columnIdx, rowIdx): void {
        let postData = {
            modelid: this.modelId,
            rowabilityid: this.columns[rowIdx].id,
            columnabilityid: this.columns[columnIdx].id,
            valuecode: values[1],
        };
        this.http_.post('/abilitycustomfield/UpdateAbilityComparisonField', postData).subscribe(() => {
            this.loadData();
        });
    }

    openPicker(data) {}

    initSortTable() {
        setTimeout(() => {
            $('#table1').tableDnD({
                onDragClass: 'myDragClass',
                onDrop: function(table, row) {
                    var rows = table.rows;
                    var debugStr = 'Row dropped was ' + row.id + '. New order: ';
                    for (var i = 0; i < rows.length; i++) {
                        debugStr += rows[i].id + ' ';
                    }
                },
                onDragStart: function(table, row) {
                    // console.log('Started dragging row ' + row.id);
                },
            });
        }, 100);
    }

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
        this.initSortTable();
    }

    exportHandler() {}

    importHandler() {}

    // 新增能力
    selectHandler() {
        let selectData = this.columns.map(item => {
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
                        .post('/abilitycustomfield/InsertAbilityComparisonRow?modelid=' + this.modelId, {
                            lstid: data,
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

    click() {
        // console.log('clicl');
    }

    startEdit(id: string, event: MouseEvent): void {
        event.preventDefault();
        event.stopPropagation();
        this.editId = id;
    }

    mouseoverCell(event: any, rowData: any, index) {
        const rows = $('#table1 tr');
        this.lastMouseOverRowIndex = index;
        if (this.removeBtnCloseTimeoutId) {
            clearTimeout(this.removeBtnCloseTimeoutId);
            this.removeBtnCloseTimeoutId = null;
        }
        this.showRowRemoveOverlay(rows[index]);
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

    removeBtnMouseEnter(e) {
        if (this.removeBtnCloseTimeoutId) {
            clearTimeout(this.removeBtnCloseTimeoutId);
            this.removeBtnCloseTimeoutId = null;
        }
    }

    removeBtnMouseLeave(e) {
        this.startRemoveBtnCloseTimeout();
    }

    closeRowRemoveOverlay() {
        if (this._rowRemoveOverlayRef && this._rowRemoveOverlayRef.hasAttached()) {
            this._rowRemoveOverlayRef.dispose();
            this._rowRemoveOverlayRef = null;
        }
    }

    deleteColumn(column) {
        this.dialogService
            .confirm(this.translateService.instant('确定删除该能力吗?'))
            .then(() => {
                this.deleteAbility(column.id);
            })
            .catch(() => {});
    }

    deleteRow(evt) {
        this.dialogService
            .confirm(this.translateService.instant('确定删除该能力吗?'))
            .then(() => {
                this.deleteAbility(this.columns[this.lastMouseOverRowIndex].id);
            })
            .catch(() => {});
    }

    deleteAbility(abilityId) {
        this.http_
            .get(`/abilitycustomfield/DeleteAbilityComparisonData?AbilityId=${abilityId}&ModelId=${this.modelId}`)
            .subscribe(res => {
                this.loadData();
            });
    }

    ngOnDestroy() {
        this.closeRowRemoveOverlay();
    }
}
