import {
    Component,
    ComponentRef,
    ComponentFactory,
    OnDestroy,
    Renderer2,
    OnInit,
    ElementRef,
    ViewContainerRef,
    Output,
    EventEmitter,
    Input,
    ViewChild,
    OnChanges,
    ComponentFactoryResolver,
    SimpleChanges,
} from '@angular/core';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Overlay, ViewportRuler } from '@angular/cdk/overlay';

import { switchAgileType } from 'src/app/utils/common.utils';

import { ChartOneComponent } from '../chart-one/chart-one.component';
import { ChartTwoComponent } from '../chart-two/chart-two.component';
import { ChartThreeComponent } from '../chart-three/chart-three.component';
import { ChartFourComponent } from '../chart-four/chart-four.component';
import { ChartFiveComponent } from '../chart-five/chart-five.component';
import { ChartSixComponent } from '../chart-six/chart-six.component';
import { ChartSevenComponent } from '../chart-seven/chart-seven.component';
import { ChartInfiniteComponent } from '../chart-infinite/chart-infinite.component';
import { AgileBaseChart } from '../base-chart';

import { ComponentPortal } from '@angular/cdk/portal';

const dynamicChartComponents: any = {
    One: ChartOneComponent,
    Two: ChartTwoComponent,
    Three: ChartThreeComponent,
    Four: ChartFourComponent,
    Five: ChartFiveComponent,
    Six: ChartSixComponent,
    Seven: ChartSevenComponent,
    Infinite: ChartInfiniteComponent,
};

@Component({
    selector: 'chart-content',
    templateUrl: './chart-content.component.html',
    preserveWhitespaces: false,
    styleUrls: ['./chart-content.component.less'],
})
export class ChartContentDetailComponent implements OnInit, OnDestroy, OnChanges {
    @Input() data: any = [];
    @Input() mode;
    @Output() update: EventEmitter<any> = new EventEmitter<any>();
    @Input() permissionType: number;
    currPortal: ComponentPortal<ChartOneComponent>;
    @ViewChild('componentHost', { read: ViewContainerRef, static:true }) componentHost: ViewContainerRef;

    component: ComponentRef<AgileBaseChart>;
    constructor(
        public componentFactoryResolver: ComponentFactoryResolver,
        public translateService: TranslateService,
        public overlay: Overlay,
        public router: Router,
        public renderer: Renderer2,
        public elementRef: ElementRef,
        private messageService: NzMessageService,
        public modalService: NzModalService,
        public viewportRuler: ViewportRuler,
    ) { }

    ngOnInit() {
        this.buildComponent();
    }
    buildComponent() {
        const initType = switchAgileType(this.data.length);
        this.componentHost.clear();
        if (!dynamicChartComponents[initType]) {
            const supportedTypes = Object.keys(dynamicChartComponents).join(', ');
            // return console.log('supportedTypes=', supportedTypes);
            return
        }
        const compFactory: ComponentFactory<
            any
        > = this.componentFactoryResolver.resolveComponentFactory(dynamicChartComponents[initType]);
        this.component = this.componentHost.createComponent(compFactory);
        this.component.instance.data = this.data;
        this.component.instance.viewportRuler = this.viewportRuler;
        this.component.instance.update = this.update;
        this.component.instance.mode = this.mode;
    }
    ngOnChanges(changes: SimpleChanges) {
        if (changes.data) this.buildComponent();
    }

    ngOnDestroy() {
        if (this.component) this.component.destroy();
    }
}
