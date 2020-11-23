import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TopbarComponent } from './layout/topbar/topbar.component';

const routes: Routes = [
    {
        path: 'crystal',
        component: TopbarComponent,
    },
    { path: 'auth', loadChildren: './modules/auth/auth.module#AuthModule' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
