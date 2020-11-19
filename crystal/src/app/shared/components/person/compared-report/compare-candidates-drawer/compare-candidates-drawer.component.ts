import { Component, OnInit, Input } from '@angular/core';
import { ComparedReportService } from '../service/compared-report.service';
import { NzMessageService } from 'ng-zorro-antd';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';
import { TranslateService } from '@ngx-translate/core';
import _ from 'lodash';
import { Observable } from 'rxjs';
@Component({
    selector: 'app-compare-candidates-drawer',
    templateUrl: './compare-candidates-drawer.component.html',
    styleUrls: ['./compare-candidates-drawer.component.less'],
    providers: [ComparedReportService],
})
export class CompareCandidatesDrawerComponent implements OnInit {
    radioValue = 'left';
    @Input() projectId = '';
    //默认选中的两个人员
    @Input() defaultCheckedArray = [];
    //人才盘点、评估中心人人对比参数；(格式:empcode +'@$@' + positionid)
    @Input() lstEmpinfo: string = '';
    //人人对比总的对此胜利次数数组；
    @Input() compareTotalCountArray = [];
    personalInfo: any;
    photo = 'assets/img/default-avatar@2x.png';
    //选中的人，最多两个
    checkArray = [];
    //人人对比统计数组；
    compareCountArray = [];
    newCompareTotalCountArray = [];

    constructor(
        private comparedReportService: ComparedReportService,
        private messageService: NzMessageService,
        private drawerRef: NzDrawerRef<string>,
        private translateService: TranslateService,
    ) {}

    ngOnInit() {
        this.newCompareTotalCountArray = [];

        const compareData = this.totalCount(this.compareTotalCountArray.concat());
        const compareSortData = compareData.sort(this.sortData);
        let empList$: Observable<any>;
        if (this.lstEmpinfo === '') {
            empList$ = this.comparedReportService.getProjectCompareEmployeeList({ projectId: this.projectId });
        } else {
            empList$ = this.comparedReportService.getSuccessionEmpInfoList({ lstEmpinfo: this.lstEmpinfo });
        }

        empList$.subscribe((res) => {
            this.personalInfo = res || [];
            this.personalInfo = this.personalInfo.map((item) => {
                item.disabled = _.includes(this.defaultCheckedArray, item.empcode);
                if (compareData.length > 0) {
                    const filterData = compareData.filter((data) => data.empCode === item.empcode);
                    if (item.empcode == compareSortData[0].empCode) {
                        item.sortnumber = -1;
                    } else {
                        item.sortnumber = filterData.length > 0 ? filterData[0].winCount : '';
                    }
                    item.comparedCount = filterData.length > 0 ? filterData[0].winCount : '';
                }
                return item;
            });
        });
    }

    radioChange() {
        this.checkArray = [];
    }

    styleMethodDisabled(i) {
        let style = {};

        if (i === this.defaultCheckedArray[0]) {
            style = {
                'background-color': '#c4c9e6',
                color: '#ffffff',
            };
        } else if (i === this.defaultCheckedArray[1]) {
            style = {
                'background-color': '#c4dfd8',
                color: '#ffffff',
            };
        }
        return style;
    }

    styleMethod(i) {
        let style = {};
        if (this.checkArray.length === 1) {
            if (i !== this.checkArray[0]) {
                return;
            }
            if (this.radioValue === 'left') {
                style = {
                    'background-color': '#7e8be0',
                    color: '#ffffff',
                };
            } else if (this.radioValue === 'right') {
                style = {
                    'background-color': '#59b9a2',
                    color: '#ffffff',
                };
            } else {
                style = {
                    'background-color': '#7e8be0',
                    color: '#ffffff',
                };
            }
        } else if (this.checkArray.length === 2) {
            if (i == this.checkArray[0]) {
                style = {
                    'background-color': '#7e8be0',
                    color: '#ffffff',
                };
            } else if (i == this.checkArray[1]) {
                style = {
                    'background-color': '#59b9a2',
                    color: '#ffffff',
                };
            }
        }
        return style;
    }

    //点击 选中人员
    checkTab(i) {
        if (this.defaultCheckedArray.indexOf(i) > -1) {
            this.messageService.warning(this.translateService.instant('This option is already in the comparison list'));
            return;
        }

        if (this.radioValue !== '' && this.radioValue !== 'all') {
            this.checkArray = [];
            this.checkArray.push(i);
        } else if (this.radioValue !== '' && this.radioValue === 'all') {
            if (this.checkArray.length === 2) {
                return;
            }
            this.checkArray.push(i);
        } else {
            this.messageService.warning(this.translateService.instant('Please select a replacement'));
        }
    }

    save() {
        if (this.checkArray.length > 0) {
            if (this.lstEmpinfo === '') {
                //发展规划 人员对比冒泡逻辑
                let checkEmps = [];
                this.checkArray.forEach((itemCode) => {
                    const checkData = this.personalInfo.filter((item) => item.empcode === itemCode);
                    checkEmps.push({
                        ckEmps: checkData[0].empcode + '@$@' + checkData[0].positionid,
                    });
                });

                let defaultCheckEmps = [];
                this.defaultCheckedArray.forEach((itemCode) => {
                    const defaultCheckedData = this.personalInfo.filter((item) => item.empcode === itemCode);
                    defaultCheckEmps.push({
                        ckEmps: defaultCheckedData[0].empcode + '@$@' + defaultCheckedData[0].positionid,
                    });
                });

                if (this.radioValue === 'all') {
                    //全选只做替换操作，没有其他逻辑

                    if (checkEmps.length !== 2) {
                        this.messageService.warning(this.translateService.instant('Please select two alternatives'));
                        return;
                    }

                    const emps = [checkEmps[0].ckEmps, checkEmps[1].ckEmps];
                    const rtnParam = {
                        compareCountArray: [],
                        emps: emps,
                    };
                    this.drawerRef.close(JSON.stringify(rtnParam));
                } else {
                    if (this.radioValue === 'left') {
                        this.compareCountArray.push(this.defaultCheckedArray[1]);
                    } else if (this.radioValue === 'right') {
                        this.compareCountArray.push(this.defaultCheckedArray[0]);
                    }

                    let emps = [];
                    if (this.radioValue === 'left') {
                        emps = [checkEmps[0].ckEmps, defaultCheckEmps[1].ckEmps];
                    } else if (this.radioValue === 'right') {
                        emps = [defaultCheckEmps[0].ckEmps, checkEmps[0].ckEmps];
                    } else {
                        emps = [checkEmps[0].ckEmps, checkEmps[1].ckEmps];
                    }
                    const rtnParam = {
                        compareCountArray: this.compareCountArray,
                        emps: emps,
                    };

                    this.drawerRef.close(JSON.stringify(rtnParam));
                }
            } else {
                //人才盘点、评估中心逻辑

                let checkEmps = [];
                this.checkArray.forEach((itemCode) => {
                    const checkData = this.personalInfo.filter((item) => item.empcode === itemCode);
                    checkEmps.push({
                        ckEmps: checkData[0].positionid,
                    });
                });

                let emps = [];
                let defaultCheckEmps = [];
                this.defaultCheckedArray.forEach((itemCode) => {
                    const defaultCheckedData = this.personalInfo.filter((item) => item.empcode === itemCode);
                    defaultCheckEmps.push({
                        ckEmps: defaultCheckedData[0].positionid,
                    });
                });

                if (this.radioValue === 'left') {
                    emps = [checkEmps[0].ckEmps, defaultCheckEmps[1].ckEmps];
                    this.compareCountArray.push(this.defaultCheckedArray[1]);
                } else if (this.radioValue === 'right') {
                    emps = [defaultCheckEmps[0].ckEmps, checkEmps[0].ckEmps];
                    this.compareCountArray.push(this.defaultCheckedArray[0]);
                } else {
                    emps = [checkEmps[0].ckEmps, checkEmps[1].ckEmps];
                }

                const rtnParam = {
                    compareCountArray: this.compareCountArray,
                    emps: emps,
                };
                this.drawerRef.close(JSON.stringify(rtnParam));
            }
        } else {
            this.messageService.warning(this.translateService.instant('Please select a replacement'));
        }
    }

    sortData(a, b) {
        return b.winCount - a.winCount;
    }
    //计算每个胜利者胜利次数
    totalCount(array: string[]) {
        let map = {};
        //循环查找
        for (let i = 0; i < array.length; i++) {
            //数组里的i个元素
            var v = array[i];
            //将数组的i个元素作为map对象的属性查看其属性值
            var counts = map[v];
            //如果map对象没有该属性，则设置该属性的值为1，有的话在其基础上再+1
            if (counts) {
                map[v] += 1;
            } else {
                map[v] = 1;
            }
        }

        let arr = [];

        for (let i in map) {
            arr.push({
                empCode: i,
                winCount: map[i],
            });
        }

        return arr;
    }

    cancel() {
        this.checkArray = [];
    }
}
