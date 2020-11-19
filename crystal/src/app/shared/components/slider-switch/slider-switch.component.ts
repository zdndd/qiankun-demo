import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
    selector: 'slider-switch',
    templateUrl: './slider-switch.component.html',
    styleUrls: ['./slider-switch.component.less'],
})
export class SliderSwitchComponent implements OnInit {
    @Input() sliderData = [];
    @Input() valueChange: Subject<any>;
    constructor() {}

    ngOnInit() {}

    clickSwitch(item) {
        this.valueChange.next(item);
    }
}
