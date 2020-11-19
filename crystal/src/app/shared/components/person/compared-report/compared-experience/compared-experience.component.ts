import {
    Component,
    ChangeDetectorRef,
    OnInit,
    Input,
    OnChanges,
    SimpleChanges,
    ComponentFactoryResolver,
} from '@angular/core';
import { DataState } from '@app/constants/app.constants';
@Component({
    selector: 'compared-experience',
    templateUrl: './compared-experience.component.html',
    styleUrls: ['./compared-experience.component.less'],
})
export class ComparedExperienceComponent implements OnInit, OnChanges {
    pageState: number = 0;
    itemHeight: number = 32; //条形图高度
    @Input() data = [];
    constructor(public componentFactoryResolver: ComponentFactoryResolver, public cd: ChangeDetectorRef) {}

    ngOnInit() {}
    ngOnChanges(changes: SimpleChanges) {
        if (changes.data && !changes.data.firstChange) {
            this.loadData();
        } else {
            this.pageState = 2;
        }
    }
    loadData() {
        const data = this.data;
        if (data && data.length > 0) {
            this.pageState = 1;
            if (data.length < 6) {
                this.itemHeight = 50;
            }
        } else {
            this.pageState = 2;
        }
        this.cd.detectChanges;
    }
}
