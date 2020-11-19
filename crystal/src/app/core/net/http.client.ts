import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
// tslint:disable-next-line:class-name
export class _HttpClient {
  constructor(private http: HttpClient) {
    
  }

  private _loading = false;

  /** 是否正在加载中 */
  get loading(): boolean {
    return this._loading;
  }

  parseParams(params: any): HttpParams {
    const newParams = {};
    Object.keys(params).forEach(key => {
      let _data = params[key];
      // 忽略空值
    //   if (this.cog.nullValueHandling === 'ignore' && _data == null) return;
      // 将时间转化为：时间戳 (秒)
    //   if (this.cog.dateValueHandling === 'timestamp' && _data instanceof Date) {
    //     _data = _data.valueOf();
    //   }
      newParams[key] = _data;
    });
    return new HttpParams({ fromObject: newParams });
  }

  formEncode(obj) {
    var encodedString = '';
    for (var key in obj) {
        if (encodedString.length !== 0) {
              encodedString += '&';
        }
        encodedString += key + '=' + encodeURIComponent(obj[key]);
      
    }
    return encodedString
}

  appliedUrl(url: string, params?: any) {
    if (!params) return url;
    url += ~url.indexOf('?') ? '' : '?';
    const arr: string[] = [];
    // tslint:disable-next-line:forin
    for (const key in params) {
      arr.push(`${key}=${params[key]}`);
    }
    return url + arr.join('&');
  }

  begin() {
    // console.time('http');
    setTimeout(() => (this._loading = true));
  }

  end() {
    // console.timeEnd('http');
    setTimeout(() => (this._loading = false));
  }

  // #region get

  /**
   * GET：返回一个 `T` 类型
   */
  get<T>(
    url: string,
    params?: any,
    options?: {
      headers?: HttpHeaders | { [header: string]: string | string[] };
      observe?: 'body';
      reportProgress?: boolean;
      responseType: 'json';
      withCredentials?: boolean;
    },
  ): Observable<T>;

  /**
   * GET：返回一个 `string` 类型
   */
  get(
    url: string,
    params: any,
    options: {
      headers?: HttpHeaders | { [header: string]: string | string[] };
      observe?: 'body';
      reportProgress?: boolean;
      responseType: 'text';
      withCredentials?: boolean;
    },
  ): Observable<string>;

  /**
   * GET：返回一个 `JSON` 类型
   */
  get(
    url: string,
    params: any,
    options: {
      headers?: HttpHeaders | { [header: string]: string | string[] };
      observe: 'response';
      reportProgress?: boolean;
      responseType?: 'json';
      withCredentials?: boolean;
    },
  ): Observable<HttpResponse<Object>>;

  /**
   * GET：返回一个 `JSON` 类型
   */
  get<T>(
    url: string,
    params: any,
    options: {
      headers?: HttpHeaders | { [header: string]: string | string[] };
      observe: 'response';
      reportProgress?: boolean;
      responseType?: 'json';
      withCredentials?: boolean;
    },
  ): Observable<HttpResponse<T>>;

  /**
   * GET：返回一个 `any` 类型
   */
  get(
    url: string,
    params?: any,
    options?: {
      headers?: HttpHeaders | { [header: string]: string | string[] };
      observe?: 'body' | 'events' | 'response';
      reportProgress?: boolean;
      responseType?: 'arraybuffer' | 'blob' | 'json' | 'text';
      withCredentials?: boolean;
    },
  ): Observable<any>;

  /**
   * GET 请求
   */
  get(
    url: string,
    params: any,
    options: {
      headers?: HttpHeaders | { [header: string]: string | string[] };
      observe?: 'body' | 'events' | 'response';
      reportProgress?: boolean;
      responseType?: 'arraybuffer' | 'blob' | 'json' | 'text';
      withCredentials?: boolean;
    },
  ): Observable<any> {
    return this.request(
      'GET',
      url,
      Object.assign(
        {
          params,
        },
        options,
      ),
    );
  }

  // #endregion

  // #region post

  /**
   * POST：返回一个 `string` 类型
   */
  post(
    url: string,
    body: any,
    params: any,
    options: {
      headers?: HttpHeaders | { [header: string]: string | string[] };
      observe?: 'body';
      reportProgress?: boolean;
      responseType: 'text';
      withCredentials?: boolean;
    },
  ): Observable<string>;

  /**
   * POST：返回一个 `HttpResponse<JSON>` 类型
   */
  post(
    url: string,
    body: any,
    params: any,
    options: {
      headers?: HttpHeaders | { [header: string]: string | string[] };
      observe: 'response';
      reportProgress?: boolean;
      responseType?: 'json';
      withCredentials?: boolean;
    },
  ): Observable<HttpResponse<Object>>;

  /**
   * POST：返回一个 `JSON` 类型
   */
  post<T>(
    url: string,
    body?: any,
    params?: any,
    options?: {
      headers?: HttpHeaders | { [header: string]: string | string[] };
      observe: 'response';
      reportProgress?: boolean;
      responseType?: 'json';
      withCredentials?: boolean;
    },
  ): Observable<T>;

  /**
   * POST：返回一个 `any` 类型
   */
  post(
    url: string,
    body?: any,
    params?: any,
    options?: {
      headers?: HttpHeaders | { [header: string]: string | string[] };
      observe?: 'body' | 'events' | 'response';
      reportProgress?: boolean;
      responseType?: 'arraybuffer' | 'blob' | 'json' | 'text';
      withCredentials?: boolean;
    },
  ): Observable<any>;

  /**
   * POST 请求
   */
  post(
    url: string,
    body: any,
    params: any,
    options: {
      headers?: HttpHeaders | { [header: string]: string | string[] };
      observe?: 'body' | 'events' | 'response';
      reportProgress?: boolean;
      responseType?: 'arraybuffer' | 'blob' | 'json' | 'text';
      withCredentials?: boolean;
    },
  ): Observable<any> {
    return this.request(
      'POST',
      url,
      Object.assign(
        {
          body,
          params,
        },
        options,
      ),
    );
  }

  // #endregion

  // #region delete

  /**
   * DELETE：返回一个 `string` 类型
   */
  delete(
    url: string,
    params: any,
    options: {
      headers?: HttpHeaders | { [header: string]: string | string[] };
      observe?: 'body';
      reportProgress?: boolean;
      responseType: 'text';
      withCredentials?: boolean;
    },
  ): Observable<string>;

  /**
   * DELETE：返回一个 `JSON` 类型
   */
  delete(
    url: string,
    params: any,
    options: {
      headers?: HttpHeaders | { [header: string]: string | string[] };
      observe: 'response';
      reportProgress?: boolean;
      responseType?: 'json';
      withCredentials?: boolean;
    },
  ): Observable<HttpResponse<Object>>;

  /**
   * DELETE：返回一个 `any` 类型
   */
  delete(
    url: string,
    params?: any,
    options?: {
      headers?: HttpHeaders | { [header: string]: string | string[] };
      observe?: 'body' | 'events' | 'response';
      reportProgress?: boolean;
      responseType?: 'arraybuffer' | 'blob' | 'json' | 'text';
      withCredentials?: boolean;
    },
  ): Observable<any>;

  /**
   * DELETE 请求
   */
  delete(
    url: string,
    params: any,
    options: {
      headers?: HttpHeaders | { [header: string]: string | string[] };
      observe?: 'body' | 'events' | 'response';
      reportProgress?: boolean;
      responseType?: 'arraybuffer' | 'blob' | 'json' | 'text';
      withCredentials?: boolean;
    },
  ): Observable<any> {
    return this.request(
      'DELETE',
      url,
      Object.assign(
        {
          params,
        },
        options,
      ),
    );
  }

  // #endregion

  /**
   * `jsonp` 请求
   *
   * @param url URL地址
   * @param params 请求参数
   * @param callbackParam CALLBACK值，默认：JSONP_CALLBACK
   */
  jsonp(
    url: string,
    params?: any,
    callbackParam: string = 'JSONP_CALLBACK',
  ): Observable<any> {
    return this.http.jsonp(this.appliedUrl(url, params), callbackParam).pipe(
      tap(() => {
        this.end();
      }),
      catchError(res => {
        this.end();
        return throwError(res);
      }),
    );
  }

  // #region patch

  /**
   * PATCH：返回一个 `string` 类型
   */
  patch(
    url: string,
    body: any,
    params: any,
    options: {
      headers?: HttpHeaders | { [header: string]: string | string[] };
      observe?: 'body';
      reportProgress?: boolean;
      responseType: 'text';
      withCredentials?: boolean;
    },
  ): Observable<string>;

  /**
   * PATCH：返回一个 `HttpResponse<JSON>` 类型
   */
  patch(
    url: string,
    body: any,
    params: any,
    options: {
      headers?: HttpHeaders | { [header: string]: string | string[] };
      observe: 'response';
      reportProgress?: boolean;
      responseType?: 'json';
      withCredentials?: boolean;
    },
  ): Observable<HttpResponse<Object>>;

  /**
   * PATCH：返回一个 `JSON` 类型
   */
  patch<T>(
    url: string,
    body?: any,
    params?: any,
    options?: {
      headers?: HttpHeaders | { [header: string]: string | string[] };
      observe: 'response';
      reportProgress?: boolean;
      responseType?: 'json';
      withCredentials?: boolean;
    },
  ): Observable<T>;

  /**
   * PATCH：返回一个 `any` 类型
   */
  patch(
    url: string,
    body?: any,
    params?: any,
    options?: {
      headers?: HttpHeaders | { [header: string]: string | string[] };
      observe?: 'body' | 'events' | 'response';
      reportProgress?: boolean;
      responseType?: 'arraybuffer' | 'blob' | 'json' | 'text';
      withCredentials?: boolean;
    },
  ): Observable<any>;

  /**
   * PATCH 请求
   */
  patch(
    url: string,
    body: any,
    params: any,
    options: {
      headers?: HttpHeaders | { [header: string]: string | string[] };
      observe?: 'body' | 'events' | 'response';
      reportProgress?: boolean;
      responseType?: 'arraybuffer' | 'blob' | 'json' | 'text';
      withCredentials?: boolean;
    },
  ): Observable<any> {
    return this.request(
      'PATCH',
      url,
      Object.assign(
        {
          body,
          params,
        },
        options,
      ),
    );
  }

  // #endregion

  // #region put

  /**
   * PUT：返回一个 `string` 类型
   */
  put(
    url: string,
    body: any,
    params: any,
    options: {
      headers?: HttpHeaders | { [header: string]: string | string[] };
      observe?: 'body';
      reportProgress?: boolean;
      responseType: 'text';
      withCredentials?: boolean;
    },
  ): Observable<string>;

  /**
   * PUT：返回一个 `HttpResponse<JSON>` 类型
   */
  put(
    url: string,
    body: any,
    params: any,
    options: {
      headers?: HttpHeaders | { [header: string]: string | string[] };
      observe: 'response';
      reportProgress?: boolean;
      responseType?: 'json';
      withCredentials?: boolean;
    },
  ): Observable<HttpResponse<Object>>;

  /**
   * PUT：返回一个 `JSON` 类型
   */
  put<T>(
    url: string,
    body?: any,
    params?: any,
    options?: {
      headers?: HttpHeaders | { [header: string]: string | string[] };
      observe: 'response';
      reportProgress?: boolean;
      responseType?: 'json';
      withCredentials?: boolean;
    },
  ): Observable<T>;

  /**
   * PUT：返回一个 `any` 类型
   */
  put(
    url: string,
    body?: any,
    params?: any,
    options?: {
      headers?: HttpHeaders | { [header: string]: string | string[] };
      observe?: 'body' | 'events' | 'response';
      reportProgress?: boolean;
      responseType?: 'arraybuffer' | 'blob' | 'json' | 'text';
      withCredentials?: boolean;
    },
  ): Observable<any>;

  /**
   * PUT 请求
   */
  put(
    url: string,
    body: any,
    params: any,
    options: {
      headers?: HttpHeaders | { [header: string]: string | string[] };
      observe?: 'body' | 'events' | 'response';
      reportProgress?: boolean;
      responseType?: 'arraybuffer' | 'blob' | 'json' | 'text';
      withCredentials?: boolean;
    },
  ): Observable<any> {
    return this.request(
      'PUT',
      url,
      Object.assign(
        {
          body,
          params,
        },
        options,
      ),
    );
  }

  // #endregion

  /**
   * `request` 请求
   *
   * @param method 请求方法类型
   * @param url URL地址
   * @param options 参数
   */
  request<R>(
    method: string,
    url: string,
    options?: {
      body?: any;
      headers?:
        | HttpHeaders
        | {
            [header: string]: string | string[];
          };
      observe?: 'body' | 'events' | 'response';
      params?:
        | HttpParams
        | {
            [param: string]: string | string[];
          };
      responseType?: 'arraybuffer' | 'blob' | 'json' | 'text';
      reportProgress?: boolean;
      withCredentials?: boolean;
    },
  ): Observable<R>;
  /**
   * `request` 请求
   *
   * @param method 请求方法类型
   * @param url URL地址
   * @param options 参数
   */
  request(
    method: string,
    url: string,
    options?: {
      body?: any;
      headers?:
        | HttpHeaders
        | {
            [header: string]: string | string[];
          };
      observe?: 'body' | 'events' | 'response';
      params?:
        | HttpParams
        | {
            [param: string]: string | string[];
          };
      responseType?: 'arraybuffer' | 'blob' | 'json' | 'text';
      reportProgress?: boolean;
      withCredentials?: boolean;
    },
  ): Observable<any> {
    this.begin();
    if (options) {
      if (options.params) options.params = this.parseParams(options.params);
      if(options.body){
        // options.body = this.formEncode(options.body)
      }

    }
    return this.http.request(method, url, options).pipe(
      tap(() => {
        this.end();
      }),
      catchError(res => {
        this.end();
        return throwError(res);
      }),
    );
  }
}
