import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { TopbarComponent } from "./layout/topbar/topbar.component";
import { DemoComponent } from "./modules/demo/demo.component";

const routes: Routes = [
  // {
  //   path: "angular8",
  //   component: TopbarComponent,
  // },
  {
    path: "angular8",
    component: TopbarComponent,
    children: [
      {
        path: "page1",
        component: DemoComponent,
      },
    ],
  },
  {
    path: "**",
    component: TopbarComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
