import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
@Component({
    selector: 'crystal-slider',
    templateUrl: './crystal-slider.component.html',
    styleUrls: ['./crystal-slider.component.less'],
})
export class CrystalSliderComponent implements OnInit, OnDestroy {
    @Input() userInfo;

    isShowMenu = false;
    isShowAgile = false;
    isShowLearnMap = false;
    isShowCourseDesign = false;
    isShowMenuUser = false;
    isShowMenuOC = false;
    isShowAssessmentCenter = false;
    isShowSuccessionCenter = false;
    isShowQualityDictionary = false;
    isShowDevelScheme = false;
    //岗位胜任力菜单是否高亮
    isCompetencyActive = false;
    routerEvent: Subscription;

    constructor(private authService: AuthService, private router: Router) {}

    ngOnInit() {
        this.isCompetencyActive = this.router.url.startsWith('/oc');
        this.routerEvent = this.router.events.subscribe((data) => {
            if (data instanceof NavigationEnd) {
                if (data.url.startsWith('/oc')) {
                    this.isCompetencyActive = true;
                } else {
                    this.isCompetencyActive = false;
                }
            }
        });
        this.isShowNav();
    }

    isShowNav() {
        this.authNav('home');
        this.authNav('agile-modeling');
        this.authNav('learnMap');
        this.authNav('course-design');
        this.authNav('oc');
        this.authNav('assessment-center');
        this.authNav('succession');
        this.authNav('quality-dictionary');
        this.authNav('devel-scheme');
    }

    authNav(str: string) {
        let nodeId: any;
        switch (str) {
            case 'home':
                //人才盘点
                nodeId = 1001;
                this.isShowMenu = this.authService.isAuthNode(nodeId);
                break;
            case 'agile-modeling':
                //敏捷建模
                nodeId = 1002;
                this.isShowAgile = this.authService.isAuthNode(nodeId);
                break;
            case 'learnMap':
                //学习地图
                nodeId = 1003;
                this.isShowLearnMap = this.authService.isAuthNode(nodeId);
                break;
            case 'course-design':
                //课程设计
                nodeId = 1005;
                this.isShowCourseDesign = this.authService.isAuthNode(nodeId);
                break;
            case 'oc':
                //岗位胜任力
                nodeId = 1006;
                this.isShowMenuOC = this.authService.isAuthNode(nodeId);
                break;
            case 'assessment-center':
                //评估中心
                nodeId = 1007;
                this.isShowAssessmentCenter = this.authService.isAuthNode(nodeId);
                break;
            case 'succession':
                //继任规划
                nodeId = 1013;
                this.isShowSuccessionCenter = this.authService.isAuthNode(nodeId);
                break;
            case 'quality-dictionary':
                //素质字典
                nodeId = 1014;
                this.isShowQualityDictionary = this.authService.isAuthNode(nodeId);
                break;
            case 'devel-scheme':
                //继任规划
                nodeId = 1015;
                this.isShowDevelScheme = this.authService.isAuthNode(nodeId);
                break;
        }
    }

    ngOnDestroy() {
        if (this.routerEvent != null) {
            this.routerEvent.unsubscribe();
        }
    }
}
