import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NoModelingService } from './noModeling.service';
const enum EnumsConclusionType {
    LeaderInterview = 1, //领导访谈
    AbilityComparison = 7, //能力比较
    TaskAnalysis = 16, // 任务分析
    EmployeeSurvey = 10, //员工调研
    AbilityModel = 20, //能力建模
    CreateModel = 21, //模型建立
}
@Component({
    selector: 'app-no-modeling',
    templateUrl: './no-modeling.component.html',
    styleUrls: ['./no-modeling.component.less'],
})
export class NoModelingComponent implements OnInit {
    id = '';
    list = [
        {
            title: '领导访谈',
            className: 'top',
            typeid: EnumsConclusionType.LeaderInterview,
            path: 'leader-interview',
            conclusionstate: false,
        },
        {
            title: '能力比较',
            className: 'right',
            typeid: EnumsConclusionType.AbilityComparison,
            path: 'ability-comparison',
            conclusionstate: false,
        },
        {
            title: '员工调研',
            className: 'bottom',
            typeid: EnumsConclusionType.EmployeeSurvey,
            path: 'employee-survey',
            conclusionstate: false,
        },
        {
            title: '任务分析',
            className: 'left',
            typeid: EnumsConclusionType.TaskAnalysis,
            path: 'task-analysis',
            conclusionstate: false,
        },
    ];
    constructor(
        public router: Router,
        public activatedRoute: ActivatedRoute,
        private noModelingService: NoModelingService,
    ) {
        this.id = this.activatedRoute.snapshot.params.modelid;
    }
    ngOnInit() {
        this.noModelingService.getModelConclusionTypeState({ ModelId: this.id }).subscribe((res) => {
            this.list = this.list.map((item) => {
                const targetItem = res.find((o) => o.typeid === item.typeid);
                if (targetItem) item.conclusionstate = targetItem.conclusionstate;
                return item;
            });
        });
    }
    onClick(typeid) {
        const targeItem = this.list.find((item) => item.typeid === typeid);
        if (targeItem) {
            const url = `/agile-modeling/model/${this.id}/${targeItem.path}`;
            this.router.navigateByUrl(url);
        }
    }
    onCreate() {
        const id = this.activatedRoute.snapshot.params.modelid;
        this.noModelingService.postModelConclusionState({ ModelId: id }).subscribe((e) => {
            // console.log('创建模型成功');
        });
        const url = `/agile-modeling/model/${id}/home/details`;
        this.router.navigateByUrl(url);
    }
}
