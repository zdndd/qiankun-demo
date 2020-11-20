import _ from 'lodash';

import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { _HttpClient } from '@app/core/net/http.client';
import { AuthService } from '@app/core/auth.service';
import { AppService } from '@app/core/app.service';
import { MockData } from '@app/constants/app.constants';

@Component({
    selector: 'app-login-page',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.less'],
})
export class LoginComponent implements OnInit, AfterViewInit {
    constructor(
        public messageService: NzMessageService,
        public modalService: NzModalService,
        public authService: AuthService,
        public appService: AppService,
        public router: Router,
        public http: _HttpClient,
        private fb: FormBuilder,
    ) {}
    logining = false;
    loginForm: FormGroup;
    serverErrorMsg = '';
    ngOnInit() {
        this.loginForm = this.fb.group({
            customerid: this.fb.control('', [Validators.required, Validators.maxLength(50)]),
            username: this.fb.control('', [Validators.required, Validators.maxLength(200)]),
            password: this.fb.control('', [Validators.required, Validators.maxLength(50)]),
        });

        setTimeout(() => {
            if (localStorage.getItem('cacheUsername'))
                this.loginForm.setValue({
                    customerid: localStorage.getItem('cacheCustomerId'),
                    username: localStorage.getItem('cacheUsername'),
                    password: '',
                });
        }, 0);

        this.loginForm.get('username').valueChanges.subscribe(() => {
            this.serverErrorMsg = '';
        });

        this.loginForm.get('password').valueChanges.subscribe(() => {
            this.serverErrorMsg = '';
        });
    }

    ngAfterViewInit() {
        this.modalService.closeAll();
    }

    loginHandler() {
        if (this.logining) return;

        for (const key in this.loginForm.controls) {
            if (this.loginForm.controls.hasOwnProperty(key)) {
                this.loginForm.controls[key].markAsTouched();
                this.loginForm.controls[key].updateValueAndValidity();
            }
        }

        if (this.loginForm.valid) {
            const { username, password, customerid } = this.loginForm.value;

            this.logining = true;
            const loginData = {
                username: username,
                password: btoa(password),
                customerid: customerid,
            };

            if (MockData) {
                setTimeout(() => {
                    localStorage.setItem('cacheUsername', username);
                    localStorage.setItem('hasCdPages', 'false');
                    this.authService.setToken('mockToken');
                    this.appService.setUserInfo({
                        username: 'admin',
                    });
                    this.router.navigateByUrl('/home');
                    this.logining = false;
                }, 1000);
            } else {
                this.http.post('auth/login', loginData).subscribe(
                    (res: any) => {
                        this.logining = false;
                        localStorage.setItem('cacheUsername', username);
                        localStorage.setItem('cacheCustomerId', customerid);
                        localStorage.setItem('hasCdPages', 'false');
                        this.authService.setToken(res.access_token);
                        this.appService.setUserInfo(res.userinfo);
                        const authmodule = res.userinfo.authmodule;

                        if (authmodule) {
                            this.authService.setAuthNode(authmodule);
                            const route = this.authService.getCurrentRoute(authmodule);
                            this.router.navigateByUrl(`/${route}`);
                        } else {
                            this.messageService.error('您尚未开通模块权限');
                        }
                    },
                    (error) => {
                        console.error(error);
                        this.logining = false;
                    },
                );
            }
        }
    }
}
