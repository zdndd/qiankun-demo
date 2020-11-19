import {
    Component,
    Input,
    ViewChild,
    OnInit,
    OnDestroy,
    ElementRef,
    SimpleChange,
    OnChanges,
} from '@angular/core';
import { init } from 'echarts';

@Component({
    selector: 'echart',
    template: `
        <div #root></div>
    `,
})
export class EChartsComponent implements OnInit, OnChanges, OnDestroy {
    @Input('option') option: any;
    @Input() width: string;
    @Input() useJsVersion = false;
    @Input() height: string;

    private chart: any;
    private initheight: number | string;
    private initwidth: number | string;

    @ViewChild('root',{static: true})
    private root: ElementRef;

    chartresize = () => this.chart.resize();

    ngOnChanges(changes: { [propName: string]: SimpleChange }) {
        if (
            changes['option'] &&
            changes['option'].previousValue != changes['option'].currentValue
        ) {
            this.initheight = this.height.indexOf('%') == -1 ? this.height + 'px' : this.height;
            this.initwidth = this.width.indexOf('%') == -1 ? this.width + 'px' : this.width;
            this.root.nativeElement.style.width = this.initwidth;
            this.root.nativeElement.style.height = this.initheight;
            if (this.useJsVersion)
                this.chart = (<any>window).echarts.init(this.root.nativeElement, {
                    width: 'auto',
                    height: 'auto',
                });
            else this.chart = init(this.root.nativeElement, { width: 'auto', height: 'auto' });
            this.chart.setOption(this.option);
            this.chart.resize();
        } else if (
            changes['height'] &&
            changes['height'].previousValue != changes['height'].currentValue
        ) {
            this.initheight = this.height.indexOf('%') == -1 ? this.height + 'px' : this.height;
            this.initwidth = this.width.indexOf('%') == -1 ? this.width + 'px' : this.width;
            this.root.nativeElement.style.width = this.initwidth;
            this.root.nativeElement.style.height = this.initheight;
            this.chart.setOption(this.option);
            this.chart.resize();
        }
    }
    clear() {
        if (this.chart && this.chart.clear) this.chart.clear();
    }

    showLoading() {
        this.chart.showLoading();
    }

    hideLoading() {
        this.chart.hideLoading();
    }

    ngOnInit(): void {
        window.addEventListener('resize', this.chartresize, true);
    }

    ngOnDestroy(): void {
        window.removeEventListener('resize', this.chartresize, true);
        this.chart.dispose();
    }

    setOption(option, notMerge) {
        this.chart.setOption(option, notMerge);
    }
}
