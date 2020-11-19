import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DynamicTableComponent } from './pages/dynamic-table/dynamic-table.component';
import { ConclusionComponent } from './pages/conclusion/conclusion.component';
import { ComparativeAnalysisComponent } from './pages/comparative-analysis/comparative-analysis.component';

import { AddColumnComponent } from './modal/add-column/add-column.component';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { ObserversModule } from '@angular/cdk/observers';
import { LayoutModule } from '@angular/cdk/layout';
import { ScrollDispatchModule } from '@angular/cdk/scrolling';
import { PlatformModule } from '@angular/cdk/platform';

import { SharedModule } from '../../../shared/shared.module';
import { LeaderInterviewRoutingModule } from './leader-interview.routing.module';

import { LayoutModule as SLayoutModule } from '../layout/layout.module';
// import { ChartHeartbeatComponent } from '../components/chart-doughnut/chart-doughnut.component';
// import { ChartScatterComponent } from '../components/chart-scatter/chart-scatter.component';
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
        ComponentModule,
        LeaderInterviewRoutingModule,
        ObserversModule,
        DragDropModule,
    ],
    declarations: [
        DynamicTableComponent,
        ComparativeAnalysisComponent,
        ConclusionComponent,
        AddColumnComponent,
        // ChartHeartbeatComponent,
        // ChartScatterComponent,
    ],
    entryComponents: [AddColumnComponent, SelectAbilityComponent],
    providers: [],
    exports: [],
})
export class LeaderInterviewModule {}
