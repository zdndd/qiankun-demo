import { Component, OnInit, Input } from '@angular/core';
@Component({
    selector: 'compared-report-content',
    templateUrl: './compared-report-content.component.html',
    styleUrls: ['./compared-report-content.component.less'],
})
export class ComparedReportContentComponent implements OnInit {
    @Input() title: string;
    @Input() color: string;
    constructor() {}

    ngOnInit() {}
}
