import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DetailComponent } from './detail.component';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { ObserversModule } from '@angular/cdk/observers';
import { LayoutModule } from '@angular/cdk/layout';
import { ScrollDispatchModule } from '@angular/cdk/scrolling';
import { PlatformModule } from '@angular/cdk/platform';

import { SharedModule } from '../../../shared/shared.module';
import { DetailRoutingModule } from './detail-routing.module';



import { ChartContentDetailComponent } from '../components/chart-content/chart-content.component';
import { ChartOneComponent } from '../components/chart-one/chart-one.component';
import { ChartTwoComponent } from '../components/chart-two/chart-two.component';
import { ChartThreeComponent } from '../components/chart-three/chart-three.component';
import { ChartFourComponent } from '../components/chart-four/chart-four.component';
import { ChartFiveComponent } from '../components/chart-five/chart-five.component';
import { ChartSixComponent } from '../components/chart-six/chart-six.component';
import { ChartSevenComponent } from '../components/chart-seven/chart-seven.component';
import { ChartInfiniteComponent } from '../components/chart-infinite/chart-infinite.component';
import { CmpService } from '../components/service/component.service';
import { ComponentModule } from '../components/component.module';
import { SelectAbilityComponent } from '../components/select-ability/select-ability.component';
import { HomeService } from '../home/service/home.service';

const chartComponetns = [
    ChartContentDetailComponent,
    ChartOneComponent,
    ChartTwoComponent,
    ChartThreeComponent,
    ChartFourComponent,
    ChartFiveComponent,
    ChartSixComponent,
    ChartSevenComponent,
    ChartInfiniteComponent,
];

@NgModule({
    imports: [
        SharedModule,
        PortalModule,
        ScrollDispatchModule,
        OverlayModule,
        PlatformModule,
        LayoutModule,
        DetailRoutingModule,
        ObserversModule,
        DragDropModule,
        ComponentModule
    ],
    declarations: [DetailComponent,
        ...chartComponetns],
    entryComponents: [
        ...chartComponetns,SelectAbilityComponent],
    providers: [CmpService,HomeService],
    exports: [...chartComponetns],
})
export class DetailModule {}
