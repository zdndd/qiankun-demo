import { Injectable } from '@angular/core';
import 'reflect-metadata';
import { NzModalService } from 'ng-zorro-antd';
import { TranslateService } from '@ngx-translate/core';
import { SelectAbilityComponent } from '../select-ability/select-ability.component';
import { abilityParam, choiceFunctionParam } from 'src/app/constants/app.constants';
import { ChoiceFunctionComponent } from '../../../occupational-competency/oc-component/choice-function/choice-function.component';
import { SelectAbilityFinalConclusionComponent } from '../select-ability-final-conclusion/select-ability-final-conclusion.component';
import { addChecked, ItemConfig } from '../../../occupational-competency/oc-config';
import { addTemplateId } from '@utils/convert';
import { KNXDataService } from '../../../../core/knxdata.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ValueObjParam } from '../../../../constants/app.constants';
import { DictionarySelectionTemplateComponent } from '../dictionary-selection-template/dictionary-selection-template.component';

import _ from 'lodash';
@Injectable()
export class CmpService {
    constructor(
        public translateService: TranslateService,
        public modalService: NzModalService, // public elementRef: ElementRef,
        public dataService: KNXDataService,
        private messageService: NzMessageService,
    ) {}

    total: ItemConfig[];
    status;
    conclusionList = [];
    //已选中的是否禁用
    isDisabled = false;
    radioId = '';
    isPass = true;
    tabs = [];
    //返回给父级
    reaultArr = [];
    // conclusionList, chooseType,isDisabled,
    popupAbilitySelectDialog(abilityData: abilityParam, cb) {
        const modal = this.modalService.create({
            nzTitle: this.translateService.instant('Select Ability'),
            nzWidth: '583px',
            nzClosable: false,
            nzMaskClosable: false,
            nzWrapClassName: 'vertical-center-modal',
            nzZIndex: 1001,
            nzBodyStyle: { height: '510px' },
            nzOkLoading: false,
            nzContent: SelectAbilityComponent,
            nzFooter: [
                {
                    label: this.translateService.instant('Ok'),
                    type: 'primary',
                    onClick: componentInstance => {
                        if (abilityData.chooseType === 1 || abilityData.chooseType === 0) {
                            componentInstance.getResult();
                            const reaultArr = componentInstance.reaultArr;
                            // if(reaultArr.length > 0){
                            if (componentInstance.isPass) {
                                //通过效验
                                cb(reaultArr);
                                modal.destroy();
                            }

                            // }
                        } else if (abilityData.chooseType === 3) {
                            const radioId = componentInstance.radioId;
                            const abilityIds = [];
                            abilityIds.push(radioId);
                            cb(abilityIds);
                            modal.destroy();
                        } else {
                            const abilityIds = componentInstance.checkIdList;
                            cb(abilityIds);
                            modal.destroy();
                        }
                    },
                },
                {
                    label: this.translateService.instant('Cancel'),
                    type: 'default',
                    onClick: componentInstance => {
                        modal.destroy();
                    },
                },
            ],
            nzOnOk: data => {},
            nzOnCancel: data => {},
            nzComponentParams: {
                conclusionList: abilityData.conclusionList,
                status: abilityData.chooseType,
                isDisabled: abilityData.isDisabled,
                modelid: abilityData.modelid,
            },
        });
        modal.afterClose.subscribe(() => {});
    }

    popupAbilityFinalConclusionSelectDialog(abilityData: abilityParam, cb) {
        const standardConfig = {
            id: '1',
            name: '能力',
            i18n: 'ability',
            page: 'ability',
        };

        this.status = abilityData.chooseType;
        this.conclusionList = abilityData.conclusionList;
        this.isDisabled = abilityData.isDisabled;
        const modelid = Number(abilityData.modelid);

        const modal = this.modalService.create({
            nzTitle: this.translateService.instant('Select Ability'),
            nzWidth: 1000 / 16 + 'rem',
            nzClosable: false,
            nzMaskClosable: false,
            nzWrapClassName: 'vertical-center-modal',
            nzZIndex: 1001,
            nzBodyStyle: { height: '510px' },
            nzOkLoading: false,
            nzContent: SelectAbilityFinalConclusionComponent,
            nzFooter: [
                {
                    label: this.translateService.instant('prev'),
                    type: 'primary',
                    show(componentInstance: any): boolean {
                        if (componentInstance.getCurrentStep() === 2) {
                            return true;
                        } else {
                            return false;
                        }
                    },
                    onClick: (componentInstance: any) =>
                        new Promise((resolve, reject) => {
                            componentInstance.preStep();
                            resolve(true);
                        }),
                },
                {
                    label: this.translateService.instant('next'),
                    type: 'primary',
                    show(componentInstance: any): boolean {
                        if (componentInstance.getCurrentStep() === 1) {
                            return true;
                        } else {
                            return false;
                        }
                    },
                    onClick: (componentInstance: any) =>
                        new Promise((resolve, reject) => {
                            componentInstance.nextStep();
                            resolve(true);
                        }),
                },
                {
                    label: this.translateService.instant('Ok'),
                    type: 'primary',
                    show(componentInstance: any): boolean {
                        if (componentInstance.getCurrentStep() === 2) {
                            return true;
                        } else {
                            return false;
                        }
                    },
                    onClick: (componentInstance: any) =>
                        new Promise((resolve, reject) => {
                            this.generalPercentage();
                            const reaultArr = this.reaultArr;
                            if (reaultArr.length > 0) {
                                if (this.isPass) {
                                    //通过效验
                                    cb(reaultArr);
                                    modal.destroy();
                                }
                            }
                            resolve(true);
                        }),
                },
                {
                    label: this.translateService.instant('Cancel'),
                    type: 'default',
                    onClick: componentInstance => {
                        modal.destroy();
                    },
                },
            ],
            nzOnOk: data => {},
            nzOnCancel: data => {},
            nzComponentParams: {
                modelId: modelid,
                conclusionList: abilityData.conclusionList,
                isDisabled: abilityData.isDisabled,
            },
        });
        modal.afterClose.subscribe(() => {});
    }

    /**
     * 能力选择新版
     *0模型结论 /1通用结论（包含百分比-多选）/2非通用多选/ 3非通用单选
     * @param cb
     */
    popupAbilitySelectDialogNew(abilityData: abilityParam, cb) {
        const standardConfig = {
            id: '1',
            name: '能力',
            i18n: 'ability',
            page: 'ability',
        };

        this.status = abilityData.chooseType;
        this.conclusionList = abilityData.conclusionList;
        this.isDisabled = abilityData.isDisabled;
        const modelid = Number(abilityData.modelid);

        this.dataService.getAbilityModel({ ModelId: modelid }).subscribe(res => {
            const qualityDictionaryId = res.qualitydictionaryid;

            if (qualityDictionaryId > 0) {
                this.dataService.GetAbilityList({ modelid }).subscribe(res => {
                    if (res) {
                        addChecked(res.abilitydictionary);
                        addTemplateId(res.abilitydictionary, '');
                        this.checkData(res.abilitydictionary);
                        const param: choiceFunctionParam = {
                            standardConfig: standardConfig,
                            dictionaryDetails: res,
                            maxlevelindex: res.maxlevelindex,
                            tree: res.abilitydictionary,
                            chooseType: abilityData.chooseType,
                            modelId: modelid,
                        };

                        if (this.status !== 0) {
                            this.showAbilityModel(param, cb);
                        } else {
                            this.showFinalConclusionModel(param, cb);
                        }
                    } else {
                        console.log('暂无数据');
                    }
                });
            } else {
                const params = {
                    modelId: modelid,
                    standardConfig: standardConfig,
                    status: 0,
                    chooseType: abilityData.chooseType,
                    conclusionList: abilityData.conclusionList,
                };
                this.showDictionarySelectionTemplateModel(params, cb);
            }
        });
    }

    //可选择能力模板弹框
    showDictionarySelectionTemplateModel(params, cb) {
        const modal = this.modalService.create({
            nzTitle: this.translateService.instant('Select Ability'),
            nzWidth: 1000 / 16 + 'rem',
            nzClosable: false,
            nzMaskClosable: false,
            nzWrapClassName: 'vertical-center-modal',
            nzZIndex: 1001,
            nzBodyStyle: { height: '510px' },
            nzOkLoading: false,
            nzContent: DictionarySelectionTemplateComponent,
            nzFooter: [
                {
                    label: this.translateService.instant('prev'),
                    type: 'primary',
                    show(componentInstance: any): boolean {
                        if (
                            (componentInstance.componentStatus === 1 && params.chooseType === 0) ||
                            componentInstance.componentStatus === 2
                        ) {
                            return true;
                        } else {
                            return false;
                        }
                    },
                    onClick: (componentInstance: any) =>
                        new Promise((resolve, reject) => {
                            componentInstance.preStep();
                            resolve(true);
                        }),
                },
                {
                    label: this.translateService.instant('next'),
                    type: 'primary',
                    show(componentInstance: any): boolean {
                        if (componentInstance.componentStatus === 0) {
                            return true;
                        } else {
                            return false;
                        }
                    },
                    onClick: (componentInstance: any) =>
                        new Promise((resolve, reject) => {
                            componentInstance.nextStep();
                            resolve(true);
                        }),
                },
                {
                    label: this.translateService.instant('Ok'),
                    type: 'primary',
                    show(componentInstance: any): boolean {
                        if (componentInstance.componentStatus === 2) {
                            return true;
                        } else {
                            return false;
                        }
                    },
                    onClick: componentInstance => {
                        if (componentInstance.getCheckListData().length <= 0) {
                            this.messageService.warning(this.translateService.instant('Please select at least one'));
                        } else {
                            if (params.chooseType === 1 || params.chooseType === 0) {
                                componentInstance.generalPercentage();
                                const reaultArr = componentInstance.reaultArr;

                                if (reaultArr.length > 0) {
                                    if (componentInstance.isPass) {
                                        //通过效验
                                        cb(reaultArr);
                                        modal.destroy();
                                    }
                                }
                            } else if (params.chooseType === 3) {
                                const radioId = componentInstance.getRadioId();
                                const abilityIds = [];
                                abilityIds.push(radioId);
                                cb(abilityIds);
                                modal.destroy();
                            } else {
                                const abilityIds = componentInstance.getCheckListData();
                                cb(abilityIds);
                                modal.destroy();
                            }
                        }
                    },
                },
                {
                    label: this.translateService.instant('Cancel'),
                    type: 'default',
                    onClick: componentInstance => {
                        modal.destroy();
                    },
                },
            ],
            nzComponentParams: {
                modelId: params.modelId,
                standardConfig: params.standardConfig,
                dictionaryDetails: params.dictionaryDetails,
                isCheckbox: params.chooseType === 3 ? false : true,
                isShowProportion: params.chooseType === 1 ? true : false,
                chooseType: params.chooseType,
                conclusionList: params.conclusionList,
                componentStatus: 0,
            },
        });
    }

    //普通能力弹框
    showAbilityModel(params: choiceFunctionParam, cb) {
        const modal = this.modalService.create({
            nzTitle: this.translateService.instant('Select Ability'),
            nzWidth: 1000 / 16 + 'rem',
            nzClosable: false,
            nzMaskClosable: false,
            nzWrapClassName: 'vertical-center-modal',
            nzZIndex: 1001,
            nzBodyStyle: { height: '510px' },
            nzOkLoading: false,
            nzContent: ChoiceFunctionComponent,
            nzFooter: [
                {
                    label: this.translateService.instant('Ok'),
                    type: 'primary',
                    onClick: componentInstance => {
                        if (componentInstance.getCheckListData().length <= 0) {
                            this.messageService.warning(this.translateService.instant('Please select at least one'));
                        } else {
                            if (params.chooseType === 1 || params.chooseType === 0) {
                                this.generalPercentage();
                                const reaultArr = this.reaultArr;

                                if (reaultArr.length > 0) {
                                    if (this.isPass) {
                                        //通过效验
                                        cb(reaultArr);
                                        modal.destroy();
                                    }
                                }
                            } else if (params.chooseType === 3) {
                                const radioId = componentInstance.radioId;
                                const abilityIds = [];
                                abilityIds.push(radioId);
                                cb(abilityIds);
                                modal.destroy();
                            } else {
                                const abilityIds = componentInstance.getCheckListData();
                                cb(abilityIds);
                                modal.destroy();
                            }
                        }
                    },
                },
                {
                    label: this.translateService.instant('Cancel'),
                    type: 'default',
                    onClick: componentInstance => {
                        modal.destroy();
                    },
                },
            ],
            nzComponentParams: {
                standardConfig: params.standardConfig,
                dictionaryDetails: params.dictionaryDetails,
                tree: params.tree,
                maxlevelindex: params.maxlevelindex,
                isCheckbox: params.chooseType === 3 ? false : true,
                isShowProportion: params.chooseType === 1 ? true : false,
            },
        });
    }

    //最终结论弹框
    showFinalConclusionModel(params: choiceFunctionParam, cb) {
        const modal = this.modalService.create({
            nzTitle: this.translateService.instant('Select Ability'),
            nzWidth: 1000 / 16 + 'rem',
            nzClosable: false,
            nzMaskClosable: false,
            nzWrapClassName: 'vertical-center-modal',
            nzZIndex: 1001,
            nzBodyStyle: { height: '510px' },
            nzOkLoading: false,
            nzContent: SelectAbilityFinalConclusionComponent,
            nzFooter: [
                {
                    label: this.translateService.instant('prev'),
                    type: 'primary',
                    show(componentInstance: any): boolean {
                        if (componentInstance.getCurrentStep() === 2) {
                            return true;
                        } else {
                            return false;
                        }
                    },
                    onClick: (componentInstance: any) =>
                        new Promise((resolve, reject) => {
                            componentInstance.preStep();
                            resolve(true);
                        }),
                },
                {
                    label: this.translateService.instant('next'),
                    type: 'primary',
                    show(componentInstance: any): boolean {
                        if (componentInstance.getCurrentStep() === 1) {
                            return true;
                        } else {
                            return false;
                        }
                    },
                    onClick: (componentInstance: any) =>
                        new Promise((resolve, reject) => {
                            componentInstance.nextStep();
                            resolve(true);
                        }),
                },
                {
                    label: this.translateService.instant('Ok'),
                    type: 'primary',
                    show(componentInstance: any): boolean {
                        if (componentInstance.getCurrentStep() === 2) {
                            return true;
                        } else {
                            return false;
                        }
                    },
                    onClick: (componentInstance: any) =>
                        new Promise((resolve, reject) => {
                            this.generalPercentage();
                            const reaultArr = this.reaultArr;

                            if (reaultArr.length > 0) {
                                if (this.isPass) {
                                    //通过效验
                                    cb(reaultArr);
                                    modal.destroy();
                                }
                            } else {
                                this.messageService.warning(
                                    this.translateService.instant('Please select at least one'),
                                );
                            }
                            resolve(true);
                        }),
                },
                {
                    label: this.translateService.instant('Cancel'),
                    type: 'default',
                    onClick: componentInstance => {
                        modal.destroy();
                    },
                },
            ],
            nzComponentParams: {
                modelId: params.modelId,
                standardConfig: params.standardConfig,
                dictionaryDetails: params.dictionaryDetails,
                tree: params.tree,
                maxlevelindex: params.maxlevelindex,
                isCheckbox: true,
                isShowProportion: true,
            },
        });
    }

    checkData(data) {
        const status = this.status;
        const conclusionList = this.conclusionList;
        this.checkState(data, status, conclusionList, this.isDisabled);
        this.tabs = data;
    }

    // 通用結論百分比
    generalPercentage() {
        let hasCheched = false;
        const status = this.status;
        const tabs = this.tabs;
        const reaultArr = [];
        this.isPass = true;

        let forFn = function(tabs) {
            _.forEach(tabs, element => {
                //const description = element.description;
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
}
