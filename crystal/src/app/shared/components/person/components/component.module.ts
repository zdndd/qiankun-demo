import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { ReportPersonCardComponent } from './report-person-card/report-person-card.component';
import { ChartLineBarComponent } from './chart-line-bar/chart-line-bar.component';
import { NineTableComponent } from './nine-table/nine-table.component';
import { StateIconComponent } from './state-icon/state-icon.component';
import { EchartModule } from '@shared/components/sv-echart/echart.module';
import { InfoCardComponent } from './info-card/info-card.component';
import { ComparedReportContentComponent } from './compared-report-content/compared-report-content.component';
import { InfoWorkComponent } from './info-work/info-work.component';
import { EducationComponent } from './education/education.component';
import { ChartCapabilityStudiesComponent } from './chart-capability-studies/chart-capability-studies.component';
import { BoxplotComponent } from './boxplot/boxplot.component';
import { LineAndBarComponent } from './line-and-bar/line-and-bar.component';

const allCmp = [
    EducationComponent,
    InfoWorkComponent,
    ComparedReportContentComponent,
    InfoCardComponent,
    NineTableComponent,
    StateIconComponent,
    ChartLineBarComponent,
    ReportPersonCardComponent,
    ChartCapabilityStudiesComponent,
    BoxplotComponent,
    LineAndBarComponent,
];

@NgModule({
    imports: [TranslateModule, CommonModule, RouterModule, NgZorroAntdModule, EchartModule],
    declarations: [...allCmp],
    exports: [...allCmp],
    providers: [],
    entryComponents: [...allCmp],
})
export class ComponentModule {}
