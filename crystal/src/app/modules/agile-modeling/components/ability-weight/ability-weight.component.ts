import { Component, OnInit, Input } from '@angular/core';
import _ from 'lodash';
import { NzMessageService } from 'ng-zorro-antd/message';
import { TranslateService } from '@ngx-translate/core';

const enum EnumsConclusionType {
    LeaderInterview = 1, //领导访谈
    AbilityComparison = 7, //能力比较
    TaskAnalysis = 16, // 任务分析
    EmployeeSurvey = 10, //员工调研
    AbilityModel = 20, //能力建模
    CreateModel = 21, //模型建立
}

@Component({
    selector: 'app-ability-weight',
    templateUrl: './ability-weight.component.html',
    styleUrls: ['./ability-weight.component.less'],
})
export class AbilityWeightComponent implements OnInit {
    tagsLoading = 2;
    @Input() tagsData = [{}, {}, {}, {}];
    // tags = [
    //     { tabid: 1, weight: 20 },
    //     { tabid: 7, weight: 20 },
    //     { tabid: 10, weight: 20 },
    //     { tabid: 16, weight: 40 },
    // ];
    tagsMap = [
        {
            title: this.translateService.instant('Leader Interview'),
            typeid: EnumsConclusionType.LeaderInterview,
            path: 'leader-interview',
        },
        {
            title: this.translateService.instant('Ability Comparison'),
            typeid: EnumsConclusionType.AbilityComparison,
            path: 'ability-comparison',
        },
        {
            title: this.translateService.instant('Employee Survey'),
            typeid: EnumsConclusionType.EmployeeSurvey,
            path: 'employee-survey',
        },
        {
            title: this.translateService.instant('Task Analysis'),
            typeid: EnumsConclusionType.TaskAnalysis,
            path: 'task-analysis',
        },
    ];
    constructor(private messageService: NzMessageService, public translateService: TranslateService) {}

    ngOnInit() {}

    //获取各个权重
    getData() {
        return this.tagsData;
    }

    checkData() {
        let countNumb: number = 0;

        _.forEach(this.tagsData, (element) => {
            if (element.weight && element.weight !== '') {
                countNumb += Number(element.weight);
            } else {
                element.weight = 0;
            }
        });

        if (Number(countNumb.toFixed(2)) !== 100) {
            this.messageService.warning('权重和必须为100');
            return false;
        } else {
            return true;
        }
    }
}
