import { Injectable, Injector, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpErrorResponse,
    HttpSentEvent,
    HttpHeaderResponse,
    HttpProgressEvent,
    HttpResponse,
    HttpUserEvent,
    HttpClient,
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { mergeMap, catchError } from 'rxjs/operators';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AuthService } from '../auth.service';
import { AppService } from '../app.service';
import { I18NService } from '../i18n/i18n.service';
import _ from 'lodash';

/**
 * 默认HTTP拦截器，其注册细节见 `app.module.ts`
 */
@Injectable()
export class DefaultInterceptor implements HttpInterceptor {
    constructor(
        public i18NService: I18NService,
        private appService: AppService,
        public modalService: NzModalService,
        private injector: Injector,
        private authService: AuthService,
        private activatedRoute: ActivatedRoute,
    ) {
        this.showMsg = _.debounce(this.showMsg.bind(this), 500);
    }

    get msg(): NzMessageService {
        return this.injector.get(NzMessageService);
    }

    private goTo(url: string) {
        setTimeout(() => this.injector.get(Router).navigateByUrl(url));
    }

    showMsg(text) {
        this.msg.error(text);
    }

    private handleData(event: HttpResponse<any> | HttpErrorResponse): Observable<any> {
        // 可能会因为 `throw` 导出无法执行 `_HttpClient` 的 `end()` 操作
        // this.injector.get(_HttpClient).end();
        // 业务处理：一些通用操作
        // console.log(event,'------------------------54------------------')

        switch (event.status) {
            case 200:
                // 业务层级错误处理，以下是假定restful有一套统一输出格式（指不管成功与否都有相应的数据格式）情况下进行处理
                // 例如响应内容：
                //  错误内容：{ status: 1, msg: '非法参数' }
                //  正确内容：{ status: 0, response: {  } }
                // 则以下代码片断可直接适用
                if (event instanceof HttpResponse) {
                    const body: any = event.body;
                    if (body && body.errorcode && body.errorcode !== 0) {
                        if (body.message) this.msg.error(body.message);
                        // 继续抛出错误中断后续所有 Pipe、subscribe 操作，因此：
                        // this.http.get('/').subscribe() 并不会触发\
                        return throwError(new HttpResponse(Object.assign(event, { body: { error: body.message } })));
                    } else {
                        // 重新修改 `body` 内容为 `response` 内容，对于绝大多数场景已经无须再关心业务状态码
                        //return of(new HttpResponse(Object.assign(event, { body: body.response })));
                        // 或者依然保持完整的格式
                        if (body.error) {
                            return throwError({ error: body.error });
                        }
                        // body.data.errorCode = body.errorCode;
                        // body.data.errorMsg = body.errorMsg;
                        //业务消息体
                        if (body.data && body.errorcode == 0)
                            return of(new HttpResponse(Object.assign(event, { body: body.data })));
                        return of(event);
                    }
                }
                break;
            case 401: // 未登录状态码
                this.modalService.closeAll();
                let currentURL = this.activatedRoute.snapshot['_routerState'].url;
                // console.log(401, 'currentURL', currentURL, currentURL.indexOf('super-cms'));
                if (currentURL.indexOf('super-cms') > -1) {
                    this.goTo('/super-cms/login');
                } else {
                    this.goTo('/auth/login');
                }
                break;
            case 403:
            case 404:
            case 500:
            case 503:
                //this.goTo(`/${event.status}`);
                console.error(event);
                // this.msg.error(String((<any>event).message));
                this.showMsg('系统异常');
                return throwError(event);
            default:
                if (event instanceof HttpErrorResponse) {
                    console.warn('未可知错误，大部分是由于后端不支持CORS或无效配置引起', event);
                    this.showMsg('系统异常');
                    return throwError(event);
                }
                break;
        }
        return of(event);
    }

    intercept(
        req: HttpRequest<any>,
        next: HttpHandler,
    ): Observable<HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any>> {
        // 统一加上服务端前缀
        let url = req.url;
        if (!url.startsWith('https://') && !url.startsWith('http://') && url.indexOf('assets') < 0) {
            url = this.appService.getServerUrl() + url;
        }
        if (url.indexOf('.json') >= 0) {
            //本地json文件去缓存
            url = url + '?t=' + Math.random();
        }

        // console.log("request url",url)
        const headers = {};
        // headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
        // headers['Content-Type'] = 'application/json;charset=UTF-8';

        if (this.authService.getToken()) headers['Authorization'] = this.authService.getToken();

        headers['lang'] = this.i18NService.currentLang;
        headers['Cache-Control'] = 'no-cache';
        headers['Pragma'] = 'no-cache';

        const newReq = req.clone({
            url: url,
            setHeaders: headers,
        });
        return next.handle(newReq).pipe(
            mergeMap((event: any) => {
                // console.log(event)

                // 允许统一对请求错误处理，这是因为一个请求若是业务上错误的情况下其HTTP请求的状态是200的情况下需要
                if (event instanceof HttpResponse && event.status === 200) return this.handleData(event);
                // 若一切都正常，则后续操作
                return of(event);
            }),
            catchError((err: any) => {
                return this.handleData(err);
            }),
        );
    }
}
