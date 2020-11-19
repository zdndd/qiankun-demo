import { Component, OnInit, Input, Output, EventEmitter, ViewChild, SimpleChanges, OnChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EChartsComponent } from '@shared/components/sv-echart/echart-component';
@Component({
    selector: 'ass-chart-line-bar',
    templateUrl: './chart-line-bar.component.html',
    styleUrls: ['./chart-line-bar.component.less'],
})
export class ChartLineBarComponent implements OnInit, OnChanges {
    @Input() containerWidth = '100%';
    @Input() containerHeight = '340';
    @Input() chartData = {
        data: [],
        label: [],
    };
    @Input() colors = [];
    @Input() title = '';
    colorList = ['#6792de', '#9dcbf6', '#fbc565', '#ff9f69'];
    pageState = 0; //[0=加载中；1=图表展现；2=无数据]
    chartOption = {}; //图表对象
    legendData = [];
    indicatorData = [];
    chatData = [];
    yAxisList = {};
    @ViewChild(EChartsComponent, { static: true }) eChartsComponent: EChartsComponent;
    constructor() {}
    ngOnChanges(changes: SimpleChanges) {
        if (changes['chartData'] && !changes['chartData'].firstChange) {
            this.legendData = [];
            this.indicatorData = [];
            this.chartOption = {};
            this.chatData = [];
            this.yAxisList = [];
            this.getChartData();
        }
    }
    ngOnInit() {
        // this.getChartData();
    }

    //获取复合柱状图表数据
    getChartData() {
        const result = this.chartData;
        if (result != null && result && result.label && result.label.length) {
            this.indicatorData = result.label;
            const Len = result.data.length;
            for (let i = 0; i < result.data.length; i++) {
                const item = result.data[i];
                this.legendData.push(item.name);
                this.yAxisList = {
                    type: 'value',
                    min: function(value) {
                        return 0;
                    },
                    // name: item.name,
                    axisLabel: {
                        // 坐标轴轴线y轴刻度
                        formatter: '{value}',
                        textStyle: {
                            color: '#4d4d4d',
                        },
                    },
                    axisLine: {
                        lineStyle: {
                            type: 'dotted',
                            color: '#dbdbdb',
                            width: '1',
                        },
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: ['#dbdbdb'],
                            type: 'dotted',
                        },
                    },
                    // 坐标轴名称的颜色
                    nameTextStyle: {
                        color: '#4d4d4d',
                    },
                    axisTick: {
                        // 坐标轴刻度线设置
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
                            barBorderRadius: [10, 10, 0, 0],
                        },
                    },
                    // lineStyle: {
                    //     width: 3,
                    //     shadowColor: 'rgba(0,0,0,0.4)',
                    //     shadowBlur: 10,
                    //     shadowOffsetY: 10
                    // },
                    name: item.name,
                    type: item.type,
                    data: item.value,
                    barMaxWidth: 60,
                    // yAxisIndex: i == Len - 1 && i !== 0 ? '1' : '0',
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
            title: {
                // text: 'Confidence Band',
                subtext: this.title,
                subtextStyle: {
                    color: '#727a84',
                    fontSize: 14,
                },
                left: 'center',
            },
            color: this.colors.length > 0 ? this.colors : this.colorList,
            grid: {
                left: '3%',
                right: '18',
                // right: '0',
                y2: '50',
                // bottom: '6%',
                containLabel: true,
            },
            tooltip: {
                show: true,
                trigger: 'axis',
                formatter: function(params, ticket, callback) {
                    let name = '';
                    const obj = params.map(item => {
                        if (item.value == undefined || item.value === -1) {
                            item.value = '暂无数据';
                        }
                        name = item.name;
                        // let percent = ((item.value / params[params.length - 1].value) * 100).toFixed(2)
                        // 小圆点显示
                        const dotColor =
                            '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' +
                            item.color +
                            '"></span>';
                        return dotColor + item.seriesName + ' : ' + item.value + '</br>';
                    });
                    return name + '<br/>' + obj.join(''); // 去除','
                },
            },
            legend: {
                show: true,
                x: 'center',
                y: 'bottom',
                itemWidth: 18, //10
                itemHeight: 4, //18
                data: this.legendData,
                type: 'scroll',
                pageIconColor: '#4d4d4d',
                pageIconSize: '10',
                formatter: function(name) {
                    return name.length > 12 ? name.substr(0, 12) + '...' : name;
                },
            },
            xAxis: {
                type: 'category',
                data: this.indicatorData,
                axisPointer: {
                    type: 'shadow',
                },
                // 坐标轴轴线
                axisLine: {
                    lineStyle: {
                        type: 'dotted',
                        color: '#dbdbdb',
                        width: '1',
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
                // 坐标轴名称的颜色
                nameTextStyle: {
                    color: '#4d4d4d',
                },
                axisTick: {
                    // 坐标轴刻度线设置
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
