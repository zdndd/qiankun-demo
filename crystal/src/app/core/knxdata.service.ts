import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { _HttpClient } from './net/http.client';
import { MockData } from '../constants/app.constants';
import { auditTime, delay, takeUntil } from 'rxjs/operators';
@Injectable()
export class KNXDataService {
    constructor(private _http: _HttpClient) {}
    cacheRowColumnData = {};

    //获取用户列表
    getUserList(params): Observable<any> {
        let url = '';
        if (MockData) {
            url = 'assets/mockData/user-list.json';
        } else {
            url = 'users/getUserList';
        }
        return this._http.get(url, params);
    }

    // 获取单条用户信息
    getUser({ id, ...params }): Observable<any> {
        let url = '';
        if (MockData) {
            url = 'assets/mockData/user.json';
        } else {
            //url = `getUser/${id}`;
            url = 'users/getbyuser?userid=' + id;
        }
        return this._http.get(url, params);
    }

    getProjectList(params): Observable<any> {
        let url = 'project/GetProjectList';
        return this._http.get(url, params);
    }

    loadTableColumnRowData(params) {
        let url = '';
        if (MockData) {
            url = 'assets/mockData/row-column-data.json';
        } else {
            url = 'fields/GetReportLeft';
        }
        this._http.get(url, params).subscribe(res => {
            this.cacheRowColumnData = res;
        });
    }

    // test_
    getTableColumnRowData(params): Observable<any> {
        // if (this.cacheRowColumnData) {
        //     return of(this.cacheRowColumnData);
        // }
        let url = '';
        if (MockData) {
            url = 'assets/mockData/row-column-data.json';
        } else {
            url = 'fields/GetReportLeft';
        }
        return this._http.get(url, params);
    }

    //获取报告列表(test_)
    getReportList(params): Observable<any> {
        let url = '';
        if (MockData) {
            url = 'assets/mockData/report-list.json';
        } else {
            // url = 'fields/GetChartList';
            url = 'fields/GetChatListByCategory';
        }
        return this._http.get(url, params);
    }

    //获取关键结论相关信息报告
    getConclusionChatListByCategory(params): Observable<any> {
        let url = '';
        url = 'fields/GetConclusionChatListByCategory';
        return this._http.get(url, params);
    }

    //获取报告列表(test_)
    getStandardReportList(params): Observable<any> {
        let url = '';
        if (MockData) {
            url = 'assets/mockData/report-list.json';
        } else {
            url = 'fields/GetStandardReport';
        }
        return this._http.get(url, params);
    }
    getProjectAddUser(params): Observable<any> {
        let url = '';
        if (MockData) {
            url = 'assets/mockData/project-users.json';
        } else {
            url = 'users';
        }
        return this._http.get(url, params);
    }

    getProjectDetailData(params): Observable<any> {
        let url = '';
        if (MockData) {
            url = 'assets/mockData/project-data.json';
        } else {
            url = 'fields/GetFieldsInfo';
        }
        return this._http.get(url, params);
    }

    // 拖拽人才盘点
    sortTalent(params): Observable<any> {
        let url = '';
        if (MockData) {
            return;
        } else {
            url = 'project/SetProjectSort';
        }
        return this._http.post(url, params);
    }

    // 刷新报告数据
    refreshChartData(params): Observable<any> {
        let url = '';
        if (MockData) {
            url = 'assets/mockData/project-data.json';
        } else {
            url = 'fields/RefreshChartData';
        }
        return this._http.get(url, params);
    }

    //获取报告列表(test_)
    getChartData(params): Observable<any> {
        let url = '';
        if (MockData) {
            switch (params.type) {
                case '0':
                    url = 'assets/mockData/chart-radar.json';
                    // url = 'fields/GetChartData';
                    break;
                case '4':
                    url = 'assets/mockData/chart-pie.json';
                    // url = 'fields/GetChartData';
                    break;
                case '3': //堆积占比（未测）
                    // url = 'fields/GetChartData';
                    url = 'assets/mockData/chart-stack.json';
                    break;
                case '1': //水平条形图
                    url = 'assets/mockData/chart-horizontal.json';
                    // url = 'fields/GetChartData';
                    break;
                case '5': //符合柱状图
                    url = 'assets/mockData/chart-composite-bar.json';
                    break;
                case '10': //洞察描述
                    url = 'assets/mockData/chart-describe.json';
                    break;
                case '8': //(p、value表格)
                    url = 'assets/mockData/chart-table.json';
                    break;
                case '6': //直方图
                    url = 'assets/mockData/chart-column-diagram.json';
                    break;
                case '2': //散点
                    url = 'assets/mockData/chart-scatter.json';
                    break;
                case '7': //柱状占比图
                    url = 'assets/mockData/chart-histogram.json';
                    break;
                case '12': //折线图
                    url = 'assets/mockData/chart-line.json';
                    break;
                default:
                    break;
            }
        } else {
            // url = 'getChartData';
            if (params.type === '10') {
                url = 'fields/GetDescription';
            } else if (params.type === '11') {
                // url = 'fields/GetPeopleMap';
                url = 'fields/GetPeopleMapByConclusion';
            } else {
                url = 'fields/GetChartData';
            }
        }
        const addParams = Object.assign(params, { time: Date.now() });
        return this._http.get(url, addParams);
    }

    // 添加解读
    updateReportRemark(params): Observable<any> {
        let url = '';
        url = 'fields/UpdateReportRemark';
        return this._http.post(url, params);
    }

    // 更改洞察描述
    updateDescription(params): Observable<any> {
        let url = '';
        url = 'fields/UpdateDescription';
        return this._http.post(url, params);
    }
    // -------------------------------------------
    // 获取结论
    getModelConclusion(params): Observable<any> {
        let url = '';
        if (MockData) {
            url = 'assets/mockData/common-conclusion.json';
        } else {
            url = 'abilitycustomfield/getModelConclusion';
        }
        return this._http.get(url, params);
    }
    // 更新結論描述
    UpdateDescription(params): Observable<any> {
        let url = '';
        if (MockData) {
            return;
        } else {
            url = 'abilitycustomfield/UpdateModelConclusionDescription';
            return this._http.post(url, params);
        }
    }
    // 结论-删除部分能力占比
    DeleteProportion(params): Observable<any> {
        let url = '';
        if (MockData) {
            return;
        } else {
            url = 'abilitycustomfield/DeleteModelConclusion';
            return this._http.get(url, params);
        }
    }

    // 模型結論-获取客户能力词典-带排序且有结论星星()
    GetAbilityListDicSortInfo(params): Observable<any> {
        let url = '';
        if (MockData) {
            url = 'assets/mockData/choose-ability-conclusion.json';
        } else {
            url = 'abilitycustomfield/GetCustomerAbilityDicSortInfo';
        }
        return this._http.get(url, params);
    }

    // 通用结论-选择能力(获取客户能力字典)
    GetAbilityList(params): Observable<any> {
        let url = '';
        if (MockData) {
            url = 'assets/mockData/choose-ability-conclusion.json';
        } else {
            url = 'abilitymodel/GetAbilityDicList';
        }
        return this._http.get(url, params);
    }

    // POST /api/v{api-version}/abilitycustomfield/InsertModelConclusion
    // 结论-新增/更新结论占比
    insertModelConclusion(params): Observable<any> {
        let url = '';
        if (MockData) {
            return;
        } else {
            url = 'abilitycustomfield/InsertModelConclusion';
            return this._http.post(url, params);
        }
    }
    getParetoData(params): Observable<any> {
        let url = '';
        if (MockData) {
            url = 'assets/mockData/chart-pareto.json';
        } else {
            url = 'abilitycustomfield/GetAbilityTaskAnalysisParetos';
        }
        return this._http.get(url, params);
    }
    getStatisticsData(params): Observable<any> {
        let url = '';
        if (MockData) {
            url = 'assets/mockData/chart-bar.json';
        } else {
            url = 'abilitymodel/GetSurveyChartsSource';
        }
        return this._http.get(url, params);
    }
    getMatrixData(params): Observable<any> {
        let url = '';
        if (MockData) {
            url = 'assets/mockData/chart-bar.json';
        } else {
            url = 'abilitymodel/GetSurveyScatterData';
        }
        return this._http.get(url, params);
    }

    getVXList(params): Observable<any> {
        let url = '';
        if (MockData) {
            url = 'assets/mockData/export-vx.json';
        } else {
            url = 'abilitycustomfield/GetEmpData';
        }
        // url = 'assets/mockData/export-vx.json';
        return this._http.get(url, params);
    }
    //POST /api/v{api-version}/abilitycustomfield/InsertFileData
    insertFileData(params): Observable<any> {
        let url = '';
        if (MockData) {
            url = 'assets/mockData/export-vx.json';
        } else {
            url = 'abilitycustomfield/InsertFileData';
        }
        return this._http.post(url, params);
    }
    // POST /api/v{api-version}/abilitycustomfield/InsertConfirmData
    insertFileConfirmData(params): Observable<any> {
        let url = '';
        if (MockData) {
            url = 'assets/mockData/export-vx.json';
        } else {
            url = 'abilitycustomfield/InsertConfirmData';
        }
        return this._http.post(url, params);
    }

    //更新散点图搜索条件
    addChartFilter(params): Observable<any> {
        let url = '';
        if (MockData) {
            return;
        } else {
            url = 'project/AddChartFilter';
        }
        return this._http.post(url, params);
    }

    // 拖拽图表数据
    setChartSort(params): Observable<any> {
        let url = '';
        if (MockData) {
            return;
        } else {
            url = 'fields/SetChartSort';
        }
        return this._http.post(url, params);
    }

    //获取角色列表
    getRoleList(): Observable<any> {
        let url = '';
        if (MockData) {
            url = '';
        } else {
            url = '/Role/getRoleList';
        }
        return this._http.get(url);
    }

    //获取当前客户的有效期
    getCurrentCustomerDate(): Observable<any> {
        let url = '';
        if (MockData) {
            url = '';
        } else {
            url = '/users/GetCurrentCustomer';
        }
        return this._http.get(url);
    }

    //盘点状态修改接口
    setProjectApprovedStatus(params): Observable<any> {
        let url = 'project/SetProjectApprovedStatus';
        return this._http.post(url, params);
    }

    //获取盘点项目查看用户列表
    getProjectViewUser(params): Observable<any> {
        let url = 'project/GetProjectViewUser';
        return this._http.get(url, params);
    }
    //发布盘点
    publishProject(params): Observable<any> {
        let url = 'project/PublishProject';
        return this._http.post(url, params);
    }
    //保存已发布盘点分享人
    editProjectView(params): Observable<any> {
        let url = 'project/EditProjectView';
        return this._http.post(url, params);
    }
    //修改已发布盘点分享人
    editProjectInfo(params): Observable<any> {
        let url = 'project/EditProjectInfo';
        return this._http.get(url, params);
    }
    //设置九宫格报告得展示和隐藏
    setChartIsShow(params): Observable<any> {
        let url = 'fields/SetChartIsShow';
        return this._http.post(url, params);
    }
    //散点图报告的校准
    alineChart(params): Observable<any> {
        let url = 'fields/AlineChart';
        return this._http.post(url, params);
    }

    //获取各视角权重占比
    getModelConclusionWeight(params): Observable<any> {
        let url = '';
        if (MockData) {
            url = '';
        } else {
            url = 'abilitycustomfield/GetModelConclusionWeight';
        }
        return this._http.get(url, params);
    }

    //设置最终结论页各视角权重占比
    setModelConclusionWeight(params): Observable<any> {
        let url = '';
        if (MockData) {
            url = '';
        } else {
            url = 'abilitycustomfield/SetModelConclusionWeight';
        }
        return this._http.post(url, params);
    }

    //九宫格的图表校准
    alineConditionConclusion(params): Observable<any> {
        let url = 'fields/AlineConditionConclusion';
        return this._http.post(url, params);
    }

    // 获取能力模型管理员列表
    getAbilityModel(params = {}): Observable<any> {
        let url = '';
        if (MockData) {
            url = 'assets/mockData/modeling-home-modelDetail.json';
        } else {
            url = 'abilitymodel/getAbilityModel';
        }
        return this._http.get(url, params);
    }

    getQualityDictionaryDataList(params = {}): Observable<any> {
        let url = '';
        if (MockData) {
            url = 'assets/mockData/oc/quality-dictionary-list.json';
        } else {
            url = 'postcompetency/GetQualityDictionaryList';
        }
        return this._http.get(url, params);
    }

    //获取素质字典详细维度信息
    getQualityDictionaryDetailList(params = {}): Observable<any> {
        let url = '';
        if (MockData) {
            url = 'assets/mockData/oc/total.json';
        } else {
            url = 'postcompetency/GetQualityDictionaryDetailList';
        }
        return this._http.get(url, params);
    }
}
