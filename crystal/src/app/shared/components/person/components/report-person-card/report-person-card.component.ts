import { ChangeDetectorRef, Component, Input, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NzMessageService } from 'ng-zorro-antd';

export interface PersonalInfo {
    empname: string;
    empcode: string;
    orgname: string;
    positionname: string;
    updatetime: string;
    headimg?: string;
}

@Component({
    selector: 'report-person-card',
    templateUrl: './report-person-card.component.html',
    styleUrls: ['./report-person-card.component.less'],
})
export class ReportPersonCardComponent {
    photo = 'assets/img/default-avatar@2x.png';

    /**
     * 控制刷新按钮显示
     */
    @Input() showRefresh = false;

    @Input() backgroundColor = '#7e8be0';

    @Input() personalInfo: PersonalInfo = {
        empname: '',
        empcode: '',
        orgname: '',
        positionname: '',
        updatetime: '',
        headimg: '',
    };

    /**
     * 刷新个人档案
     */
    @Output() personalReportRefresh = new EventEmitter();
    constructor(
        public cd: ChangeDetectorRef,
        public translateService: TranslateService,
        public messageService: NzMessageService,
    ) {}

    /**
     * 刷新
     */
    refresh() {
        this.personalReportRefresh.emit();
    }
}
