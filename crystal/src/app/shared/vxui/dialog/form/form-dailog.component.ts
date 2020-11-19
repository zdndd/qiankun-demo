import { Component, OnInit,ChangeDetectorRef, ChangeDetectionStrategy,Input,ElementRef,ViewChild } from '@angular/core';
import { _HttpClient } from "../../../../core/net/http.client"
import { NzModalRef, NzModalService } from 'ng-zorro-antd';
import { NzMessageService } from 'ng-zorro-antd';
declare var $:any;
import {TranslateService} from "@ngx-translate/core"

@Component({
    selector: 'vx-dialog-form',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './form-dailog.component.html',
    styleUrls: ['./form-dailog.component.less']
})
export class FormDialogComponent implements OnInit {

    @ViewChild("formView", { static: true }) formViewComponent;
    @Input() formData: {};
    saving = false;
    dialogHeight = 0;

    constructor(public translateService:TranslateService,public http:_HttpClient,private messageService: NzMessageService,public cd:ChangeDetectorRef,private modal: NzModalRef,public element:ElementRef) {
    }

    ngOnInit() {
        this.dialogHeight = window.innerHeight - 320;
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
                let postData = this.formViewComponent.getValue();
                if(this.formData["saveParams"] && this.formData["saveKey"]){
                    let saveParams = Object.assign({},this.formData["saveParams"])
                    Object.assign(saveParams[this.formData["saveKey"]],this.formViewComponent.getValue());
                    postData = Object.assign({},saveParams);
                    console.log(postData)
                }

                this.http.post(this.formData["saveUrl"],postData).subscribe(()=>{
                    this.saving = false;
                    this.cd.detectChanges();
                    this.messageService.create("success", this.translateService.instant("Save Success"));
                    this.modal.close(this.formViewComponent.getValue())
                },()=>{
                    this.saving = false;
                    this.cd.detectChanges();
                })
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
