import { Component, OnInit, Input } from '@angular/core';
import _ from 'lodash';
// import { DevelSchemeService } from '@modules/devel-scheme/services/devel-scheme.service';
import { TranslateService } from '@ngx-translate/core';

export interface ItemData {
    empcode: string;
    positionid: string;
}

@Component({
    selector: 'app-advanced-search',
    templateUrl: './advanced-search.component.html',
    styleUrls: ['./advanced-search.component.less'],
})
export class AdvancedSearchComponent implements OnInit {
    departmentList = [];
    positionNameList = [];
    jobSequenceList = [];
    rankList = [];
    isSelectDepart = true;
    departmentValue = null;
    positionNameValue = null;
    jobSequenceValue = null;
    rankValue = null;

    totalcount = 0;
    pagesize = 20;
    pagecount = 1;
    pageindex = 1;
    tabledata = [];
    pagestate = 1;
    isAllDisplayDataChecked = false;
    isIndeterminate = false;
    listOfDisplayData: ItemData[] = [];
    mapOfCheckedId: { [key: string]: boolean } = {};
    checkIds: any[] = []; //选中tableItem的id集合；
    allEmpData = [];
    get lang() {
        return this.translateService.store.currentLang.replace(/[^a-z].*$/, '');
    }
    imgChange = 'zh';
    isCheckedAllPage = false;

    @Input() selectedData;
    constructor(public translateService: TranslateService) {}

    ngOnInit() {
        const params = {
            orgId: '',
            posId: '',
            posGrade: '',
        };
        // this.develSchemeService.getAdvancedOptions(params).subscribe((res) => {
        //     this.departmentList = res;
        // });
        this.getAllData();
        this.loadData();
        this.selectData(this.selectedData);
    }

    //按分页获取数据
    loadData() {
        const paramTable = {
            pageIndex: this.pageindex,
            pageSize: this.pagesize,
            orgId: this.departmentValue == null ? '' : this.departmentValue,
            posId: this.jobSequenceValue == null ? '' : this.jobSequenceValue,
            posName: this.positionNameValue == null ? '' : this.positionNameValue,
            posGrade: this.rankValue == null ? '' : this.rankValue,
        };
        // this.develSchemeService.getEmployeeList(paramTable).subscribe((res) => {
        //     if (res.list.length > 0) {
        //         this.tabledata = res.list;
        //         this.totalcount = res.totalcount;
        //         this.pagecount = res.totalpages;
        //         this.pagestate = 3;
        //     } else {
        //         this.pagestate = 2;
        //     }
        // });
    }

    //获取所有员工数据
    getAllData() {
        const allDataParams = {
            pageIndex: 1,
            pageSize: 999999,
            orgId: this.departmentValue == null ? '' : this.departmentValue,
            posId: this.jobSequenceValue == null ? '' : this.jobSequenceValue,
            posName: this.positionNameValue == null ? '' : this.positionNameValue,
            posGrade: this.rankValue == null ? '' : this.rankValue,
        };
        // this.develSchemeService.getEmployeeList(allDataParams).subscribe((res) => {
        //     if (this.selectedData.length === res.list.length) {
        //         this.isCheckedAllPage = true;
        //     }
        //     if (res.list.length > 0) {
        //         _.forEach(res.list, (item) => {
        //             this.allEmpData.push(
        //                 _.assign(item, {
        //                     empCodePositionId: item.empcode + '@$@' + item.positionid,
        //                 }),
        //             );
        //         });
        //     }
        // });
    }

    departmentSelect(e) {
        this.isSelectDepart = false;
        _.forEach(this.departmentList, (item) => {
            if (item.value === e) {
                this.positionNameList = item.children;
                this.jobSequenceList = item.children;
            }
        });
        this.positionNameValue = null;
        this.jobSequenceValue = null;
        this.rankValue = null;
    }
    positionNameSelect(e) {
        _.forEach(this.positionNameList, (item) => {
            if (item.value === e) {
                this.rankList = item.children;
            }
        });
        this.rankValue = null;
    }
    jobSequenceSelect(e) {
        _.forEach(this.jobSequenceList, (item) => {
            if (item.value === e) {
                this.rankList = item.children;
            }
        });
        this.rankValue = null;
    }

    rankSelect(e) {}

    pageIndexChange($event) {
        this.pageindex = $event;
        this.loadData();
    }

    refreshStatus(): void {
        const mapOfCheckedTrueArr = Object.values(this.mapOfCheckedId);
        const isTrue = mapOfCheckedTrueArr.every((item) => item);
        if (this.allEmpData.length === mapOfCheckedTrueArr.length && isTrue) {
            this.isCheckedAllPage = true;
        } else {
            this.isCheckedAllPage = false;
        }
        this.isAllDisplayDataChecked = this.tabledata.every(
            (item) => this.mapOfCheckedId[item.empcode + '@$@' + item.positionid],
        );
        this.isIndeterminate =
            this.listOfDisplayData.some((item) => this.mapOfCheckedId[item.empcode + '@$@' + item.positionid]) &&
            !this.isAllDisplayDataChecked;

        const obj = this.mapOfCheckedId;
        const checkIds = [];
        Object.keys(obj).forEach((key) => {
            if (obj[key]) {
                checkIds.push(key);
            }
        });
        this.checkIds = checkIds;
    }

    currentPageDataChange($event: ItemData[]): void {
        this.listOfDisplayData = $event;
        this.refreshStatus();
    }

    checkAll(value: boolean): void {
        if (!value) {
            this.isCheckedAllPage = false;
        }
        this.listOfDisplayData.forEach((item) => (this.mapOfCheckedId[item.empcode + '@$@' + item.positionid] = value));
        this.refreshStatus();
    }

    search() {
        this.pageindex = 1;
        this.loadData();
    }

    reset() {
        this.isSelectDepart = true;
        this.departmentValue = null;
        this.positionNameValue = null;
        this.jobSequenceValue = null;
        this.rankValue = null;
        this.loadData();
        this.isCheckedAllPage = false;
        this.selectData(this.selectedData);
    }

    //全选所有
    selectAllPage() {
        if (this.isCheckedAllPage) {
            this.selectData(this.allEmpData);
            this.isAllDisplayDataChecked = true;
            this.refreshStatus();
        } else {
            this.mapOfCheckedId = {};
            this.isAllDisplayDataChecked = false;
            this.refreshStatus();
        }
    }

    //根据相应情况选中数据
    selectData(data) {
        const selectedArrKey = [];
        const selectedArrValue = [];
        if (data.length > 0) {
            _.forEach(data, (item) => {
                selectedArrKey.push(item.empcode + '@$@' + item.positionid);
                selectedArrValue.push('true');
            });
            this.mapOfCheckedId = _.zipObject(selectedArrKey, selectedArrValue);
        }
    }

    getData() {
        const selectedEmp = [];
        _.forEach(this.allEmpData, (element) => {
            _.forEach(this.checkIds, (item) => {
                if (element.empCodePositionId === item) {
                    selectedEmp.push(element);
                }
            });
        });
        return selectedEmp;
    }
}
