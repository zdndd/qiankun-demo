import { Injectable, Injector, Inject } from '@angular/core';
import { Router, Route, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { zip } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LocationStrategy, HashLocationStrategy, PathLocationStrategy } from '@angular/common';
import { I18NService } from '../i18n/i18n.service';
import { AppService } from '../app.service';
import { _HttpClient } from '../net/http.client';
import { NzModalRef, NzModalService, NzMessageService } from 'ng-zorro-antd';

@Injectable()
export class StartupService {
    constructor(
        public appService: AppService,
        public i18NService: I18NService,
        private httpClient: HttpClient,
        private injector: Injector,
    ) {}

    load(): Promise<any> {
        return new Promise((resolve, reject) => {
            const location: LocationStrategy = this.injector.get(LocationStrategy);
            const router: ActivatedRoute = this.injector.get(ActivatedRoute);
            let queryParams = this.appService.storeParamsByUrl(location.path());
            var urlLang = queryParams['lang'];
            if (urlLang) {
                if (['zh-CN', 'en'].indexOf(urlLang) === -1) {
                    urlLang = 'zh-CN';
                }
            } else if (localStorage.getItem('currLang')) {
                urlLang = localStorage.getItem('currLang');
            } else {
                urlLang = 'zh-CN';
            }

            this.i18NService.use(urlLang, false);
            resolve(null);
        });
    }
}
