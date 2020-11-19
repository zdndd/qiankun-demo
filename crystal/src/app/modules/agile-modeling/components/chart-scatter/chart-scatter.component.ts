import { Component, OnInit, ViewChild, Input, SimpleChange, OnChanges } from '@angular/core';
import { EChartsComponent } from '../../../../shared/components/sv-echart/echart-component';
import { KNXDataService } from "../../../../core/knxdata.service";

@Component({
  selector: 'chart-scatter',
  templateUrl: './chart-scatter.component.html',
  styleUrls: ['./chart-scatter.component.less']
})
export class ChartScatterComponent implements OnChanges, OnInit {
  legendData = [];
  chatData = [];
  chartOption = {}; //图表对象
  Ilist = [];
  resultData = [];
  columnyList = [];   //列名
  List = {};
  @ViewChild(EChartsComponent, { static: true }) eChartsComponent: EChartsComponent;
  @Input() chartParams: any
  constructor(public dataService: KNXDataService) { }

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
      if (this.chartParams != null && this.chartParams.data) {
        this.getChartData();
      }
    }
  }

  //获取图表数据
  getChartData() {
    this.legendData = [];
    this.chatData = [];
    this.Ilist = [];
    this.resultData = [];
    this.columnyList = [];   //列名
    let result = this.chartParams
    this.columnyList = result.column;
    this.resultData = result.data;
    const average = result.average ? result.average : ["", ""]; //x,y均值
    this.resultFn(result.data, average);
    setTimeout(() => {
      if (this.eChartsComponent) {
        this.eChartsComponent.clear();
      }
      this.setChartOption();
    }, 100)

  }

  setChartOption() {
    const that = this;
    this.chartOption = {
      color: ['#63b3e0', '#f36', 'pink', 'blue'],
      label: {
        color: '#8f8f8f',
        show: true,
        position: ['100%', '-10'],
        formatter: function (params) {
          let arr = params.value[2].split(',')
          if (arr.length > 1) {
            return arr[0] + ' ...'
          }else{
            return params.value[2]
          }

        },
      },
      tooltip: {
        formatter: function (params) {
          let arr = params.value[2].split(',')
          let _default = "( " + params.value[0]+ ' , ' +params.value[1] + " )"
          // if (arr.length > 1) {
            let _string = ''
            arr.forEach((element, index) => {
              _string += element+' '
              if(index>0 && index%5==0){
                _string += '<br/>'
              }
            });
            return _string+ _default
          // } else {
          //   return _default
          // }

        }

      },
      xAxis: {
        type: 'value',
        name: this.columnyList[0],
        axisLine: {
          lineStyle: {
            color: '#abaebd'
          }
        },
        splitLine: {
          lineStyle: {
            type: 'dashed',
            color: '#d9d9d9'
          }
        },
        axisLabel: {
          color: '#656d78'
        }
      },
      yAxis: {
        type: 'value',
        name: this.columnyList[1],
        axisLine: {
          lineStyle: {
            color: '#abaebd'
          }
        },
        splitLine: {
          lineStyle: {
            type: 'dashed',
            color: '#d9d9d9'
          }
        },
        axisLabel: {
          color: '#656d78'
        }
      },
      series: this.chatData
    };

  }

  resultFn(data, average) {

    const Value = data[0].value;

    for (var i = 0; i < Value.length; i++) {
      let i_list = [];
      i_list[0] = Value[i].x;
      i_list[1] = Value[i].y;
      i_list[2] = Value[i].name;
      this.Ilist.push(i_list);
    }

    this.legendData.push('');
    this.chatData.push(
      {
        data: this.Ilist,
        type: 'scatter',
        symbolSize: 16,
        markLine: {
          symbol: 'none',
          silent: true,
          lineStyle: {
            normal: {
              width: 2,
              type: 'dashed'
            }
          },
          label: {
            color: '#63b3e0',
            show: true,
            formatter: '平均值：{c}'
          },
          data: [
            { yAxis: average[1] },
            { xAxis: average[0] }
          ]
        }
      }
    );

  }

}
