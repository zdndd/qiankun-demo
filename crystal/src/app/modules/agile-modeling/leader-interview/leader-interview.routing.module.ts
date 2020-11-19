import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DynamicTableComponent } from './pages/dynamic-table/dynamic-table.component';
import { ConclusionComponent } from './pages/conclusion/conclusion.component';
import { ComparativeAnalysisComponent } from './pages/comparative-analysis/comparative-analysis.component';
import { SubLayoutComponent } from '../layout/sub/layout.component';

const routes: Routes = [
    {
        path: '',
        component: SubLayoutComponent,
        children: [
            {
                path: 'conclusion',
                component: ConclusionComponent,
            },
            {
                path: 'comparative-analysis',
                component: ComparativeAnalysisComponent,
            },
            {
                path: 'kind/:id',
                component: DynamicTableComponent,
            },
            { path: '', redirectTo: 'kind/2', pathMatch: 'full' },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class LeaderInterviewRoutingModule {}
