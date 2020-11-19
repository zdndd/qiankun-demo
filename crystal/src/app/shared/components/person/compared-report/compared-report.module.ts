import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Routes, RouterModule } from '@angular/router';
import { ComparedReportRoutingModule } from './compared-report-routing.module';
import { ComponentModule } from '../components/component.module';
import { ComparedReportComponent } from './compared-report.component';
import { ComparedExperienceComponent } from './compared-experience/compared-experience.component';
import { ComparedAbilityComponent } from './compared-ability/compared-ability.component';
// import { StateIconComponent } from '@shared/components/person/components/state-icon/state-icon.component';
import { VxUiModule } from '@shared/vxui/vxui.module';
import { CompareCandidatesDrawerComponent } from './compare-candidates-drawer/compare-candidates-drawer.component';

const allCmp = [
    // StateIconComponent,
    ComparedAbilityComponent,
    ComparedExperienceComponent,
    ComparedReportComponent,
    CompareCandidatesDrawerComponent,
];

@NgModule({
    declarations: [...allCmp],
    imports: [RouterModule, VxUiModule, TranslateModule, FormsModule, CommonModule, NgZorroAntdModule, ComponentModule],
    entryComponents: [...allCmp],
    providers: [],
    exports: [RouterModule, TranslateModule, ...allCmp],
})
export class ComparedReportModule {}
