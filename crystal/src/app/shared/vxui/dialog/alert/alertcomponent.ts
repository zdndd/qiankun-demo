import { Component, OnInit, Input } from '@angular/core';
import { _HttpClient } from "../../../../core/net/http.client"
import { HttpClient } from "@angular/common/http"
import { NzModalRef, NzModalService } from 'ng-zorro-antd';

@Component({
    selector: 'vx-dialog-alert',
    templateUrl: './alert.component.html',
    styleUrls: ['./alert.component.less']
})
export class VxDialogAlertComponent implements OnInit {


    @Input() message: string;
    @Input() icon: string = "vx-icon-TiShiTuBiao1"


    constructor(private modal: NzModalRef) {

     }


    ngOnInit() {

    }

    destroyModal(): void {
        this.modal.destroy();
      }



}
