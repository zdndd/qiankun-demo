import { Component } from '@angular/core';
import { AgileBaseChart } from '../base-chart';
@Component({
    selector: 'chart-six',
    templateUrl: './chart-six.component.html',
    styleUrls: ['./chart-six.component.less'],
})
export class ChartSixComponent extends AgileBaseChart {
    constructor() {
        super();
    }
}
