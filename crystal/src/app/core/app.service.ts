import _ from 'lodash';
import 'reflect-metadata';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { _HttpClient } from './net/http.client';
import { AuthService } from '@app/core/auth.service';
import { menuEnum, pageEnum } from '../modules/module-config';
import { queryToObject } from '@utils/common.utils';

/**
 * 依赖于素质字典的模块名
 */
const dependsOnQD = ['agile-modeling', 'oc'];

@Injectable()
export class AppService {
    _cmpid = '';
    _from = 'portal'; //默认猎头门户
    _cmpidVerify = false;
    _params = {};
    _userId = 0;
    _channelId = '';
    _userInfo: any;

    pageInfo: ModulePermissionData;
    authModule: ModulePermissionData[];

    constructor(private authService: AuthService, private _http: _HttpClient) {}

    public getServerUrl() {
        // return this.configService.get('SERVER_URL');
        return '';
    }

    public downloadTemplate() {
        let url = this.getServerUrl() + 'doc/人才盘点数据源导入模板20200603.xlsx';
        url = url.replace('/api/v1', '');

        window.open(url);
    }

    //导出模板
    public exportTemplate(param?: string) {
        let url = this.getServerUrl() + param;
        url = url.replace('/api/v1', '');

        window.open(url);
    }

    public getFile(exportInterface: string, param?: string) {
        let token = this.authService.getToken();
        token = token.replace('Bearer ', '');
        let url = this.getServerUrl() + 'api/' + exportInterface;
        url = url + '?access_token=' + token + '&' + param;
        url = url.replace('/api/v1', '');
        window.open(url);
    }
    public getFileTxtDoc(exportInterface: string, param?: string) {
        let token = this.authService.getToken();
        token = token.replace('Bearer ', '');
        let url = this.getServerUrl() + exportInterface;
        url = url + '?access_token=' + token + '&' + param;
        // url = url.replace('/api/v1', '');
        window.open(url);
    }

    public exportPdf(exportInterface: string, param?: string) {
        let token = this.authService.getToken();
        const userInfo = this.getUserInfo();
        token = token.replace('Bearer ', '');
        let url = this.getServerUrl() + exportInterface;
        url = url + '?access_token=' + token + '&' + param + '&customerid=' + userInfo['customerid'];
        url = url.replace('/api/v1', '');
        window.open(url);
    }

    public getUserInfo(): Object {
        if (localStorage.getItem('userInfo')) {
            try {
                this._userInfo = JSON.parse(localStorage.getItem('userInfo'));
                return this._userInfo;
            } catch (e) {
                return { username: '' };
            }
        }
        return { username: '' };
    }

    public setUserInfo(value) {
        this._userInfo = value;
        localStorage.setItem('userInfo', JSON.stringify(value));
    }

    public updateUserAvatar(avatar) {
        this._userInfo['headimg'] = avatar;
        localStorage.setItem('userInfo', JSON.stringify(this._userInfo));
    }

    get userId() {
        if (this._userId > 0)
            //从招聘那边过来的
            return this._userId;
        const userInfo = this.getUserInfo();
        if (userInfo['userid']) {
            return userInfo['userid'];
        }
        return null;
    }

    set userId(val) {
        this._userId = val;
    }

    get channelId() {
        if (this._channelId != '')
            //从招聘那边过来的
            return this._channelId;
        const userInfo = this.getUserInfo();
        if (userInfo['channelid']) {
            return userInfo['channelid'];
        }
        return null;
    }

    set channelId(val) {
        this._channelId = val;
    }

    get cmpidVerify() {
        return this._cmpidVerify;
    }

    set cmpidVerify(value) {
        this._cmpidVerify = value;
    }

    get cmpid() {
        return this._cmpid;
    }

    set cmpid(value) {
        this._cmpid = value;
    }

    get from() {
        return this._from;
    }

    storeCmpIdByUrl(url) {
        const arr = url.split('/');
        if (arr.length > 1) {
            const cmpid = arr[1];
            if (cmpid != this._cmpid) {
                this._cmpid = cmpid;
            }
            return cmpid;
        }
        return null;
    }

    storeParamsByUrl(url: string) {
        const obj = queryToObject(url);
        this._params = obj;
        if (obj['userid']) {
            this.userId = obj['userid'];
        }
        if (obj['customerid']) {
            this.cmpid = obj['customerid'];
            this._from = 'zhaopin';
        }

        if (obj['channelid']) {
            this.channelId = obj['channelid'];
        }

        return obj;
    }

    isFromPortal() {
        return this._from == 'portal';
    }

    isFromZhaopin() {
        return this._from == 'zhaopin';
    }

    getParams() {
        return this._params;
    }

    get sequencetype() {
        if (this.isFromZhaopin()) {
            return 'RecruitmentChannel';
        }

        return 'CandidateChannel';
    }

    getUserManual(param): Observable<any> {
        let token = this.authService.getToken();
        token = token.replace('Bearer ', '');
        let url = '/api/v1' + this.getServerUrl() + 'AccessmentCenter/GetUserManual';
        url = url + '?access_token=' + token + '&ModuleId=' + param;
        url = url.replace('/api/v1', '');
        return this._http.get(url, param);
    }

    getFirstRoute() {
        const userInfo = this.getUserInfo();

        const firstModuleId = _.map(JSON.parse(userInfo['authmodule']), 'moduleid')[0];
        return Object.keys(menuEnum).find((menu) => menuEnum[menu] === firstModuleId) || '';
    }

    getCurrentPage(pageName: string) {
        const authModule: ModulePermissionData[] = JSON.parse(this.getUserInfo()['authmodule']) || [];
        this.pageInfo = authModule.find(({ moduleid }) => moduleid === menuEnum[pageName]);

        const moduleId = this.pageInfo.moduleid;
        const menu = Object.entries(menuEnum).find((item) => item[1] === moduleId);
        this.pageInfo.path = menu && menu[0];

        const qdModuleId = menuEnum['quality-dictionary'];
        const dependsOnQDIds = dependsOnQD.map((name) => menuEnum[name]);
        if (dependsOnQDIds.includes(moduleId) && this.authService.isAuthNode(qdModuleId)) {
            const qdModule = authModule.find(({ moduleid }) => moduleid === qdModuleId);
            this.pageInfo.children = this.pageInfo.children.concat(qdModule.children);
        }

        const pages = Object.entries(pageEnum);
        this.pageInfo.children.forEach((child) => {
            const page = pages.find((item) => {
                return item[1] === child.pageid;
            });
            child.path = page && page[0];
        });
    }
}

interface ModulePermissionData {
    path?: string;
    moduleid: number;
    modulename: string;
    children: PagePermissionData[];
}

interface PagePermissionData {
    path?: string;
    state: boolean;
    pageid: number;
    pagename: string;
    permissionid: string;
}
