import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NoModelingComponent } from './no-modeling.component';
import { NoModelingService } from './noModeling.service';
const routes: Routes = [
    {
        path: '',
        component: NoModelingComponent,
    },
];

@NgModule({
    declarations: [NoModelingComponent],
    imports: [CommonModule, RouterModule.forChild(routes)],
    providers: [NoModelingService],
})
export class NoModelingModule {}
