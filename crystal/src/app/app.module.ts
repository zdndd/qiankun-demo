import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER, LOCALE_ID, Injectable, ErrorHandler, Injector } from '@angular/core';
import { LocationStrategy, HashLocationStrategy, PathLocationStrategy } from '@angular/common';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ConfigModule } from 'ngx-envconfig';
import { FormsModule } from '@angular/forms';

// i18n
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { HttpClient, HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgZorroAntdModule, NZ_I18N, zh_CN } from 'ng-zorro-antd';

import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';

// modules
import { AppRoutingModule } from './app-routing.module';
import { LayoutModule } from './layout/layout.module';
import { DefaultInterceptor } from './core/net/default.interceptor';
import { StartupService } from './core/startup/startup.service';
import { CoreModule } from './core/core.module';
import { RouteReuseStrategy } from '@angular/router';
import { assetUrl } from '../../src/single-spa/asset-url';
import { AppRoutingCache } from './core/app-routing.cache';
import { environment } from '../environments/environment';

const MOCK_MODULES = [];
// const MOCK_MODULES = [KNZMockModule.forRoot({ data: MOCKDATA })];

// 加载i18n语言文件
export function I18nHttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, assetUrl('/i18n/'), '.json');
}

export function StartupServiceFactory(startupService: StartupService): Function {
    return () => startupService.load();
}

registerLocaleData(zh);

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
    constructor(private injector: Injector) {}
    handleError(error) {
        throw error;
    }
}

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        // ConfigModule.forRoot(environment),
        FormsModule,
        LayoutModule,
        CoreModule,
        HttpClientModule,
        NgZorroAntdModule,
        // i18n
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: I18nHttpLoaderFactory,
                deps: [HttpClient],
            },
        }),
        ...MOCK_MODULES,
    ],
    providers: [
        { provide: ErrorHandler, useClass: GlobalErrorHandler },
        { provide: LOCALE_ID, useValue: 'zh-Hans' },
        { provide: NZ_I18N, useValue: zh_CN },
        { provide: RouteReuseStrategy, useClass: AppRoutingCache },
        { provide: HTTP_INTERCEPTORS, useClass: DefaultInterceptor, multi: true },
        StartupService,
        { provide: LocationStrategy, useClass: PathLocationStrategy },
        {
            provide: APP_INITIALIZER,
            useFactory: StartupServiceFactory,
            deps: [StartupService],
            multi: true,
        },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
