import _ from 'lodash';
export const standardConfig = [
    {
        id: '1',
        name: '能力',
        i18n: 'ability',
        page: 'ability',
    },
    {
        id: '2',
        name: '动力',
        i18n: 'driving',
        page: 'driving',
    },
    {
        id: '3',
        name: '潜力',
        i18n: 'potential',
        page: 'potential',
    },
    {
        id: '4',
        name: '经历',
        i18n: 'experience',
        page: 'experience',
    },
];

export interface ItemConfig {
    id?: number;
    abilityname?: string;
    parent_id?: number;
    defaultdescription?: string;
    rowindex?: string;
    targetscore?: null;
    maxtargetscore?: null;
    children?: ItemConfig[];
    checked?: boolean;
    disabled?: boolean;
    templateId?: string;
    parentTitle?: string;
    descriptionlist?:any;
    abilityNameDisabled?:boolean;
}

//数组增加checked disable 状态
export function addChecked(arr) {
    _.forEach(arr, element => {
        element.visible = true;
        element.checked = false;
        element.disabled = false;
        if (element.children && element.children.length > 0) {
            addChecked(element.children);
        }
    });
}

//数组增加checked disable 状态
export function filterChecked(arr) {
    _.forEach(arr, element => {
        if (element.children && element.children.length <= 0) {
            element.checked = true;
            element.disabled = false;
        } else {
            element.checked = false;
            element.disabled = true;
        }

        if (element.children && element.children.length > 0) {
            filterChecked(element.children);
        }
    });
}
