import { Component, OnInit, Input } from '@angular/core';
import { NzDrawerService, NzModalService, NzMessageService } from 'ng-zorro-antd';
import _ from 'lodash';
@Component({
    selector: 'personal-report-carousel',
    templateUrl: './personal-report-carousel.component.html',
    styleUrls: ['./personal-report-carousel.component.less'],
})
export class PersonalReportCarouselComponent implements OnInit {
    effect = 'scrollx';
    workArr = {};
    personalInfo = {};
    personalInfoBoo = false;
    sliderData = [];
    basicData: any = [];
    cepinData: any = [];
    pandianData: any = [];
    isRefresh = true;
    @Input() empCode;
    constructor(private messageService: NzMessageService) {}

    ngOnInit() {
        this.getPersonalInfo();
        this.getSlider();
    }

    getSlider() {
        console.log('只有敏捷建模一个模块');
    }

    getPersonalInfo() {
        console.log('只有敏捷建模一个模块');
    }

    // 刷新
    refresh() {
        console.log('只有敏捷建模一个模块');
    }
}
