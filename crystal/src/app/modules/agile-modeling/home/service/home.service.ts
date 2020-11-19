import { Injectable } from '@angular/core';
import { Observable, Subject, of } from 'rxjs';
import { MockData } from 'src/app/constants/app.constants';
import { _HttpClient } from 'src/app/core/net/http.client';

import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { TranslateService } from '@ngx-translate/core';



@Injectable()
export class HomeService {
    constructor(
        private _http: _HttpClient,
        private translateService: TranslateService,
        private modalService: NzModalService,
        private messageService: NzMessageService
    ) { }

    //获取用户列表
    getUserList(params): Observable<any> {
        let url = '';
        if (MockData) {
            url = 'assets/mockData/user-list.json';
        } else {
            url = 'users';
        }
        return this._http.get(url, params);
    }

    // 获取能力模型列表
    getAbilityModelList(params = {}): Observable<any> {
        let url = '';
        if (MockData) {
            url = 'assets/mockData/modeling-home-model.json';
        } else {
            url = 'abilitymodel/getAbilityModelList';
        }
        return this._http.get(url, params);
    }

    // 获取能力模型管理员列表
    getAbilityModel(params = {}): Observable<any> {
        let url = '';
        if (MockData) {
            url = 'assets/mockData/modeling-home-modelDetail.json';
        } else {
            url = 'abilitymodel/getAbilityModel';
        }
        return this._http.get(url, params);
    }

    // 创建更新能力模型列
    postAbilityModel(params = {}): Observable<any> {
        let url = '';
        let method = 'post';
        if (MockData) {
            url = 'assets/mockData/modeling-home-model.json';
            method = 'get';
        } else {
            url = 'abilitymodel/AddAbilityModel';
        }
        return this._http[method](url, params);
    }

    // 删除能力模型
    deleteAbilityModel(params = {}): Observable<any> {
        let url = '';
        if (MockData) {
            url = 'assets/mockData/modeling-home-model.json';
        } else {
            url = 'abilitymodel/DeleteAbilityModel';
        }
        return this._http.get(url, params);
    }

    //复制能力模型
    copyAbilityModel(params: any = {}): Observable<any> {
        let url = '';
        let method = 'post';
        if (MockData) {
            url = 'assets/mockData/modeling-home-model.json';
            method = 'get';
        } else {
            url = `abilitymodel/CopyAbilityModel?CopySourceId=${params.Id}`;
        }
        return this._http[method](url, params);
    }

    // 获取模型详细首页子弹图数据
    getModelConclusionTypeState(params = {}): Observable<any> {
        let url = '';
        if (MockData) {
            url = 'assets/mockData/modeling-home-modelState.json';
        } else {
            url = 'abilitymodel/getModelConclusionTypeState';
        }
        return this._http.get(url, params);
    }

    // 拖拽模型列表顺序
    setAbilitySort(params = {}): Observable<any> {
        let url = '';
        let method = 'post';
        if (MockData) {
            url = 'assets/mockData/modeling-home-model.json';
            method = 'get';
        } else {
            url = 'abilitymodel/SetAbilitySort';
        }
        return this._http[method](url, params);
    }

    //获取能力字典列表
    getAbilityDicList(params = {}): Observable<any> {
        let url = '';
        if (MockData) {
            url = 'assets/mockData/modeling-home-dictionary.json';
        } else {
            url = 'abilitymodel/GetAbilityDicList';
        }
        return this._http.get(url, params);
    }

    //设置用户能力词典
    setAblityDescription(params: any = {}): Observable<any> {
        let url = '';
        let method = 'post';
        if (MockData) {
            url = 'assets/mockData/modeling-home-dictionary.json';
            method = 'get';
        } else {
            url = `abilitymodel/SetAblityDescription?Id=${params.Id}`;
        }
        return this._http[method](url, params);
    }

    //客户能力词典恢复默认
    resetAblityDescription(params: any = {}): Observable<any> {
        let url = '';
        let method = 'post';
        if (MockData) {
            url = 'assets/mockData/modeling-home-dictionary.json';
            method = 'get';
        } else {
            url = `abilitymodel/ResetAblityDescription?Id=${params.Id}`;
        }
        return this._http[method](url, params);
    }

    //获取能力字典列表（新）
    getDictionaryList(params: any = {}): Observable<any> {
        let url = '';
        if (MockData) {
            url = 'assets/mockData/modeling-home-dictionary.json';
        } else {
            url = 'abilitymodel/GetQualityDictionaryList'
        }
        return this._http.get(url, params);
    }


    //验证敏捷建模名称是否存在
    ExsitQualityDicNameById(params = {}): Observable<any> {
        let url = '';
        if (MockData) {
            return of({});
        } else {
            url = 'abilitymodel/ExsitQualityDicNameById';
        }
        return this._http.get(url, params);
    }

    //新增、修改敏捷建模字典
    insertQualityDictionary(params = {}): Observable<any> {
        let url = '';
        if (MockData) {
            return of({});
        } else {
            url = 'abilitymodel/InsertQualityDictionary';
        }
        return this._http.post(url, params);
    }

    //获取敏捷建模字典详细维度信息
    getQualityDictionaryDetailList(params = {}): Observable<any> {
        let url = '';
        if (MockData) {
            url = 'assets/mockData/oc/total.json';
        } else {
            url = 'abilitymodel/GetQualityDictionaryDetailList';
        }
        return this._http.get(url, params);
    }

    //保存敏捷建模字典详情 包括新增/修改/删除 维度/子维度后统一调用接口进行保存
    setQualityDictionaryDetail(params = {}): Observable<any> {
        let url = '';
        if (MockData) {
            return of({});
        } else {
            url = 'abilitymodel/SetQualityDictionaryDetail';
        }
        return this._http.post(url, params);
    }
}
