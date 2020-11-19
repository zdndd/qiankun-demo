import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { KNXDataService } from "../../../../../core/knxdata.service";
import { DataState } from '../../../../../constants/app.constants';
@Component({
    selector: 'comparative-analysis',
    templateUrl: './comparative-analysis.component.html',
    styleUrls: ['./comparative-analysis.component.less'],
})
export class ComparativeAnalysisComponent implements OnInit {
    pageState = DataState.LOADING;
    imgChange = 'zh';
    size = 'small';
    listOfOption = [
        { label: '点数法', value: '2' },
        { label: '权数分配法', value: '3' },
        { label: '权重分配法', value: '4' }
    ];
    xAxis = this.listOfOption[0].value
    yAxis = this.listOfOption[1].value
    modelId = this.activatedRoute.parent.snapshot.params.modelid || '0'
    params = {
        TabId1: this.xAxis,
        TabId2: this.yAxis,
        modelId: this.modelId
    }
    chartParams:{}
    constructor(public activatedRoute: ActivatedRoute,public dataService: KNXDataService) { }

    ngOnInit() {
        this.changeEcharts()
    }

    changeEcharts() {
        //echarts 重新调用接口
        this.params = {
            TabId1: this.xAxis,
            TabId2: this.yAxis,
            modelId: this.modelId
        }
        
        this.dataService.getMatrixData(this.params).subscribe(res => {
            if(res.data){
                this.pageState = DataState.EXIST_DATA;
                this.chartParams = res
            }else{
                this.pageState = DataState.EMPTY
            }
            
        })
    }
}
