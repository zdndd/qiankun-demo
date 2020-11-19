import { MockRequest, MockStatusError } from '@knz/mock';

const data3377 = {
    data: {
        adminproject: [
            {
                username: 'andy',
                userid: 2,
            },
        ],
        createdate: '2020-05-09T11:09:32.75',
        createuser: 1,
        customerid: 'knx',
        id: 3377,
        modifydate: '2020-05-09T15:31:29.683',
        modifyuser: 1,
        permissiontype: 0,
        projectname: '项目管理员-进行中',
        projectstate: 0,
        remark: '',
        sort: null,
        username: null,
        begindate: '2020-05-09T00:00:00',
        enddate: '2020-05-20T00:00:00',
        approvedproject: [
            { username: 'Bella', userid: 31 },
            { username: '6677', userid: 129 },
        ],
        viewproject: [
            {
                userid: 82,
                username: 'zdndd2',
            },
            {
                userid: 87,
                username: 'zdndd3',
            },
        ],
    },
    errorcode: 0,
    message: '获取成功',
};

const data1308 = {
    data: {
        adminproject: [
            {
                username: 'andy',
                userid: 2,
            },
        ],
        createdate: '2020-05-09T11:09:32.75',
        createuser: 1,
        customerid: 'knx',
        id: 1308,
        modifydate: '2020-05-09T15:31:29.683',
        modifyuser: 1,
        permissiontype: 0,
        projectname: '项目管理员-待审核',
        projectstate: 2,
        remark: '',
        sort: null,
        username: null,
        begindate: '2020-05-09T00:00:00',
        enddate: '2020-05-20T00:00:00',
        approvedproject: [
            { username: 'Bella', userid: 31 },
            { username: '6677', userid: 129 },
        ],
    },
    errorcode: 0,
    message: '获取成功',
};

const data3366 = {
    data: {
        adminproject: [
            {
                username: 'andy',
                userid: 2,
            },
        ],
        createdate: '2020-05-09T11:09:32.75',
        createuser: 1,
        customerid: 'knx',
        id: 3366,
        modifydate: '2020-05-09T15:31:29.683',
        modifyuser: 1,
        permissiontype: 0,
        projectname: '项目管理员-待校准',
        projectstate: 3,
        remark: '',
        sort: null,
        username: null,
        begindate: '2020-05-09T00:00:00',
        enddate: '2020-05-20T00:00:00',
        approvedproject: [
            { username: 'Bella', userid: 31 },
            { username: '6677', userid: 129 },
        ],
    },
    errorcode: 0,
    message: '获取成功',
};

const data283 = {
    data: {
        adminproject: [
            {
                username: 'andy',
                userid: 2,
            },
        ],
        createdate: '2020-05-09T11:09:32.75',
        createuser: 1,
        customerid: 'knx',
        id: 283,
        modifydate: '2020-05-09T15:31:29.683',
        modifyuser: 1,
        permissiontype: 0,
        projectname: '项目管理员-待发布',
        projectstate: 4,
        remark: '',
        sort: null,
        username: null,
        begindate: '2020-05-09T00:00:00',
        enddate: '2020-05-20T00:00:00',
        approvedproject: [
            { username: 'Bella', userid: 31 },
            { username: '6677', userid: 129 },
        ],
    },
    errorcode: 0,
    message: '获取成功',
};

const data276 = {
    data: {
        adminproject: [
            {
                username: 'andy',
                userid: 2,
            },
        ],
        createdate: '2020-05-09T11:09:32.75',
        createuser: 1,
        customerid: 'knx',
        id: 276,
        modifydate: '2020-05-09T15:31:29.683',
        modifyuser: 1,
        permissiontype: 0,
        projectname: '项目管理员-已发布',
        projectstate: 1,
        remark: '',
        sort: null,
        username: null,
        begindate: '2020-05-09T00:00:00',
        enddate: '2020-05-20T00:00:00',
        approvedproject: [
            { username: 'Bella', userid: 31 },
            { username: '6677', userid: 129 },
        ],
    },
    errorcode: 0,
    message: '获取成功',
};

const data261 = {
    data: {
        adminproject: [
            {
                username: 'andy',
                userid: 2,
            },
        ],
        createdate: '2020-05-09T11:09:32.75',
        createuser: 1,
        customerid: 'knx',
        id: 261,
        modifydate: '2020-05-09T15:31:29.683',
        modifyuser: 1,
        permissiontype: 2,
        projectname: '审核人-待审核',
        projectstate: 2,
        remark: '',
        sort: null,
        username: null,
        begindate: '2020-05-09T00:00:00',
        enddate: '2020-05-20T00:00:00',
        approvedproject: [
            { username: 'Bella', userid: 31 },
            { username: '6677', userid: 129 },
        ],
    },
    errorcode: 0,
    message: '获取成功',
};

const data266 = {
    data: {
        adminproject: [
            {
                username: 'andy',
                userid: 2,
            },
        ],
        createdate: '2020-05-09T11:09:32.75',
        createuser: 1,
        customerid: 'knx',
        id: 266,
        modifydate: '2020-05-09T15:31:29.683',
        modifyuser: 1,
        permissiontype: 2,
        projectname: '审核人-待发布',
        projectstate: 4,
        remark: '',
        sort: null,
        username: null,
        begindate: '2020-05-09T00:00:00',
        enddate: '2020-05-20T00:00:00',
        approvedproject: [
            { username: 'Bella', userid: 31 },
            { username: '6677', userid: 129 },
        ],
    },
    errorcode: 0,
    message: '获取成功',
};

const data249 = {
    data: {
        adminproject: [
            {
                username: 'andy',
                userid: 2,
            },
        ],
        createdate: '2020-05-09T11:09:32.75',
        createuser: 1,
        customerid: 'knx',
        id: 249,
        modifydate: '2020-05-09T15:31:29.683',
        modifyuser: 1,
        permissiontype: 2,
        projectname: '审核人-已发布',
        projectstate: 1,
        remark: '',
        sort: null,
        username: null,
        begindate: '2020-05-09T00:00:00',
        enddate: '2020-05-20T00:00:00',
        approvedproject: [
            { username: 'Bella', userid: 31 },
            { username: '6677', userid: 129 },
        ],
    },
    errorcode: 0,
    message: '获取成功',
};

const data245 = {
    data: {
        adminproject: [
            {
                username: 'andy',
                userid: 2,
            },
        ],
        createdate: '2020-05-09T11:09:32.75',
        createuser: 1,
        customerid: 'knx',
        id: 245,
        modifydate: '2020-05-09T15:31:29.683',
        modifyuser: 1,
        permissiontype: 1,
        projectname: '查看人-已发布',
        projectstate: 1,
        remark: '',
        sort: null,
        username: null,
        begindate: '2020-05-09T00:00:00',
        enddate: '2020-05-20T00:00:00',
        approvedproject: [
            { username: 'Bella', userid: 31 },
            { username: '6677', userid: 129 },
        ],
    },
    errorcode: 0,
    message: '获取成功',
};

function getProjectInfo(params) {
    let data;
    switch (params.projectid) {
        case 3377:
            data = data3377;
            break;
        case 1308:
            data = data1308;
            break;
        case 3366:
            data = data3366;
            break;
        case 283:
            data = data283;
            break;
        case 276:
            data = data276;
            break;
        case 261:
            data = data261;
            break;
        case 266:
            data = data266;
            break;
        case 249:
            data = data249;
            break;
        case 245:
            data = data245;
            break;
    }
    return data;
}

function saveUserInfoDemo(req: MockRequest) {
    return 'ok';
}

export const projectInfo = {
    'project/EditProjectInfo': (req: MockRequest) => getProjectInfo(req.queryString),
    // 'POST /saveUserInfo': (req: MockRequest) => saveUserInfoDemo(req),
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
