import { Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { EChartsComponent } from '../../../../shared/components/sv-echart/echart-component';
import { gradientColor } from '../../../../utils/gradient';
@Component({
    selector: 'chart-doughnut',
    templateUrl: './chart-doughnut.component.html',
    styleUrls: ['./chart-doughnut.component.less']
})
export class ChartDoughnutComponent implements OnInit {
    chatData = [];
    chartOption = {}; //图表对象
    // colors = ['#5530d9', '#5e3bdb', '#6f4fe0', '#7b5de3', '#896ee7', '#9178e9', '#b09ef2', '#d8cdfd'];
    colors = []
    list = [];
    @Input() chartList
    @ViewChild(EChartsComponent, { static: true }) eChartsComponent: EChartsComponent;
    constructor() { }

    ngOnInit() {


        // console.log('1 init')
    }

    ngOnChanges(changes: SimpleChanges) {
        // console.log('2, change',changes["chartList"].isFirstChange())
        if (changes["chartList"]) {

            this.list = this.chartList
            this.colors = gradientColor('#5530d9', '#d8cdfd', this.chartList.length);
            this.getChartData();
        }
    }

    //获取图表数据
    getChartData() {
        this.chatData = [];
        const resultData = this.list;
        if (resultData.length > 0) {
            for (let i = 0; i < resultData.length; i++) {
                const item = resultData[i];
                this.chatData.push(
                    {
                        name: item.name,
                        value: item.value + '',
                    }
                );
            }
            setTimeout(() => {
                if (this.eChartsComponent) {
                    this.eChartsComponent.clear();
                }
                this.setChartOption();
            }, 0)
        }
    };

    setChartOption() {
        this.chartOption = {
            // animation: false,
            color: this.colors,
            title: {
                text: ''
            },
            series: [
                {
                    type: 'pie',
                    hoverAnimation: false,
                    radius: ['50%', '70%'],
                    avoidLabelOverlap: false,
                    data: this.chatData,
                    labelLine: {
                        normal: {
                            length: 4
                        }
                    },
                    itemStyle: {
                        normal: {
                            label: {
                                show: true,
                                formatter: "{b}:({d}%)"
                            }
                        }
                    }
                }
            ],
            // graphic: [
            //     {
            //         type: 'image',
            //         left: 'center',
            //         top: '33%',
            //         origin: [101, 107],
            //         style: {
            //             image: 'assets/img/image-powers@2x.png',
            //             width: 202,
            //             height: 214,
            //         }
            //     }
            // ],

        };
        if (this.list.length > 1) {
            this.chartOption["itemStyle"] = {
                borderWidth: 2,
                borderColor: '#fff'
            }
        }
    }

}
