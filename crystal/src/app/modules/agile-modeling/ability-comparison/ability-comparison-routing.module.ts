import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConclusionComponent } from './pages/conclusion/conclusion.component';
import { AbilityComparisonComponent } from './pages/ability-comparison/ability-comparison.component';
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
                path: 'ability-comparison',
                component: AbilityComparisonComponent,
            },
            { path: '', redirectTo: 'ability-comparison', pathMatch: 'full' },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AbilityComparisonRoutingModule {}
