import {
    Directive,
    NgZone,
    ElementRef,
    HostListener,
    Input,
    AfterContentInit,
    OnChanges,
    SimpleChanges,
    ChangeDetectorRef,
} from '@angular/core';
import { ScrollBarHelper } from '../../utils/scrollbar-helper';
import { ContentObserver } from '@angular/cdk/observers';
import { coerceBooleanProperty, coerceNumberProperty } from '@angular/cdk/coercion';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { NzTableComponent } from 'ng-zorro-antd';

import {
    Platform,
    supportsPassiveEventListeners,
    getSupportedInputTypes,
} from '@angular/cdk/platform';

@Directive({
    selector: '[pretty-table]',
    host: {},
})
export class PrettyTableDirective implements AfterContentInit, OnChanges {
    private _scrollBar = null;
    private _currentSubscription: Subscription | null = null;
    @Input() nzScroll = null;
    @HostListener('window:resize', ['$event'])
    onwindowResize(event) {
        setTimeout(() => {
            this.setTableScrollHeight();
        }, 100);
    }

    constructor(
        public plat: Platform,
        public tableComponent: NzTableComponent,
        private _contentObserver: ContentObserver,
        public elementRef: ElementRef,
        private _ngZone: NgZone,
        private changeDetectorRef: ChangeDetectorRef,
    ) {}

    ngAfterViewInit() {
        let elHeight = this.elementRef.nativeElement.parentNode.clientHeight;
    }
    ngOnChanges(changes: SimpleChanges): void {
        this.setTableScrollHeight();
    }

    ngAfterContentInit() {
        this.tableComponent.nzScroll = this.mergeScroll({ x: null, y: '100px' });
        this.setTableScrollHeight();
        if (!this._currentSubscription) {
            this._subscribe();
        }
    }

    mergeScroll(obj) {
        const newObj = { ...obj, ...this.nzScroll };
        return newObj;
    }

    setTableScrollHeight() {
        let elHeight = this.elementRef.nativeElement.parentNode.clientHeight;
        let headerHeight = 36;
        if (this.elementRef.nativeElement.querySelector('.ant-table-thead') != null) {
            headerHeight =
                this.elementRef.nativeElement.querySelector('.ant-table-thead').clientHeight ||
                headerHeight;
        }
        const scrollHeight = elHeight - headerHeight;
        let elWidth = this.elementRef.nativeElement.parentNode.clientWidth;
        this.tableComponent.nzScroll = this.mergeScroll({
            x: elWidth + 'px',
            y: scrollHeight + 'px',
        });
        this.updateScrollbar();
    }
    scrollbarInit() {
        const ele = this.elementRef.nativeElement.querySelector('.ant-table-body');
        if (ele) {
            // fiexd, 当虚拟滚动消失后还可以滚动的bug,使用上下滚动赋值取消这个问题
            ele.scrollTop = 1;
            ele.scrollTop = 0;
        }
    }
    updateScrollbar() {
        setTimeout(() => {
            if (this._scrollBar) {
                this._scrollBar.update();
            } else {
                if (this.elementRef.nativeElement.querySelector('.ant-table-body')) {
                    this._scrollBar = ScrollBarHelper.makeScrollbar(
                        this.elementRef.nativeElement.querySelector('.ant-table-body'),
                    );
                }
            }
        }, 100);
    }

    private _subscribe() {
        this._unsubscribe();
        const stream = this._contentObserver.observe(this.elementRef);
        this._ngZone.runOutsideAngular(() => {
            this._currentSubscription = (100 ? stream.pipe(debounceTime(100)) : stream).subscribe(
                () => {
                    this.updateScrollbar();
                },
            );
        });
    }

    private _unsubscribe() {
        if (this._currentSubscription) {
            this._currentSubscription.unsubscribe();
        }
    }

    ngOnDestroy() {
        if (this._scrollBar) {
            this._scrollBar.destroy();
            this._scrollBar = null;
        }
        this._unsubscribe();
    }
}
