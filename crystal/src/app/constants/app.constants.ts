import { TransferItem } from '../shared/components/sv-transfer/interface';

export enum DataState {
    LOADING = 1,
    EMPTY = 2,
    EXIST_DATA = 3,
}

//全局变量-开启模拟数据
export const MockData = false;

export enum ChooseType {
    isModel = 0, //模型结论
    generalPercentage = 1, //通用结论（包含百分比）
    generalMultiple = 2, //非通用多选
    generalSingle = 3, //非通用单选
}

export enum ChartType {
    Radar = '0', //雷达图
    Bar = '1', //条形图
    Scatter = '2', //散点图
    Stacked = '3', //堆积占比图
    Pie = '4', //饼状图
    Composite = '5', //复合柱状图
    Histogram = '6', //直方图
    Column = '7', //柱状占比图
    Pvalue = '8', //pvalue 图
    Pearson = '9', //相关系数
    Chdescribe = '10', //洞察描述
    Talent = '11', //洞察描述
    Line = '12', //折线图
}

// 通用结论和模型结论传参
export interface ValueObjParam {
    abilityid: number;
    description?: string;
    proportion?: number;
}

//图列表->渲染打个图标对接口
export interface ChartItemData {
    id?: number;
    title?: string;
    type?: number;
    abilityname?: string;
    remark?: string;
    tabtype?: number;
    datasource?: any;
}

export interface abilityParam {
    conclusionList: any;
    chooseType: number;
    isDisabled: boolean;
    modelid?: number;
}

export interface choiceFunctionParam {
    standardConfig?: any;
    dictionaryDetails?: any;
    maxlevelindex?: number;
    tree?: any;
    chooseType: number;
    modelId?: number;
}

export interface IResponse<T> {
    isOk: boolean;
    data: T;
    message: string;

    /**
     * 0 -> success，1 -> failed
     */
    errorcode: 0 | 1;
}
