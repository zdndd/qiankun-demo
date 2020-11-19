import { Component,Input,forwardRef } from '@angular/core';
import * as _ from 'lodash';
import {DataState} from "../../../constants/app.constants"



@Component({
  selector: 'page-state',
  styleUrls: ['./page-state.comonent.less'],
  template: `
   <div class="loading-box" *ngIf="state==1">
        <nz-spin nzTip="{{ 'Loading' | translate}}"></nz-spin>
    </div>
    <div class="empty-box" *ngIf="state==2">
    {{ 'No Content' | translate}}
    </div>
  `
})
export class PageStateComponent {
    @Input() state = 0;
    constructor(){

    }

    ngOnInit(){

    }

}
