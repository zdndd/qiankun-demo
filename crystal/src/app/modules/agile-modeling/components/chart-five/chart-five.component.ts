import { Component } from '@angular/core';
import { AgileBaseChart } from '../base-chart';
@Component({
    selector: 'chart-five',
    templateUrl: './chart-five.component.html',
    styleUrls: ['./chart-five.component.less'],
})
export class ChartFiveComponent extends AgileBaseChart {
    constructor() {
        super();
    }
}
