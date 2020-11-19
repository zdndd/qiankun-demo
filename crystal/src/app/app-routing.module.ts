import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TopbarComponent } from './layout/topbar/topbar.component';
import { AuthGuardService } from './core/auth-guard.service';
import { NavService } from './core/nav.service';

const routes: Routes = [
    {
        path: 'crystal',
        component: TopbarComponent,
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
