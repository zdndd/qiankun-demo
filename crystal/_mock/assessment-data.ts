import { MockRequest, MockStatusError } from '@knz/mock';

const assessmentData = {
    errorcode: 0,
    message: '操作成功',
    data: {
        list: [
            {
                projectid: 3395,
                customerid: 'BellaCompany',
                id: 1118,
                empcode: 'emp008',
                empname: 'emp008',
                positionid: 'p2',
                abilityplanid: 0,
                ability: {
                    planid: 0,
                    list: [
                        {
                            planid: 0,
                            name: '2018年测评',
                            createdate: '2020-05-18T10:19:44.369Z',
                        },
                        {
                            planid: 1,
                            name: '2019年测评',
                            createdate: '2020-05-19T10:19:44.369Z',
                        },
                        {
                            planid: 2,
                            name: '2020年测评',
                            createdate: '2020-05-20T10:19:44.369Z',
                        },
                    ],
                },
                impetusplanid: 1,
                impetus: {
                    planid: 1,
                    list: [
                        {
                            planid: 0,
                            name: '2018年测评',
                            createdate: '2020-05-18T10:19:44.369Z',
                        },
                        {
                            planid: 1,
                            name: '2019年测评',
                            createdate: '2020-05-19T10:19:44.369Z',
                        },
                        {
                            planid: 2,
                            name: '2020年测评',
                            createdate: '2020-05-20T10:19:44.369Z',
                        },
                    ],
                },
                potentialplanid: 2,
                potential: {
                    planid: 2,
                    list: [
                        {
                            planid: 0,
                            name: '2018年测评',
                            createdate: '2020-05-18T10:19:44.369Z',
                        },
                        {
                            planid: 1,
                            name: '2019年测评',
                            createdate: '2020-05-19T10:19:44.369Z',
                        },
                        {
                            planid: 2,
                            name: '2020年测评',
                            createdate: '2020-05-20T10:19:44.369Z',
                        },
                    ],
                },
                positionname: '开发工程师',
            },
            {
                projectid: 3395,
                customerid: 'BellaCompany',
                id: 1123,
                empcode: 'emp013',
                empname: 'emp013',
                positionid: 'p2',
                abilityplanid: 2227,
                ability: {
                    planid: 2227,
                    list: [
                        {
                            planid: 2227,
                            name: '盘点多岗位_Copy',
                            qualitytype: 1,
                            createdate: '2020-05-15T16:08:45.77',
                        },
                    ],
                },
                impetusplanid: 2227,
                impetus: {
                    planid: 2227,
                    list: [
                        {
                            planid: 2227,
                            name: '盘点多岗位_Copy',
                            qualitytype: 2,
                            createdate: '2020-05-15T16:08:45.77',
                        },
                        {
                            planid: 2230,
                            name: 'bellaTest20200507_Co_Copy_Copy_Copy_Copy',
                            qualitytype: 2,
                            createdate: '2020-05-15T16:37:46.947',
                        },
                    ],
                },
                potentialplanid: 2227,
                potential: {
                    planid: 2227,
                    list: [
                        {
                            planid: 2227,
                            name: '盘点多岗位_Copy',
                            qualitytype: 3,
                            createdate: '2020-05-15T16:08:45.77',
                        },
                        {
                            planid: 2230,
                            name: 'bellaTest20200507_Co_Copy_Copy_Copy_Copy',
                            qualitytype: 3,
                            createdate: '2020-05-15T16:37:46.947',
                        },
                    ],
                },
                positionname: '开发工程师',
            },
            {
                projectid: 3395,
                customerid: 'BellaCompany',
                id: 1123,
                empcode: 'emp013',
                empname: 'emp013',
                positionid: 'p5',
                abilityplanid: 2230,
                ability: {
                    planid: 2230,
                    list: [
                        {
                            planid: 2230,
                            name: 'bellaTest20200507_Co_Copy_Copy_Copy_Copy',
                            qualitytype: 1,
                            createdate: '2020-05-15T16:37:46.947',
                        },
                    ],
                },
                impetusplanid: 2227,
                impetus: {
                    planid: 2227,
                    list: [
                        {
                            planid: 2227,
                            name: '盘点多岗位_Copy',
                            qualitytype: 2,
                            createdate: '2020-05-15T16:08:45.77',
                        },
                        {
                            planid: 2230,
                            name: 'bellaTest20200507_Co_Copy_Copy_Copy_Copy',
                            qualitytype: 2,
                            createdate: '2020-05-15T16:37:46.947',
                        },
                    ],
                },
                potentialplanid: 2227,
                potential: {
                    planid: 2227,
                    list: [
                        {
                            planid: 2227,
                            name: '盘点多岗位_Copy',
                            qualitytype: 3,
                            createdate: '2020-05-15T16:08:45.77',
                        },
                        {
                            planid: 2230,
                            name: 'bellaTest20200507_Co_Copy_Copy_Copy_Copy',
                            qualitytype: 3,
                            createdate: '2020-05-15T16:37:46.947',
                        },
                    ],
                },
                positionname: '初级测试工程师',
            },
            {
                projectid: 3395,
                customerid: 'BellaCompany',
                id: 1124,
                empcode: 'emp014',
                empname: 'emp014',
                positionid: 'p5',
                abilityplanid: 92,
                ability: {
                    planid: 92,
                    list: [],
                },
                impetusplanid: 89,
                impetus: {
                    planid: 89,
                    list: [],
                },
                potentialplanid: 0,
                potential: {
                    planid: 0,
                    list: [],
                },
                positionname: '初级测试工程师',
            },
        ],
        pageindex: 1,
        pagesize: 20,
        totalcount: 4,
        totalpages: 1,
        projectid: 3395,
    },
};

function getPagedProjectAssessment(req: MockRequest) {
    return assessmentData;
}

function addProjectAssessment(req: MockRequest) {
    return req;
}

export const assessmentDataList = {
    'project/getPagedProjectAssessment': (req: MockRequest) => getPagedProjectAssessment(req.queryString),
    'POST project/getPagedProjectAssessment': (req: MockRequest) => getPagedProjectAssessment(req),
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
