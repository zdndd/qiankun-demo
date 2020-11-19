import { enableProdMode, ViewEncapsulation } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

// declare var $;

export function preloaderFinished() {
    const body = document.querySelector('body');
    const preloader = document.querySelector('.preloader');
    body.style.overflow = 'hidden';

    function remove() {
        preloader.addEventListener('transitionend', function() {
            preloader.className = 'preloader-hidden';
        });
        preloader.className += ' preloader-hidden-add preloader-hidden-add-active';
    }

    (<any>window).appBootstrap = () => {
        setTimeout(() => {
            remove();
            body.style.overflow = '';
        }, 100);
    };
}

preloaderFinished();

if (environment['production']) {
    enableProdMode();
}

const bootstrap = () => {
    return platformBrowserDynamic().bootstrapModule(AppModule, {
        defaultEncapsulation: ViewEncapsulation.Emulated,
        preserveWhitespaces: false,
    });
};

// platformBrowserDynamic().bootstrapModule(AppModule)
//     .catch(err => console.log(err));

bootstrap().then(() => {
    if ((<any>window).appBootstrap) {
        (<any>window).appBootstrap();
    }
});
