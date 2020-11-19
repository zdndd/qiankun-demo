import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { KNXDataService } from '../../../../core/knxdata.service';
import { addChecked } from '../../../occupational-competency/oc-config';
import { addTemplateId } from '@utils/convert';
import { ValueObjParam } from '../../../../constants/app.constants';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ChoiceFunctionComponent } from '../../../occupational-competency/oc-component/choice-function/choice-function.component';
import { AbilityWeightComponent } from '../ability-weight/ability-weight.component';
import { TranslateService } from '@ngx-translate/core';
import _ from 'lodash';
@Component({
    selector: 'app-dictionary-selection-template',
    templateUrl: './dictionary-selection-template.component.html',
    styleUrls: ['./dictionary-selection-template.component.less'],
})
export class DictionarySelectionTemplateComponent implements OnInit {
    @ViewChild('choiceFunction', { static: false }) choiceFunction: ChoiceFunctionComponent;
    @ViewChild('abilityWeight', { static: false }) abilityWeight: AbilityWeightComponent;
    //模型id
    @Input() modelId;
    /**
     * 0:最终结论页权重;1:能力字典选择模板;2、字典详细
     */
    @Input() componentStatus = 0;
    @Input() chooseType = 0;
    /**
     * 当前页面的配置项，能力
     */
    @Input() standardConfig;

    /**
     * 是否显示占比
     */
    @Input() isShowProportion = true;
    @Input() isCheckbox = true;
    @Input() conclusionList = [];
    @Input() isDisabled = false;
    tagsData = [{}, {}, {}, {}];
    /**
     * 字典id
     */
    qualityDictionaryId: any;
    pageState = 1;
    tree = [];
    dictionaryList = [];
    dictionaryDetails = {};
    maxLevelIndex = 0;

    isPass = true;
    tabs = [];
    //返回给父级
    reaultArr = [];
    constructor(
        private modal: NzModalRef,
        private dataService: KNXDataService,
        private messageService: NzMessageService,
        private translateService: TranslateService,
    ) {}

    ngOnInit() {
        if (this.chooseType === 0) {
            this.isCheckbox = true;
            this.isShowProportion = true;
            this.componentStatus = 0;
            this.getWeightData();
        } else {
            this.componentStatus = 1;
            this.getDictionaryList();
        }
    }

    preStep() {
        --this.componentStatus;
        if (this.componentStatus === 0) {
            this.getWeightData();
        } else if (this.componentStatus === 1) {
            this.getDictionaryList();
        }
    }

    nextStep() {
        if (this.abilityWeight.checkData()) {
            const rtnData = this.abilityWeight.getData();
            const param = {
                modelid: this.modelId,
                tabweightdtos: rtnData,
            };
            this.pageState = 1;
            this.dataService.setModelConclusionWeight(param).subscribe(res => {
                ++this.componentStatus;
            });
        } else {
            this.componentStatus = 0;
        }

        this.getDictionaryList();
    }

    getWeightData() {
        const params = {
            modelId: this.modelId,
        };
        this.tagsData = [{}, {}, {}, {}];
        this.dataService.getModelConclusionWeight(params).subscribe(res => {
            if (res) {
                this.tagsData = res;
            }
        });
    }

    getDictionaryList() {
        const param = {
            competencyModelId: this.modelId,
            qualityType: this.standardConfig['id'],
        };
        this.dictionaryList = [];
        this.dataService.getQualityDictionaryDataList(param).subscribe(res => {
            this.dictionaryList = res.data;
        });
    }

    showFunction(qualityDictionaryId) {
        this.qualityDictionaryId = qualityDictionaryId;

        this.dictionaryDetails = {};
        this.tree = [];
        this.dataService
            .getQualityDictionaryDetailList({
                qualityDictionaryId: qualityDictionaryId,
            })
            .subscribe(res => {
                if (res.abilitydictionary) {
                    this.dictionaryDetails = res;
                    this.maxLevelIndex = res.maxlevelindex;
                    this.componentStatus = 2;
                    addChecked(res.abilitydictionary);
                    addTemplateId(res.abilitydictionary, '');
                    this.checkData(res.abilitydictionary);
                    this.tree = res.abilitydictionary;
                    this.pageState = this.tree.length <= 0 ? 2 : 1;
                } else {
                    this.pageState = 2;
                }
            });
    }

    checkData(data) {
        const status = this.chooseType;
        const conclusionList = this.conclusionList;
        this.checkState(data, status, conclusionList, this.isDisabled);
        this.tabs = data;
    }

    checkState(data, status, conclusionList, isDisabled) {
        let forFn = function(data, status, conclusionList, isDisabled) {
            _.forEach(data, element => {
                element.visible = true;
                element.checked = false;
                element.disabled = false;
                const id = element.id;
                element.proportion = status === 0 ? 0 : null;
                _.forEach(conclusionList, e => {
                    e.id = e.abilityid ? e.abilityid : e.id;
                    if (status === 3) {
                        e.id = parseInt(e.id);
                    }
                    if (id === e.id) {
                        element.checked = true;

                        if (isDisabled) {
                            element.disabled = true;
                        }
                        if (e.proportion) {
                            element.proportion = e.proportion;
                        }
                    }
                });

                if (element.children && element.children.length > 0) {
                    forFn(element.children, status, conclusionList, isDisabled);
                }
            });
        };
        forFn(data, status, conclusionList, isDisabled);
    }

    // 通用結論百分比
    generalPercentage() {
        let hasCheched = false;
        const status = this.chooseType;
        const tabs = this.tabs;
        const reaultArr = [];
        this.isPass = true;

        let forFn = function(tabs) {
            _.forEach(tabs, element => {
                const id = element.id;
                const check = element.checked;
                const proportion = element.proportion;
                const descriptionList = element.descriptionlist;
                let valueObj: ValueObjParam;
                if (check) {
                    hasCheched = true;
                    if (status === 1) {
                        valueObj = {
                            abilityid: Number(id),
                            proportion: proportion,
                        };
                    } else if (status === 0) {
                        let despList = '';

                        if (descriptionList) {
                            descriptionList.forEach(item => {
                                despList += item.description + '\n';
                            });
                        }

                        valueObj = {
                            abilityid: Number(id),
                            proportion: proportion,
                            description: despList,
                        };
                    }
                    reaultArr.push(valueObj);
                }
                if (element.children && element.children.length > 0) {
                    forFn(element.children);
                }
            });
        };
        forFn(tabs);
        this.reaultArr = reaultArr;
        if (status === 1 || status === 0) {
            let proportionS = 0;
            for (let z = 0; z < reaultArr.length; z++) {
                const proportion = reaultArr[z]['proportion'];
                if (proportion) {
                    proportionS += Number(proportion);
                } else {
                    this.messageService.warning(this.translateService.instant('Select to enter the proportion'));
                    this.isPass = false;
                    return false;
                }
            }
            if (hasCheched && Number(proportionS.toFixed(2)) !== 100) {
                this.messageService.warning(this.translateService.instant('The sum must be hundred percent'));
                this.isPass = false;
                return false;
            }
        }
        return true;
    }

    getCheckListData() {
        return this.choiceFunction.getCheckListData();
    }

    getRadioId() {
        return this.choiceFunction.radioId;
    }
}
