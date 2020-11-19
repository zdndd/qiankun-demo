import { Component, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, Input, HostBinding } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { TranslateService } from '@ngx-translate/core';
import { TransferItem } from './interface';
import * as _ from 'lodash';
import { AppService } from '@app/core/app.service';

@Component({
    selector: 'sv-transfer',
    templateUrl: './sv-transfer.component.html',
    host: {},
    styleUrls: ['./sv-transfer.component.less'],
})
export class SvTransferComponent implements OnInit, OnChanges {
    constructor(
        public translateService: TranslateService,
        public appService: AppService,
        public messageService: NzMessageService,
    ) {}
    @HostBinding('style.height.px')
    @Input()
    height = 350;

    @Input() dataSource: TransferItem[] = [];

    @Input() type1Select: any[] = null;

    @Input() type2Select: any[] = null;

    @Input() title = '';
    @Input() showSelectLength = false;

    @Input() showWeight = false;
    @Input() showCheckAll = true;
    @Input() isRequiredTip = false;
    @Output() type2SelectChange: EventEmitter<any> = new EventEmitter();

    @Input() isRadio = false; //是否单选 (备注 单选情况下 不能开放全选按钮,此处没做强制修改 全选显示属性 )
    isDisabled = false; //checkbox框是否禁用 暂时单选框用
    radioValue = ''; //单选值

    @Input() moveCheck: (key: any) => boolean;
    @Output() assessmentDataChange = new EventEmitter();
    @Output() assessmentClassifyChange = new EventEmitter();
    @Output() peopleDataChange = new EventEmitter();
    @Output() performanceDataChange = new EventEmitter();
    @Output() projectReviewerChange = new EventEmitter();
    // left
    leftDataSource: TransferItem[] = null;

    // right
    rightDataSource: TransferItem[] = [];

    rightGroupsData = {};

    leftBtnDisabled = false;
    rightBtnDisabled = {};

    rightGroupKeys: string[] = [];
    rightGroupNames: string[] = [];

    type1Value = '';
    type2Value = '';

    checkAll = false;

    filter = '';
    changeByType2 = false;
    leftSelectedList = [];
    @Input() getTitle: (item: any) => string = (item) => {
        if (item.title) return item.title;
        else {
            return this.translateService.instant('Selected quantity', {
                field: item.length || 0,
            });
        }
        return '';
    };
    getTitleAndSlength: (item: any) => string = (item) => {
        const selectTtxt = this.translateService.instant('Selected number', {
            field: item.length || 0,
        });
        return item.title + ` ( ${selectTtxt} )`;
    };

    ngOnChanges(changes: SimpleChanges): void {
        if ('dataSource' in changes && !changes['dataSource'].firstChange) {
            this.splitDataSource();
            this.assessmentClassifyChange.emit(this.getData());
            this.peopleDataChange.emit(this.getData());
            this.performanceDataChange.emit(this.getData());
        }
    }

    private splitDataSource(): void {
        this.leftDataSource = [];
        this.rightDataSource = [];
        this.dataSource.forEach((record) => {
            if (record.direction === 'right') {
                this.rightDataSource.push(record);
            } else {
                this.leftDataSource.push(record);
            }
        });
        if (this.type1Value) {
            this.leftDataSource.forEach((item) => {
                item._hidden = item.type1 != this.type1Value;
            });
        }

        if (this.changeByType2) {
            return;
        }
        this.rightGroupsData = _.groupBy(this.rightDataSource, (item) => {
            if (item.group) {
                return item.group.key;
            }
            return 'all';
        });
        this.rightGroupKeys = Object.keys(this.rightGroupsData);

        if (this.rightGroupKeys.length == 0) {
            this.rightGroupKeys = ['all'];
            this.rightGroupsData['all'] = [];
        }
        _.each(this.rightGroupsData, (items, key) => {
            if (key == 'all') {
                this.rightGroupNames[key] = '';
                this.rightBtnDisabled[key] = true;
            } else {
                this.rightGroupNames[key] = items[0].group.title;
                this.rightBtnDisabled[key] = true;
                if (items.length == 1) {
                    if (items[0].key == items[0].group.key && items[0].title == items[0].group.title) {
                        this.rightGroupsData[key] = [];
                    }
                }
            }
        });
        this.leftBtnDisabled = true;
        this.dealRadioStatus();
    }

    onLeftSelectChange() {
        setTimeout(() => {
            const selectedList = this.leftDataSource.filter((item) => item.checked === true && !item._hidden);
            this.leftSelectedList = selectedList;
            if (this.isRadio) {
                if (selectedList.length === 1) {
                    this.radioValue = selectedList[0].key;
                } else if (selectedList.length > 1) {
                    this.leftDataSource = this.leftDataSource.map((item) => {
                        if (this.radioValue === item.key) {
                            item.checked = false;
                        }
                        return item;
                    });
                    this.radioValue = this.leftDataSource.filter(
                        (item) => item.checked === true && !item._hidden,
                    )[0].key;
                }
            }
            this.leftBtnDisabled = selectedList.length === 0;
            if (this.leftDataSource.length > 0 && this.leftDataSource.length === selectedList.length) {
                this.checkAll = true;
            } else {
                this.checkAll = false;
            }
        });
    }

    onRightSelectChange(groupname) {
        setTimeout(() => {
            const selectedList = this.rightGroupsData[groupname].filter((item) => {
                return item.key != groupname && item.checked;
            });
            this.rightBtnDisabled[groupname] = selectedList.length == 0;
        });
    }

    ngOnInit() {
        if (this.type1Select && this.type1Select.length > 0) {
            this.type1Value = this.type1Select[0].value;
        }

        if (this.type2Select && this.type2Select.length > 0) {
            this.type2Value = this.type2Select[0].value;
        }

        if (!this.leftDataSource) this.splitDataSource();
    }

    moveToRight(targetGroup) {
        // console.log(targetGroup);
        const userInfo = this.appService.getUserInfo();
        let isSelectedUser = false;
        _.forEach(this.leftSelectedList, (item) => {
            if (item.key === userInfo['userid']) {
                isSelectedUser = true;
            }
        });
        if (targetGroup === 'manager' && isSelectedUser) {
            this.messageService.warning(this.translateService.instant('The creator is already a admin'));
            return false;
        }

        if (typeof this.moveCheck != 'undefined') {
            if (!this.moveCheck(targetGroup)) {
                return;
            }
        }
        const moveList = this.leftDataSource.filter((item) => item.checked === true);
        moveList.forEach((item) => {
            const index = this.leftDataSource.indexOf(item);
            if (index >= 0) {
                const deleteItems = this.leftDataSource.splice(index, 1);
                if (deleteItems.length > 0) {
                    deleteItems[0].checked = false;
                    deleteItems[0].direction = 'right';
                    this.rightGroupsData[targetGroup].push(...deleteItems);
                }
            }
        });
        this.onLeftSelectChange();
        this.hasAssessmentData();
        this.hasProjectReviewer();
        this.dealRadioStatus();
    }

    dealRadioStatus() {
        if (this.isRadio && this.rightGroupsData['all'].length > 0) {
            this.isDisabled = true;
        } else {
            this.isDisabled = false;
        }
    }

    moveToLeft(targetGroup) {
        // console.log(targetGroup);
        let items = this.rightGroupsData[targetGroup].slice(0);
        items = items.filter((item) => {
            return item.key != targetGroup && item.checked;
        });
        // console.log(items);
        if (items.length > 0) {
            items = items.map((item) => {
                return Object.assign(item, { checked: false, direction: 'left' });
            });
            this.leftDataSource.push(...items);
            this.rightGroupsData[targetGroup] = this.rightGroupsData[targetGroup].filter((item) => {
                const isExist = items.find((element) => {
                    return item.key == element.key;
                });
                return !isExist;
            });
            this.filterLeft();
        }
        this.onRightSelectChange(targetGroup);
        this.hasAssessmentData();
        this.hasProjectReviewer();
        this.dealRadioStatus();
    }

    emptyGroup(groupName) {
        let items = this.rightGroupsData[groupName].slice(0);
        items = items.filter((item) => {
            return item.key != groupName;
        });
        items = items.map((item) => {
            return Object.assign(item, { checked: false, direction: 'left' });
        });
        this.leftDataSource.push(...items);
        this.rightGroupsData[groupName] = [];
        this.filterLeft();
        this.onRightSelectChange(groupName);
        this.onLeftSelectChange();
        this.hasAssessmentData();
        this.hasProjectReviewer();
        this.dealRadioStatus();
    }

    filterLeft() {
        if (this.type1Value || this.type2Value) {
            this.leftDataSource.forEach((item) => {
                if (this.type1Value && this.type2Value) {
                    item._hidden = !(item.type1 == this.type1Value && item.type2 == this.type2Value);
                } else if (this.type1Value) {
                    item._hidden = item.type1 != this.type1Value;
                } else {
                    item._hidden = false;
                }
            });
        } else {
            this.leftDataSource.forEach((item) => {
                item._hidden = this.filter.length > 0 && !this.matchFilter(this.filter, item);
            });
        }
    }

    handleType1SelectChange(event) {
        setTimeout(() => {
            this.filterLeft();
            this.onLeftSelectChange();
        }, 0);
    }

    handleType2SelectChange(event) {
        this.changeByType2 = true;
        this.type2SelectChange.emit(event);
        this.onLeftSelectChange();
    }

    handleFilter(value: string) {
        this.filter = value;
        this.leftDataSource.forEach((item) => {
            item._hidden = value.length > 0 && !this.matchFilter(value, item);
        });
        this.onLeftSelectChange();
    }

    private matchFilter(text: string, item: TransferItem): boolean {
        return item.title.includes(text);
    }

    ngOnDestroy(): void {}

    onHandleSelectAll(status: boolean): void {
        this.leftDataSource.forEach((item) => {
            if (!item._hidden) {
                item.checked = status;
            }
        });
        this.onLeftSelectChange();
    }

    hasAssessmentData() {
        if (this.rightGroupsData['Assessment'] && this.rightGroupsData['Assessment'].length > 0) {
            this.assessmentDataChange.emit(true);
        } else {
            this.assessmentDataChange.emit(false);
        }
    }

    hasProjectReviewer() {
        if (this.rightGroupsData['projectReviewer'] && this.rightGroupsData['projectReviewer'].length > 0) {
            this.projectReviewerChange.emit(false);
        } else {
            this.projectReviewerChange.emit(true);
        }
    }

    getData() {
        return {
            left: this.leftDataSource,
            right: this.rightGroupsData,
        };
    }
}
