import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgZorroAntdModule, NZ_I18N, zh_CN } from 'ng-zorro-antd';
import { SharedModule } from '../shared/shared.module';
import { TopbarComponent } from './topbar/topbar.component';
import { CmsSliderComponent } from './cms-slider/cms-slider.component';
import { CrystalSliderComponent } from './crystal-slider/crystal-slider.component';
import { LayoutDefaultComponent } from './default/default.component';

@NgModule({
    imports: [CommonModule, RouterModule, SharedModule, NgZorroAntdModule],
    declarations: [TopbarComponent, CmsSliderComponent, CrystalSliderComponent, LayoutDefaultComponent],
    exports: [],
})
export class LayoutModule {}
