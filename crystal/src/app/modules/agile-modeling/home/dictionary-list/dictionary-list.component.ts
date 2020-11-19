import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HomeService } from '../service/home.service';
import { DictionaryModalService } from '@app/utils/dictionary-modal.service';
import * as _ from 'lodash';
import { NzMessageService } from 'ng-zorro-antd';
import { standardConfig } from '../dict-config';
import { EditDictionaryModelComponent } from '../components/edit-dictionary-model/edit-dictionary-model.component';

@Component({
    selector: 'app-dictionary-list',
    templateUrl: './dictionary-list.component.html',
    styleUrls: ['./dictionary-list.component.less'],
})
export class DictionaryListComponent implements OnInit {
    imgChange = 'zh';
    pageindex = 1;
    pagesize = 20;
    totalcount = 30;
    qualityType = -1; //字典类别 查全部传-1
    pageState = 1;
    currentPageCount = 0;
    pageCount = 1; //总共多少页

    abilityData = [];

    query = '';
    listOfData = [];
    constructor(
        private homeService: HomeService,
        private translateService: TranslateService,
        private messageService: NzMessageService,
        private commonService: DictionaryModalService,
    ) {}

    ngOnInit() {
        this.imgChange = this.translateService.instant('Image language switching');
        this.currentPageCount = (this.pageindex - 1) * this.pagesize; //当前页之前数据总条数
        this.getData();
    }

    //翻页
    pageIndexChange($event) {
        this.pageindex = $event;
        this.currentPageCount = (this.pageindex - 1) * this.pagesize; //当前页之前数据总条数
        this.getData();
    }

    getData() {
        const param = {
            pageindex: this.pageindex,
            pagesize: this.pagesize,
            qualitytype: this.qualityType,
            qualitydictionaryname: this.query,
        };
        this.homeService.getDictionaryList().subscribe(res => {
            if (res != null && res.data.length > 0) {
                this.listOfData = _.map(res.data, (row, rowIndex) => {
                    const qualityObject = _.find(standardConfig, {
                        id: row.qualitytype.toString(),
                    });
                    let qualityTypeName = '';
                    if (typeof qualityObject !== 'undefined') {
                        qualityTypeName = qualityObject.name;
                    }
                    return {
                        rowIndex: this.currentPageCount + rowIndex + 1,
                        id: row.id,
                        qualityType: row.qualitytype,
                        qualityTypeName: qualityTypeName,
                        dictionaryName: row.dictionaryname,
                        dictionaryType: row.dictionarytype,
                    };
                });

                this.pageindex = res.pageindex;
                this.pagesize = res.pagesize;
                this.totalcount = res.totalcount;
                this.pageCount = Math.ceil(this.totalcount / this.pagesize);
                this.pageState = 3;
            } else {
                this.pageState = 2;
            }
        });
    }

    editModule(isAdd, params) {
        let tipMsg =
            isAdd !== 'add'
                ? this.translateService.instant('字典修改成功')
                : this.translateService.instant('字典新增成功');
        this.commonService
            .editModule(isAdd, params, EditDictionaryModelComponent)
            .then((e: any) => {
                this.homeService
                    .ExsitQualityDicNameById({
                        id: e.id,
                        dictionaryName: e.dictionaryName,
                    })
                    .subscribe(res => {
                        if (res === true) {
                            this.messageService.error('字典名称重复!');
                        } else {
                            // 不存在重复
                            this.pageState = 1;
                            this.homeService
                                .insertQualityDictionary({
                                    id: e.id,
                                    dictionaryName: e.dictionaryName,
                                })
                                .subscribe(data => {
                                    this.pageState = 3;
                                    this.messageService.success(tipMsg);
                                    this.query = '';
                                    this.getData();
                                });
                        }
                    });
            })
            .catch(() => {
                console.log('取消');
            });
    }
}
