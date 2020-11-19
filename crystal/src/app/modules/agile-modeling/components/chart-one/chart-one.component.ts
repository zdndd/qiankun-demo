import { Component, Input, OnInit } from '@angular/core';
import { ChartItemData } from 'src/app/constants/app.constants';
@Component({
    selector: 'chart-one',
    templateUrl: './chart-one.component.html',
    styleUrls: ['./chart-one.component.less'],
})
export class ChartOneComponent implements OnInit {
    constructor() {}
    @Input() data: ChartItemData[];
    ngOnInit() {}
}
