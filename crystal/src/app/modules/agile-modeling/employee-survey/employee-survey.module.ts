import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { ObserversModule } from '@angular/cdk/observers';
import { LayoutModule } from '@angular/cdk/layout';
import { ScrollDispatchModule } from '@angular/cdk/scrolling';
import { PlatformModule } from '@angular/cdk/platform';

import { LayoutModule as SLayoutModule } from '../layout/layout.module';

import { SharedModule } from '../../../shared/shared.module';
import { EmployeeSurveyRoutingModule } from './employee-survey-routing.module';

import { AnswerDataComponent } from './pages/answer-data/answer-data.component';
import { ConclusionComponent } from './pages/conclusion/conclusion.component';
import { IfMatrixComponent } from './pages/if-matrix/if-matrix.component';
import { IfStatisticsComponent } from './pages/if-statistics/if-statistics.component';
import { QuestionnaireComponent } from './pages/questionnaire/questionnaire.component';
import { ComponentModule } from '../components/component.module';
import { SelectAbilityComponent } from '../components/select-ability/select-ability.component';
import { GenerateLinkComponent } from './modal/generate-link/generate-link.component';

@NgModule({
    imports: [
        SharedModule,
        PortalModule,
        ScrollDispatchModule,
        OverlayModule,
        PlatformModule,
        LayoutModule,
        SLayoutModule,
        EmployeeSurveyRoutingModule,
        ObserversModule,
        DragDropModule,
        ComponentModule,
    ],
    declarations: [
        AnswerDataComponent,
        GenerateLinkComponent,
        ConclusionComponent,
        IfMatrixComponent,
        IfStatisticsComponent,
        QuestionnaireComponent,
        // ChartHeartbeatComponent,
        // ComponentModule,
    ],
    entryComponents: [SelectAbilityComponent, GenerateLinkComponent],
    providers: [],
    exports: [],
})
export class EmployeeSurveyModule {}
