import { Component, OnDestroy, OnInit, Input } from '@angular/core';

@Component({
    selector: 'state-icon',
    templateUrl: './state-icon.component.html',
    preserveWhitespaces: false,
    styleUrls: ['./state-icon.component.less'],
})
export class StateIconComponent implements OnInit, OnDestroy {
    //页面状态 0请求中；1显示数据 ；2空数据; 3点击查看描述内容
    @Input() state: number = 0;
    @Input() title: string;

    imgUrl = 'assets/img/ic-empty.png';
    desimgUrl = '';
    constructor() {}

    ngOnInit() {}

    ngAfterViewInit() {}
    ngAfterContentInit() {}

    ngOnDestroy() {}
}
