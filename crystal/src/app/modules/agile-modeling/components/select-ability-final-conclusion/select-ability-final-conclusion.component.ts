import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { KNXDataService } from '../../../../core/knxdata.service';
import { AbilityWeightComponent } from '../ability-weight/ability-weight.component';
import _ from 'lodash';

const enum EnumsConclusionType {
    LeaderInterview = 1, //领导访谈
    AbilityComparison = 7, //能力比较
    TaskAnalysis = 16, // 任务分析
    EmployeeSurvey = 10, //员工调研
    AbilityModel = 20, //能力建模
    CreateModel = 21, //模型建立
}

@Component({
    selector: 'app-select-ability-final-conclusion',
    templateUrl: './select-ability-final-conclusion.component.html',
    styleUrls: ['./select-ability-final-conclusion.component.less'],
})
export class SelectAbilityFinalConclusionComponent implements OnInit {
    pageIndex = 1; //1:分配权重页;2:选择能力页
    tagsData = [{}, {}, {}, {}];
    @ViewChild('abilityWeight', { static: false }) abilityWeight: AbilityWeightComponent;
    @Input() modelId;
    @Input() conclusionList;
    @Input() isDisabled;
    @Input() standardConfig;
    @Input() dictionaryDetails;
    @Input() tree: any[];
    @Input() maxlevelindex;
    @Input() isCheckbox = true;
    @Input() isShowProportion = true; //是否显示占比输入框
    pageState = 1; //1:loading ,2:正常
    tabs = [];
    status = null; //0模型结论 /1通用结论（包含百分比-多选）/2非通用多选/ 3非通用单选
    constructor(public dataService: KNXDataService) {}

    ngOnInit() {
        const modelId = this.modelId;
        const params = {
            modelId: modelId,
        };
        this.dataService.getModelConclusionWeight(params).subscribe((res) => {
            if (res) {
                this.tagsData = res;
            }
        });
    }

    //获取当前步骤是多少
    getCurrentStep() {
        return this.pageIndex;
    }

    //下一步
    nextStep() {
        if (this.abilityWeight.checkData()) {
            const rtnData = this.abilityWeight.getData();

            const param = {
                modelid: this.modelId,
                tabweightdtos: rtnData,
            };
            this.pageState = 1;
            this.dataService.setModelConclusionWeight(param).subscribe((res) => {
                const params = { ModelId: this.modelId, TabId: EnumsConclusionType.CreateModel };
                this.dataService.getModelConclusion(params).subscribe((res) => {
                    if (res) {
                        const lstabilityproportion = res.lstabilityproportion;
                        this.refreshConclusion(lstabilityproportion);
                    }
                    this.pageIndex = 2;
                });
            });
        } else {
            this.pageIndex = 1;
        }
    }

    //上一步
    preStep() {
        this.pageIndex = 1;
    }

    //根据权重设置 获取最新的占比
    refreshConclusion(lstAbilityProportion) {
        const treeData = this.tree;

        let forFn = function (treeData, lstAbilityProportion) {
            _.forEach(treeData, (element) => {
                const id = element.id; //treeId
                element.checked = false;
                element.proportion = '';
                _.forEach(lstAbilityProportion, (e) => {
                    e.id = e.abilityid ? e.abilityid : e.id;
                    if (id === e.id) {
                        element.checked = true;
                        if (e.proportion) {
                            element.proportion = e.proportion;
                        }
                    }
                });

                if (element.children && element.children.length > 0) {
                    forFn(element.children, lstAbilityProportion);
                }
            });
        };
        forFn(treeData, lstAbilityProportion);
    }
}
