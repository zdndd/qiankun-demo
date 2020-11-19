import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConclusionComponent } from './pages/conclusion/conclusion.component';
import { ParetoReturnComponent } from './pages/pareto-return/pareto-return.component';
import { WorkTaskAnalysisComponent } from './pages/work-task-analysis/work-task-analysis.component';

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
                path: 'pareto-return',
                component: ParetoReturnComponent,
            },
            {
                path: 'work-task-analysis',
                component: WorkTaskAnalysisComponent,
            },
            { path: '', redirectTo: 'work-task-analysis', pathMatch: 'full' },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class TaskAnalysisRoutingModule {}
