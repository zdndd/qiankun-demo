import {
    Component,
    Input,
    Output,
    EventEmitter,
    HostListener,
    AfterViewInit,
    ElementRef,
} from '@angular/core';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import { ScrollBarHelper } from 'src/app/utils/scrollbar-helper';
@Component({
    selector: 'chart-infinite',
    templateUrl: './chart-infinite.component.html',
    styleUrls: ['./chart-infinite.component.less'],
})
export class ChartInfiniteComponent implements AfterViewInit {
    tableScroll = {
        y: '540px',
    };
    scrollContent: HTMLElement;
    @Input() data;
    @Output() update = new EventEmitter();

    constructor(public elementRef: ElementRef) {}
    @HostListener('window:resize', ['$event'])
    resize(event) {
        this.resizeTable();
    }
    ngAfterViewInit() {
        this.resizeTable();
    }
    resizeTable() {
        if (!this.scrollContent)
            this.scrollContent = this.elementRef.nativeElement.querySelector('.ant-table-body');

        // pretter scroll
        ScrollBarHelper.makeScrollbar(this.scrollContent);
    }
    drop(e) {
        console.log('drop e=', e);
        const { currentIndex, previousIndex } = e;
        if (currentIndex !== previousIndex) {
            moveItemInArray(this.data, previousIndex, currentIndex);
            this.update.emit(this.data);
        }
    }
}
