import { Component, OnInit } from "@angular/core";
import { GlobalEvent } from "./core/service/global-event.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.less"],
})
export class AppComponent implements OnInit {
  constructor(public globalEvent: GlobalEvent) {}
  ngOnInit() {
    console.log("-----------------haha");
    this.globalEvent.on("app", (e) => {
      console.log("-----------------haha2");
      console.log(e);
    });
  }
}
