import _ from 'lodash';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { menuEnum } from '../modules/module-config';

Injectable();
export class AuthService {
    // userInfo;
    authNodes: any = {};
    constructor() {}

    public getToken() {
        const token = localStorage.getItem('token');
        return token != null && token.startsWith('Bearer ') ? token : '';
    }

    getTokenAsync(): Observable<any> {
        return of(this.getToken());
    }

    //登录
    public setToken(value: string) {
        localStorage.setItem('token', value);
    }

    //退出登录
    public clearToken() {
        this.authNodes = {};
        localStorage.removeItem('token');
        localStorage.removeItem('hasCdPages');
    }

    //权限判断
    public isAuthNode(nodeId: number) {
        return this.authNodes['node_' + nodeId];
    }

    //获取权限
    public setAuthNode(str: string) {
        const nodeIds: number[] = _.map(JSON.parse(str), 'moduleid');
        if (nodeIds.length < 1) return;

        this.authNodes = nodeIds
            .map((nodeId) => `node_${nodeId}`)
            .reduce((authNodes, nodeKey) => {
                return (authNodes[nodeKey] = true), authNodes;
            }, {});
    }

    public getAuthNode() {
        return this.authNodes;
    }

    //1.登录时跳转到第一个路由；2.url，redirectTo的时候跳转到第一个路由
    public getCurrentRoute(str: string) {
        const currentModule = _.map(JSON.parse(str), 'moduleid')[0];
        return Object.keys(menuEnum).find((menu) => menuEnum[menu] === currentModule) || '';
    }

    public isAuthenticated() {
        const token = this.getToken();
        return of(!!token);
    }
}
