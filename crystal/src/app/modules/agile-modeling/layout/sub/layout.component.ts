import {
    Component,
    HostListener,
    NgZone,
    ChangeDetectorRef,
    ApplicationRef,
    EventEmitter,
    ElementRef,
    ViewChild,
    Output,
    OnInit,
    Injector,
    TemplateRef,
    Renderer2,
    ComponentFactoryResolver,
    ComponentRef,
    ChangeDetectionStrategy,
    ComponentFactory,
    Input,
} from '@angular/core';
import * as _ from 'lodash';
import { Router, ActivatedRoute } from '@angular/router';
import { NzModalRef, NzModalService } from 'ng-zorro-antd';
import { HomeService } from '../../home/service/home.service';
import { DetailService } from '@modules/agile-modeling/detail/detail.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'layout',
    changeDetection: ChangeDetectionStrategy.Default,
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.less'],
})
export class SubLayoutComponent implements OnInit {
    moduleId = '';
    moduleName = '';
    isclickcreatemodel = true;
    typeName = '';
    interviewprogress;
    isLeaderInterview = false;
    @ViewChild('modal1Content', { static: true }) modal1Content: TemplateRef<any>;
    @ViewChild('modal2Content', { static: true }) modal2Content: TemplateRef<any>;
    @ViewChild('modal3Content', { static: true }) modal3Content: TemplateRef<any>;
    @ViewChild('modal4Content', { static: true }) modal4Content: TemplateRef<any>;

    navs = [];
    constructor(
        public modalService: NzModalService,
        public homeService: HomeService,
        public router: Router,
        public activatedRoute: ActivatedRoute,
        private detailService: DetailService,
        public translateService: TranslateService,
    ) {}

    ngOnInit() {
        try {
            this.moduleId = this.activatedRoute.parent.snapshot.url[0].path;
            switch (this.moduleId) {
                case 'leader-interview':
                    this.isLeaderInterview = true;
                    this.typeName = this.translateService.instant('Leader Interview');
                    this.navs = [
                        {
                            title: this.translateService.instant('Frequency Analysis'),
                            url: 'kind/2',
                        },
                        {
                            title: this.translateService.instant('Distribution Analysis'),
                            url: 'kind/3',
                        },
                        {
                            title: this.translateService.instant('Weight Analysis'),
                            url: 'kind/4',
                        },
                        // {
                        //     title: '对比分析',
                        //     url: 'comparative-analysis',
                        // },
                        {
                            title: this.translateService.instant('Conclusion'),
                            url: 'conclusion',
                        },
                    ];
                    break;
                case 'employee-survey':
                    this.typeName = this.translateService.instant('Employee Survey');
                    this.navs = [
                        {
                            title: this.translateService.instant('Questionnaire'),
                            url: 'questionnaire',
                        },
                        {
                            title: this.translateService.instant('Answer Data'),
                            url: 'answer-data',
                        },
                        {
                            title: this.translateService.instant('IF Analysis'),
                            url: 'if-statistics',
                        },
                        {
                            title: this.translateService.instant('IF Matrix'),
                            url: 'if-matrix',
                        },
                        {
                            title: this.translateService.instant('Conclusion'),
                            url: 'conclusion',
                        },
                    ];
                    break;
                case 'ability-comparison':
                    this.typeName = this.translateService.instant('Ability Comparison');
                    this.navs = [
                        {
                            title: this.translateService.instant('Ability Comparison'),
                            url: 'ability-comparison',
                        },
                        {
                            title: this.translateService.instant('Conclusion'),
                            url: 'conclusion',
                        },
                    ];
                    break;
                case 'task-analysis':
                    this.typeName = this.translateService.instant('Task Analysis');
                    this.navs = [
                        {
                            title: this.translateService.instant('Job Task Analysis'),
                            url: 'work-task-analysis',
                        },
                        {
                            title: this.translateService.instant('Pareto Regression'),
                            url: 'pareto-return',
                        },
                        {
                            title: this.translateService.instant('Conclusion'),
                            url: 'conclusion',
                        },
                    ];
                    break;
            }
        } catch (error) {}

        this.getModelName();
    }

    getModelName() {
        let id = this.activatedRoute.parent.snapshot.params.modelid;
        this.homeService.getAbilityModel({ ModelId: id }).subscribe((res) => {
            this.interviewprogress = res.interviewprogress;
            this.moduleName = res.modelname;
            this.isclickcreatemodel = res.isclickcreatemodel;
        });
    }

    nextStep() {
        const url = this.navs[this.interviewprogress - 1].url;
        const modelid = this.activatedRoute.snapshot.params.modelid;
        const params = { modelid: modelid, tabid: this.interviewprogress };
        this.detailService.synModelInterviewData(params).subscribe((res) => {
            this.router.navigateByUrl('/agile-modeling/model/' + modelid + '/leader-interview/' + url);
        });
        this.interviewprogress++;
    }

    openHelp() {
        switch (this.moduleId) {
            case 'leader-interview':
                this.createModal(
                    this.translateService.instant('Leadership interview modeling method'),
                    this.modal2Content,
                );
                break;
            case 'employee-survey':
                this.createModal(
                    this.translateService.instant('Employee interview modeling method'),
                    this.modal4Content,
                );
                break;
            case 'ability-comparison':
                this.createModal(
                    this.translateService.instant('Analytic hierarchy process modeling'),
                    this.modal1Content,
                );
                break;
            case 'task-analysis':
                this.createModal(this.translateService.instant('Task analysis modeling method'), this.modal3Content);
                break;
        }
    }

    createModal(title, contentTemplat: TemplateRef<any>) {
        this.modalService.create({
            nzTitle: title,
            nzWidth: '1000px',
            nzContent: contentTemplat,
            nzClosable: true,
            nzFooter: null,
        });
    }

    goBack() {
        const isclickcreatemodel = this.isclickcreatemodel;
        const modelid = this.activatedRoute.snapshot.params.modelid;
        let url = '';
        if (isclickcreatemodel) {
            url = `/agile-modeling/model/${modelid}/home/details`;
        } else {
            url = `/agile-modeling/model/${modelid}/no-modeling`;
        }
        this.router.navigateByUrl(url);
    }
}
