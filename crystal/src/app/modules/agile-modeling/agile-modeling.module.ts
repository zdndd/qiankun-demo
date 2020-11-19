import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgileModelingRoutingModule } from './agile-modeling-routing.module';
import { LayoutModule } from './layout/layout.module';
import { SharedModule } from '../../shared/shared.module';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        LayoutModule,
        OverlayModule,
        PortalModule,
        AgileModelingRoutingModule,
    ],
    declarations: [],
    entryComponents: [],
})
export class AgileModelingModule {}
