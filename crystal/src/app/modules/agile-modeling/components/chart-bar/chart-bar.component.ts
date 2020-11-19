import { Component, OnInit, ViewChild, Input, SimpleChanges } from '@angular/core';
import { EChartsComponent } from '../../../../shared/components/sv-echart/echart-component';

@Component({
  selector: 'chart-bar',
  templateUrl: './chart-bar.component.html',
  styleUrls: ['./chart-bar.component.less']
})
export class ChartBarComponent implements OnInit {
  indicatorData = []
  chatData = []
  yAxisList = []
  chartOption = {}; //图表对象
  @ViewChild(EChartsComponent, { static: true }) eChartsComponent: EChartsComponent;
  @Input() chartParams
  constructor() { }

  ngOnInit() {
    setTimeout(() => {
      if (this.eChartsComponent) {
        this.eChartsComponent.showLoading()
      }
    }, 0)
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["chartParams"] && !changes["chartParams"].isFirstChange()) {
      setTimeout(() => {
        if (this.eChartsComponent) {
          this.eChartsComponent.hideLoading()
        }
      }, 100)
      if (this.chartParams != null && this.chartParams.data) {
        this.indicatorData = this.chartParams.label;
        for (let i = 0; i < this.chartParams.data.length; i++) {
          let item = this.chartParams.data[i];
          this.chatData.push(
            {
              itemStyle: {
                normal: {
                  barBorderRadius: [5, 5, 0, 0]
                }
              },
              name: item.name,
              type: 'bar',
              data: item.value,
              barMaxWidth: 14,
            }
          );
        }
        this.setChartOption()
      }
    }
  }



  setChartOption() {
    this.chartOption = {
      color: ['#828fe1', '#fdb9a2'],
      tooltip:{},
      xAxis: {
        type: 'category',
        axisLine: {
          lineStyle: {
            color: '#abaebd'
          }
        },
        axisLabel:{
          color:'#656d78'
        },
        splitLine: {
          lineStyle: {
            type: 'dashed',
            color: '#d9d9d9'
          }
        },
        data: this.indicatorData
      },
      yAxis: [
        {
          type: 'value',
          axisLine: {
            lineStyle: {
              color: '#abaebd'
            }
          },
          axisLabel:{
            color:'#656d78'
          },
          splitLine: {
            lineStyle: {
              type: 'dashed',
              color: '#d9d9d9'
            }
          }
        }
      ],
      series: this.chatData
    };
    //如果能力大于20，显示datazoom
    if (this.indicatorData.length > 18) {
      this.chartOption['dataZoom'] = [
        {
          type: 'slider',
          start: 0,
          end: 50,
          minSpan: 30,
          maxSpan: 50
        }
      ]
    }
  }

}
