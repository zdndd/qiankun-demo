import { enableProdMode, NgZone } from '@angular/core';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { Router } from '@angular/router';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import singleSpaAngular, { getSingleSpaExtraProviders } from 'single-spa-angular';
import { singleSpaPropsSubject } from './single-spa/single-spa-props';

export function preloaderFinished() {
    const body = document.querySelector('body');
    const preloader = document.querySelector('.preloader');
    body.style.overflow = 'hidden';

    function remove() {
        preloader.addEventListener('transitionend', function () {
            preloader.className = 'preloader-hidden';
        });
        preloader.className += ' preloader-hidden-add preloader-hidden-add-active';
    }
    setTimeout(() => {
        remove();
        body.style.overflow = '';
    }, 100);
}

preloaderFinished();

if (environment.production) {
    enableProdMode();
}

if (!(window as any).__POWERED_BY_QIANKUN__) {
    platformBrowserDynamic()
        .bootstrapModule(AppModule)
        .catch((err) => console.error(err));
}

const { bootstrap, mount, unmount } = singleSpaAngular({
    bootstrapFunction: (singleSpaProps) => {
        singleSpaPropsSubject.next(singleSpaProps);
        return platformBrowserDynamic(getSingleSpaExtraProviders()).bootstrapModule(AppModule);
    },
    template: '<app-root />',
    Router,
    NgZone,
});

export { bootstrap, mount, unmount };
