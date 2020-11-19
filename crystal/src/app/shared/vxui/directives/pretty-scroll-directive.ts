import {
    Directive,
    NgZone,
    ElementRef,
    HostListener,
    HostBinding,
    Input,
    AfterContentInit,
} from '@angular/core';
import { ScrollBarHelper } from '../../../utils/scrollbar-helper';
import { ContentObserver } from '@angular/cdk/observers';
import { coerceBooleanProperty, coerceNumberProperty } from '@angular/cdk/coercion';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import {
    Platform,
    supportsPassiveEventListeners,
    getSupportedInputTypes,
} from '@angular/cdk/platform';

@Directive({
    selector: '[pretty-scroll]',
    host: {
        '[class.pretty-scroll]': 'true',
        '[style.height.px]': 'height',
    },
})
export class PrettyScrollDirective implements AfterContentInit {
    private _disabled = false;
    private _scrollBar = null;
    private _debounce = 100;
    private _currentSubscription: Subscription | null = null;

    @Input() height = null;

    @Input()
    get debounce(): number {
        return this._debounce;
    }
    set debounce(value: number) {
        this._debounce = coerceNumberProperty(value);
        this._subscribe();
    }

    @Input()
    @HostBinding('class.pretty-scroll-disabled')
    set disabled(value: boolean) {
        this._disabled = value;
    }

    get disabled(): boolean {
        return this._disabled;
    }

    @HostListener('window:resize', ['$event'])
    onwindowResize(event) {
        this.updateScrollbar();
    }

    constructor(
        public plat: Platform,
        public elementRef: ElementRef,
        private _ngZone: NgZone,
        private _contentObserver: ContentObserver,
    ) {}

    ngAfterViewInit() {}

    ngAfterContentInit() {
        let delay = 300;
        if (this.plat.BLINK || this.plat.WEBKIT) {
            delay = 200;
        }
        setTimeout(() => {
            this._scrollBar = ScrollBarHelper.makeScrollbar(this.elementRef.nativeElement);
        }, delay);
        if (!this._currentSubscription) {
            this._subscribe();
        }
    }

    updateScrollbar() {
        if (this._scrollBar) {
            setTimeout(() => {
                if (this._scrollBar) this._scrollBar.update();
            }, 0);
        }
    }

    private _subscribe() {
        this._unsubscribe();
        const stream = this._contentObserver.observe(this.elementRef);
        this._ngZone.runOutsideAngular(() => {
            this._currentSubscription = (this.debounce
                ? stream.pipe(debounceTime(this.debounce))
                : stream
            ).subscribe(() => {
                this.updateScrollbar();
            });
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
