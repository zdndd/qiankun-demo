import { ChangeDetectorRef, Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import _ from 'lodash';
import { TranslateService } from '@ngx-translate/core';
import { ComparedReportService } from './service/compared-report.service';
import { NzMessageService } from 'ng-zorro-antd';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { CompareCandidatesDrawerComponent } from '../compared-report/compare-candidates-drawer/compare-candidates-drawer.component';

@Component({
    selector: 'compared-report',
    templateUrl: './compared-report.component.html',
    styleUrls: ['./compared-report.component.less'],
    providers: [ComparedReportService],
})
export class ComparedReportComponent implements OnInit, AfterViewInit {
    colors = ['#828fe1', '#59b9a2', '#fbc565'];

    // emps: string = '';

    nineData: [] = [];
    tabInfo = [
        {
            title: this.translateService.instant('个人信息'),
            tabIndex: 0,
        },
        {
            title: this.translateService.instant('四力对比'),
            tabIndex: 1,
        },
        {
            title: this.translateService.instant('绩效分析'),
            tabIndex: 2,
        },
    ];

    personalInfo = [];
    workArr = [];
    strengthData = {};
    performanceAnalysis = [];
    talentBox = [];
    isLinkRouter = false;
    lstEmpinfo = '';

    compareTotalCountArray = []; //人人对比统计数组；

    @Input() selectedIndex = 0;
    @Input() emps: string;
    @Input() type: string = ''; //两两对比展现形式，人才盘点中是弹框，评估中心是页面
    @Input() projectId: string = ''; //发展规划项目ID
    @Input() isSorting: boolean = false; //是否参与排序(目前发展规划可以排序)

    defaultTwoEmps: string; //目前放开了对比人数，默认选择前两个人对比；

    constructor(
        public activatedRoute: ActivatedRoute,
        public router: Router,
        public translateService: TranslateService,
        public comparedReportService: ComparedReportService,
        public cd: ChangeDetectorRef,
        public messageService: NzMessageService,
        private drawerService: NzDrawerService,
    ) {}

    ngOnInit() {
        if (this.type == '') {
        } else {
            this.isLinkRouter = true;
        }

        if (!this.isSorting) {
            this.lstEmpinfo = this.emps;
        }

        const empsArray = this.emps.split(',');
        if (empsArray.length > 2) {
            this.defaultTwoEmps = empsArray.slice(0, 2).toString();
        } else {
            this.defaultTwoEmps = empsArray.toString();
        }

        this.getSwitchFn();
    }

    ngAfterViewInit() {}
    // 个人信息
    getData() {
        this.comparedReportService.getEmpInfoList({ strEmpCode: this.defaultTwoEmps }).subscribe(res => {
            if (res && res !== {}) {
                if (JSON.stringify(res) === '{}') {
                    this.personalInfo[0] = [];
                    this.personalInfo[1] = [];
                } else {
                    const empsArr = Object.keys(res);

                    this.personalInfo[0] = res[empsArr[0]] ? res[empsArr[0]] : [];
                    this.personalInfo[1] = res[empsArr[1]] ? res[empsArr[1]] : [];
                }
            }
        });
    }
    // 工作经历
    getWorkExperience() {
        this.comparedReportService.getWorkExperienceList({ strEmpCode: this.defaultTwoEmps }).subscribe(res => {
            if (res && res !== {}) {
                const empsArr = Object.keys(res);
                this.workArr[0] = res[empsArr[0]];
                this.workArr[1] = res[empsArr[1]];
            }
        });
    }
    // 四力对比
    getLastPlanDimension() {
        this.comparedReportService.getLastPlanDimensionList({ strEmpCode: this.defaultTwoEmps }).subscribe(res => {
            if (res && res !== {}) {
                if (JSON.stringify(res) === '{}') {
                    this.strengthData = {
                        1: [],
                        2: [],
                        3: [],
                        4: [],
                    };
                } else {
                    this.strengthData = res;
                }
            }
        });
    }
    getPerformanceAnalysis() {
        this.getPerformanceChartList();
        this.getPeopleScoreList();
    }
    //绩效分析
    getPerformanceChartList() {
        this.comparedReportService.getPerformanceChartList({ strEmpCode: this.defaultTwoEmps }).subscribe(res => {
            if (res && res !== {}) {
                const empsArr = Object.keys(res);
                this.performanceAnalysis = res;
            }
        });
    }
    // 人才九宫格
    getPeopleScoreList() {
        this.comparedReportService.getPeopleScoreList({ strEmpCode: this.defaultTwoEmps }).subscribe(res => {
            if (res) {
                this.nineData = res;
            }
        });
    }
    getSwitchFn() {
        switch (this.selectedIndex) {
            case 0:
                this.getData();
                this.getWorkExperience();
                break;
            case 1:
                this.getData();
                this.getLastPlanDimension();
                break;
            case 2:
                this.getData();
                this.getPerformanceAnalysis();
                break;
            default:
                break;
        }
    }
    selectedIndexChange() {
        this.getSwitchFn();
    }

    //添加候选人
    addCandidate() {
        let firstEmpCode = this.personalInfo[0].empcode;
        let secondEmpCode = this.personalInfo[1].empcode;
        let defaultCheckedArray = [];
        // const empsArr = Object.keys(this.emps);

        if (this.compareTotalCountArray.length > 0) {
            const codeArr = this.emps.split(',');
            firstEmpCode = codeArr[0].split('@$@')[0];
            secondEmpCode = codeArr[1].split('@$@')[0];
        }

        defaultCheckedArray = [firstEmpCode, secondEmpCode];

        const drawerRef = this.drawerService.create({
            nzContent: CompareCandidatesDrawerComponent,
            nzWidth: '450px',
            nzClosable: false,
            nzBodyStyle: { padding: '0', height: '100%' },
            nzContentParams: {
                projectId: this.projectId,
                defaultCheckedArray: defaultCheckedArray,
                lstEmpinfo: this.lstEmpinfo,
                compareTotalCountArray: this.compareTotalCountArray,
            },
        });

        drawerRef.afterClose.subscribe(data => {
            if (data && data !== '') {
                const rtnData = JSON.parse(data);
                const winnerArray = rtnData.compareCountArray;

                if (winnerArray.length > 0) {
                    this.compareTotalCountArray.push(winnerArray[0]);
                }

                this.emps = rtnData.emps.toString();
                this.defaultTwoEmps = rtnData.emps.toString();
                this.getSwitchFn();
            }
        });
    }
}
