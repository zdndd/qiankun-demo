import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'common-list',
    templateUrl: './common-list.component.html',
    styleUrls: ['./common-list.component.less'],
})
export class CommonListComponent implements OnInit {
    @Input() headerList;
    @Input() listOfData;
    @Input() pageindex;
    @Input() pagesize;
    @Input() totalcount;

    @Output() pageChange: EventEmitter<any> = new EventEmitter();
    @Output() checkedIds: EventEmitter<any> = new EventEmitter();

    math = Math;

    isAllDisplayDataChecked = false;
    isIndeterminate = false;
    listOfDisplayData: any[] = []; //当前页面数组
    mapOfCheckedId: { [key: string]: boolean } = {};

    listContext(item) {
        return {
            $implicit: item, // 默认传出cellValue数据
        };
    }
    constructor() {}

    ngOnInit() {}

    //翻页
    pageIndexChange($event) {
        this.pageChange.emit($event);
        this.pageindex = $event;
    }

    currentPageDataChange($event: any[]): void {
        this.listOfDisplayData = $event;
        this.refreshStatus();
    }

    checkAll(value: boolean): void {
        this.listOfDisplayData
            .filter(item => !item.disabled)
            .forEach(item => (this.mapOfCheckedId[item.id] = value));
        this.refreshStatus();
    }

    refreshStatus(): void {
        this.isAllDisplayDataChecked = this.listOfDisplayData
            .filter(item => !item.disabled)
            .every(item => this.mapOfCheckedId[item.id]);
        this.isIndeterminate =
            this.listOfDisplayData
                .filter(item => !item.disabled)
                .some(item => this.mapOfCheckedId[item.id]) && !this.isAllDisplayDataChecked;

        // console.log(this.mapOfCheckedId);
        this.checkedIds.emit(this.mapOfCheckedId);
    }
}
