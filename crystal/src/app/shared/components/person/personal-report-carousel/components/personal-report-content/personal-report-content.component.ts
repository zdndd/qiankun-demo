import {
    Component,
    OnInit,
    Input,
    ViewChild,
    ViewContainerRef,
    ComponentFactory,
    ComponentFactoryResolver,
    ComponentRef,
    OnChanges,
    SimpleChanges,
    AfterContentInit,
} from '@angular/core';

import { InfoCardComponent } from '../../../components/info-card/info-card.component';
import { EducationComponent } from '../../../components/education/education.component';
import { InfoWorkComponent } from '../../../components/info-work/info-work.component';
import { NineTableComponent } from '../../../components/nine-table/nine-table.component';
import { ChartCapabilityStudiesComponent } from '../../../components/chart-capability-studies/chart-capability-studies.component';
import { BoxplotComponent } from '../../../components/boxplot/boxplot.component';
import { LineAndBarComponent } from '../../../components/line-and-bar/line-and-bar.component';
import { ChartLineBarComponent } from '../../../components/chart-line-bar/chart-line-bar.component';
import { ActivatedRoute } from '@angular/router';

const dynamicComponents = {
    1: InfoCardComponent,
    2: EducationComponent,
    3: InfoWorkComponent,
    4: NineTableComponent, //九宫格
    5: ChartCapabilityStudiesComponent, //能力分析
    6: BoxplotComponent, //动力分析
    7: LineAndBarComponent, //潜力分析
    8: ChartLineBarComponent, //绩效
};

@Component({
    selector: 'personal-report-content',
    templateUrl: './personal-report-content.component.html',
    styleUrls: ['./personal-report-content.component.less'],
})
export class PersonalReportContentComponent implements OnInit, OnChanges, AfterContentInit {
    @Input() item;
    @Input() personalInfo = {};
    @Input() empCode: string;
    @Input() class: string = '';

    component: ComponentRef<any>;
    compFactory: ComponentFactory<any>;
    interval;

    @ViewChild('componentHost', { read: ViewContainerRef, static: true })
    componentHost: ViewContainerRef;

    constructor(public componentFactoryResolver: ComponentFactoryResolver, private route: ActivatedRoute) {}

    ngOnInit() {}

    ngAfterContentInit() {
        this.init();
    }
    init() {
        this.compFactory = this.componentFactoryResolver.resolveComponentFactory(
            dynamicComponents[this.item.charttype],
        );
        this.component = this.componentHost.createComponent(this.compFactory);
        if (this.item.charttype == 1) {
            this.component.instance.personalInfo = this.personalInfo;
            this.component.instance.getData();
        } else {
            let params = {
                empCode: this.empCode,
            };
            console.log('只有敏捷建模一个模块', params);
        }
    }

    ngOnChanges(changes: SimpleChanges) {}

    ngOnDestroy() {
        if (this.component) this.component.destroy();
    }
}
