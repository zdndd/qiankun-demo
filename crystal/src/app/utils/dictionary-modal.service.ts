import { Injectable } from '@angular/core';

import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { TranslateService } from '@ngx-translate/core';
import { AddDictionaryModelComponent } from '../modules/occupational-competency/oc-component/add-dictionary-model/add-dictionary-model.component';
import { ModalContentComponent } from '../modules/occupational-competency/oc-component/modal-content/modal-content.component';
import { ItemConfig } from '../modules/occupational-competency/oc-config';

import _ from 'lodash';

@Injectable()
export class DictionaryModalService {
    modalStatus = 0;
    currentTemplateId;
    constructor(
        private translateService: TranslateService,
        private modalService: NzModalService,
        private messageService: NzMessageService,
    ) {}

    modalTitle(status, title, position?) {
        // console.log(status, title, position);
        if (status) {
            if (position === 'siblings') {
                switch (title) {
                    case '能力':
                        return this.translateService.instant('Add entry of the same ability level');
                    case '动力':
                        return this.translateService.instant('Add entry of the same power level');
                    case '潜力':
                        return this.translateService.instant('Add entry of the same potential level');
                    case '经历':
                        return this.translateService.instant('Add entry of the same experience level');
                }
            } else if (position === 'child') {
                switch (title) {
                    case '能力':
                        return this.translateService.instant('Add entry of the lower ability level');
                    case '动力':
                        return this.translateService.instant('Add entry of the lower power level');
                    case '潜力':
                        return this.translateService.instant('Add entry of the lower potential level');
                    case '经历':
                        return this.translateService.instant('Add entry of the lower experience level');
                }
            } else if (position === 'self') {
                switch (title) {
                    case '能力':
                        return this.translateService.instant('edit ability');
                    case '动力':
                        return this.translateService.instant('edit power');
                    case '潜力':
                        return this.translateService.instant('edit potential');
                    case '经历':
                        return this.translateService.instant('edit experience');
                }
            } else {
                switch (title) {
                    case '能力':
                        return this.translateService.instant('add ability');
                    case '动力':
                        return this.translateService.instant('add power');
                    case '潜力':
                        return this.translateService.instant('add potential');
                    case '经历':
                        return this.translateService.instant('add experience');
                }
            }
        } else {
            return this.translateService.instant('Add Dimension');
        }
    }

    //素质字典 与 素质字典详情页共用
    editModule(isAdd, params, component?) {
        return new Promise((resolve, reject) => {
            const modal = this.modalService.create({
                nzTitle:
                    isAdd === 'add'
                        ? this.translateService.instant('add dictionary')
                        : this.translateService.instant('edit dictionary'),
                nzWidth: '304px',
                nzClosable: false,
                nzMaskClosable: false,
                nzWrapClassName: 'vertical-center-modal',
                nzZIndex: 1001,
                nzBodyStyle: { height: '200px' },
                nzContent: component ? component : AddDictionaryModelComponent,
                nzFooter: [
                    {
                        label: this.translateService.instant('Ok'),
                        type: 'primary',
                        onClick: (componentInstance: any) => {
                            // new Promise((resolve, reject) => {
                            if (componentInstance.dictionaryNameValid()) {
                                const postData = componentInstance.getData();
                                let id = 0;
                                if (isAdd !== 'add') {
                                    id = postData.id;
                                }

                                if (postData.dictionaryName.indexOf('_') > -1) {
                                    this.messageService.error(
                                        this.translateService.instant('Dictionary Name') +
                                            this.translateService.instant('Cannot contain special characters') +
                                            '_',
                                    );
                                    return;
                                }

                                const checkDuplicateParams = {
                                    id: id,
                                    dictionaryName: postData.dictionaryName,
                                    qualityType: postData.qualityType ? postData.qualityType : '',
                                };

                                resolve(checkDuplicateParams);
                                modal.destroy();
                            } else {
                                // resolve(false);
                            }
                            // }),
                        },
                    },
                    {
                        label: this.translateService.instant('Cancel'),
                        type: 'default',
                        onClick: (componentInstance) => {
                            modal.destroy();
                        },
                    },
                ],
                nzComponentParams: { data: params },
            });
        });
    }

    //关联模型中的能力动力潜力页面 与 素质字典详情共用
    addDimension(status, qualityName, standardConfigId, position?, currentItem?, component?) {
        if (currentItem) {
            this.currentTemplateId = currentItem.templateId;
        }

        this.modalStatus = status;
        return new Promise((resolve, reject) => {
            const modal = this.modalService.create({
                nzTitle: this.modalTitle(status, qualityName, position),
                nzContent: component ? component : ModalContentComponent,
                nzMaskClosable: false,
                nzClosable: false,
                nzComponentParams: {
                    status: this.modalStatus,
                    currentItem: currentItem,
                    qualityName: qualityName,
                    standardConfigId: standardConfigId,
                },
                nzFooter: [
                    {
                        label: this.translateService.instant('prev'),
                        type: 'primary',
                        show: (): boolean => {
                            if (this.modalStatus >= 1 && !position) {
                                return true;
                            } else {
                                return false;
                            }
                        },
                        onClick: (componentInstance: any) => {
                            this.modalStatus = 0;
                            componentInstance.go(0);

                            modal.getInstance().nzTitle = this.modalTitle(this.modalStatus, qualityName);
                        },
                    },
                    {
                        label: this.translateService.instant('next'),
                        type: 'primary',
                        show: (): boolean => {
                            if (this.modalStatus == 0) {
                                return true;
                            } else {
                                return false;
                            }
                        },
                        onClick: (componentInstance: any) =>
                            new Promise((resolve) => {
                                if (componentInstance.dimensionName.indexOf('_') > -1) {
                                    this.messageService.error(
                                        this.translateService.instant('Dimension names') +
                                            this.translateService.instant('Cannot contain special characters') +
                                            '_',
                                    );
                                    return;
                                }
                                if (componentInstance.valid()) {
                                    this.modalStatus = 1;
                                    console.log('qualityName2', qualityName);
                                    modal.getInstance().nzTitle = this.modalTitle(this.modalStatus, qualityName);
                                    componentInstance.go(1);
                                } else {
                                    resolve(true);
                                }
                            }),
                    },

                    {
                        label: this.translateService.instant('Ok'),
                        type: 'primary',
                        show: (): boolean => {
                            if (this.modalStatus >= 1) {
                                return true;
                            } else {
                                return false;
                            }
                        },
                        onClick: (componentInstance: any) => {
                            const abilityName = componentInstance.newList().children[0].abilityname;
                            if (abilityName.indexOf('_') > -1) {
                                this.messageService.error(
                                    this.translateService.instant('ability name') +
                                        this.translateService.instant('Cannot contain special characters') +
                                        '_',
                                );
                                return;
                            }
                            if (componentInstance.ablityValid()) {
                                //status 0的时候要带上维度
                                const newItem: ItemConfig = status
                                    ? componentInstance.newList().children[0]
                                    : componentInstance.newList();

                                this.filterDescription(newItem);
                                resolve(newItem);
                                modal.destroy();
                            }
                        },
                    },
                    {
                        label: this.translateService.instant('Cancel'),
                        type: 'default',
                        onClick: () => {
                            modal.destroy();
                        },
                    },
                ],
            });
        });
    }

    filterDescription(obj: ItemConfig) {
        if (obj.defaultdescription) {
            const arr = obj.defaultdescription.split(/\n/);
            const emptyindex = _.findIndex(arr, function (o) {
                return o == '';
            });
            if (emptyindex >= 1) {
                obj.defaultdescription = _.compact(arr).join('\n');
            }
        }
        if (!obj.descriptionlist) {
            const obj2 = { descriptionlist: [] };
            obj = Object.assign(obj, obj2);
        }
        return obj;
    }

    digui(newItem, arr, position, currentTemplateId?) {
        if (!currentTemplateId) {
            currentTemplateId = this.currentTemplateId;
        }

        _.forEach(arr, (element) => {
            if (element.templateId == currentTemplateId) {
                if (!element.children) {
                    element.children = [];
                }

                switch (position) {
                    case 'child':
                        element.children.push(newItem);
                        break;
                    case 'siblings':
                        element.children.unshift(newItem);
                        break;
                    case 'self':
                        element.abilityname = newItem.abilityname;
                        element.defaultdescription = newItem.defaultdescription;
                        break;
                }

                return true;
            } else {
                this.digui(newItem, element.children, position, currentTemplateId);
            }
        });
    }
}
