import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import { NgZorroAntdModule, NZ_I18N, zh_CN } from 'ng-zorro-antd';
import { SharedModule } from '../../../shared/shared.module';

import { ConclusionInnerTopComponent } from './conclusion-inner-top/conclusion-inner-top.component';
import { ConclusionCommonComponent } from './conclusion-common/conclusion-common.component';
import { ChartDoughnutComponent } from './chart-doughnut/chart-doughnut.component';
import { ChartBarComponent } from './chart-bar/chart-bar.component';
import { ChartScatterComponent } from '../components/chart-scatter/chart-scatter.component';
import { ChartParetoComponent } from '../components/chart-pareto/chart-pareto.component';
import { SelectAbilityComponent } from './select-ability/select-ability.component';
import { CmpService } from './service/component.service';
import { SelectAbilityFinalConclusionComponent } from './select-ability-final-conclusion/select-ability-final-conclusion.component';
import { AbilityWeightComponent } from './ability-weight/ability-weight.component';
import { DictionarySelectionTemplateComponent } from './dictionary-selection-template/dictionary-selection-template.component';

@NgModule({
    imports: [CommonModule, RouterModule, SharedModule, NgZorroAntdModule],
    declarations: [
        SelectAbilityComponent,
        ConclusionCommonComponent,
        ConclusionInnerTopComponent,
        ChartDoughnutComponent,
        ChartBarComponent,
        ChartScatterComponent,
        ChartParetoComponent,
        SelectAbilityFinalConclusionComponent,
        AbilityWeightComponent,
        DictionarySelectionTemplateComponent,
    ],
    exports: [
        SelectAbilityComponent,
        ConclusionCommonComponent,
        ChartDoughnutComponent,
        ChartBarComponent,
        ChartScatterComponent,
        ChartParetoComponent,
    ],
    providers: [CmpService],
    entryComponents: [SelectAbilityFinalConclusionComponent, DictionarySelectionTemplateComponent],
})
export class ComponentModule {}
