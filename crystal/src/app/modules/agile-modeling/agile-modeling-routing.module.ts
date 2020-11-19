import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main/layout.component';
import { PageGuard } from '@app/core/agile-modeling.guard';

const routes: Routes = [
    {
        path: '',
        component: MainLayoutComponent,
        children: [
            {
                path: '',
                loadChildren: './home/home.module#HomeModule',
            },
            {
                path: 'model/:modelid',
                canActivate: [PageGuard],
                data: { pageid: 100202 },
                children: [
                    {
                        path: 'no-modeling', //未设置模型首页
                        loadChildren: './no-modeling/no-modeling.module#NoModelingModule',
                    },
                    {
                        path: 'home', //能力模型首页
                        loadChildren: './detail/detail.module#DetailModule',
                    },
                    {
                        path: 'leader-interview', //领导访谈
                        loadChildren: './leader-interview/leader-interview.module#LeaderInterviewModule',
                    },
                    {
                        path: 'ability-comparison', //能力比较
                        loadChildren: './ability-comparison/ability-comparison.module#AbilityComparisonModule',
                    },
                    {
                        path: 'employee-survey', //员工调研
                        loadChildren: './employee-survey/employee-survey.module#EmployeeSurveyModule',
                    },
                    {
                        path: 'task-analysis', //任务分析
                        loadChildren: './task-analysis/task-analysis.module#TaskAnalysisModule',
                    },
                    { path: '', redirectTo: 'home', pathMatch: 'full' },
                ],
            },
            {
                path: '',
                redirectTo: 'home',
                pathMatch: 'full',
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    declarations: [],
    exports: [RouterModule],
})
export class AgileModelingRoutingModule {}
