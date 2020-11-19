import { Component, OnInit,ChangeDetectorRef, ChangeDetectionStrategy,Input,ElementRef,ViewChild } from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import { _HttpClient } from "../../../../core/net/http.client"
import { NzModalRef, NzModalService } from 'ng-zorro-antd';
import { NzMessageService } from 'ng-zorro-antd';
declare var $:any;

@Component({
    selector: 'vx-dialog-view',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './view-dailog.component.html',
    styleUrls: ['./view-dailog.component.less']
})
export class ViewDialogComponent implements OnInit {

    @ViewChild("formView", { static: true }) formViewComponent;
    @Input() formData: {};
    saving = false;

    constructor(public translateService:TranslateService,private messageService: NzMessageService,public cd:ChangeDetectorRef,private modal: NzModalRef,public element:ElementRef) {
    }

    ngOnInit() {
    }

    ngAfterViewInit(){
    }

    cancelHandler(): void {
        this.modal.triggerCancel();
    }

    okHandler(): void {
        //this.modal.triggerOk();
        if(this.formViewComponent.validata() && !this.formViewComponent.loading){
            if(this.formData["saveUrl"]){
                this.saving = true;
                setTimeout(()=>{
                    this.saving = false;
                    this.cd.detectChanges();
                    this.messageService.create("success", this.translateService.instant('Save Success'));
                    this.modal.close(this.formViewComponent.getValue())
                },1500)
            }
            else{
                this.modal.close(this.formViewComponent.getValue())
            }

        }
    }

    getData(){
        if(this.formViewComponent.validata()){
            return this.formViewComponent.getValue();
        }
        return null;

    }



    ngOnDestroy(){

    }



}
