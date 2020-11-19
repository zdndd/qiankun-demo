import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { PersonalReportCarouselComponent } from './personal-report-carousel.component';
import { ComponentModule } from '../components/component.module';
import { VxUiModule } from '@shared/vxui/vxui.module';
import { PersonalReportContentComponent } from './components/personal-report-content/personal-report-content.component';

let allCmp = [PersonalReportCarouselComponent, PersonalReportContentComponent];
@NgModule({
    declarations: [...allCmp],
    imports: [ComponentModule, VxUiModule, TranslateModule, FormsModule, NgZorroAntdModule, CommonModule],
    exports: [...allCmp],
    entryComponents: [...allCmp],
})
export class PersonalReportCarouselModule {}
