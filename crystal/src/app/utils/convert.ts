import _ from 'lodash';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

export function ensureArray(value: any) {
    if (value == null) return [];
    if (Array.isArray(value)) return value;
    return [value];
}

export function toBoolean(value: boolean | string): boolean {
    return coerceBooleanProperty(value);
}

export function formatTreeData(treeData) {
    if (treeData.children.length <= 0) {
        treeData.isLeaf = true;
    } else {
        treeData.children.forEach(element => {
            formatTreeData(element);
        });
    }
}

export function getDemographicSelected(list, transformData) {
    list.forEach(item => {
        let itemData = Object.assign({
            key: item.key,
            title: item.title,
            children: [],
        });
        transformData.push(itemData);
        if (item.children.length > 0) {
            getDemographicSelected(item.children, itemData.children);
        }
    });
}

export function deleteItemFromParent(arr, deleteId) {
    let _arr = _.cloneDeep(arr);
    _.forEach(_arr, (element, index) => {
        if (element.templateId == deleteId) {
            arr.splice(index, 1);
        }
    });
}

export function addTemplateId(arr, str, parent?) {
    let count = 0;

    mapper(arr, str, parent);
    function mapper(arr, str, parent?) {
        _.forEach(arr, (element, index) => {

            let ptitle = str + '' + (index + 1);
            element.templateId = ptitle;
            element.rowindex = ptitle;
            count++;
            element.count = count;
            if (!parent) {
                parent = '';
            }
            let parenttitle = parent + element.abilityname;
            element.parentTitle = parenttitle;

            if (element.children && element.children.length > 0) {
                mapper(element.children, ptitle + '.', parenttitle + '-');
            }
        });
    }
}
