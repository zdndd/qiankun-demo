import {
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    TemplateRef,
    ViewChild
} from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { isInteger } from 'ng-zorro-antd';

export function toBoolean(value: any): boolean {
    return value != null && `${value}` !== 'false';
  }


@Component({
    selector: 'vx-pagination',
    template: `
    <ul class="pagination" *ngIf="pages.length>1">
        <li>
           <a (click)="jumpPreOne()">
                <i class="vx-icon-first-page"></i>
            </a>
        </li>
        <li  *ngFor="let page of pages" [class.active]="pageIndex==page.index">
            <a (click)="jumpPage(page.index)">{{page.index}}</a>
        </li>
        <li>
            <a (click)="jumpNextOne()">
                <i class="vx-icon-last-page"></i>
            </a>
        </li>
        <li>
            <span class="pagination-jump">
            <input type="text" [(ngModel)]="_pageIndex" #quickJumperInput (keydown.enter)="handleKeyDown($event,quickJumperInput,true)">/{{lastIndex}}{{ 'Page' | translate}}
            </span>
    </li>
</ul>
  `
})
export class VxPaginationComponent implements OnInit, OnDestroy {
    private unsubscribe$ = new Subject<void>();
    // tslint:disable-next-line:no-any
    locale: any = {};
    @ViewChild('renderItemTemplate',{static: true}) private _itemRender: TemplateRef<{ $implicit: 'page' | 'prev' | 'next', page: number }>;
    private _showSizeChanger = false;
    private _showQuickJumper = false;
    private _simple = false;
    private _hideOnSinglePage = false;
    private _pageSize = 10;
    private _pageSizeOptions = [10, 20, 30, 40];
    private _total: number;
    _pageIndex = 1;
    firstIndex = 1;
    pages = [];
    @Input() nzShowTotal: TemplateRef<{ $implicit: number, range: [number, number] }>;
    @Input() nzInTable = false;
    @Input() nzSize: string;
    @Output() nzPageSizeChange: EventEmitter<number> = new EventEmitter();
    @Output() nzPageIndexChange: EventEmitter<number> = new EventEmitter();

    @Input()
    set nzItemRender(value: TemplateRef<{ $implicit: 'page' | 'prev' | 'next', page: number }>) {
        this._itemRender = value;
    }

    get nzItemRender(): TemplateRef<{ $implicit: 'page' | 'prev' | 'next', page: number }> {
        return this._itemRender;
    }

    @Input()
    set nzShowSizeChanger(value: boolean) {
        this._showSizeChanger = toBoolean(value);
    }

    get nzShowSizeChanger(): boolean {
        return this._showSizeChanger;
    }

    @Input()
    set nzHideOnSinglePage(value: boolean) {
        this._hideOnSinglePage = toBoolean(value);
    }

    get nzHideOnSinglePage(): boolean {
        return this._hideOnSinglePage;
    }

    @Input()
    set nzShowQuickJumper(value: boolean) {
        this._showQuickJumper = toBoolean(value);
    }

    get nzShowQuickJumper(): boolean {
        return this._showQuickJumper;
    }

    @Input()
    set nzSimple(value: boolean) {
        this._simple = toBoolean(value);
    }

    get nzSimple(): boolean {
        return this._simple;
    }

    /** page size changer select values */
    @Input()
    set nzPageSizeOptions(value: number[]) {
        if (value && value.length) {
            this._pageSizeOptions = value;
        }
    }

    get nzPageSizeOptions(): number[] {
        return this._pageSizeOptions;
    }

    @Input()
    set pageIndex(value: number) {
        if (this._pageIndex === value) {
            return;
        }
        if (value > this.lastIndex) {
            this._pageIndex = this.lastIndex;
        } else if (value < this.firstIndex) {
            this._pageIndex = this.firstIndex;
        } else {
            this._pageIndex = Number(value);
        }
        this.buildIndexes();
    }

    get pageIndex(): number {
        return this._pageIndex;
    }

    @Input()
    set pageSize(value: number) {
        if (value === this._pageSize) {
            return;
        }
        console.log("set pageSize:"+value)
        this._pageSize = value;
        const pageIndexOverflow = this.checkLastIndexOverflow();
        if (pageIndexOverflow) {
            this.pageIndex = this.lastIndex;
            this.nzPageIndexChange.emit(this.lastIndex);
        }
        this.buildIndexes();
    }

    get pageSize(): number {
        return this._pageSize;
    }

    @Input()
    set total(value: number) {
        this._total = value;
        this.buildIndexes();
    }

    get total(): number {
        return this._total;
    }

    jumpPage(index: number): void {
        if (index === this.pageIndex) {
            return;
        }

        if (index < this.firstIndex) {
            this.pageIndex = this.firstIndex;
        } else if (index > this.lastIndex) {
            this.pageIndex = this.lastIndex;
        } else {
            this.pageIndex = index;
        }
        this.nzPageIndexChange.emit(this.pageIndex);
    }

    jumpPreFive(): void {
        this.jumpPage(this.pageIndex - 5);
    }

    jumpNextFive(): void {
        this.jumpPage(this.pageIndex + 5);
    }

    jumpPreOne(): void {
        if (this.isFirstIndex) {
            return;
        }
        this.jumpPage(this.pageIndex - 1);
    }

    jumpNextOne(): void {
        if (this.isLastIndex) {
            return;
        }
        this.jumpPage(this.pageIndex + 1);
    }

    onPageSizeChange($event: number): void {
        this.pageSize = $event;
        this.nzPageSizeChange.emit($event);
    }

    handleKeyDown(e: KeyboardEvent, input: HTMLInputElement, clearInputValue: boolean): void {
        const target = input;
        const inputValue = target.value;
        const currentInputValue = this.pageIndex;
        let value;

        if (inputValue === '') {
            value = inputValue;
        } else if (isNaN(Number(inputValue))) {
            value = currentInputValue;
        } else {
            value = Number(inputValue);
        }
        this.handleChange(value, target, clearInputValue);
    }

    isValid(page: number): boolean {
        return isInteger(page) && (page >= 1) && (page !== this.pageIndex) && (page <= this.lastIndex);
    }

    handleChange(value: number, target: HTMLInputElement, clearInputValue: boolean): void {
        const page = value;
        if (this.isValid(page)) {
            this.pageIndex = page;
            this.nzPageIndexChange.emit(this.pageIndex);
        }
        if (clearInputValue) {
            target.value = null;
        } else {
            target.value = `${this.pageIndex}`;
        }
    }

    checkLastIndexOverflow(): boolean {
        return this.pageIndex > this.lastIndex;
    }

    get lastIndex(): number {
        return Math.ceil(this.total / this.pageSize);
    }

    /** generate indexes list */
    buildIndexes(): void {
        const tmpPages = [];
        if (this.lastIndex <= 3) {
            for (let i = 1; i <= this.lastIndex; i++) {
                tmpPages.push({ index: i });
            }

        } else {
            const current = +this.pageIndex;
            //最多显示3页
            let left = Math.max(1, current - 1);
            let right = Math.min(current + 1, this.lastIndex);

            if (current - 1 < 2) {
                right = 3;
            }

            if (this.lastIndex - current < 2) {
                left = this.lastIndex - 2;
            }

            console.log(left,right)

            for (let i = left; i <= right; i++) {
                tmpPages.push({ index: i });
            }
        }
        this.pages = tmpPages;
    }

    get isLastIndex(): boolean {
        return this.pageIndex === this.lastIndex;
    }

    get isFirstIndex(): boolean {
        return this.pageIndex === this.firstIndex;
    }

    min(val1: number, val2: number): number {
        return Math.min(val1, val2);
    }

    constructor() {
    }

    ngOnInit(): void {

    }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
