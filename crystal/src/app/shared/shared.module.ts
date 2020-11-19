import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { VxUiModule } from './vxui/vxui.module';
import { TranslateModule } from '@ngx-translate/core';

import { PageStateComponent } from './components/page-state/page-state.comonent';
import { SVPaginationComponent } from './components/sv-pagination/sv-pagination.component';
import { SvTransferComponent } from './components/sv-transfer/sv-transfer.component';
import { EchartModule } from './components/sv-echart/echart.module';
import { PersonalReportCarouselModule } from './components/person/personal-report-carousel/personal-report-carousel.module';
import {
    CapitalizePipe,
    PluralPipe,
    RoundPipe,
    TimingPipe,
    MomentPipe,
    CNCurrencyPipe,
    KeysPipe,
    YNPipe,
} from './pipes';

import { ContenteditableModel } from './directives/contenteditable';
import { PrettyTableDirective } from './directives/pretty-table-directive';
import { InlineEditorComponent } from './components/inline-editor/inline-editor.comonent ';
import { SafeHtmlPipe } from './pipes/safehtml.pipe';
import { CommonListComponent } from './components/common-list/common-list.component';
import { ComparedReportModule } from './components/person/compared-report/compared-report.module';
import { SliderSwitchComponent } from './components/slider-switch/slider-switch.component';
import { EmpcodeFilterPipe } from './pipes/empcode-filter.pipe';
import { AdvancedSearchComponent } from './components/advanced-search/advanced-search.component';

const PIPES = [
    CapitalizePipe,
    PluralPipe,
    RoundPipe,
    TimingPipe,
    MomentPipe,
    CNCurrencyPipe,
    KeysPipe,
    YNPipe,
    CommonListComponent,
    SliderSwitchComponent,
    EmpcodeFilterPipe,
];

@NgModule({
    imports: [
        PersonalReportCarouselModule,
        ComparedReportModule,
        CommonModule,
        FormsModule,
        TranslateModule,
        RouterModule,
        ReactiveFormsModule,
        NgZorroAntdModule,
        EchartModule,
        VxUiModule,
    ],
    providers: [],
    declarations: [
        ContenteditableModel,
        PrettyTableDirective,
        InlineEditorComponent,
        SafeHtmlPipe,
        PageStateComponent,
        SVPaginationComponent,
        SvTransferComponent,
        ...PIPES,
        AdvancedSearchComponent,
    ],
    exports: [
        PersonalReportCarouselModule,
        ComparedReportModule,
        TranslateModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        NgZorroAntdModule,
        VxUiModule,
        EchartModule,
        PageStateComponent,
        SvTransferComponent,
        SVPaginationComponent,
        ContenteditableModel,
        PrettyTableDirective,
        InlineEditorComponent,
        SafeHtmlPipe,
        ...PIPES,
    ],
    entryComponents: [SliderSwitchComponent, AdvancedSearchComponent],
})
export class SharedModule {}
