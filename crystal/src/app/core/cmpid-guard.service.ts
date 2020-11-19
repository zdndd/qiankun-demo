
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs'
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { NzNotificationService, NzMessageService } from 'ng-zorro-antd';
import { AuthService } from "./auth.service"
import { AppService } from "./app.service"
import { HttpClient } from '@angular/common/http';
import { forkJoin, of,merge,zip,concat } from 'rxjs';

@Injectable()
export class CmpIdGuardService implements CanActivate {

    constructor(private httpClient: HttpClient, private router: Router, public appService: AppService, private messageService: NzMessageService, private authService: AuthService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
       
        let url: string = state.url;
        let oldCpmId = this.appService.cmpid
        let cmpid = this.appService.storeCmpIdByUrl(url);
        // console.log("cmpid "+cmpid+" check")
        let customerIdCheck$ = Observable.create((observer)=>{
            this.httpClient.get("customer/check?customerid=" + cmpid).subscribe((res: any) => {
                this.appService.cmpidVerify = true;
                observer.next();
                observer.complete()
            }, (err) => {
                this.appService.cmpidVerify = false;
                console.error(err)
                observer.next();
                observer.complete()
            })
        })
       

        let authCheck$ = Observable.create((observer) => {
            if (!this.appService.cmpidVerify) {
                window.location.href = "https://www.vxhcm.com/index.html";
                // this.router.navigate(['/landingpage']);
                observer.next(false);
                observer.complete()
                return;
            }
            observer.next(true);
            observer.complete()
           
        })

        if (oldCpmId != cmpid) {
            return Observable.create((observer) => {
                concat(customerIdCheck$,authCheck$).subscribe((res)=>{
                    if(typeof(res)=="boolean"){
                        observer.next(res);
                        observer.complete()
                    }
                   
                })
            })
        }
        return authCheck$;

    }

}
