import { MockRequest, MockStatusError } from '@knz/mock';
function getChat(req) {
    let obj = {
        datasource: {
            peoplemap: [
                {
                    sort: 1,
                    name: '张三',
                    nlper: true,
                    nldl: false,
                    nlql: false,
                    nldlql: false,
                    totalcount: 1,
                },
            ],
            conclusion: [
                {
                    chartid: 8127,
                    chartname: '人才地图输出——能力与绩效',
                    charttype: 13,
                    locationuser: [
                        {
                            empcode: 'emp001',
                            empname: '张三',
                            positionname:
                                '初级功能测试,经理,CEO,CEO,CEO,技术副总裁,技术副总裁,技术副总裁,技术副总裁,CEO,CEO,CEO',
                            beforelocation: 1,
                            afterlocation: 9,
                        },
                        {
                            empcode: 'emp101',
                            empname: '三',
                            positionname: 'CEO,CEO,CEO',
                            beforelocation: 2,
                            afterlocation: 9,
                        },
                        {
                            empcode: 'emp201',
                            empname: '三',
                            positionname: '',
                            beforelocation: 2,
                            afterlocation: 9,
                        },
                        {
                            empcode: 'emp002',
                            empname: '李四',
                            positionname:
                                '初级开发工程师,产品总监,产品总监,产品总监,初级开发工程师,初级开发工程师,初级开发工程师,初级开发工程师,产品总监,产品总监,产品总监',
                            beforelocation: 3,
                            afterlocation: 9,
                        },
                        {
                            empcode: 'emp013',
                            empname: '王嘛',
                            positionname: '初级测试工程师,销售经理,销售经理,销售经理,销售经理,销售经理,销售经理',
                            beforelocation: 3,
                            afterlocation: 9,
                        },
                        {
                            empcode: 'emp014',
                            empname: '赵四',
                            positionname:
                                '初级测试工程师,高级销售专员,高级销售专员,高级销售专员,高级销售专员,高级销售专员,高级销售专员',
                            beforelocation: 3,
                            afterlocation: 9,
                        },
                    ],
                },
            ],
            desc: {
                rows: [
                    {
                        code: '1',
                        title: '组织',
                        columns: [
                            {
                                code: '4',
                                value: null,
                            },
                            {
                                code: '5',
                                value: null,
                            },
                            {
                                code: '6',
                                value: null,
                            },
                        ],
                    },
                    {
                        code: '2',
                        title: '群体',
                        columns: [
                            {
                                code: '4',
                                value: null,
                            },
                            {
                                code: '5',
                                value: null,
                            },
                            {
                                code: '6',
                                value: null,
                            },
                        ],
                    },
                    {
                        code: '3',
                        title: '个体',
                        columns: [
                            {
                                code: '4',
                                value: null,
                            },
                            {
                                code: '5',
                                value: null,
                            },
                            {
                                code: '6',
                                value: null,
                            },
                        ],
                    },
                ],
                columns: [
                    {
                        code: '4',
                        title: '绩效',
                    },
                    {
                        code: '5',
                        title: '能力',
                    },
                    {
                        code: '6',
                        title: '特质',
                    },
                ],
            },
        },
        list: [
            {
                id: 888,
                type: 10,
                title: '洞察描述',
            },
            {
                id: 666,
                type: 11,
                title: '人才名单输出',
            },
            {
                id: 8127,
                type: 13,
                title: '人才地图输出——能力与绩效',
            },
        ],
        isshowcategory: true,
        sidebar: null,
    };
    return obj;
}
export const Report = {
    'fields/GetConclusionChatListByCategory': (req: MockRequest) => getChat(req),
};
