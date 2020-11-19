export function queryToObject(url: string) {
    const retObj = {},
        sPageURL = url.split('?').pop(),
        queryParams = sPageURL.split('&');

    for (const pair of queryParams) {
        const key = pair[0].replace('?', '');
        const value = pair[1];
        retObj[key] = value;
    }

    return retObj;
}

export function switchType(params) {
    let type = '';
    switch (params + '') {
        case '0':
            type = 'Radar'; //雷达图
            break;
        case '1':
            type = 'Bar'; //条形图
            break;
        case '2':
            type = 'Scatter'; //散点图
            break;

        case '3':
            type = 'Stacked'; //堆积占比图
            break;
        case '4':
            type = 'Pie'; //饼状图
            break;
        case '5':
            type = 'Composite'; //复合柱状图
            break;
        case '6':
            type = 'Histogram'; //直方图
            break;
        case '7':
            type = 'Column'; //柱状占比图
            break;
        case '8':
            type = 'Pvalue'; //pvalue 图
            break;
        case '9':
            type = 'Pearson'; //相关系数
            break;
        case '10':
            type = 'Pearson'; //洞察描述
            break;
        case '11':
            type = 'Talent'; //人才名单输出
            break;
        case '12':
            type = 'Line'; //折线图
            break;
        case '13':
            type = 'NineTable'; //九宫格
            break;
        case '14':
            type = 'FourTable'; //四宫格
            break;
        case '15':
            type = 'SixVTable'; //纵向六宫格
            break;
        case '16':
            type = 'SixHTable'; //横向六宫格
            break;
        case '21':
            type = 'PeopleScatter'; //人才地图散点图
            break;
        default:
            break;
    }
    return type;
}

export function switchAgileType(params) {
    let type = '';
    const typeNum = Number(params);
    if (typeNum && typeNum > 7) params = 8;
    switch (params + '') {
        case '1':
            type = 'One';
            break;
        case '2':
            type = 'Two';
            break;
        case '3':
            type = 'Three';
            break;
        case '4':
            type = 'Four';
            break;
        case '5':
            type = 'Five';
            break;
        case '6':
            type = 'Six';
            break;
        case '7':
            type = 'Seven';
            break;
        case '8':
            type = 'Infinite';
            break;
        default:
            break;
    }
    return type;
}

export function switchMinTime(value: number) {
    let min: any = Math.floor(value / 60);
    let sec: any = value % 60;
    min = min >= 10 ? min : `0` + min;
    sec = sec >= 10 ? sec : `0` + sec;
    return `${min}:${sec}`;
}

// 将秒转化为 00:00
export function switchTime(value: number) {
    const residue = Math.floor(value % 3600);
    let hr: any = Math.floor(value / 3600);
    let min: any = Math.floor(residue / 60);
    let sec: any = value % 60;
    hr = hr >= 10 ? hr : `0` + hr;
    min = min >= 10 ? min : `0` + min;
    sec = sec >= 10 ? sec : `0` + sec;
    return `${hr}:${min}`; //`${hr}:${min}:${sec}`
}

// 将分钟转化为 n小时n分钟
export function switchTimeString(value: number) {
    const hr: any = Math.floor(value / 60);
    const min: any = Math.floor(value % 60);
    if (hr > 0) {
        return `${hr}小时${min}分钟`;
    } else {
        return `${min}分钟`;
    }
}

// 00:00 转化为分钟数  或 00:00:00 转化为秒
export function switchMinute(str: string) {
    const arr = str.split(/[: \/]/).reverse();
    const len = arr.length;
    let sumS = 0;
    for (let i = len - 1; i >= 0; i--) {
        if (arr[i].indexOf('0') === 0) {
            arr[i] = arr[i][1] ? arr[i][1] : '0';
        }
        sumS += Number(arr[i]) * Math.pow(60, i);
    }
    return sumS;
}

// 下载指定链接
export const downloadUrl = (url, name = '') => {
    const link = document.createElement('a');
    link.setAttribute('type', 'hidden'); //  Add the element to the DOM ,make it hidden
    link.download = name;
    link.href = url;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    link.remove();
};
