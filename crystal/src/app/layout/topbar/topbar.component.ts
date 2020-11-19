import _ from 'lodash';

import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { ModuleConfig, menuEnum } from '@modules/module-config';
import { VXDialogService } from '../../shared/vxui/service/dialog.service';
import { AuthService } from '../../core/auth.service';
import { AppService } from '../../core/app.service';
import { I18NService } from '../../core/i18n/i18n.service';
import { PasswordComponent } from '../../shared/vxui/dialog/password/password.component';
import { _HttpClient } from '../../core/net/http.client';
import { CroppieDialogComponent } from '../../shared/vxui/dialog/croppie/croppie.component';

const hasUserGuideModules = [
    {
        param: 1001,
        module: 'talent-inventory',
    },
    {
        param: 1002,
        module: 'agile-modeling',
    },
    {
        param: 1005,
        module: 'course-design',
    },
    {
        param: 1008,
        module: 'assessment-center',
    },
    {
        param: 1007,
        module: 'oc',
    },
    {
        param: 1013,
        module: 'succession',
    },
];

@Component({
    selector: 'topbar',
    templateUrl: './topbar.component.html',
    styleUrls: ['./topbar.component.less'],
})
export class TopbarComponent implements OnInit {
    moduleConfig: any;
    isCollapsed = true;
    userInfo: any = { username: '', usernamealias: '', isadmin: false, headimg: null };
    txtHome = '';
    username = '';
    txtJobList = '';
    txtCandidate = '';
    avatarUrl = 'assets/img/default-avatar@2x.png';
    isShowReview = false;
    cmsNodesIndex = -1;
    currentModule = '';
    isCms = false;

    constructor(
        public Module: ModuleConfig,
        public translateService: TranslateService,
        public http: _HttpClient,
        private messageService: NzMessageService,
        public appService: AppService,
        public router: Router,
        public i18NService: I18NService,
        public authService: AuthService,
        public dialogService: VXDialogService,
        public modalService: NzModalService,
    ) {
        this.moduleConfig = this.Module;
        this.userInfo = appService.getUserInfo();
        if (this.userInfo['headimg']) {
            this.avatarUrl = this.userInfo['headimg'];
        }
        this.txtHome = this.translateService.instant('Home');
        this.txtJobList = this.translateService.instant('Job List');
        this.txtCandidate = this.translateService.instant('List Of Candidates');

        //判断路由，显示pdf预览按钮
        this.router.events.subscribe((data) => {
            if (data instanceof NavigationEnd) {
                this.currentModule = this.getCurrentModule(data.url);
                if (hasUserGuideModules.some((m) => m.module === this.currentModule)) {
                    this.isShowReview = true;
                } else if (data.url.includes('cms')) {
                    this.isCms = true;
                } else {
                    this.isShowReview = false;
                }
            }
        });

        this.cmsNodesIndex = _.indexOf(Object.keys(this.authService.getAuthNode()), 'node_' + menuEnum.cms);
    }

    ngOnInit() {
        if (this.router.url.indexOf('cms') > -1) {
            this.isCms = true;
        }
        if (this.isCollapsed) {
            document.body.classList.add('collapsed');
        } else {
            document.body.classList.remove('collapsed');
        }
    }

    toggleCollapsed(): void {
        this.isCollapsed = !this.isCollapsed;
        if (this.isCollapsed) {
            document.body.classList.add('collapsed');
        } else {
            document.body.classList.remove('collapsed');
        }
    }

    logout() {
        /*
        this.http.post("login/logout",{}).subscribe(()=>{
            this.authService.clearToken();
            this.router.navigateByUrl(this.appService.cmpid+"/auth/login")
        })
        */
        this.authService.clearToken();
        this.router.navigateByUrl('/auth/login');
    }

    popupPassword() {
        const modal = this.modalService.create({
            nzTitle: this.translateService.instant('Password setting'),
            nzContent: PasswordComponent,
            nzBodyStyle: { padding: '0px' },
            nzComponentParams: {},
            nzFooter: null,
        });
    }

    changeLanguage(lang) {
        this.i18NService.use(lang, true);
        this.router.navigate(['/lang'], { queryParams: { page: this.router.url } });
    }

    saveUserAvatar(avatarUrl) {
        const updateData = {
            headimg: avatarUrl,
        };

        this.http.post('/users/modifhead', updateData).subscribe((res: any) => {
            if (res.errorcode === 0) {
                this.messageService.success(this.translateService.instant('Save Success'));
                this.avatarUrl = avatarUrl;
                this.appService.updateUserAvatar(avatarUrl);
            } else {
                this.messageService.error(res.message);
            }
        });
    }

    openPhotoCroppieDialog() {
        const modal = this.modalService.create({
            nzTitle: this.translateService.instant('Upload avatar'),
            nzContent: CroppieDialogComponent,
            nzBodyStyle: { padding: '0px' },
            nzComponentParams: {},
            nzFooter: [
                {
                    label: this.translateService.instant('Choose Img'),
                    type: 'primary',
                    onClick: (componentInstance) =>
                        new Promise((resolve) => {
                            componentInstance.selectedFile();
                            resolve(true);
                        }),
                },
                {
                    label: this.translateService.instant('Save'),
                    type: 'primary',
                    onClick: (componentInstance) =>
                        new Promise((resolve) => {
                            if (componentInstance.valid()) {
                                componentInstance.getData().then((res) => {
                                    resolve(true);
                                    this.saveUserAvatar(res);
                                    modal.destroy();
                                });
                            } else {
                                resolve(true);
                            }
                        }),
                },
                {
                    label: this.translateService.instant('Cancel'),
                    type: 'default',
                    onClick: () => {
                        modal.destroy();
                    },
                },
            ],
        });
    }

    reviewPdf() {
        const module = hasUserGuideModules.find((m) => {
            return m.module === this.currentModule;
        });
        this.appService.getUserManual(module.param).subscribe((res) => {
            window.open(`http://${res.downsrc}`);
        });
    }

    private getCurrentModule(url: string) {
        const matched = url.match(/^\/([^\/]+)/);
        return matched && matched[1];
    }
}
