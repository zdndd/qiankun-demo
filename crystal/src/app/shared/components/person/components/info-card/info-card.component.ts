import { Component, Input, OnChanges, SimpleChanges, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'info-card',
    templateUrl: './info-card.component.html',
    styleUrls: ['./info-card.component.less'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoCardComponent implements OnChanges {
    pageState = 0;
    _personalInfo: any = {};

    @Input() personalInfo;
    constructor(private cd: ChangeDetectorRef) {}

    ngOnChanges(changes: SimpleChanges) {
        if (changes.personalInfo && !changes.personalInfo.firstChange) {
            this.getData();
        }
    }

    getData() {
        if (this.personalInfo && JSON.stringify(this.personalInfo) !== '[]') {
            this.pageState = 1;
            this._personalInfo = this.personalInfo;
        } else {
            this.pageState = 2;
        }
    }
}
