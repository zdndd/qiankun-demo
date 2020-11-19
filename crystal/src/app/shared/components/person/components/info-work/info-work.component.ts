import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import _ from 'lodash';

@Component({
    selector: 'info-work',
    templateUrl: './info-work.component.html',
    styleUrls: ['./info-work.component.less'],
})
export class InfoWorkComponent implements OnChanges {
    @Input() color = '';
    @Input()
    workArr = [];
    showYear = 0;
    pageState = 0;
    constructor(private route: ActivatedRoute) {}

    ngOnChanges(changes: SimpleChanges) {
        if (changes.workArr && !changes.workArr.firstChange) this.getData();
    }
    getData() {
        if (this.workArr && this.workArr.length > 0) {
            this.showYear = _.filter(this.workArr, ['isoldexperience', false]).length - 1;
            this.pageState = 1;
        } else {
            this.pageState = 2;
        }
    }
}
