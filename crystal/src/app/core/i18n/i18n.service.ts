import { Injectable, Inject, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';

import { TranslateService } from '@ngx-translate/core';

@Injectable({ providedIn: 'root' })
export class I18NService {
    private _default = '';
    private change$ = new BehaviorSubject<string>(null);

    private _langs = [{ code: 'en', text: 'English' }, { code: 'zh-CN', text: '中文' }];

    constructor(private translate: TranslateService, private injector: Injector) {
        const defaultLan = translate.getBrowserLang() || this.defaultLang;
        const lans = this._langs.map(item => item.code);
        //this._default = lans.includes(defaultLan) ? defaultLan : lans[0];
        translate.addLangs(lans);
    }

    get change(): Observable<string> {
        return this.change$.asObservable().pipe(filter(w => w != null));
    }

    use(lang: string, emit = true): void {
        lang = lang || this.translate.getDefaultLang();
        if (this.currentLang === lang) return;
        this.translate.use(lang).subscribe(() => {
            if (emit) this.change$.next(lang);
        });
        localStorage.setItem('currLang', lang);
        document.documentElement.lang = lang;
    }
    /** 获取语言列表 */
    getLangs() {
        return this._langs;
    }

    get zone() {
        return this.translate.currentLang.split('-')[0];
    }

    /** 默认语言 */
    get defaultLang() {
        return this._default;
    }
    /** 当前语言 */
    get currentLang() {
        return this.translate.currentLang || this.translate.getDefaultLang() || this._default;
    }
}
