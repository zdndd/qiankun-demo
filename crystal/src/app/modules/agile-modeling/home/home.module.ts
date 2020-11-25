import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { ObserversModule } from '@angular/cdk/observers';
import { LayoutModule } from '@angular/cdk/layout';
import { ScrollDispatchModule } from '@angular/cdk/scrolling';
import { PlatformModule } from '@angular/cdk/platform';
import { DetailModule } from 'src/app/modules/agile-modeling/detail/detail.module';

import { SharedModule } from '../../../shared/shared.module';
import { DictionaryComponent } from './dictionary/dictionary.component';
import { ModelComponent } from './model/model.component';
import { LayoutComponent } from './components/layout/layout.component';
import { HomeService } from './service/home.service';
import { DictionaryModalService } from '@app/utils/dictionary-modal.service';
import { ModelFormComponent } from './model/components/model-form/model-form.component';
import { DictionaryListComponent } from './dictionary-list/dictionary-list.component';
import { EditDictionaryModelComponent } from './components/edit-dictionary-model/edit-dictionary-model.component';
import { DictionaryDetailComponent } from './dictionary-detail/dictionary-detail.component';

const routes: Routes = [
    {
        path: 'home',
        component: LayoutComponent,
        children: [
            {
                path: 'dictionary-list',
                component: DictionaryListComponent,

                data: { pageid: 100201 },
            },
            {
                path: 'model',
                component: ModelComponent,

                data: { pageid: 100202 },
            },
            { path: '**', redirectTo: 'model' },
        ],
    },
    {
        path: 'ability-dictionary-detail/:id',
        component: DictionaryDetailComponent,

        data: { pageid: 100201 },
    },
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
    },
];

@NgModule({
    imports: [
        SharedModule,
        PortalModule,
        ScrollDispatchModule,
        OverlayModule,
        PlatformModule,
        LayoutModule,
        ObserversModule,
        DragDropModule,
        DetailModule,
        RouterModule.forChild(routes),
    ],
    declarations: [
        DictionaryComponent,
        ModelComponent,
        LayoutComponent,
        DictionaryListComponent,
        DictionaryDetailComponent,
        ModelFormComponent,
        EditDictionaryModelComponent,
    ],
    entryComponents: [ModelFormComponent, EditDictionaryModelComponent],
    providers: [HomeService, DictionaryModalService],
    exports: [],
})
export class HomeModule {}
