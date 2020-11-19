import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Input,
    ElementRef,
    HostListener
} from '@angular/core';

import * as _ from 'lodash';
import { KNXDataService } from "../../../../../core/knxdata.service";
import { Router, ActivatedRoute } from '@angular/router';
import { ScrollBarHelper } from '../../../../../utils/scrollbar-helper';
import { DataState } from '../../../../../constants/app.constants';

@Component({
    selector: 'if-statistics',
    changeDetection: ChangeDetectionStrategy.Default,
    templateUrl: './if-statistics.component.html',
    styleUrls: ['./if-statistics.component.less'],
})
export class IfStatisticsComponent implements OnInit {
    pageState = DataState.LOADING;
    imgChange = 'zh';
    scrollbar: any;
    chartParams = {}
    listOfData = [];
    modelId = this.activatedRoute.parent.snapshot.params.modelid || '0'
    constructor(private elementRef: ElementRef, public dataService: KNXDataService,public activatedRoute: ActivatedRoute,) { }

    @HostListener('window:resize', ['$event'])
    resize(event: any) {
        this.updateScrollbar();
    }

    ngOnInit() {
        
        this.getChartData();
        // console.log(this.elementRef.nativeElement.querySelector('.table-wrap2'))
        this.scrollbar = ScrollBarHelper.makeScrollbar(
            this.elementRef.nativeElement.querySelector('.static-table'),{
                suppressScrollY: true
            }
        );
    }

    getChartData() {
        let params = {
            modelId: this.modelId
        };
        this.dataService.getStatisticsData(params).subscribe(res => {
            if(res.histogramsource){
                let chartParams = res.histogramsource;
                if(chartParams && chartParams.data){
                    this.chartParams = chartParams
                }
                if(res.tablesource.length>=2){
                    this.listOfData = res.tablesource
                }
            }else{
                this.pageState = DataState.EMPTY
            }
           
        })
    }

    exportHandler() {

    }

    updateScrollbar(){
        if(this.scrollbar){
            this.scrollbar.update()
        }
    }

    ngOnDestroy() {
        if(this.scrollbar){
            this.scrollbar.destroy();
            this.scrollbar = null;
        }
    }
}
