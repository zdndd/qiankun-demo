import { MockRequest, MockStatusError } from '@knz/mock';

const user = ['jack', 'rock', 'oscar', 'wendy', '冬宁', 'jun', 'shawn', 'dana', 'cathy', 'ivy'];

function getUserListDemo(count: number = 2): any[] {
    const list: any[] = [];
    for (let i = 0; i < count; i++) {
        list.push({
            id: `empcode-${i}`,
            name: user[i % 10],
            content: '测试人员数据哦',
        });
    }
    return list;
}

function saveUserInfoDemo(req: MockRequest) {
    return 'ok';
}

function getChat(req) {
    let obj = {
        datasource: [
            {
                id: 8127,
                title: '能力与绩效',
                type: 21,
                name: '21',
                remark: null,
                row: 1,
                extenddata: null,
                tabtype: 0,
                sort: 0,
                charttype: 21,
                isstandardreport: true,
                isshow: true,
                category: 7,
            },
        ],
        isshowcategory: true,
        sidebar: [
            {
                id: 17507,
                title: '能力与特质',
                charttype: 21,
                isstandardreport: true,
                isshow: true,
                category: 7,
            },
            {
                id: 17506,
                title: '能力与动力',
                charttype: 21,
                isstandardreport: true,
                isshow: true,
                category: 7,
            },
            {
                id: 17505,
                title: '能力与潜力',
                charttype: 21,
                isstandardreport: true,
                isshow: false,
                category: 7,
            },
        ],
    };
    return obj;
}

function getChartData() {
    return {
        datasource: {
            data: [
                {
                    value: [
                        {
                            x: '5.50',
                            y: '81.04',
                            name: '张三',
                            empcode: 'emp001',
                        },
                        {
                            x: '1.00',
                            y: '72.04',
                            name: '李四',
                            empcode: 'emp002',
                        },
                        {
                            x: '1.50',
                            y: '63.00',
                            name: '王嘛',
                            empcode: 'emp013',
                        },
                        {
                            x: '2.00',
                            y: '54.00',
                            name: '赵四',
                            empcode: 'emp014',
                        },
                    ],
                },
            ],
            line: [],
            column: ['能力均值', '均值'],
            average: ['2.50', '67.52'],
            filter: '',
            charttype: 21,
            isstandardreport: true,
            beforealine: {
                x1: '10',
                x2: '50',
                y1: '20',
                y2: '30',
            },
            afteraline: {
                x1: '20',
                x2: '60',
                y1: '40',
                y2: '80',
            },
            size: { minx: '1.00', maxx: '5.50', miny: '54.00', maxy: '81.04' },
            explain: null,
        },
        explain: '我是explain，我是新的。根据潜力均值观察，员工潜力倾向为实干者较高,创新者较弱',
    };
}

export const APIS = {
    '/getuserList': (req: MockRequest) => getUserListDemo(req.queryString.count),
    'POST saveUserInfo': (req: MockRequest) => saveUserInfoDemo(req),
    'fields/GetChatListByCategory': (req: MockRequest) => getChat(req),
    'fields/GetChartData': (req: MockRequest) => getChartData(),
    '/api/401': () => {
        throw new MockStatusError(401);
    },
    '/api/403': () => {
        throw new MockStatusError(403);
    },
    '/api/404': () => {
        throw new MockStatusError(404);
    },
    '/api/500': () => {
        throw new MockStatusError(500);
    },
};
