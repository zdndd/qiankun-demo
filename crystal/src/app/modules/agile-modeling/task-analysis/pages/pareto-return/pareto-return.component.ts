import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { KNXDataService } from '../../../../../core/knxdata.service';
import * as _ from 'lodash';
import { Router, ActivatedRoute } from '@angular/router';
import { DataState } from '../../../../../constants/app.constants';
import { TranslateService } from '@ngx-translate/core';
@Component({
    selector: 'pareto-return',
    changeDetection: ChangeDetectionStrategy.Default,
    templateUrl: './pareto-return.component.html',
    styleUrls: ['./pareto-return.component.less'],
})
export class ParetoReturnComponent implements OnInit {
    pageState = DataState.LOADING;
    imgChange = 'zh';
    chartParams = {};
    modelId = this.activatedRoute.parent.snapshot.params.modelid || '0';
    constructor(
        public dataService: KNXDataService,
        public translateService: TranslateService,
        public activatedRoute: ActivatedRoute,
    ) {}

    ngOnInit() {
        this.imgChange = this.translateService.instant('Image language switching');
        this.getData();
    }

    getData() {
        let params = {
            modelId: this.activatedRoute.parent.snapshot.params.modelid || '0',
        };
        this.dataService.getParetoData(params).subscribe((res) => {
            if (res.datasource) {
                this.pageState = DataState.EXIST_DATA;
                this.chartParams = res;
            } else {
                this.pageState = DataState.EMPTY;
            }
        });
    }
}
