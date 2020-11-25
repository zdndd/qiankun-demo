import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    TemplateRef,
    ViewChild,
} from '@angular/core';

import { Subscription } from 'rxjs';
import { NzListGrid, NzMessageService } from 'ng-zorro-antd';
import { KNXDataService } from '../../../../core/knxdata.service';
import { TranslateService } from '@ngx-translate/core';
import { ScrollBarHelper } from '../../../../utils/scrollbar-helper';
import { ActivatedRoute } from '@angular/router';
import { DataState, ValueObjParam } from '../../../../constants/app.constants';

const enum EnumsConclusionType {
    LeaderInterview = 1, //领导访谈
    AbilityComparison = 7, //能力比较
    TaskAnalysis = 16, // 任务分析
    EmployeeSurvey = 10, //员工调研
    AbilityModel = 20, //能力建模
    CreateModel = 21, //模型建立
}

@Component({
    selector: 'select-ability',
    preserveWhitespaces: false,
    templateUrl: './select-ability.component.html',
    styleUrls: ['./select-ability.component.less'],
})
export class SelectAbilityComponent implements OnInit, AfterViewInit, OnDestroy {
    pageState = DataState.LOADING;
    imgChange = 'zh';
    isPass = true;
    radioId = '';
    tabs = [];
    modelid = 0;
    reaultArr = []; //返回给父级
    conclusionList = [];
    checkIdList = [];
    isDisabled = false; //已选中的是否禁用
    status = null; //0模型结论 /1通用结论（包含百分比-多选）/2非通用多选/ 3非通用单选
    private _scrollBar = null;
    constructor(
        public dataService: KNXDataService,
        public translateService: TranslateService,
        public elementRef: ElementRef,
        private messageService: NzMessageService,
        public activatedRoute: ActivatedRoute,
    ) {}

    ngOnInit(): void {
        this.imgChange = this.translateService.instant('Image language switching');
        const status = this.status;
        const modelid = Number(this.modelid);
        if (status !== 0) {
            this.dataService.GetAbilityList({ modelid }).subscribe((res) => {
                if (res && res.length > 0) {
                    this.pageState = DataState.EXIST_DATA;
                    this.getData(res);
                } else {
                    this.pageState = DataState.EMPTY;
                    console.log('暂无数据');
                }
            });
        } else {
            this.dataService.GetAbilityListDicSortInfo({ modelid }).subscribe((res) => {
                if (res && res.length > 0) {
                    this.pageState = DataState.EXIST_DATA;
                    this.getData(res);
                } else {
                    this.pageState = DataState.EMPTY;
                    //console.log('暂无数据');
                }
            });
        }
    }

    getData(data) {
        const status = this.status;
        const conclusionList = this.conclusionList;
        if (status !== 3) {
            for (let i = 0; i < data.length; i++) {
                if (data[i].children) {
                    const children = data[i].children;
                    for (let j = 0; j < children.length; j++) {
                        const id = children[j].id;
                        children[j]['ischecked'] = false;
                        children[j]['proportion'] = status === 0 ? 0 : null;
                        children[j]['disabled'] = false;
                        if (children[j]['lstpagetabinfo']) {
                            const lstpagetabinfo = children[j]['lstpagetabinfo'];
                            for (let k = 0; k < lstpagetabinfo.length; k++) {
                                const showstar = lstpagetabinfo[k]['showstar'];
                                lstpagetabinfo[k]['name'] = this.switchType(lstpagetabinfo[k]['tabparentid']);
                                lstpagetabinfo[k]['classname'] = showstar ? 'star-gold' : 'star-gray';
                            }
                        }
                        for (let z = 0; z < conclusionList.length; z++) {
                            conclusionList[z]['id'] = conclusionList[z]['abilityid']
                                ? conclusionList[z]['abilityid']
                                : conclusionList[z]['id'];
                            if (id === conclusionList[z].id) {
                                children[j]['ischecked'] = true;
                                if (this.isDisabled) {
                                    children[j]['disabled'] = true;
                                }
                                this.checkIdList.push(id);
                                if (conclusionList[z].proportion) {
                                    children[j]['proportion'] = conclusionList[z].proportion;
                                }
                            }
                        }
                    }
                }
            }
        } else {
            if (conclusionList.length > 0)
                this.radioId = conclusionList[0].id ? conclusionList[0].id : conclusionList[0];
        }
        this.tabs = data;
        // console.log(this.checkIdList, data, 'data-');
    }

    switchType(tabparentid) {
        const id = Number(tabparentid);
        let name = '';
        switch (id) {
            case EnumsConclusionType.LeaderInterview:
                name = '领导访谈';
                break;
            case EnumsConclusionType.AbilityComparison:
                name = '能力比较';
                break;
            case EnumsConclusionType.TaskAnalysis:
                name = '任务分析';
                break;
            case EnumsConclusionType.EmployeeSurvey:
                name = '员工调研';
                break;
            default:
                break;
        }
        return name;
    }

    ngOnDestroy(): void {
        if (this._scrollBar) {
            this._scrollBar.destroy();
            this._scrollBar = null;
        }
    }

    // log(value: string[]): void {
    //     console.log(value);
    // }

    makeScrollbar() {
        setTimeout(() => {
            if (this._scrollBar) {
                this._scrollBar.destroy();
                this._scrollBar = null;
            }
            this._scrollBar = ScrollBarHelper.makeScrollbar(
                this.elementRef.nativeElement.querySelector('.ant-tabs-tabpane-active'),
            );
        }, 200);
    }
    checkedChange(value: string[], id): void {
        // console.log(value,id,'single');
        const checkIdList = this.checkIdList;
        if (value) {
            this.checkIdList.push(id);
        } else {
            const index = checkIdList.indexOf(id);
            if (index > -1) {
                this.checkIdList.splice(index, 1);
            }
        }
    }

    getResult() {
        const status = this.status;
        // if(status === 1){    //通用结论；
        this.generalPercentage();
        // }
    }
    // 通用結論百分比
    generalPercentage() {
        let hasCheched = false;
        const status = this.status;
        const tabs = this.tabs;
        const reaultArr = [];
        this.isPass = true;
        for (let i = 0; i < tabs.length; i++) {
            if (tabs[i].children) {
                const children = tabs[i].children;
                for (let j = 0; j < children.length; j++) {
                    const description = children[j].description;
                    const id = children[j].id;
                    const check = children[j]['ischecked'];
                    const proportion = children[j]['proportion'];
                    let valueObj: ValueObjParam;
                    // let valueObj = {
                    //     description: '',
                    //     abilityid: '',
                    //     proportion: '',
                    // };
                    if (check) {
                        hasCheched = true;
                        if (status === 1) {
                            valueObj = {
                                abilityid: Number(id),
                                proportion: proportion,
                            };
                        } else if (status === 0) {
                            valueObj = {
                                abilityid: Number(id),
                                description: description,
                            };
                        }
                        reaultArr.push(valueObj);
                    }
                }
            }
        }
        this.reaultArr = reaultArr;
        if (status === 1) {
            let proportionS = 0;
            for (let z = 0; z < reaultArr.length; z++) {
                const proportion = reaultArr[z]['proportion'];
                if (proportion) {
                    proportionS += Number(proportion);
                } else {
                    this.messageService.warning('选中需输入占比');
                    this.isPass = false;
                    return false;
                }
            }
            // console.log(proportionS,proportionS.toFixed(2),Math.round(proportionS));
            if (hasCheched && Number(proportionS.toFixed(2)) !== 100) {
                this.messageService.warning('占比和必须为100');
                this.isPass = false;
                return false;
            }
        }
        return true;
    }

    ngAfterViewInit() {
        this.makeScrollbar();
    }
}
