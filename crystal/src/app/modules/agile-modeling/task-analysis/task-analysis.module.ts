import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { ObserversModule } from '@angular/cdk/observers';
import { LayoutModule } from '@angular/cdk/layout';
import { ScrollDispatchModule } from '@angular/cdk/scrolling';
import { PlatformModule } from '@angular/cdk/platform';

import { SharedModule } from '../../../shared/shared.module';
import { TaskAnalysisRoutingModule } from './task-analysis-routing.module';

import { ConclusionComponent } from './pages/conclusion/conclusion.component';
import { ParetoReturnComponent } from './pages/pareto-return/pareto-return.component';
import { WorkTaskAnalysisComponent } from './pages/work-task-analysis/work-task-analysis.component';
import { LayoutModule as SLayoutModule } from '../layout/layout.module';
import { ComponentModule } from '../components/component.module';
import { SelectAbilityComponent } from '../components/select-ability/select-ability.component';

@NgModule({
    imports: [
        SharedModule,
        PortalModule,
        ScrollDispatchModule,
        OverlayModule,
        PlatformModule,
        LayoutModule,
        SLayoutModule,
        TaskAnalysisRoutingModule,
        ObserversModule,
        DragDropModule,
        ComponentModule
    ],
    declarations: [ConclusionComponent, ParetoReturnComponent, WorkTaskAnalysisComponent],
    entryComponents: [SelectAbilityComponent],
    providers: [],
    exports: [],
})
export class TaskAnalysisModule {}
