import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DetailComponent } from './detail.component';
import { DetailService } from './detail.service';

const routes: Routes = [
    {
        path: 'details',
        component: DetailComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [DetailService],
})
export class DetailRoutingModule {}
