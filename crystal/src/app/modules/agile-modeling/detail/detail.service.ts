import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { MockData } from 'src/app/constants/app.constants';
import { _HttpClient } from 'src/app/core/net/http.client';

@Injectable()
export class DetailService {
    constructor(private _http: _HttpClient) {}

    // 获取结论
    getModelConclusion(params = {}): Observable<any> {
        let url = '';
        if (MockData) {
            url = 'assets/mockData/modeling-detail-conclusion.json';
        } else {
            url = 'abilitycustomfield/getModelConclusion';
        }
        return this._http.get(url, params);
    }

    // 获取结论列表-四个方法结论集合
    getListModelConclusion(params = {}): Observable<any> {
        let url = '';
        if (MockData) {
            url = 'assets/mockData/modeling-detail-listConclusion.json';
        } else {
            url = 'abilitycustomfield/getListModelConclusion';
        }
        return this._http.get(url, params);
    }

    // 结论详细能力排序
    postModelConclusionSort(params: any = {}): Observable<any> {
        let url = '';
        let method = 'post';
        if (MockData) {
            url = 'assets/mockData/modeling-home-model.json';
            method = 'get';
        } else {
            url = `abilitycustomfield/UpdateModelConclusionSort?ModelId=${params.ModelId}&TabId=${params.TabId}`;
        }
        return this._http[method](url, params);
    }

    // 领导访谈tab数据同步（有下一步页签时）
    synModelInterviewData(params: any = {}): Observable<any> {
        let url = '';
        let method = 'post';
        if (MockData) {
            url = 'assets/mockData/modeling-home-model.json';
            method = 'get';
        } else {
            url = `abilitycustomfield/SynModelInterviewData?modelid=${params.modelid}&tabid=${params.tabid}`;
        }
        return this._http[method](url, params);
    }
}
