import { Component, OnChanges, OnInit, SimpleChanges, ViewChild, Input } from '@angular/core';
import { EChartsComponent } from '@shared/components/sv-echart/echart-component';

@Component({
    selector: 'chart-capability-studies',
    templateUrl: './chart-capability-studies.component.html',
    styleUrls: ['./chart-capability-studies.component.less'],
})
export class ChartCapabilityStudiesComponent implements OnInit, OnChanges {
    colorList = ['#e78fc3', '#828fe1', '#a5c7fd', '#fce28d', '#fdb9a2'];
    pageState = 0; // [0=加载中；1=图表展示；2=无数据]
    chartOption = {}; // 图表对象
    // 图表对象

    legendData = [];
    indicatorData = [];
    chatData = [];
    xMax = 5;
    dataShadow = [];
    containerWidth = '100%';
    containerHeight = '320';
    yAxisList = {};

    @Input() chartData = {
        data: [],
        label: [],
    };
    @ViewChild(EChartsComponent, { static: true }) eChartsComponent: EChartsComponent;
    constructor() {}

    ngOnInit() {
        this.getChartData();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['chartData']) {
            this.chartOption = {};
            this.chatData = [];
            this.indicatorData = [];
            this.getChartData();
        }
    }

    // 获取复合柱状图表数据
    getChartData() {
        const result = this.chartData;
        if (result != null && result && result.label && result.label.length) {
            this.indicatorData = result.label;
            const len = result.data ? result.data.length : 0;
            for (let i = 0; i < len; i++) {
                const item = result.data[i];
                this.legendData.push(item.name);

                this.yAxisList = {
                    type: 'value',
                    axisLable: {
                        formatter: '{value}',
                        textStyle: {
                            color: '#4d4d4d',
                        },
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#dbdbdb',
                            width: '1',
                            type: 'dotted',
                        },
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: ['#dbdbdb'],
                            type: 'dotted',
                        },
                    },
                    nameTextStyle: {
                        color: '#4d4d4d',
                    },
                    axisTick: {
                        lineStyle: {
                            show: true,
                            color: '#dbdbdb',
                            type: 'dotted',
                        },
                    },
                };
                this.chatData.push({
                    itemStyle: {
                        normal: {
                            barBorderRadius: [4, 4, 0, 0],
                        },
                    },
                    name: item.name,
                    type: item.type,
                    data: item.value,
                    barMaxWidth: 12,
                });
            }
            if (this.eChartsComponent) {
                this.eChartsComponent.clear();
            }
            this.setChartOption();
        } else {
            this.pageState = 2;
        }
    }

    setChartOption() {
        this.chartOption = {
            color: this.colorList,
            grid: {
                left: '3%',
                right: '18',
                y2: '50',
                containLabel: true,
            },
            title: {
                text: null,
            },
            legend: {
                top: 'bottom',
            },
            tooltip: {
                show: true,
                trigger: 'axis',
            },
            xAxis: {
                type: 'category',
                data: this.indicatorData,
                axisPointer: {
                    type: 'shadow',
                },
                axisLine: {
                    lineStyle: {
                        color: '#dbdbdb',
                        width: '1',
                        type: 'dotted',
                    },
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: ['#dbdbdb'],
                        type: 'dotted',
                    },
                },
                axisLabel: {
                    textStyle: {
                        color: '#4d4d4d',
                    },
                },
                nameTextStyle: {
                    color: '#4d4d4d',
                },
                axisTick: {
                    lineStyle: {
                        show: true,
                        color: '#dbdbdb',
                        type: 'dotted',
                    },
                },
            },
            dataZoom: [
                {
                    type: 'inside',
                    minSpan: 10,
                },
            ],
            yAxis: this.yAxisList,
            series: this.chatData,
        };
        this.pageState = 1;
    }
}
