import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '../../../core/net/http.client';
import { AuthService } from '../../../core/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AppService } from '../../../core/app.service';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';

@Component({
    selector: 'sso-login-page',
    template: '',
})
export class SSOLoginComponent implements OnInit {
    constructor(
        public messageService: NzMessageService,
        public modalService: NzModalService,
        public authService: AuthService,
        public appService: AppService,
        public router: Router,
        public activatedRoute: ActivatedRoute,
        public http: _HttpClient,
        private fb: FormBuilder,
    ) {}
    logining = false;
    loginForm: FormGroup;
    serverErrorMsg = '';
    ngOnInit() {
        console.log('222 ');
        this.logining = true;
        let ssotoken = this.activatedRoute.snapshot.params.ssotoken;
        console.log('ssotoken ' + ssotoken);
        if (!ssotoken) {
            this.messageService.error('ssotoken没有取到');
            return;
        }
        this.http.post('auth/loginByCode?ssotoken=' + ssotoken, {}).subscribe(
            (res: any) => {
                console.log('ssotoken ' + res);
                this.logining = false;
                localStorage.setItem('cacheUsername', res.userinfo.username);
                localStorage.setItem('cacheCustomerId', res.userinfo.customerid);
                this.authService.setToken(res.access_token);
                this.appService.setUserInfo(res.userinfo);

                if (res.userinfo.authmodule) {
                    console.log('sslogin');
                    this.authService.setAuthNode(res.userinfo.authmodule);
                    let currentModule = res.userinfo.authmodule.split(',')[0],
                        _route = '';
                    _route = this.authService.getCurrentRoute(res.userinfo.authmodule);
                    this.router.navigateByUrl('/' + _route);
                    // if (currentModule == 1004 && res.userinfo.isadmin == false) {
                    //     this.messageService.error('您尚未开通模块权限');
                    // } else {
                    //     this.router.navigateByUrl('/' + _route);
                    // }
                } else {
                    this.messageService.error('您尚未开通模块权限');
                }
            },
            error => {
                console.error(error);
                this.logining = false;
                setTimeout(() => {
                    this.router.navigate(['/auth/login']);
                }, 3000);
            },
        );
    }

    ngAfterViewInit() {}
}
