import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AppService } from '@app/core/app.service';

import _ from 'lodash';

@Injectable({
    providedIn: 'root',
})
export class PageGuard implements CanActivate {
    constructor(private appService: AppService, private router: Router) {}
    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot,
    ): Observable<boolean> | Promise<boolean> | boolean {
        return new Observable((observer) => {
            const url: string = state.url;
            const cmpid = this.appService.storeCmpIdByUrl(url);
            const children: any[] = this.appService.pageInfo.children;
            const currentPageInfo = _.find(children, { pageid: next.data.pageid });
            if (currentPageInfo.state) {
                observer.next(true);
                observer.complete();
            } else {
                const childFirst = _.find(children, 'state');
                if (childFirst) {
                    if (next.parent.params.projectid) {
                        //人才盘点中的拦截
                        this.router.navigateByUrl(
                            '/' + cmpid + '/' + next.parent.params.projectid + '/' + childFirst.path,
                        );
                    } else {
                        this.router.navigateByUrl('/' + cmpid + '/' + childFirst.path);
                    }
                }
            }
        });
    }
}
