import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { MockData } from 'src/app/constants/app.constants';
import { _HttpClient } from 'src/app/core/net/http.client';

@Injectable()
export class NoModelingService {
    constructor(private _http: _HttpClient) {}

    // GET /api/v{api-version}/
    // 获取模型详细首页子弹图数据
    getModelConclusionTypeState(params = {}): Observable<any> {
        let url = '';
        if (MockData) {
            url = 'assets/mockData/modeling-home-model.json';
        } else {
            url = 'abilitycustomfield/getModelConclusionTypeState';
        }
        return this._http.get(url, params);
    }
    // 更新子弹头页面中间按钮点击状态
    postModelConclusionState(params: any = {}): Observable<any> {
        let url = '';
        let method = 'post';
        if (MockData) {
            url = 'assets/mockData/modeling-home-model.json';
            method = 'get';
        } else {
            url = `abilitymodel/SetModelConclusionState?ModelId=${params.ModelId}`;
        }
        return this._http[method](url, params);
    }
}
