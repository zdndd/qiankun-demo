import {
    Component,
    OnInit,
    ChangeDetectorRef,
    Inject,
    Input,
    Optional,
    Output,
    ChangeDetectionStrategy,
    HostListener,
    Renderer2,
    ElementRef,
    EventEmitter,
} from '@angular/core';
import { _HttpClient } from '../../../core/net/http.client';
import { HttpClient } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';
import { NzDropdownContextComponent, NzDropdownService, NzMenuItemDirective, NzDropDownComponent } from 'ng-zorro-antd';
declare var $: any;
import * as _ from 'lodash';

import { ScrollBarHelper } from '../../../utils/scrollbar-helper';
import { Subject, Subscription, fromEvent, merge, of } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'vx-tableview',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './table-view.component.html',
    styleUrls: ['./table-view.component.less'],
})
export class VXTableViewComponent implements OnInit {
    _fixedLeftWidth = 100;
    _fixedRightWidth = 100;
    _height = null;

    _fixedLeftCoumns = [];
    _fixedRightCoumns = [];
    _noFixedCoumns = [];
    _columns = [];
    _rows = [];
    _rawRows = [];
    _queryParams = {};

    //分页相关
    _currentPage = 1;
    _pageSize = 10;
    _totalCount = 0;

    unlistenScroll = null;
    sortData = { key: '', value: '' };

    dropdownShow = false;
    private unsubscribe$ = new Subject<void>();

    private dropdown: NzDropdownContextComponent;
    public dropdownMenus = [];
    private dropdownIndex = -1;

    private _horizontalScrollBar: any;
    private _verticalScrollBar: any;
    overlayBackdropClickSubscription: Subscription;

    constructor(
        public translateService: TranslateService,
        public cd: ChangeDetectorRef,
        private nzDropdownService: NzDropdownService,
        public http: _HttpClient,
        @Optional() @Inject(DOCUMENT) private _document: any,
        public element: ElementRef,
        public render2: Renderer2,
    ) {}

    @Input() tableId = '';
    @Input() title = '';
    @Input() showHeader = true;
    @Input() pageable = true;
    @Input() serverUrl;
    @Input() loading = false;
    @Input() buttons = [];
    @Input() queryData = {};
    @Input() offset = 1;

    @Output() buttonClick: EventEmitter<Number> = new EventEmitter();
    @Output() operationLinkClick: EventEmitter<any> = new EventEmitter();
    @Output() dropdownItemClick: EventEmitter<any> = new EventEmitter();
    @Output() linkActionClick: EventEmitter<any> = new EventEmitter();

    @Input()
    set currentPage(value) {
        this._currentPage = value;
    }

    get currentPage() {
        return this._currentPage;
    }

    @Input()
    set pageSize(value) {
        this._pageSize = value;
    }

    get pageSize() {
        return this._pageSize;
    }

    @Input()
    set rows(value) {
        if (value) {
            this._rawRows = value;
            this._rows = value;
            this._totalCount = value.length;

            //front pager
            if (this.pageable) {
                let startIndex = (this._currentPage - 1) * this._pageSize;
                let endIndex = startIndex + this._pageSize;
                if (endIndex >= this._rawRows.length) {
                    endIndex = this._rawRows.length;
                }
                this._rows = this._rawRows.slice(startIndex, endIndex);
            } else {
                this._rows = this._rawRows.slice(0, this._rawRows.length);
            }
        }
    }

    get rows() {
        return this._rows;
    }

    @Input()
    set columns(value) {
        this._columns = value;
        this._fixedLeftCoumns = this._columns.filter((item) => {
            return item.fixedLeft;
        });
        this._fixedRightCoumns = this._columns.filter((item) => {
            return item.fixedRight;
        });
        this._noFixedCoumns = this._columns.filter((item) => {
            return !item.fixedRight && !item.fixedLeft;
        });
        let fixedLeftWidth = 0;
        let fixedRightWidth = 0;
        this._fixedLeftCoumns.forEach((item) => {
            item.width = item.width || 100;
            fixedLeftWidth += item.width;
        });
        this._fixedRightCoumns.forEach((item) => {
            item.width = item.width || 100;
            fixedRightWidth += item.width;
        });
        this._noFixedCoumns.forEach((item) => {
            item.width = item.width || 150;
        });

        this._fixedLeftWidth = fixedLeftWidth;
        this._fixedRightWidth = fixedRightWidth;
    }

    get columns() {
        return this._columns;
    }

    @Input()
    set height(value) {
        this._height = value;
    }

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        event.preventDefault();
        this.draw(true);
    }

    ngOnInit() {
        this.setPageData();
    }

    ngAfterViewInit() {
        var $hostEle = $(this.element.nativeElement);
        this.unlistenScroll = this.render2.listen($hostEle.find('.tbl-footer .tbl-no-fixed')[0], 'scroll', (event) => {
            setTimeout(
                function () {
                    if (this._rows.length > 0)
                        $hostEle.find('.tbl-content .tbl-no-fixed').scrollLeft($(event.target).scrollLeft());
                    $hostEle.find('.tbl-header .tbl-no-fixed').scrollLeft($(event.target).scrollLeft());
                }.bind(this),
                0,
            );
        });

        this.draw(false);

        $(document).on(
            'mouseover',
            '.tbl-content > table > tbody > tr, .tbl-content > .tbl-no-fixed > table > tbody > tr',
            function (event) {
                $(this)
                    .parents('.tbl-content')
                    .find('.tbl-freeze-1 > tbody > tr:nth-child(' + ($(this).index() + 1) + ')')
                    .addClass('hover');
                $(this)
                    .parents('.tbl-content')
                    .find('.tbl-freeze-2 > tbody > tr:nth-child(' + ($(this).index() + 1) + ')')
                    .addClass('hover');
                $(this)
                    .parents('.tbl-content')
                    .find('.tbl-no-fixed > table > tbody > tr:nth-child(' + ($(this).index() + 1) + ')')
                    .addClass('hover');
            },
        );

        $(document).on('mouseleave', '.tbl-content table > tbody > tr', function (event) {
            $('.tbl-content table > tbody > tr.hover').removeClass('hover');
        });
    }

    draw(update = false, delay?) {
        delay = delay || 100;
        var $hostEle = $(this.element.nativeElement);

        setTimeout(() => {
            var fullWidth = this.element.nativeElement.offsetWidth;
            var nofixWidth = $hostEle.find('.tbl-header .tbl-no-fixed > table').width();
            $hostEle.find('.tbl-footer .tbl-no-fixed > .tbl-dummy-content').css('width', nofixWidth + 'px');
            $hostEle.find('.tbl-content .tbl-no-fixed > table').css('width', nofixWidth + 'px');
            let visibleWidth = fullWidth - this._fixedLeftWidth - this._fixedRightWidth;
            $hostEle.find('.tbl-footer .tbl-no-fixed').css('width', visibleWidth + 'px');

            // $hostEle.find('.tbl-content').css('height', '100%')

            if (update) {
                if (this._horizontalScrollBar) {
                    this._horizontalScrollBar.update();
                }
                if (this._verticalScrollBar) {
                    this._verticalScrollBar.update();
                }
            } else {
                this._verticalScrollBar = ScrollBarHelper.makeScrollbar(
                    this.element.nativeElement.querySelector('.tbl-content'),
                );
                this._horizontalScrollBar = ScrollBarHelper.makeScrollbar(
                    this.element.nativeElement.querySelector('.tbl-footer .tbl-no-fixed'),
                );
            }
        }, delay);
    }

    linkClickHandler(rowIndex, data) {
        this.operationLinkClick.emit({ action: data['value'], data: this._rows[rowIndex] });
    }

    onPageIndexChange(page) {
        this._currentPage = page;
        this.setPageData();
    }

    reload() {
        this.currentPage = 1;
        this.setPageData();
    }

    setPageData() {
        if (this.serverUrl) {
            console.log(this.serverUrl);
            this.loading = true;

            let options = Object.assign({ pagesize: this._pageSize, currentpage: this._currentPage }, this.queryData);
            if (this.sortData && this.sortData.key && this.sortData.value) {
                if (this.sortData.value == 'ascending') options['sort'] = this.sortData.key;
                else options['sort'] = '-' + this.sortData.key;
            }

            this.http.get(this.serverUrl, options).subscribe(
                (res: any) => {
                    this._totalCount = res.totalcount;
                    this.loading = false;
                    res.rows = res.rows || [];
                    _.each(res.rows, (row) => {
                        _.each(row, (column, columnIndex) => {
                            if (typeof column == 'string') {
                                if (column.indexOf('__file__') >= 0) {
                                    let fileInfo = column.split('__file__');
                                    row[columnIndex] = '';
                                    // "<a href='" +
                                    // this.configService.get('ATTACHMENT_URL') +
                                    // fileInfo[1] +
                                    // "'>" +
                                    // fileInfo[0] +
                                    // '</a>';
                                }
                            }
                        });
                    });
                    this._rows = res.rows;
                    if (this._verticalScrollBar) {
                        this._verticalScrollBar.update();
                    }
                    if (this._horizontalScrollBar) {
                        this._horizontalScrollBar.update();
                    }
                    this.cd.detectChanges();
                },
                () => {
                    this._rows = [];
                    this.loading = false;
                    this.cd.detectChanges();
                },
            );
        } else {
            if (this.pageable) {
                let startIndex = (this._currentPage - 1) * this._pageSize;
                let endIndex = startIndex + this._pageSize;
                if (endIndex >= this._rawRows.length) {
                    endIndex = this._rawRows.length;
                }
                this._rows = this._rawRows.slice(startIndex, endIndex);
            } else {
                this._rows = this._rawRows.slice(0, this._rawRows.length);
            }
        }
    }

    showPopUp(event, template, fieldItem, rowIndex) {
        let dropdownData = fieldItem.dropdowns;
        if (fieldItem.dropdownCallback) {
            dropdownData = fieldItem.dropdownCallback(this._rows[rowIndex], this.translateService);
        }
        this.dropdownMenus = dropdownData;
        this.dropdownIndex = rowIndex;
        this.dropdown = this.nzDropdownService.create(event, template);
        this.dropdownShow = true;
        setTimeout(() => {
            this.overlayBackdropClickSubscription = this.subscribeOverlayBackdropClick();
        }, 100);
    }

    subscribeOverlayBackdropClick(): Subscription {
        return fromEvent(this._document, 'click')
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((event: MouseEvent) => {
                console.log('document click');
                const clickTarget = event.target as HTMLElement;
                if (clickTarget && clickTarget.className == 'vx-icon-caozuo') {
                    return;
                }
                //this.nzDropdownService.close()
                // console.log(clickTarget==this.elementRef.nativeElement)
                // console.log(this.elementRef.nativeElement.contains(clickTarget))
                // console.log(this.cdkConnectedOverlay.overlayRef.overlayElement.contains(clickTarget))
                // if(clickTarget!=this.dropdown. && !this.elementRef.nativeElement.contains(clickTarget)  && this.overlayOpen && !this.nzDropdownService.overlayRef.overlayElement.contains(clickTarget)){
                //     this.hideOverlay()
                // }

                if (this.dropdownShow) this.closePopUp(null);
            });
    }

    closePopUp(e: any): void {
        // console.log(this.dropdownMenus[e.nzMenuDirective.menuItems.indexOf(e)]);
        if (e) {
            this.dropdownItemClick.emit({
                action: this.dropdownMenus[e.nzMenuDirective.menuItems.indexOf(e)]['value'],
                data: this._rows[this.dropdownIndex],
            });
        }
        this.dropdownShow = false;
        if (this.dropdown) this.dropdown.close();
        this.dropdownIndex = -1;
        this.unsubscribe$.next();

        if (this.overlayBackdropClickSubscription) {
            this.overlayBackdropClickSubscription.unsubscribe();
            this.overlayBackdropClickSubscription = null;
        }
    }

    buttonClickHandler(index) {
        this.buttonClick.emit(index);
    }

    lickActionHandler(fieldData, rowData) {
        this.linkActionClick.emit({ fieldData, rowData });
    }

    doSorting(event, fieldData, sortValue) {
        console.log(sortValue);
        event.preventDefault();
        event.stopPropagation();
        if (sortValue) {
            if (sortValue == this.sortData['value'] && this.sortData['key'] == fieldData.field) {
                //相等的情况
                this.sortData['value'] = '';
                this.sortData['key'] = '';
            } else {
                this.sortData['key'] = fieldData.field;
                this.sortData['value'] = sortValue;
            }
        } else {
            const currSortKey = this.sortData['key'];
            const currSortValue = this.sortData['value'];
            if (this.sortData['key'] == fieldData.field) {
                this.sortData['value'] = currSortValue == 'ascending' ? 'descending' : 'ascending';
            } else {
                this.sortData['key'] = fieldData.field;
                this.sortData['value'] = 'ascending';
            }
        }

        console.log(this.sortData);
        this.setPageData();
    }

    ngOnDestroy() {
        if (this._horizontalScrollBar) {
            this._horizontalScrollBar.destroy();
            this._horizontalScrollBar = null;
        }
        if (this._verticalScrollBar) {
            this._verticalScrollBar.destroy();
            this._verticalScrollBar = null;
        }

        $(document).off(
            'mouseover',
            '.tbl-content > table > tbody > tr, .tbl-content > .tbl-no-fixed > table > tbody > tr',
        );
        $(document).off('mouseleave', '.tbl-content table > tbody > tr');

        if (this.unlistenScroll) {
            this.unlistenScroll();
            this.unlistenScroll = null;
        }

        if (this.dropdown) this.dropdown.close();
        this.dropdownIndex = -1;

        if (this.overlayBackdropClickSubscription) {
            this.overlayBackdropClickSubscription.unsubscribe();
            this.overlayBackdropClickSubscription = null;
        }
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
