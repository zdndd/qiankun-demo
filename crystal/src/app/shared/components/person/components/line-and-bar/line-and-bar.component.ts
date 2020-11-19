import { Component, OnInit, ViewChild, Input } from '@angular/core';
@Component({
    selector: 'app-line-and-bar',
    templateUrl: './line-and-bar.component.html',
    styleUrls: ['./line-and-bar.component.less'],
})
export class LineAndBarComponent implements OnInit {
    pageState = 0;
    @Input() containerWidth = '100%';
    @Input() containerHeight = '320';

    option: {};
    @Input() chartData;
    constructor() {}

    ngOnInit() {}

    setChartOption() {
        if (JSON.stringify(this.chartData) === '{}') {
            this.pageState = 2;
            return;
        }
        this.pageState = 1;
        this.option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    crossStyle: {
                        color: '#999',
                    },
                },
            },
            legend: {
                data: this.chartData.legend,
                x: 'center',
                y: 'top',
            },
            grid: {
                bottom: '18%',
                left: '30px',
            },
            xAxis: [
                {
                    type: 'category',
                    data: this.chartData.label,
                    axisPointer: {
                        type: 'shadow',
                    },
                    axisLabel: {
                        minInterval: 0,
                        // interval: 0,
                        rotate: -50,
                        textStyle: {
                            color: '#4d4d4d',
                            fontSize: 12,
                        },
                    },
                },
            ],
            yAxis: [
                {
                    type: 'value',
                    name: '', //本人
                },
            ],
            series: [
                {
                    name: this.chartData.series[0].name,
                    type: 'bar',
                    yAxisIndex: 0,
                    // barMaxWidth: 10,
                    itemStyle: {
                        normal: {
                            color: '#9dcbf6',
                        },
                    },
                    data: this.chartData.series[0].data,
                },
                {
                    name: this.chartData.series[1].name,
                    type: 'line',
                    yAxisIndex: 0,
                    symbolSize: 10,
                    itemStyle: {
                        normal: {
                            color: '#ff9f69',
                        },
                    },
                    data: this.chartData.series[1].data,
                },
            ],
            dataZoom: [
                {
                    type: 'inside',
                },
            ],
        };
    }
}
