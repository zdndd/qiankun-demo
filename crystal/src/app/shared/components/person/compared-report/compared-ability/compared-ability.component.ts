import {
    ChangeDetectorRef,
    Component,
    OnInit,
    Input,
    OnChanges,
    SimpleChanges,
    ComponentFactoryResolver,
} from '@angular/core';
import { DataState } from '@app/constants/app.constants';
@Component({
    selector: 'compared-ability',
    templateUrl: './compared-ability.component.html',
    styleUrls: ['./compared-ability.component.less'],
})
export class ComparedAbilityComponent implements OnInit, OnChanges {
    pageState: number = 0;
    wi: '70%';
    itemHeight: number = 32; //条形图高度
    @Input() data = [
        // {
        //     num1: 4.5,
        //     sum1:5,
        //     title: '倒计时福建省',
        //     num2: 4.3,
        //     sum2:5,
        // },{
        //     num1: 4.5,
        //     sum1:5,
        //     title: '倒计时福建省',
        //     num2: 4.3,
        //     sum2:5,
        // }
    ];
    constructor(public componentFactoryResolver: ComponentFactoryResolver, public cd: ChangeDetectorRef) {}

    ngOnInit() {}
    ngOnChanges(changes: SimpleChanges) {
        if (changes.data && !changes.data.firstChange) {
            this.loadData()
        } else {
            this.pageState = 2;
        };
    }
    loadData() {
        const data = this.data;
        if (data && data.length > 0) {
            this.pageState = 1;
            if (data.length < 6) {
                this.itemHeight = 40;
            }
        } else {
            this.pageState = 2;
        }
    }
}
