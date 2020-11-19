import { Component, OnInit, Input, OnDestroy } from "@angular/core";

import { Router, NavigationEnd } from "@angular/router";
import { Subscription } from "rxjs";
@Component({
  selector: "crystal-slider",
  templateUrl: "./crystal-slider.component.html",
  styleUrls: ["./crystal-slider.component.less"],
})
export class CrystalSliderComponent implements OnInit, OnDestroy {
  @Input() userInfo;

  isShowMenu = false;
  isShowAgile = false;
  isShowLearnMap = false;
  isShowCourseDesign = false;
  isShowMenuUser = false;
  isShowMenuOC = false;
  isShowAssessmentCenter = true;
  isShowSuccessionCenter = true;
  isShowQualityDictionary = true;
  isShowDevelScheme = false;
  //岗位胜任力菜单是否高亮
  isCompetencyActive = false;
  routerEvent: Subscription;

  constructor(private router: Router) {}

  ngOnInit() {
    this.isCompetencyActive = this.router.url.startsWith("/oc");
    this.routerEvent = this.router.events.subscribe((data) => {
      if (data instanceof NavigationEnd) {
        if (data.url.startsWith("/oc")) {
          this.isCompetencyActive = true;
        } else {
          this.isCompetencyActive = false;
        }
      }
    });
    this.isShowNav();
  }

  isShowNav() {
    this.authNav("home");
    this.authNav("agile-modeling");
    this.authNav("learnMap");
    this.authNav("course-design");
    this.authNav("oc");
    this.authNav("assessment-center");
    this.authNav("succession");
    this.authNav("quality-dictionary");
    this.authNav("devel-scheme");
  }

  authNav(str: string) {
    let nodeId: any;
    switch (str) {
      case "home":
        //人才盘点
        nodeId = 1001;

        break;
      case "agile-modeling":
        //敏捷建模
        nodeId = 1002;

        break;
      case "learnMap":
        //学习地图
        nodeId = 1003;

        break;
      case "course-design":
        //课程设计
        nodeId = 1005;

        break;
      case "oc":
        //岗位胜任力
        nodeId = 1006;

        break;
      case "assessment-center":
        //评估中心
        nodeId = 1007;

        break;
      case "succession":
        //继任规划
        nodeId = 1013;

        break;
      case "quality-dictionary":
        //素质字典
        nodeId = 1014;

        break;
      case "devel-scheme":
        //继任规划
        nodeId = 1015;

        break;
    }
  }

  ngOnDestroy() {
    if (this.routerEvent != null) {
      this.routerEvent.unsubscribe();
    }
  }
}
