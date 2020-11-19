import { Component } from '@angular/core';
import { AgileBaseChart } from '../base-chart';

@Component({
    selector: 'chart-two',
    templateUrl: './chart-two.component.html',
    styleUrls: ['./chart-two.component.less'],
})
export class ChartTwoComponent extends AgileBaseChart {
    constructor() {
        super();
    }
}
