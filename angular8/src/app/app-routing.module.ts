import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { TopbarComponent } from "./layout/topbar/topbar.component";
const routes: Routes = [
  {
    path: "angular8",
    component: TopbarComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
