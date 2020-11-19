import { Component, OnInit, OnChanges, SimpleChanges, Input } from '@angular/core';

@Component({
    selector: 'nine-table',
    templateUrl: './nine-table.component.html',
    styleUrls: ['./nine-table.component.less'],
})
export class NineTableComponent implements OnChanges {
    empCode;
    pageState = 0;
    currentId = 5;
    nineArr = [['高', 0, 1, 2], ['中', 3, 4, 5], ['低', 6, 7, 8]];
    @Input() nineData = [];

    icons = ['nor', 'good', 'great', 'nor', 'good', 'good', 'nor', 'nor', 'nor'];

    constructor() {}

    ngOnChanges(changes: SimpleChanges) {
        if (changes.nineData && !changes.nineData.firstChange) {
            this.getData();
        }
    }
    getData() {
        if (this.nineData.length > 0) {
            this.pageState = 1;
        } else {
            this.pageState = 2;
        }
    }
}
