import { Component } from '@angular/core';
import { AgileBaseChart } from '../base-chart';
@Component({
    selector: 'chart-seven',
    templateUrl: './chart-seven.component.html',
    styleUrls: ['./chart-seven.component.less'],
})
export class ChartSevenComponent extends AgileBaseChart {
    constructor() {
        super();
    }
}
