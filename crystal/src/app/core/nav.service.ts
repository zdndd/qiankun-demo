import _ from 'lodash';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { AppService } from './app.service';
import { menuEnum } from '../modules/module-config';

@Injectable({
    providedIn: 'root',
})
export class NavService implements CanActivate {
    constructor(private router: Router, public appService: AppService, public authService: AuthService) {}
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
        return new Observable((observer) => {
            const url: string = state.url;
            const cmpid = this.appService.storeCmpIdByUrl(url);
            const userInfo = this.appService.getUserInfo();
            if (userInfo['authmodule']) {
                this.authService.setAuthNode(userInfo['authmodule']);

                if (cmpid === 'changelog') {
                    //更新日志不用走后续流程
                    observer.next(true);
                    observer.complete();
                } else if (!this.authService.isAuthNode(menuEnum[cmpid])) {
                    //错误-跳转到authModule中第一个
                    const URL = this.appService.getFirstRoute();
                    this.router.navigateByUrl('/' + URL);
                } else {
                    //正常流程

                    this.appService.getCurrentPage(cmpid);
                    observer.next(true);
                    observer.complete();
                }
            } else {
                this.router.navigateByUrl('/auth/login');
            }
        });
    }
}
