// pageState = 0; //[0=加载中；1=图表展现；2=无数据]
// 再添加一个：如果series只有动力项无个人信息，且动力项第三项数据为-1（代表缺少数据），
// 此时不展示图表，显示为第四个状态： 动力项及个人数据不完整；
import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
@Component({
    selector: 'app-boxplot',
    templateUrl: './boxplot.component.html',
    styleUrls: ['./boxplot.component.less'],
})
export class BoxplotComponent implements OnInit, OnChanges {
    msg = '动力项及个人信息不完整';
    pageState = 0; //[0=加载中；1=图表展现；2=无数据]再添加一个状态：如果series只有动力项无个人信息，且动力项第三项数据为-1（代表缺少数据），此时不展示图标，显示为： 动力项及个人数据不完整；
    @Input() containerWidth = '100%';
    @Input() containerHeight = '320';
    @Input() chartData: any;

    option: any = {};
    constructor() {}
    ngOnChanges(changes: SimpleChanges) {
        if (changes['chartData']) {
            this.option = {};
            this.setData();
        }
    }
    ngOnInit() {}
    setData() {
        if (this.chartData.series && this.chartData.series.length > 0) {
            const seriesData = this.chartData.series;
            if (seriesData.length === 1 && seriesData[0]['type'] === 'boxplot') {
                const fistListData = seriesData[0]['data'];
                const v = fistListData.find(value => value[2] === -1);
                // pdf es5方式
                // let v = null;
                // fistListData.forEach(function(item){
                //    if(item[2] === -1){
                //        v= item
                //    }
                // });
                if (v && v[2] === -1) {
                    this.pageState = 5;
                } else {
                    this.setChartOption();
                }
            } else {
                this.setChartOption();
            }
        } else {
            this.pageState = 2;
        }
    }

    setChartOption() {
        this.option = {
            tooltip: {
                trigger: 'item',
                axisPointer: {
                    type: 'shadow',
                },
            },
            grid: {
                left: '20px',
                right: '0%',
                bottom: '15%',
                backgroundColor: ['#FFFFFF', '#F6F7FB'],
            },
            xAxis: {
                type: 'category',
                data: this.chartData.label,
                boundaryGap: true,
                nameGap: 30,
                splitArea: {
                    show: false,
                },

                splitLine: {
                    show: false,
                },
            },
            yAxis: {
                type: 'value',
                name: '分值',
                splitArea: {
                    show: true,
                    areaStyle: {
                        color: ['#FFFFFF', '#F6F7FB'],
                    },
                },
            },
            series: [
                {
                    name: 'boxplot',
                    type: 'boxplot',
                    zlevel: 0,
                    data: this.chartData.series[0] ? this.chartData.series[0].data : [],
                    itemStyle: {
                        normal: {
                            borderColor: '#6792de',
                            color: 'transparent',
                        },
                    },
                    tooltip: {
                        formatter: function(param) {
                            return [
                                '动力项最大值: ' + param.data[5],
                                '目标分最大值: ' + param.data[4],
                                '动力项平均值: ' + param.data[3],
                                '目标分最小值: ' + param.data[2],
                                '动力项最小值: ' + param.data[1],
                            ].join('<br/>');
                        },
                    },
                },
                {
                    name: 'outlier',
                    type: 'scatter',
                    data: this.chartData.series[1] ? this.chartData.series[1].data : [],
                    zlevel: 1,
                    itemStyle: {
                        normal: {
                            color: '#6792de',
                        },
                    },
                },
            ],
            dataZoom: [
                {
                    type: 'inside',
                },
            ],
        };
        this.pageState = 1;
    }
}
