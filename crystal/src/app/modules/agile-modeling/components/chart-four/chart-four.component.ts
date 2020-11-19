import { Component } from '@angular/core';
import { AgileBaseChart } from '../base-chart';

@Component({
    selector: 'chart-four',
    templateUrl: './chart-four.component.html',
    styleUrls: ['./chart-four.component.less'],
})
export class ChartFourComponent extends AgileBaseChart {
    constructor() {
        super();
    }
}
