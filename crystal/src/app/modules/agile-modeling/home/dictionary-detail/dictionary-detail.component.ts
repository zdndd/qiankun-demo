import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { VXDialogService } from '@shared/vxui/service/dialog.service';
import { DictionaryModalService } from '@app/utils/dictionary-modal.service';
import { HomeService } from '../service/home.service';
import { deleteItemFromParent, addTemplateId } from '@utils/convert';
import { standardConfig, ItemConfig } from '../dict-config';
import { EditDictionaryModelComponent } from '../components/edit-dictionary-model/edit-dictionary-model.component';

import _ from 'lodash';
@Component({
    selector: 'app-dictionary-detail',
    templateUrl: './dictionary-detail.component.html',
    styleUrls: ['./dictionary-detail.component.less'],
})
export class DictionaryDetailComponent implements OnInit {
    qualityDictionaryId;
    dictionaryname;
    imgChange = 'zh';
    total: ItemConfig[] = [];
    isModelUsed = false;
    //standardConfig中的 能力 潜力 动力等
    qualityType;

    //字典类型1内置，2是自定义
    dictionaryType;

    pageState = 1;
    modalStatus = 0;
    currentIndex = 0;
    currentStandardConfig: any;
    saveDimentionParams = {
        id: '',
        dictionaryname: '',
        abilitydictionary: [],
        dictionarytype: 0,
        qualityType: 0,
    };
    currentTemplateId;
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private homeService: HomeService,
        private modalService: NzModalService,
        private translateService: TranslateService,
        private dialogService: VXDialogService,
        private message: NzMessageService,
        private commonService: DictionaryModalService,
    ) {
        this.qualityDictionaryId = this.route.snapshot.params.id;
        this.saveDimentionParams.id = this.qualityDictionaryId;
    }

    ngOnInit() {
        this.homeService
            .getQualityDictionaryDetailList({
                qualityDictionaryId: this.qualityDictionaryId,
            })
            .subscribe(res => {
                if (res) {
                    this.pageState = 2;
                    this.isModelUsed = res.ismodelused;
                    if (res.abilitydictionary) {
                        this.total = res.abilitydictionary;

                        this.saveDimentionParams.abilitydictionary = this.total;
                        addTemplateId(this.total, '');
                        this.pageState = 3;
                    }

                    this.qualityType = res.qualitytype;
                    this.currentStandardConfig = _.find(standardConfig, {
                        id: this.qualityType + '',
                    });
                    this.dictionaryType = res.dictionarytype;

                    //this.saveDimentionParams赋值
                    this.dictionaryname = res.dictionaryname;
                    this.saveDimentionParams.dictionaryname = this.dictionaryname;

                    this.saveDimentionParams.dictionarytype = res.dictionarytype;
                    this.saveDimentionParams.qualityType = res.qualitytype;
                } else {
                }
            });
    }

    choiceDimension(item, i) {
        this.currentIndex = i;
    }

    deleteDimension(item) {
        this.dialogService
            .confirm(this.translateService.instant('是否删除' + item.abilityname + '?'))
            .then(() => {
                deleteItemFromParent(this.total, item.templateId);
                addTemplateId(this.total, '');
                if (this.total.length <= 0) {
                    this.pageState = 2;
                }
            })
            .catch(() => {});
    }

    //tree-list中 新增同级、子级、编辑
    editElement(e) {
        this.currentTemplateId = e.item.templateId;
        let item = e.position == 'self' ? e.item : {};
        this.commonService
            .addDimension(1, this.currentStandardConfig['name'], this.currentStandardConfig['id'], e.position, item)
            .then(newItem => {
                // this.digui(newItem, this.total, e.position);

                this.commonService.digui(newItem, this.total, e.position, this.currentTemplateId);
                addTemplateId(this.total, '');
                this.pageState = 3;
            })
            .catch(() => {
                console.log('catch');
            });
    }

    addDimension(status) {
        this.commonService
            .addDimension(status, this.currentStandardConfig['name'], this.currentStandardConfig['id'], null, null)
            .then(newItem => {
                this.total.push(newItem);
                addTemplateId(this.total, '');
                this.pageState = 3;
            })
            .catch(() => {
                console.log('catch');
            });
    }

    modalTitle(status, position?) {
        if (status) {
            if (position == 'siblings') {
                return this.translateService.instant('添加同级能力');
            } else if (position == 'child') {
                return this.translateService.instant('添加子能力');
            } else {
                return this.translateService.instant('编辑能力');
            }
        } else {
            return this.translateService.instant('添加维度');
        }
    }

    saveDimension() {
        if (this.dictionaryType == 1) {
            this.saveDimentionParams.dictionarytype = 1;
            this.copyDictionary();
        } else {
            this.setDictionaryDetail();
        }
    }

    //错误-2的时候 或者this.dictionaryType 是内置字典   ，复制一个字典
    copyDictionary() {
        let dictionaryInfo = {
            dictionaryName: this.dictionaryname,
            qualityType: this.qualityType,
            id: this.qualityDictionaryId,
        };

        this.commonService
            .editModule('add', dictionaryInfo, EditDictionaryModelComponent)
            .then((e: any) => {
                this.homeService
                    .ExsitQualityDicNameById({
                        id: e.id,
                        dictionaryName: e.dictionaryName,
                    })
                    .subscribe(res => {
                        if (res === true) {
                            this.message.error('字典名称重复!');
                        } else {
                            // 不存在重复
                            this.saveDimentionParams.id = e.id;
                            this.saveDimentionParams.dictionaryname = e.dictionaryName;
                            this.setDictionaryDetail();
                        }
                    });
            })
            .catch(() => {
                console.log('取消');
            });
    }

    setDictionaryDetail() {
        this.pageState = 1;
        this.saveDimentionParams.abilitydictionary = this.total;
        this.homeService.setQualityDictionaryDetail(this.saveDimentionParams).subscribe(res => {
            this.pageState = 3;
            if (res.errorcode == 0) {
                this.message
                    .create('success', `保存成功`, {
                        nzDuration: 1000,
                    })
                    .onClose!.pipe()
                    .subscribe(() => {
                        this.router.navigateByUrl('/agile-modeling/home/dictionary-list');
                    });
            } else if (res.errorcode == -2) {
                this.message.create('error', res.message);
                this.copyDictionary();
            } else {
                let errorTxt = '';
                if (res.data) {
                    errorTxt = res.data.join('<br/>');
                }
                this.modalService.error({
                    nzTitle: res.message,
                    nzContent: errorTxt,
                });
            }
        });
    }
}
