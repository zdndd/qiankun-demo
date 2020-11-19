import { ViewChild, EventEmitter, Output, Input, AfterViewInit } from '@angular/core';
import {
    CdkDrag,
    CdkDropList,
    CdkDropListGroup,
    CdkDragMove,
    moveItemInArray,
} from '@angular/cdk/drag-drop';
import { ViewportRuler } from '@angular/cdk/overlay';
import { ChartItemData } from 'src/app/constants/app.constants';
export class AgileBaseChart implements AfterViewInit {

    @Output() update: EventEmitter<any> = new EventEmitter();
    @Input() data: ChartItemData[];
    @Input() viewportRuler: ViewportRuler;
    @Input() mode = 'sort';
    @ViewChild(CdkDropListGroup, { static: true }) listGroup: CdkDropListGroup<CdkDropList>;

    @ViewChild(CdkDropList, { static: true }) placeholder: CdkDropList;
    public target: CdkDropList;
    public targetIndex: number;
    public source: CdkDropList;
    public sourceIndex: number;
    public dragIndex: number;
    public activeContainer;

    _listCache = null;
    constructor() {
        this.target = null;
        this.source = null;
    }
    ngAfterViewInit() {
        const phElement = this.placeholder.element.nativeElement;

        phElement.style.display = 'none';
        phElement.parentElement.removeChild(phElement);
    }

    dragMoved(e: CdkDragMove) {

        const point = this.getPointerPositionOnPage(e.event);
        this.listGroup._items.forEach(dropList => {
            if (__isInsideDropListClientRect(dropList, point.x, point.y)) {
                this.activeContainer = dropList;
                return;
            }
        });
    }

    dropListDropped() {
        this._listCache = null;
        if (!this.target) return;

        const phElement = this.placeholder.element.nativeElement;
        const parent = phElement.parentElement;

        phElement.style.display = 'none';

        parent.removeChild(phElement);
        parent.appendChild(phElement);
        parent.insertBefore(this.source.element.nativeElement, parent.children[this.sourceIndex]);

        this.target = null;
        this.source = null;

        if (this.sourceIndex !== this.targetIndex) {
            this.updateMoveItem(this.sourceIndex, this.targetIndex);
        }
    }
    updateMoveItem(sourceIndex, targetIndex) {
        if (this.mode === 'replace') {
            // 替换拖拽模式
            const temp = this.data[sourceIndex];
            this.data.splice(sourceIndex, 1, this.data[targetIndex]);
            this.data.splice(targetIndex, 1, temp);
        } else {
            // 排序拖拽模式
            moveItemInArray(this.data, sourceIndex, targetIndex);
        }
        this.update.emit(this.data);
    }

    dropListEnterPredicate = (drag: CdkDrag, drop: CdkDropList) => {
        if (drop === this.placeholder) return true;

        if (drop !== this.activeContainer) return false;

        const phElement = this.placeholder.element.nativeElement; // 隐藏的占位容器
        const sourceElement = drag.dropContainer.element.nativeElement; // 拖动的元素
        const dropElement = drop.element.nativeElement; // 目标位置的元素

        const dragIndex = __indexOf(
            dropElement.parentElement.children,
            this.source ? phElement : sourceElement,
        );
        const dropIndex = __indexOf(dropElement.parentElement.children, dropElement);

        if (!this.source) {
            this.sourceIndex = dragIndex;
            this.source = drag.dropContainer;
            phElement.style.width = sourceElement.clientWidth + 'px';
            phElement.style.height = sourceElement.clientHeight + 'px';
            phElement.style.display = '';
            if (this.mode === 'sort') sourceElement.parentElement.removeChild(sourceElement);
            else if (this.mode === 'replace') {
                dropElement.parentElement.replaceChild(phElement, sourceElement);
            }
            this._listCache = Array.from(dropElement.parentElement.children);
        }

        this.targetIndex = dropIndex;
        this.target = drop;

        if (this.mode === 'sort') {
            dropElement.parentElement.insertBefore(
                phElement,
                dropIndex > dragIndex ? dropElement.nextSibling : dropElement,
            );
        } else if (this.mode === 'replace') {
            const listCopy = this._listCache.slice();
            const temp = listCopy[this.targetIndex];
            listCopy[this.targetIndex] = listCopy[this.sourceIndex];
            listCopy[this.sourceIndex] = temp;
            listCopy.forEach(item => {
                dropElement.parentElement.appendChild(item);
            });
        }

        // console.log(dragIndex, ' dropIndex ', dropIndex);
        // console.log(sourceElement, ' dropElement ', dropElement);

        this.placeholder.enter(
            drag,
            drag.element.nativeElement.offsetLeft,
            drag.element.nativeElement.offsetTop,
        );
        return false;
    };

    /** Determines the point of the page that was touched by the user. */
    getPointerPositionOnPage(event: MouseEvent | TouchEvent) {
        // `touches` will be empty for start/end events so we have to fall back to `changedTouches`.
        const point = __isTouchEvent(event) ? event.touches[0] || event.changedTouches[0] : event;
        const scrollPosition = this.viewportRuler.getViewportScrollPosition();

        return {
            x: point.pageX - scrollPosition.left,
            y: point.pageY - scrollPosition.top,
        };
    }
}

function __indexOf(collection, node) {
    return Array.prototype.indexOf.call(collection, node);
}

/** Determines whether an event is a touch event. */
function __isTouchEvent(event: MouseEvent | TouchEvent): event is TouchEvent {
    return event.type.startsWith('touch');
}

function __isInsideDropListClientRect(dropList: CdkDropList, x: number, y: number) {
    const { top, bottom, left, right } = dropList.element.nativeElement.getBoundingClientRect();
    return y >= top && y <= bottom && x >= left && x <= right;
}
