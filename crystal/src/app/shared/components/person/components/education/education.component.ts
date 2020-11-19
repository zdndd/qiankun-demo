import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
@Component({
    selector: 'education',
    templateUrl: './education.component.html',
    styleUrls: ['./education.component.less'],
})
export class EducationComponent implements OnInit {
    empCode;
    @Input() educateData = [];
    pageState = 0;
    constructor() {}

    ngOnInit() {}

    getData() {
        if (this.educateData && this.educateData.length > 0) {
            this.pageState = 1;
        } else {
            this.pageState = 2;
        }
    }
}
