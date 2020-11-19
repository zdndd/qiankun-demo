import { MockRequest, MockStatusError } from '@knz/mock';
 
const InventoryListData = {
    data: {
        data: [
                {
                    createdate: "2020-05-09T11:09:32.75",
                    createusername: "admin",
                    id: 3377,
                    permissiontype: 0,
                    projectname: "项目管理员-进行中",
                    projectstate: 0,
                    remark: "",
                },
                {
                    createdate: "2020-05-09T10:02:21.92",
                    createusername: "admin",
                    id: 1308,
                    permissiontype: 0,
                    projectname: "项目管理员-待审核",
                    projectstate: 2,
                    remark: "",
                },
                {
                    createdate: "2020-04-29T15:48:53.587",
                    createusername: "admin",
                    id: 3366,
                    permissiontype: 0,
                    projectname: "项目管理员-待校准",
                    projectstate: 3,
                    remark: "",
                },
                {
                    createdate: "2020-04-16T15:47:34.143",
                    createusername: "admin",
                    id: 283,
                    permissiontype: 0,
                    projectname: "项目管理员-待发布",
                    projectstate: 4,
                    remark: "",
                },
                {
                    createdate: "2020-05-09T10:02:21.92",
                    createusername: "admin",
                    id: 276,
                    permissiontype: 0,
                    projectname: "项目管理员-已发布",
                    projectstate: 1,
                    remark: "",
                },
                {
                    createdate: "2020-05-09T10:02:21.92",
                    createusername: "admin",
                    id: 261,
                    permissiontype: 2,
                    projectname: "审核人-待审核",
                    projectstate: 2,
                    remark: "",
                },
                {
                    createdate: "2020-04-16T15:47:34.143",
                    createusername: "admin",
                    id: 266,
                    permissiontype: 2,
                    projectname: "审核人-待发布",
                    projectstate: 4,
                    remark: "",
                },
                {
                    createdate: "2020-05-09T10:02:21.92",
                    createusername: "admin",
                    id: 249,
                    permissiontype: 2,
                    projectname: "审核人-已发布",
                    projectstate: 1,
                    remark: "",
                },
                {
                    createdate: "2020-05-09T10:02:21.92",
                    createusername: "admin",
                    id: 245,
                    permissiontype: 1,
                    projectname: "查看人-已发布",
                    projectstate: 1,
                    remark: "",
                }
        ],
        maximumdata: {
            currentmaximum: 5,
            maximum: -1
        }
    },
    errorcode: 0,
    message: "获取成功"
};
 
const InventoryUndisposedData = {
    data: {
        data: [
                {
                    createdate: "2020-05-09T11:09:32.75",
                    createusername: "admin",
                    id: 3377,
                    permissiontype: 0,
                    projectname: "项目管理员-进行中",
                    projectstate: 0,
                    remark: "",
                },
                {
                    createdate: "2020-04-29T15:48:53.587",
                    createusername: "admin",
                    id: 3366,
                    permissiontype: 0,
                    projectname: "项目管理员-待校准",
                    projectstate: 3,
                    remark: "",
                },
                {
                    createdate: "2020-04-16T15:47:34.143",
                    createusername: "admin",
                    id: 283,
                    permissiontype: 0,
                    projectname: "项目管理员-待发布",
                    projectstate: 4,
                    remark: "",
                },
                {
                    createdate: "2020-05-09T10:02:21.92",
                    createusername: "admin",
                    id: 261,
                    permissiontype: 2,
                    projectname: "审核人-待审核",
                    projectstate: 2,
                    remark: "",
                }
        ],
        maximumdata: {
            currentmaximum: 5,
            maximum: -1
        }
    },
    errorcode: 0,
    message: "获取成功"
};

function getProjectList(params){
    if(params.type == 'pending'){
        return InventoryUndisposedData;
    }else{
        return InventoryListData;
    }
}

function saveUserInfoDemo(req: MockRequest){
    return 'ok';
}

export const projectList = {
    'project/GetProjectList': (req: MockRequest) => getProjectList(req.queryString),
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
