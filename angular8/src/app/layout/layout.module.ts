import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { NgZorroAntdModule } from "ng-zorro-antd";

import { TopbarComponent } from "./topbar/topbar.component";
import { CrystalSliderComponent } from "./crystal-slider/crystal-slider.component";
import { AssetUrlPipe } from "../../single-spa/asset-url.pipe";

@NgModule({
  imports: [CommonModule, RouterModule, NgZorroAntdModule],
  declarations: [TopbarComponent, CrystalSliderComponent, AssetUrlPipe],
  exports: [],
})
export class LayoutModule {}
