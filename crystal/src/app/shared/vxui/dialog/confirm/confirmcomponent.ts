import { Component, OnInit, Input } from '@angular/core';
import { _HttpClient } from "../../../../core/net/http.client"
import { HttpClient } from "@angular/common/http"
import { NzModalRef, NzModalService } from 'ng-zorro-antd';

@Component({
    selector: 'vx-dialog-confirm',
    templateUrl: './confirm.component.html',
    styleUrls: ['./confirm.component.less']
})
export class VxDialogConfirmComponent implements OnInit {


    @Input() message: string;
    @Input() icon: string = "vx-icon-TiShiTuBiao1"


    constructor(private modal: NzModalRef) {

    }


    ngOnInit() {

    }

    cancelHandler(): void {
        this.modal.triggerCancel();
    }

    okHandler(): void {
        this.modal.triggerOk();
    }



}
