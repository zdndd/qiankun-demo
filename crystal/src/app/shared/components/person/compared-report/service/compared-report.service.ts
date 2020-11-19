import { Injectable } from '@angular/core';
import { MockData } from '@app/constants/app.constants';
import { _HttpClient } from '@app/core/net/http.client';
import { Observable, of } from 'rxjs';
import { AppService } from '@app/core/app.service';

@Injectable()
export class ComparedReportService {
    constructor(private _http: _HttpClient, public appService: AppService) {}

    //获取个人信息
    // getPersonInfomation(params = {}): Observable<any> {
    //     let url = '';
    //     // if (MockData) {
    //     url = 'assets/mockData/assessment/compared-report-info.json';
    //     // } else {
    //         //
    //         // }
    //         return this._http.get(url, params);
    // }
    // 获取个人报告对比-员工信息
    getEmpInfoList(params = {}): Observable<any> {
        let url = '';
        if (MockData) {
            url = 'assets/mockData/assessment/compared-report-info.json';
        } else {
            url = 'AccessmentCenter/GetEmpInfoList';
        }
        return this._http.get(url, params);
    }
    // 获取个人报告对比-员工工作经验
    getWorkExperienceList(params = {}): Observable<any> {
        let url = '';
        if (MockData) {
            return of({});
        } else {
            url = 'AccessmentCenter/GetWorkExperienceList';
        }
        return this._http.get(url, params);
    }
    // 获取个人报告对比-四力对比
    getLastPlanDimensionList(params = {}): Observable<any> {
        let url = '';
        if (MockData) {
            url = 'assets/mockData/assessment/person-data.json';
        } else {
            url = 'AccessmentCenter/GetLastPlanDimensionList';
        }
        return this._http.get(url, params);
    }
    // 获取个人报告对比-绩效分析
    getPerformanceChartList(params = {}): Observable<any> {
        let url = '';
        if (MockData) {
            return of({});
        } else {
            url = 'AccessmentCenter/getPerformanceChartList';
        }
        return this._http.get(url, params);
    }
    // 获取个人报告对比-人才九宫格
    getPeopleScoreList(params = {}): Observable<any> {
        let url = '';
        if (MockData) {
            return of({});
        } else {
            url = 'AccessmentCenter/GetPeopleScoreList';
        }
        return this._http.get(url, params);
    }

    //获取项目对比员工列表
    getProjectCompareEmployeeList(params = {}): Observable<any> {
        let url = '';
        if (MockData) {
            return of({});
        } else {
            url = 'Succession/GetProjectCompareEmployeeList';
        }
        return this._http.get(url, params);
    }

    //提交多人对比排名结果
    submitProjectCompareEmployee(params = {}): Observable<any> {
        let url = '';
        if (MockData) {
            return of({});
        } else {
            url = 'Succession/SubmitCompareResult';
        }
        return this._http.post(url, params);
    }

    //根据员工工号+岗位获取员工基础信息(批量)
    getSuccessionEmpInfoList(params = {}): Observable<any> {
        let url = '';
        if (MockData) {
            return of({});
        } else {
            url = 'Succession/GetEmpInfoList';
        }
        return this._http.get(url, params);
    }
}
