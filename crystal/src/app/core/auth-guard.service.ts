import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { NzNotificationService, NzMessageService } from 'ng-zorro-antd';
import { AuthService } from './auth.service';
import { AppService } from './app.service';
import { HttpClient } from '@angular/common/http';
import { forkJoin, of, merge, zip, concat } from 'rxjs';

@Injectable()
export class AuthGuardService implements CanActivate {
    constructor(
        private httpClient: HttpClient,
        private router: Router,
        public appService: AppService,
        private messageService: NzMessageService,
        private authService: AuthService,
    ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
        let url: string = state.url;
        let oldCpmId = this.appService.cmpid;
        let cmpid = this.appService.storeCmpIdByUrl(url);
        let authCheck$ = Observable.create((observer) => {
            this.authService.isAuthenticated().subscribe((authRes) => {
                if (cmpid && cmpid.indexOf('ssotoken') > -1) {
                    let ssotoken = cmpid.split('=')[cmpid.split('=').length - 1];
                    let _url = '/auth/sso/' + ssotoken;
                    this.router.navigate([_url]);
                } else if (!authRes) {
                    this.router.navigate(['/auth/login']);
                } else {
                    let userInfo = this.appService.getUserInfo();
                    let authModule = userInfo['authmodule'];

                    try {
                        JSON.parse(authModule);
                    } catch (error) {
                        console.log(error);
                        this.router.navigate(['/auth/login']);
                    }
                }
                observer.next(authRes);
                observer.complete();
            });
        });

        if (oldCpmId != cmpid) {
            return Observable.create((observer) => {
                concat(authCheck$).subscribe((res) => {
                    if (typeof res == 'boolean') {
                        observer.next(res);
                        observer.complete();
                    }
                });
            });
        }
        return authCheck$;
    }
}
