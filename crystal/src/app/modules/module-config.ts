import { Injectable } from '@angular/core';

export const menuEnum = {
    cms: 1000,
    'talent-inventory': 1001,
    'agile-modeling': 1002,
    'course-design': 1005,
    oc: 1006,
    'assessment-center': 1007,
    succession: 1013,
    'quality-dictionary': 1014,
    'devel-scheme': 1015,
};

export const pageEnum = {
    'role-auth': 100001,
    user: 100002,
    'organization/organization-list': 100003,
    'operation-log/log-list': 100004,
    'talent-inventory/talent-inventory-list': 100104,
    'talent-inventory/talent-inventory-undisposed': 100105,
    'home/dictionary-list': 100201,
    'home/model': 100202,
    'home/library': 100501,
    'home/system': 100502,
    'home/design': 100503,
    'home/dictionary': 100601,
    'home/competency': 100602,
    'assessment-center/evaluation-plan': 100701,
    'assessment-center/talentreport': 100702,
    '/succession/home': 101301,
    '/succession/home/map': 101302,
    '/quality-dictionary/dictionary/dictionary-list': 101401,
    '/devel-scheme/scheme/scheme-list': 101501,
    '/devel-scheme/scheme/demand-people-list': 101502,
};

@Injectable({
    providedIn: 'root',
})
export class ModuleConfig {
    modules = [
        {
            menuID: menuEnum['agile-modeling'],
            i18n: '敏捷建模',
            page: 'agile-modeling',
        },
        {
            menuID: menuEnum['assessment-center'],
            i18n: '评估中心',
            page: 'assessment-center',
        },
    ];

    constructor() {}
}
