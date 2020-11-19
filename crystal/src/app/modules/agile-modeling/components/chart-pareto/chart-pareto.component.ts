import { Component, OnInit, ViewChild, Input, OnChanges,SimpleChange} from '@angular/core';
import { KNXDataService } from "../../../../core/knxdata.service";
import { EChartsComponent } from '../../../../shared/components/sv-echart/echart-component';
import * as _ from 'lodash';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
    selector: 'chart-pareto',
    templateUrl: './chart-pareto.component.html',
    styleUrls: ['./chart-pareto.component.less']
})
export class ChartParetoComponent implements OnChanges, OnInit {

    indicatorData = []
    chatData = []
    yAxisList = []
    chartOption = {}; //图表对象
    @ViewChild(EChartsComponent, { static: true }) eChartsComponent: EChartsComponent;
    @Input() chartParams: any
    constructor(public dataService: KNXDataService,public activatedRoute: ActivatedRoute) { }

    ngOnInit() {
        setTimeout(() => {
            if (this.eChartsComponent) {
                this.eChartsComponent.showLoading()
            }
        }, 0)
    }

    ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
        if (changes["chartParams"] && !changes["chartParams"].isFirstChange()) {
            setTimeout(() => {
                if (this.eChartsComponent) {
                    this.eChartsComponent.hideLoading()
                }
            }, 100)
            if (this.chartParams.datasource.length>0) {
                this.getChartData();
            }
        }
    }

    getChartData() {
        let params = {
            modelId: this.activatedRoute.parent.snapshot.params.modelid || '0',
        };
        setTimeout(() => {
            if (this.eChartsComponent) {
                this.eChartsComponent.showLoading()
            }
        }, 0)

        let result = this.chartParams.datasource;
        if (result != null && result) {
            this.indicatorData = this.chartParams.label;
            for (let i = 0; i < result.length; i++) {
                let item = result[i];
                this.chatData.push(
                    {
                        itemStyle: {
                            barBorderRadius: [5, 5, 0, 0],
                            show:false,
                            // opacity:i >= 1 ? '0' : '1'
                        },
                        name: item.name,
                        type: i >= 1 ? 'line' : 'bar',
                        smooth:true,
                        data: item.value,
                        barMaxWidth: 14,
                        lineStyle: {
                            normal: {
                                type: 'dashed'
                            }
                        },
                    }
                );

                this.yAxisList.push(
                    {
                        type: 'value',
                        splitLine: {
                            show:false,
                            lineStyle: {
                                type: 'dashed',
                                color: '#d9d9d9'
                            }
                        },
                        axisLabel: {
                            color:'#656d78',
                            formatter: function(value,index){
                                if(i >= 1){
                                    return value
                                }else{
                                    return value+'%'
                                }
                            }
                        },
                        axisLine: {
                            lineStyle: {
                                color: '#abaebd'
                            }
                        }
                    }
                )
            }

            this.chatData[this.chatData.length-1].yAxisIndex=1
            this.setChartOption()
        }
    }

    setChartOption() {
        this.chartOption = {
            color: ['#828fe1', '#fdb9a2'],
            xAxis: {
                type: 'category',
                data: this.indicatorData,
                axisLine: {
                    lineStyle: {
                        color: '#abaebd'
                    }
                },
                axisLabel:{
                    rotate:45,
                    color:'#656d78'
                },
                splitLine: {
                    lineStyle: {
                        type: 'dashed',
                        color: '#d9d9d9'
                    }
                },
                axisPointer: {
                  type: 'shadow'
                }
            },
            tooltip: {
              formatter: '{a0}: {c0}%<br />{a1}: {c1}',
              trigger: 'axis'
            },
            legend: {},
            grid: {},
            yAxis: this.yAxisList,
            // yAxis: [
            //   {
            //     type: 'value',
            //     name: '频率',
            //     axisLabel: {
            //       formatter: '{value} %'
            //     }
            //   },
            //   {
            //     type: 'value',
            //     name: '影响',
            //     axisLabel: {
            //       formatter: '{value} °C'
            //     }
            //   }
            // ],
            series: this.chatData
        };

    }

}
