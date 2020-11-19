import { MockRequest, MockStatusError } from '@knz/mock';
function getChat(req) {
    let obj = {
        roleid: 0,
        rolename: null,
        customerid: null,
        description: null,
        state: false,
        permissions: [
            {
                moduleid: 1002,
                modulename: '敏捷建模',
                children: [
                    {
                        permissionid: 0,
                        pageid: 100201,
                        pagename: '能力字典',
                        state: false,
                    },
                    {
                        permissionid: 0,
                        pageid: 100202,
                        pagename: '能力模型',
                        state: false,
                    },
                ],
            },
            {
                moduleid: 1006,
                modulename: '岗位胜任力',
                children: [
                    {
                        permissionid: 0,
                        pageid: 100601,
                        pagename: '素质字典',
                        state: false,
                    },
                    {
                        permissionid: 0,
                        pageid: 100602,
                        pagename: '胜任力模型',
                        state: false,
                    },
                ],
            },
            {
                moduleid: 1007,
                modulename: '评估中心',
                children: [
                    {
                        permissionid: 0,
                        pageid: 100701,
                        pagename: '评估方案',
                        state: false,
                    },
                    {
                        permissionid: 0,
                        pageid: 100702,
                        pagename: '人才报告',
                        state: false,
                    },
                ],
            },
            {
                moduleid: 1001,
                modulename: '人才盘点',
                children: [
                    {
                        permissionid: 0,
                        pageid: 100104,
                        pagename: '盘点列表',
                        state: false,
                    },
                    {
                        permissionid: 0,
                        pageid: 100105,
                        pagename: '待处理的盘点',
                        state: false,
                    },
                ],
            },
            {
                moduleid: 1013,
                modulename: '继任规划',
                children: [
                    {
                        permissionid: 0,
                        pageid: 101301,
                        pagename: '继任规划',
                        state: false,
                    },
                    {
                        permissionid: 0,
                        pageid: 101302,
                        pagename: '岗位继任图谱',
                        state: false,
                    },
                ],
            },
            {
                moduleid: 1005,
                modulename: '课程设计',
                children: [
                    {
                        permissionid: 0,
                        pageid: 100501,
                        pagename: '目标库',
                        state: false,
                    },
                    {
                        permissionid: 0,
                        pageid: 100502,
                        pagename: '课程体系',
                        state: false,
                    },
                    {
                        permissionid: 0,
                        pageid: 100503,
                        pagename: '课程设计',
                        state: false,
                    },
                ],
            },
            {
                moduleid: 1000,
                modulename: '后台管理',
                children: [
                    {
                        permissionid: 0,
                        pageid: 100001,
                        pagename: '角色权限',
                        state: false,
                    },
                    {
                        permissionid: 0,
                        pageid: 100002,
                        pagename: '用户管理',
                        state: false,
                    },
                    {
                        permissionid: 0,
                        pageid: 100003,
                        pagename: '组织架构',
                        state: false,
                    },
                    {
                        permissionid: 0,
                        pageid: 100004,
                        pagename: '操作日志',
                        state: false,
                    },
                ],
            },
            {
                moduleid: 1003,
                modulename: '学习地图',
                children: [],
            },
            {
                moduleid: 1004,
                modulename: '用户管理',
                children: [],
            },
        ],
    };
    return obj;
}
export const Role = {
    'Role/GetEmptyRoleWithPermission': (req: MockRequest) => getChat(req),
};
