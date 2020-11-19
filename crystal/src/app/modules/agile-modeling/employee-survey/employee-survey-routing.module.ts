import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AnswerDataComponent } from './pages/answer-data/answer-data.component';
import { ConclusionComponent } from './pages/conclusion/conclusion.component';
import { IfMatrixComponent } from './pages/if-matrix/if-matrix.component';
import { IfStatisticsComponent } from './pages/if-statistics/if-statistics.component';
import { QuestionnaireComponent } from './pages/questionnaire/questionnaire.component';
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
                path: 'questionnaire',
                component: QuestionnaireComponent,
            },
            {
                path: 'if-statistics',
                component: IfStatisticsComponent,
            },
            {
                path: 'if-matrix',
                component: IfMatrixComponent,
            },
            {
                path: 'answer-data',
                component: AnswerDataComponent,
            },
            { path: '', redirectTo: 'questionnaire', pathMatch: 'full' },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class EmployeeSurveyRoutingModule {}
