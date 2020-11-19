import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ComparedReportComponent } from './compared-report.component';
const routes: Routes = [
    {
        path: '',
        component: ComparedReportComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ComparedReportRoutingModule {}
