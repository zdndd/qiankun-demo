import {
    Component,
    ViewChildren,
    OnInit,
    ChangeDetectionStrategy,
    QueryList
} from '@angular/core';
import * as _ from 'lodash';
import { ActivatedRoute } from '@angular/router';
import { KNXDataService } from "../../../../../core/knxdata.service";
import { getLocaleDateFormat } from '@angular/common';
import { DataState } from '../../../../../constants/app.constants';
@Component({
    selector: 'if-matrix',
    changeDetection: ChangeDetectionStrategy.Default,
    templateUrl: './if-matrix.component.html',
    styleUrls: ['./if-matrix.component.less'],
})
export class IfMatrixComponent implements OnInit {
    pageState = DataState.LOADING;
    imgChange = 'zh';
    chartParams = {}
    modelId = this.activatedRoute.parent.snapshot.params.modelid || '0'
    constructor(public activatedRoute: ActivatedRoute, public dataService: KNXDataService) {}

    ngOnInit() {
        this.getData()
    }

    getData () {
        let params = {
            modelId: this.modelId,
            TabId1:0,
            TabId2:0
        };
        this.dataService.getMatrixData(params).subscribe(res => {
            if(res.data){
                this.pageState = DataState.EXIST_DATA;
                this.chartParams = res
            }else{
                this.pageState = DataState.EMPTY
            }
            
        })
    }
}
