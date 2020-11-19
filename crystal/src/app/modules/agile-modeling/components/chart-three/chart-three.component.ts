import { Component } from '@angular/core';
import { AgileBaseChart } from '../base-chart';
@Component({
    selector: 'chart-three',
    templateUrl: './chart-three.component.html',
    styleUrls: ['./chart-three.component.less'],
})
export class ChartThreeComponent extends AgileBaseChart {
    constructor() {
        super();
    }
}
