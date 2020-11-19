import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainLayoutComponent } from './main/layout.component';
import { SubLayoutComponent } from './sub/layout.component';

import { RouterModule } from '@angular/router';
import { NgZorroAntdModule, NZ_I18N, zh_CN } from 'ng-zorro-antd';
import { SharedModule } from '../../../shared/shared.module';
import { HomeService } from '../home/service/home.service';
import { DetailService } from '../detail/detail.service';

@NgModule({
    imports: [CommonModule, RouterModule, SharedModule, NgZorroAntdModule],
    declarations: [MainLayoutComponent, SubLayoutComponent],
    exports: [MainLayoutComponent, SubLayoutComponent],
    providers: [HomeService, DetailService]
})
export class LayoutModule {}
