import { MockRequest, MockStatusError } from '@knz/mock';

const peoplePerformanceData = {
    data: {
        people: [
            {
                columncode: '11',
                columnname: '姓名',
                selected: true,
            },
            {
                columncode: '12',
                columnname: '工号',
                selected: false,
            },
            {
                columncode: '13',
                columnname: '部门',
                selected: false,
            },
            {
                columncode: '14',
                columnname: '地区',
                selected: false,
            },
            {
                columncode: '15',
                columnname: '级别',
                selected: false,
            },
            {
                columncode: '16',
                columnname: '性别',
                selected: true,
            },
        ],
        performance: [
            {
                columncode: '21',
                columnname: '2017年绩效',
                selected: false,
            },
            {
                columncode: '22',
                columnname: '2018年Q1绩效',
                selected: false,
            },
            {
                columncode: '23',
                columnname: '2018年Q2绩效',
                selected: true,
            },
            {
                columncode: '24',
                columnname: '2018年Q3绩效',
                selected: false,
            },
            {
                columncode: '25',
                columnname: '2019年绩效',
                selected: false,
            },
        ],
    },
    errorcode: 0,
    message: '获取成功',
};

function getProjectPeopleAndPerformanceColumn(params) {
    return peoplePerformanceData;
}

function AddProjectColumn(req: MockRequest) {
    return req;
}

export const projectPeopleAndPerformance = {
    'project/GetProjectPeopleAndPerformanceColumn': (req: MockRequest) =>
        getProjectPeopleAndPerformanceColumn(req.queryString),
    'POST project/AddProjectColumn': (req: MockRequest) => AddProjectColumn(req.queryString),
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
