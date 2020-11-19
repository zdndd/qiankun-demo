import {
    Component,
    OnDestroy,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    HostBinding,
    Renderer2,
    QueryList,
    OnInit,
    HostListener,
    ViewChild,
    ViewContainerRef,
    ElementRef,
    ContentChildren,
    forwardRef,
} from '@angular/core';
import { DataState } from '../../../../../constants/app.constants';
import { NzModalRef, NzModalService, NzMessageService, UploadXHRArgs } from 'ng-zorro-antd';
import { AuthService } from '../../../../../core/auth.service';
import { AppService } from '../../../../../core/app.service';
import { Observable, of, fromEvent, Subscription, Subject } from 'rxjs';
import PerfectScrollbar from 'perfect-scrollbar';
import { filter } from 'rxjs/operators';
import { Router, ActivatedRoute, NavigationEnd, Params, PRIMARY_OUTLET } from '@angular/router';

import { HttpRequest, HttpClient, HttpEventType, HttpEvent, HttpResponse } from '@angular/common/http';
import { auditTime, delay, takeUntil } from 'rxjs/operators';
import { _HttpClient } from '../../../../../core/net/http.client';
import * as _ from 'lodash';
import { TranslateService } from '@ngx-translate/core';
import { CdkDragDrop, moveItemInArray, CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import { ScrollBarHelper } from '../../../../../utils/scrollbar-helper';
import { PrettyScrollDirective } from '../../../../../shared/vxui/directives/pretty-scroll-directive';
import { ConnectionPositionPair, OverlayConfig, OverlayRef, Overlay } from '@angular/cdk/overlay';
import { ComponentPortal, TemplatePortalDirective } from '@angular/cdk/portal';
import { AddColumnComponent } from '../../modal/add-column/add-column.component';

import { VXDialogService } from '../../../../../shared/vxui/service/dialog.service';
import { MockData } from '../../../../../constants/app.constants';
import { ChooseType } from '../../../../../constants/app.constants';
import { CmpService } from '../../../components/service/component.service';
// import { HomeService } from '../../../home/service/home.service';

const enum PROJECT_TYPE {
    ALL = 'all',
    ASSESSMENT = 'assessment',
    PERFOMANCE = 'perfomance',
    PEOPLE = 'people',
}
@Component({
    selector: 'app-dynamic-table',
    templateUrl: './dynamic-table.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    preserveWhitespaces: false,
    styleUrls: ['./dynamic-table.component.less'],
})
export class DynamicTableComponent implements OnInit, OnDestroy {
    private _destroy: Subject<any> = new Subject();
    kind = '';
    imgChange = 'zh';
    modelId = '';
    currSort = '';
    pageData = {
        currentPage: 1,
        pageSizce: 20,
        totalCount: 0,
        pagecount: 1,
    };
    lastLoadSub: Subscription;
    abilityIdColumns = null;
    pageState = DataState.LOADING;
    currentScrollY = 0;
    currHoverRow = null;
    currOperColumn = null;
    projectId = null;
    currTabId = 'all';
    typeId = 2;
    lastMoveRowIndex = -1;
    removeBtnCloseTimeoutId;
    private _operatorPicker: OverlayRef;
    private _rowRemoveOverlayRef: OverlayRef;
    private _overlayLoading: OverlayRef;
    lastEditCell = null;
    globalOverlayPosition = 0;
    notFixedColumns = [];
    fixedColumns = [];
    rightFixedColumns = [];
    visibleNotFixedColumns = [];

    fixedColumnScrollbar: PerfectScrollbar = null;
    horizontalScrollbar: PerfectScrollbar = null;

    verticalScrollListener = null;
    lastScrollUpdateTimeout = null;
    uploading = false;
    firstLoad = true;
    lastUploadItem: UploadXHRArgs = null;
    fileUploadConfirmPoped = false;

    destroy$: Subject<any> = new Subject<any>();

    @ViewChild(PrettyScrollDirective, { static: true }) scrollDirective: PrettyScrollDirective;
    @ViewChild('scrollbar', { read: ElementRef, static: true }) scrollbar: ElementRef;
    @ViewChild('tableContainer', { read: ElementRef, static: true }) tableContainer: ElementRef;
    @ViewChild('fixedColumnLeft', { read: ElementRef, static: true }) fixedColumnLeft: ElementRef;
    @ViewChild('fixedColumnRight', { read: ElementRef, static: true }) fixedColumnRight: ElementRef;
    @ViewChild(CdkDropList, { static: true }) dropList: CdkDropList;

    @ContentChildren(forwardRef(() => CdkDrag)) _draggables: QueryList<CdkDrag>;

    @ViewChild('operatorPickerTemplate', { static: true }) operatorPickerPortals: TemplatePortalDirective;
    @ViewChild('rowRemoveTemplate', { static: true }) rowRemovePortals: TemplatePortalDirective;
    @ViewChild('overloayLoadingTemplate', { static: true }) overloayLoadingPortals: TemplatePortalDirective;

    @HostListener('document:click', ['$event'])
    documentClick(event: any) {
        if (event.target.classList.contains('hover') || event.target.classList.contains('ant-input')) {
            return;
        }
        if (this.lastEditCell) {
            this.saveCellData(this.lastEditCell);
            this.lastEditCell.edit = false;
            this.lastEditCell = null;
        }
    }

    @HostListener('window:resize', ['$event'])
    resize(event: any) {
        this.updateScrollbar();
    }

    @HostListener('window:mousewheel', ['$event'])
    onmousewheel(wheelEvent: any) {
        if (document.querySelector('.ant-modal-mask')) {
            return;
        }
        var upDown;
        if (wheelEvent.wheelDelta) {
            //chrome
            upDown = -wheelEvent.wheelDelta;
        } else {
            //FF
            var rawAmmount = wheelEvent.deltaY ? wheelEvent.deltaY : wheelEvent.detail;
            upDown = rawAmmount;
        }

        this.scrollbar.nativeElement.scrollTop += upDown;
    }

    @HostListener('document:DOMMouseScroll', ['$event'])
    dOMMouseScroll(e: any) {
        if (document.querySelector('.ant-modal-mask')) {
            return;
        }
        this.scrollbar.nativeElement.scrollTop += e.detail * 10;
    }

    overlayPositions: ConnectionPositionPair[] = [
        {
            offsetY: -12,
            offsetX: -40,
            originX: 'end',
            originY: 'top',
            overlayX: 'end',
            overlayY: 'bottom',
        },
    ] as ConnectionPositionPair[];

    constructor(
        public dialogService: VXDialogService,
        public translateService: TranslateService,
        public http_: _HttpClient,
        public http: HttpClient,
        public overlay: Overlay,
        public router: Router,
        public activatedRoute: ActivatedRoute,
        public cd: ChangeDetectorRef,
        public renderer: Renderer2,
        public elementRef: ElementRef,
        public appService: AppService,
        private messageService: NzMessageService,
        public authService: AuthService,
        public modalService: NzModalService,
        public cmpService: CmpService, // public homeService: HomeService,
    ) {}

    ngOnInit() {
        this.modelId = this.activatedRoute.parent.snapshot.params.modelid;
        this.typeId = parseInt(this.activatedRoute.snapshot.params['id']);
        this.imgChange = this.translateService.instant('Image language switching');
        // this.projectId = 1;
        this.loadData(() => {
            this.firstLoad = false;
        });

        // this.homeService.getAbilityModel({ ModelId: this.modelId}).subscribe(res => {
        //    console.log(res,'-res-');
        // });

        this.router.events
            .pipe(
                takeUntil(this.destroy$),
                filter((event) => event instanceof NavigationEnd),
            )
            .subscribe((event: any) => {
                this.typeId = parseInt(this.activatedRoute.snapshot.params['id']);
                this.loadData();
            });
    }

    ngAfterViewInit() {
        setTimeout(() => {
            const overlayContainerList = document.querySelectorAll('.cdk-overlay-container');
            if (overlayContainerList.length > 1) {
                overlayContainerList[1]['style'].zIndex = 100;
            }
            // console.log(this.tableContainer.nativeElement.querySelector('.col-list'));
            this.horizontalScrollbar = ScrollBarHelper.makeScrollbar(
                this.tableContainer.nativeElement.querySelector('.col-list'),
            );
        }, 10);

        this.verticalScrollListener = this.renderer.listen(this.scrollbar.nativeElement, 'scroll', (event) => {
            this.currentScrollY = event.target.scrollTop;
            this.syncDragScrollTop(event.target);
            const scrollList = this.tableContainer.nativeElement.querySelectorAll('.scroll-container');
            _.each(scrollList, (item) => {
                item.scrollTop = this.currentScrollY;
            });
        });

        this.dropList._draggables.changes.subscribe((res) => {
            this.dropList._draggables.forEach((drag, index) => {
                if (index == 0) {
                    setTimeout(() => {
                        const scrollHeight = drag.element.nativeElement.querySelector('.scroll-container').scrollHeight;
                        this.scrollbar.nativeElement.querySelector('.inner').style.height = scrollHeight + 'px';
                        setTimeout(() => {
                            this.scrollDirective.updateScrollbar();
                        }, 100);
                    }, 0);
                }
                drag.started.pipe(takeUntil(this.destroy$)).subscribe((res) => {
                    setTimeout(() => {
                        let previewElement = document.querySelector('.cdk-drag-preview');
                        previewElement.querySelector('.scroll-container').scrollTop = this.currentScrollY;
                    }, 0);
                });
            });
        });
    }

    loadData(cb = null) {
        const sort = this.currSort || '1';
        if (this.lastLoadSub) {
            this.lastLoadSub.unsubscribe();
            this.lastLoadSub = null;
        }
        this.pageState = DataState.LOADING;
        let url =
            'abilitycustomfield/GetInterviewData?Sort=' + sort + '&ModelId=' + this.modelId + '&TabId=' + this.typeId;

        this.lastLoadSub = this.http_.get(url, {}).subscribe(
            (data: any) => {
                // console.log(data,'--data---298---');
                let notFixedColumns = [];
                let fixedColumns = [];
                let rightFixedColumns = [];
                // console.log(data);
                if (Object.keys(data).length == 0) {
                    this.pageState = DataState.EMPTY;
                    this.notFixedColumns = [];
                    this.rightFixedColumns = [];
                    this.fixedColumns = [];
                    this.abilityIdColumns = null;
                    this.updateScrollbar();
                    this.cd.detectChanges();
                    return;
                }
                let datasource = data;
                datasource = datasource || [];
                this.abilityIdColumns = datasource[0];
                datasource = datasource.slice(1);
                // console.log(datasource);
                if (datasource.length == 2) {
                    //inser balnk column;
                    var rowsLen = datasource[0].rows.length;
                    var blankrows = [];
                    for (var i = 0; i < rowsLen; i++) {
                        blankrows.push('');
                    }
                    var blankColumn = {
                        isedit: false,
                        isstandard: false,
                        columnname: '',
                        fieldcode: 'blank',
                        rule: 0,
                        title: '',
                        rows: blankrows,
                    };
                    datasource.splice(1, 0, blankColumn);
                }
                const columnNum = datasource.length;
                for (var i = 0; i < datasource.length; i++) {
                    let columnWidth = this.calcColumnWidth(datasource[i].rows);
                    if (datasource[i].rule) {
                        columnWidth = '100px';
                    }
                    // console.log(rows)
                    let columnData = Object.assign({ width: columnWidth, visible: true }, datasource[i]);
                    columnData.rows = _.map(datasource[i].rows, (row, rowIndex) => {
                        var trend = '';
                        // var ruleRow = _.find(rowrule, item => {
                        //     return item.rowindex == rowIndex;
                        // });
                        if (columnData.rule) {
                            trend = 'customer';
                            try {
                                if (row.indexOf('+') >= 0 && row.indexOf('%') >= 0) {
                                    trend = 'increase';
                                } else if (row.indexOf('-') >= 0 && row.indexOf('%') >= 0) {
                                    trend = 'reduce';
                                }
                            } catch (e) {}
                        }
                        return {
                            columnName: columnData.fieldcode,
                            trend,
                            fixed: i == columnNum - 1,
                            title: row,
                            rule: columnData.rule,
                            title_old: row,
                            edit: false,
                            checked: row == 1,
                            column: i,
                            columnType: columnData.type,
                            hover: false,
                            row: rowIndex,
                        };
                    });
                    if (i == 0) {
                        columnData.width = '100px';
                        fixedColumns.push(columnData);
                    } else if (i == columnNum - 1) {
                        columnData.width = '100px';
                        rightFixedColumns.push(columnData);
                    } else {
                        notFixedColumns.push(columnData);
                    }
                }
                this.fixedColumns = fixedColumns;
                this.notFixedColumns = notFixedColumns;
                this.rightFixedColumns = rightFixedColumns;
                this.pageState = datasource.length > 0 ? DataState.EXIST_DATA : DataState.EMPTY;

                if (this.notFixedColumns.length <= 0) {
                    //this.scrollbar.nativeElement.querySelector('.inner').style.height = '0px';
                    setTimeout(() => {
                        this.scrollDirective.updateScrollbar();
                    }, 100);
                }
                this.updateScrollbar();
                this.cd.detectChanges();
                this.scrollbar.nativeElement.scrollTop = 0;
                if (cb) {
                    cb();
                }
                // console.log(this.notFixedColumns,'-notFixedColumns-')
            },
            (error) => {
                this.pageState = DataState.EMPTY;
                if (cb) {
                    cb();
                }
            },
        );
    }

    pageIndexChange(newPage) {
        this.pageData.currentPage = newPage;
        this.loadData();
    }

    syncDragScrollTop(target) {
        this.dropList._draggables.forEach((drag) => {
            if (drag.element.nativeElement != target)
                drag.element.nativeElement.querySelector('.scroll-container').scrollTop = this.currentScrollY;
        });
    }

    addRowHandler() {
        let selectData = [];
        if (this.abilityIdColumns) {
            selectData = this.abilityIdColumns['rows'].map((item) => {
                return {
                    id: parseInt(item),
                    name: '',
                };
            });
        }
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
                        .post('/abilitycustomfield/AddInterviewRows', {
                            modelid: this.modelId,
                            tabid: this.typeId,
                            abilityids: data,
                        })
                        .subscribe(() => {
                            this.loadData();
                        });
                }
                // else {
                // this.messageService.error('请选择能力');
                // }
            },
        );
        // this.popupAddRow();
    }

    addColumnHandler() {
        this.popupAddColumn(null);
    }

    popupAddRow() {
        // let modal = this.modalService.create({
        //     nzTitle: this.translateService.instant('Add row'),
        //     nzWidth: '584px',
        //     nzClosable: false,
        //     nzMaskClosable: false,
        //     nzZIndex: 1001,
        //     nzContent: AddRowComponent,
        //     nzFooter: [
        //         {
        //             label: this.translateService.instant('Save'),
        //             type: 'primary',
        //             loading: false,
        //             onClick: componentInstance =>
        //                 new Promise(resolve => {
        //                     if (componentInstance.valid()) {
        //                         const data = componentInstance.getData();
        //                         // console.log(data);
        //                         this.http
        //                             .post('fields/AddRow', {
        //                                 projectid: this.projectId,
        //                                 empname: data.rowName,
        //                                 rowtype: parseInt(data.calcType),
        //                                 dataType: this.transofrmType(this.currTabId),
        //                             })
        //                             .subscribe(res => {
        //                                 // console.log(res);
        //                                 resolve();
        //                                 modal.destroy();
        //                                 this.loadData();
        //                             });
        //                     } else {
        //                         resolve();
        //                     }
        //                 }),
        //         },
        //         {
        //             label: this.translateService.instant('Cancel'),
        //             type: 'default',
        //             onClick: componentInstance => {
        //                 modal.destroy();
        //             },
        //         },
        //     ],
        //     nzOnOk: data => {},
        //     nzOnCancel: data => {},
        //     nzComponentParams: {},
        // });
        // modal.afterClose.subscribe(result => {
        //     // console.log(result)
        // });
    }

    popupAddColumn(columnData) {
        const title = columnData
            ? this.translateService.instant('Edit column')
            : this.translateService.instant('Add Column');
        let modal = this.modalService.create({
            nzTitle: title,
            nzWidth: '584px',
            nzClosable: false,
            nzMaskClosable: false,
            nzZIndex: 1001,
            nzWrapClassName: 'vertical-center-modal',
            nzContent: AddColumnComponent,
            nzFooter: [
                {
                    label: this.translateService.instant('Save'),
                    type: 'primary',
                    onClick: (componentInstance) =>
                        new Promise((resolve) => {
                            if (componentInstance.valid()) {
                                const data = componentInstance.getData();
                                this.http_
                                    .post('/abilitycustomfield/AddInterviewColumn', {
                                        columns: data,
                                        modelid: this.modelId,
                                        tabid: this.typeId,
                                    })
                                    .subscribe(
                                        () => {
                                            resolve();
                                            modal.destroy();
                                            this.loadData();
                                        },
                                        () => {
                                            resolve();
                                        },
                                    );
                            } else {
                                resolve();
                            }
                        }),
                },
                {
                    label: this.translateService.instant('Cancel'),
                    type: 'default',
                    onClick: (componentInstance) => {
                        modal.destroy();
                    },
                },
            ],
            nzOnOk: (data) => {},
            nzOnCancel: (data) => {},
            nzComponentParams: {
                columnData: this.notFixedColumns,
                modelId: this.modelId,
                tabId: this.typeId,
            },
        });
    }

    drop(event: CdkDragDrop<string[]>) {
        moveItemInArray(this.notFixedColumns, event.previousIndex, event.currentIndex);
        setTimeout(() => {
            this.dropList._draggables.forEach((drag) => {
                drag.element.nativeElement.querySelector('.scroll-container').scrollTop = this.currentScrollY;
            });
            this.saveColumnSort();
        }, 0);
    }

    showRowRemoveOverlay(cellData: any) {
        //权重
        if (this.abilityIdColumns['rows'][cellData.row] <= -1) {
            return;
        }

        const targetRowEle = this.fixedColumnLeft.nativeElement.querySelector('.col-box').querySelectorAll('.cell')[
            cellData.row
        ];
        if (!targetRowEle) {
            return;
        }
        this.currHoverRow = cellData.row;
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

    showOperatorPicker(event, column) {
        if (this.currTabId != 'all' && !column.rule) {
            return;
        }

        if (column.name == 'blank') {
            return;
        }
        if (event.target.tagName != 'DIV') {
            event.preventDefault();
            event.stopPropagation();
            return false;
        }
        this.closeRowRemoveOverlay();
        if (this._operatorPicker && this._operatorPicker.hasAttached()) {
            this._operatorPicker.dispose();
        }
        this.currOperColumn = column;
        const target = event.target;
        const rect = target.getBoundingClientRect();
        const config = new OverlayConfig();
        config.hasBackdrop = false;
        config.scrollStrategy = this.overlay.scrollStrategies.close();
        config.positionStrategy = this.overlay
            .position()
            .global()
            .width(`${rect.width}px`)
            .left(`${rect.left}px`)
            .top(`${rect.top}px`);
        this._operatorPicker = this.overlay.create(config);
        this._operatorPicker.attach(this.operatorPickerPortals);
        this._operatorPicker.backdropClick().subscribe(() => {
            this.closeOperatorPicker();
        });
    }

    closeOperatorPicker() {
        if (this._operatorPicker && this._operatorPicker.hasAttached()) {
            this._operatorPicker.dispose();
            this._operatorPicker = null;
        }
    }

    closeRowRemoveOverlay() {
        if (this._rowRemoveOverlayRef && this._rowRemoveOverlayRef.hasAttached()) {
            this._rowRemoveOverlayRef.dispose();
            this._rowRemoveOverlayRef = null;
        }
    }

    mouseoverCell(event: any, cellData: any, index) {
        this.lastMoveRowIndex = index;
        if (this.currTabId == 'all' || (cellData.trend && !cellData.rule)) {
            if (this.removeBtnCloseTimeoutId && this.abilityIdColumns['rows'][cellData.row] > -1) {
                clearTimeout(this.removeBtnCloseTimeoutId);
                this.removeBtnCloseTimeoutId = null;
            }
            this.notFixedColumns.forEach((columnData) => {
                try {
                    columnData.rows[cellData.row].hover = true;
                } catch (e) {}
            });

            this.fixedColumns.forEach((columnData) => {
                columnData.rows[cellData.row].hover = true;
            });

            this.rightFixedColumns.forEach((columnData) => {
                columnData.rows[cellData.row].hover = true;
            });

            this.showRowRemoveOverlay(cellData);
        }
    }

    mouseoutCell(event: any, cellData: any) {
        // this.closeRowRemoveOverlay()

        if (this.currTabId == 'all' || cellData.trend) {
            this.notFixedColumns.forEach((columnData) => {
                try {
                    columnData.rows[cellData.row].hover = false;
                } catch (e) {}
            });

            this.fixedColumns.forEach((columnData) => {
                try {
                    columnData.rows[cellData.row].hover = false;
                } catch (e) {}
            });

            this.rightFixedColumns.forEach((columnData) => {
                try {
                    columnData.rows[cellData.row].hover = false;
                } catch (e) {}
            });

            this.startRemoveBtnCloseTimeout();
        }
    }

    cellClick(rowData, columnData, event) {
        if (columnData.rule) {
            //自定义列
            return;
        }

        if (this.typeId == 2) {
            return;
        }

        if (columnData.sortable) {
            //自定义列
            return;
        }

        if (!columnData.isedit) {
            //列不可编辑
            return;
        }
        if (rowData.trend) {
            //自定义行
            return;
        }
        if (this.currTabId == 'all') {
            if (this.lastEditCell) {
                this.saveCellData(this.lastEditCell);
                this.lastEditCell.edit = false;
            }
            rowData.edit = true;
            this.lastEditCell = rowData;
            setTimeout(() => {
                // console.log(event.target,'-event.target-');
                if (event.target && event.target.querySelector('input')) {
                    event.target.querySelector('input').focus();
                }
            }, 500);
        }
    }

    toggleSort(columnData) {
        const currSort = this.currSort;
        if (currSort == '') {
            this.currSort = 'asc';
        } else if (currSort == 'asc') {
            this.currSort = 'desc';
        } else {
            this.currSort = '';
        }
        this.loadData(null);
    }

    onBlurInp(i_index, index, value: string) {
        // console.log(this.notFixedColumns,'-notFixedColumns-');
        const reg = /^[0-9]+$/;
        if (!isNaN(+value) && reg.test(value)) {
            this.updateValue(i_index, index);
        } else if (value === '' || value === null) {
            this.notFixedColumns[i_index]['rows'][index]['title'] = null;
        } else {
            this.messageService.warning('请输入正整数'); //只能输入整数
            this.notFixedColumns[i_index]['rows'][index]['title'] = this.notFixedColumns[i_index]['rows'][index][
                'title_old'
            ];
        }
    }

    updateValue(i_index, index) {
        const typeId = this.typeId;
        let k = Number(typeId) === 4 ? 1 : 0;
        let sum = 0;
        let colSum = 0;
        const notFixedColumns = this.notFixedColumns;
        for (let i = 0; i < notFixedColumns.length; i++) {
            const row = notFixedColumns[i]['rows'];
            if (i_index === i) {
                for (k; k < row.length; k++) {
                    const num_k = row[k]['title'];
                    if (num_k) {
                        colSum += Number(row[k]['title']);
                    }
                }
            }
            if (Number(typeId) === 4 && index === 0) {
                for (let j = 0; j < row.length; j++) {
                    const num_j = row[j]['title'];
                    if (index === j) {
                        if (num_j) {
                            sum += Number(num_j);
                        }
                    }
                }
            }
        }
        if (colSum > 10) {
            this.messageService.warning('同列之和不能超过10');
            this.notFixedColumns[i_index]['rows'][index]['title'] = this.notFixedColumns[i_index]['rows'][index][
                'title_old'
            ];
        }
        if (Number(typeId) === 4 && index === 0 && sum > 100) {
            this.messageService.warning('同行之和不能超过100');
            this.notFixedColumns[i_index]['rows'][index]['title'] = this.notFixedColumns[i_index]['rows'][index][
                'title_old'
            ];
        }
    }

    checkboxChange(rowData, columnData, event) {
        const postData = {
            abilityid: this.abilityIdColumns['rows'][rowData.row],
            fieldcode: rowData.columnName,
            value: event ? 1 : 0,
            modelid: this.modelId,
            tabid: this.typeId,
        };
        // console.log(postData);
        this.http_.post('/abilitycustomfield/UpdateData', postData).subscribe((res) => {
            //this.loadData();
            if (res) {
                this.refreshRightFixedColumn();
            }
        });
    }

    refreshRightFixedColumn() {
        const sort = this.currSort || '1';
        let url =
            'abilitycustomfield/GetInterviewData?Sort=' + sort + '&ModelId=' + this.modelId + '&TabId=' + this.typeId;

        this.http_.get(url, {}).subscribe((data: any[]) => {
            if (data.length > 0) {
                const lastcolumnData = data[data.length - 1];
                let columnWidth = '100px';

                // console.log(rows)
                let columnData = Object.assign({ width: columnWidth, visible: true }, lastcolumnData);
                columnData.rows = _.map(lastcolumnData.rows, (row, rowIndex) => {
                    var trend = '';
                    // var ruleRow = _.find(rowrule, item => {
                    //     return item.rowindex == rowIndex;
                    // });
                    if (columnData.rule) {
                        trend = 'customer';
                        try {
                            if (row.indexOf('+') >= 0 && row.indexOf('%') >= 0) {
                                trend = 'increase';
                            } else if (row.indexOf('-') >= 0 && row.indexOf('%') >= 0) {
                                trend = 'reduce';
                            }
                        } catch (e) {}
                    }
                    return {
                        columnName: columnData.fieldcode,
                        trend,
                        fixed: true,
                        title: row,
                        rule: columnData.rule,
                        title_old: row,
                        edit: false,
                        checked: row == 1,
                        column: data.length - 1,
                        columnType: columnData.type,
                        hover: false,
                        row: rowIndex,
                    };
                });

                this.rightFixedColumns[0] = columnData;
            }
        });
    }

    switchTab(tabId) {
        this.currTabId = tabId;
        this.pageData.currentPage = 1;
        this.loadData();
        this.closeOperatorPicker();
        // this.updateScrollbar()
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

    startRemoveBtnCloseTimeout() {
        this.removeBtnCloseTimeoutId = setTimeout(() => {
            this.closeRowRemoveOverlay();
            this.removeBtnCloseTimeoutId = null;
        }, 200);
    }

    changeColumnType(targetType) {
        if (this.currOperColumn) {
            this.currOperColumn.type = targetType;
            let data = {
                projectid: this.projectId,
                column: this.currOperColumn.name,
                columntype: this.transofrmType(targetType),
            };
            this.http.post('fields/SetColumnDimension', data).subscribe((res) => {});
            this.closeOperatorPicker();
        }
    }

    deleteRow(evt) {
        let abilityId = this.abilityIdColumns['rows'][this.lastMoveRowIndex];
        this.dialogService
            .confirm(this.translateService.instant('Confirm delete the line'))
            .then(() => {
                this.http
                    .post('/abilitycustomfield/DelInterviewRow', {
                        modelid: this.modelId,
                        tabid: this.typeId,
                        abilityid: abilityId,
                    })
                    .subscribe((res) => {
                        // console.log(res);
                        this.loadData();
                    });
            })
            .catch(() => {});
    }

    deleteColumn(column) {
        // console.log(column,'-column-');
        //this.sendDeleteColumnReq(column, 0);
        this.dialogService
            .confirm('确认删除列吗?')
            .then(() => {
                //this.sendDeleteColumnReq(column, 1);
                this.http_
                    .post('/abilitycustomfield/DelInterviewColumn', {
                        modelid: this.modelId,
                        tabid: this.typeId,
                        fieldcode: column.fieldcode,
                    })
                    .subscribe(() => {
                        this.loadData();
                    });
            })
            .catch(() => {});
    }

    export() {
        // if (this.pageState != DataState.EMPTY) {
        //     const userInfo = this.appService.getUserInfo();
        //     let token = this.authService.getToken();
        //     token = token.replace('Bearer ', '');
        //     let url: string =
        //         this.appService.getServerUrl() +
        //         'Excel/export?projectid=' +
        //         this.projectService.currProjectId +
        //         '&access_token=' +
        //         token;
        //     url = url.replace('/v1', '');
        //     window.open(url);
        // }
    }

    sendDeleteColumnReq(column, step) {
        this.http
            .post('fields/DeleteColumn', {
                fieldtype: column.rule ? column.rule : 0, //是否原始数据
                projectid: this.projectId,
                fieldcode: column.name,
                operationCode: step,
            })
            .subscribe((res: any) => {
                const { code, message } = res;
                if (code) {
                    //需要弹出确认框
                    this.dialogService
                        .confirm(message)
                        .then(() => {
                            this.sendDeleteColumnReq(column, 1);
                        })
                        .catch(() => {});
                } else {
                    const findIndex = this.notFixedColumns.indexOf(this.currOperColumn);
                    if (findIndex >= 0) {
                        this.notFixedColumns.splice(findIndex, 1);
                    }
                    this.loadData();
                }
            });
    }

    editColumn(event) {
        event.preventDefault();
        event.stopPropagation();
        this.closeOperatorPicker();
        if (this.currOperColumn) {
            this.popupAddColumn(this.currOperColumn);
        }
    }

    updateScrollbar() {
        if (this.lastScrollUpdateTimeout) {
            clearTimeout(this.lastScrollUpdateTimeout);
            this.lastScrollUpdateTimeout = null;
        }
        //DOTO 暂时解决滚动条不更新的问题
        this.tableContainer.nativeElement.querySelector('.col-list').scrollLeft = 1;
        this.lastScrollUpdateTimeout = setTimeout(() => {
            if (this.horizontalScrollbar) {
                this.horizontalScrollbar.update();
            }

            if (this.fixedColumnScrollbar) {
                this.fixedColumnScrollbar.update();
            }
            this.scrollDirective.updateScrollbar();
            this.lastScrollUpdateTimeout = null;
        }, 100);
    }

    isChineseStr(str) {
        if (/^[\u3220-\uFA29]+$/.test(str)) {
            return true;
        } else {
            return false;
        }
    }

    /**
     *  超过5个字符中文宽度固定设置为200否则为87
     * @param rows
     */
    calcColumnWidth(rows) {
        let row;
        let maxWidth = 130;
        // for(var i=0;i<rows.length;i++){
        //     row = String(rows[i]);
        //     var cnStrCount = 0;
        //     for(var j=0;j<row.length;j++){
        //         if(this.isChineseStr(row[j])){
        //             cnStrCount++;
        //         }
        //     }
        //     if(cnStrCount>5){
        //         maxWidth = 200;
        //         break;
        //     }
        // }
        return maxWidth + 'px';
    }

    beforeUpload = (file: File) => {
        if (this.uploading) {
            return false;
        }
        const acceptedFiles = '.xls,.xlsx';
        const acceptedFilesArray = acceptedFiles.split(',');
        const fileName = '' + file.name;
        const mimeType = '' + file.type;
        const baseMimeType = mimeType.replace(/\/.*$/, '');

        let fileTypeValid = acceptedFilesArray.some((type) => {
            const validType = type.trim();
            if (validType.charAt(0) === '.') {
                return (
                    fileName
                        .toLowerCase()
                        .indexOf(
                            validType.toLowerCase(),
                            fileName.toLowerCase().length - validType.toLowerCase().length,
                        ) !== -1
                );
            } else if (/\/\*$/.test(validType)) {
                // This is something like a image/* mime type
                return baseMimeType === validType.replace(/\/.*$/, '');
            }
            return mimeType === validType;
        });

        if (!fileTypeValid) {
            this.messageService.error(this.translateService.instant('Invalid file Format Tip2'));
        }

        return fileTypeValid;
    };

    uploadRequest = (item: UploadXHRArgs) => {
        // 构建一个 FormData 对象，用于存储文件或其他参数
        if (this.pageState == DataState.EXIST_DATA) {
            const msg = this.translateService.instant('Import the prompt');
            this.dialogService
                .confirm(msg)
                .then(() => {
                    this.fileUploadConfirmPoped = false;
                    this.sentUploadRequest(item);
                })
                .catch(() => {});
        } else {
            this.fileUploadConfirmPoped = false;
            this.sentUploadRequest(item);
        }
    };

    sentUploadRequest(item: UploadXHRArgs, resendData?) {
        // console.log('uploadRequest');
        this.lastUploadItem = item;
        const formData = new FormData();
        formData.append('file', item.file as any);
        formData.append('projectId', this.projectId);
        if (resendData) {
            formData.append('code', resendData);
        }
        this.uploading = true;
        this.showOverlayLoading();
        let url = '';
        if (resendData) {
            url = this.appService.getServerUrl() + 'fields/ImportConfirmData';
        } else {
            url = this.appService.getServerUrl() + 'fields/ImportFileData';
        }
        const req = new HttpRequest('POST', url, formData, {
            reportProgress: true,
            withCredentials: false,
        });
        // 始终返回一个 `Subscription` 对象，nz-upload 会在适当时机自动取消订阅
        return this.http.request(req).subscribe(
            (event: HttpEvent<{}>) => {
                if (event.type === HttpEventType.UploadProgress) {
                    if (event.total > 0) {
                        // tslint:disable-next-line:no-any
                        (event as any).percent = (event.loaded / event.total) * 100;
                    }
                    // 处理上传进度条，必须指定 `percent` 属性来表示进度
                    item.onProgress(event, item.file);
                } else if (event instanceof HttpResponse) {
                    // 处理成功
                    this.uploading = false;
                    this.closeOverlayLoading();
                    item.onSuccess(event.body, item.file, event);
                }
            },
            (err) => {
                // 处理失败
                this.closeOverlayLoading();
                this.uploading = false;
                item.onError(err, item.file);
            },
        );
    }

    handleFileChange({ file, fileList }): void {
        const status = file.status;
        if (status !== 'uploading') {
            // console.log(file);
        }
        if (status === 'done') {
            const { code, message } = file.response;
            if (code == 1 || code == 2) {
                // console.log('popup');
                if (this.fileUploadConfirmPoped) {
                    return;
                }
                this.dialogService
                    .confirm(message)
                    .then(() => {
                        this.sentUploadRequest(this.lastUploadItem, code);
                        this.fileUploadConfirmPoped = true;
                    })
                    .catch(() => {});
            } else if (code == 3) {
                //错误信息展示
                this.popupErrorData(file.response);
            } else {
                this.loadData();
            }
        } else if (status === 'error') {
        }
    }

    popupErrorData(data) {
        // let modal = this.modalService.create({
        //     nzTitle: '错误信息',
        //     nzWidth: '584px',
        //     nzClosable: true,
        //     nzMaskClosable: false,
        //     nzWrapClassName: '',
        //     nzZIndex: 1001,
        //     nzBodyStyle: { padding: '5px 0px 5px 15px' },
        //     nzContent: ErrorDataComponent,
        //     nzFooter: null,
        //     nzOnOk: data => {},
        //     nzOnCancel: data => {},
        //     nzComponentParams: {
        //         data: data,
        //     },
        // });
        // modal.afterClose.subscribe(() => {});
    }

    saveColumnSort() {
        const sortedColumns = _.map(this.notFixedColumns, (column, index) => {
            return {
                name: column.fieldcode,
                sequence: index + 1,
            };
        });
        const postData = {
            fieldsource: sortedColumns,
            modelid: this.modelId,
            tabid: this.typeId,
        };
        // console.log(postData,'----');
        this.http.post('abilitycustomfield/DragInterviewColumn', postData).subscribe(() => {});
    }

    transofrmType(origin) {
        let ret = 0;
        switch (origin) {
            case PROJECT_TYPE.ASSESSMENT:
                ret = 1;
                break;
            case PROJECT_TYPE.PERFOMANCE:
                ret = 2;
                break;
            case PROJECT_TYPE.PEOPLE:
                ret = 3;
                break;
            default:
                break;
        }

        return ret;
    }

    saveCellData(cellData) {
        // console.log(cellData);
        try {
            if (cellData.title.trim() == '') {
                cellData.title = cellData.title_old;
                return;
            }
        } catch (e) {}

        if (cellData.title != cellData.title_old) {
            let abilityid = this.abilityIdColumns.rows[cellData.row];
            const postData = {
                fieldcode: cellData.columnName,
                value: cellData.title,
                abilityid: abilityid,
                modelid: this.modelId,
                tabid: this.typeId,
            };
            this.http.post('abilitycustomfield/UpdateData', postData).subscribe((res) => {
                if (res) {
                    cellData.title_old = cellData.title;
                    this.loadData();
                }
            });
        }
    }

    showOverlayLoading() {
        const config = new OverlayConfig();
        config.hasBackdrop = false;
        config.scrollStrategy = this.overlay.scrollStrategies.close();
        config.positionStrategy = this.overlay.position().global().width('100%').height('100%').left(`0px`).top(`0px`);
        this._overlayLoading = this.overlay.create(config);
        this._overlayLoading.attach(this.overloayLoadingPortals);
    }

    closeOverlayLoading() {
        if (this._overlayLoading && this._overlayLoading.hasAttached()) {
            this._overlayLoading.dispose();
            this._overlayLoading = null;
        }
    }

    exportHandler() {}

    importHandler() {}

    ngOnDestroy() {
        if (this.horizontalScrollbar) {
            this.horizontalScrollbar.destroy();
            this.horizontalScrollbar = null;
        }
        if (this.fixedColumnScrollbar) {
            this.fixedColumnScrollbar.destroy();
            this.fixedColumnScrollbar = null;
        }

        if (this.verticalScrollListener) {
            this.verticalScrollListener();
        }

        if (this.lastLoadSub) {
            this.lastLoadSub.unsubscribe();
            this.lastLoadSub = null;
        }

        this.destroy$.next();
        this.destroy$.complete();
        this.closeOverlayLoading();
        this.closeOperatorPicker();
        this.closeRowRemoveOverlay();
    }
}
