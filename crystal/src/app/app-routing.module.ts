import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TopbarComponent } from './layout/topbar/topbar.component';

const routes: Routes = [
    {
        path: 'crystal',
        component: TopbarComponent,
        children: [
            {
                path: 'agile-modeling',
                loadChildren: () =>
                    import('./modules/agile-modeling/agile-modeling.module').then((m) => m.AgileModelingModule),
            },
            {
                path: '',
                loadChildren: () => import('./modules/demo/demo.module').then((m) => m.DemoModule),
            },
        ],
    },
    { path: 'auth', loadChildren: './modules/auth/auth.module#AuthModule' },
    { path: '**', redirectTo: '' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
