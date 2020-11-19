import { Component, OnInit } from "@angular/core";

import { assetUrl } from "src/single-spa/asset-url";

@Component({
  selector: "topbar",
  templateUrl: "./topbar.component.html",
  styleUrls: ["./topbar.component.less"],
})
export class TopbarComponent implements OnInit {
  logoImg = assetUrl("/img/logo.png");

  constructor() {}

  ngOnInit() {}

  toggleCollapsed(): void {}

  logout() {}

  popupPassword() {}

  changeLanguage(lang) {}

  saveUserAvatar(avatarUrl) {}

  openPhotoCroppieDialog() {}

  reviewPdf() {}

  private getCurrentModule(url: string) {}
}
