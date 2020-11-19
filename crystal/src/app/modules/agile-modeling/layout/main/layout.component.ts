import {
    Component,
    OnDestroy,
    OnInit,
    Optional,
    Inject,
    HostListener,
    ViewChild,
    ViewContainerRef,
    ChangeDetectorRef,
    ElementRef,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { NzModalService } from 'ng-zorro-antd';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
    selector: 'app-home-layout',
    templateUrl: './layout.component.html',
    preserveWhitespaces: false,
    styleUrls: ['./layout.component.less'],
})
export class MainLayoutComponent implements OnInit {
    x;

    arrowShow = false;
    constructor(
        private modalSrv: NzModalService,
        public cd: ChangeDetectorRef,
        public activatedRoute: ActivatedRoute,
        public elementRef: ElementRef,
        public router: Router,
        @Optional() @Inject(DOCUMENT) private _document: any,
    ) {}

    ngOnInit() {}
}
