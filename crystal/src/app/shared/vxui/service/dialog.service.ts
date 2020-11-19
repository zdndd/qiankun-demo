import { Injectable } from '@angular/core';
import { VxDialogAlertComponent } from "../dialog/alert/alertcomponent"
import { VxDialogConfirmComponent} from "../dialog/confirm/confirmcomponent"
import { PositionPickeDialogComponent} from "../dialog/position-picker/position-picker.component"
import { FormDialogComponent} from "../dialog/form/form-dailog.component"
import { ViewDialogComponent} from "../dialog/view/view-dailog.component"
import { UploaderPickeDialogComponent} from "../dialog/uploader-picker/uploader-picker.component"
import {Subject} from "rxjs"
import {TranslateService} from "@ngx-translate/core"

import { NzModalRef, NzModalService } from 'ng-zorro-antd';
import { NzMessageService, UploadFile,UploadFileStatus } from 'ng-zorro-antd';


@Injectable()
export class VXDialogService {
    constructor(public translateService:TranslateService,public modalService: NzModalService) {

    }

    alert(message, options: { title: string, icon: string, width: string } = { title: this.translateService.instant('Remind'), icon: "vx-icon-TiShiTuBiao1", width: "400px" }) {
        this.modalService.create({
            nzTitle: options.title,
            nzWidth: options.width,
            nzMaskClosable:false,
            nzClosable: false,
            nzContent: VxDialogAlertComponent,
            nzComponentParams: {
                icon: options.icon,
                message: message,
            },
            nzFooter: null
        });
    }


    confirm(message) {
        return new Promise((resolve,reject)=>{
            this.modalService.create({
                nzTitle: this.translateService.instant('Remind'),
                nzWidth: "340",
                nzMaskClosable:false,
                nzClosable: true,
                nzContent: VxDialogConfirmComponent,
                nzOnOk: () =>{
                    if(resolve)
                        resolve("ok")
                },
                nzOnCancel:()=>{
                    if(reject)
                        reject("cancel")
                },
                nzComponentParams: {
                    message: message,
                },
                nzFooter: null
            });
        })

    }

    positionPicker(options: { title: string, icon: string, width: string } = { title: this.translateService.instant("Please Choose Position Info"), icon: "vx-icon-TiShiTuBiao1", width: "960px" }) {
        return new Promise((resolve,reject)=>{
            let modal = this.modalService.create({
                nzTitle: options.title,
                nzWidth: options.width,
                nzClosable: true,
                nzMaskClosable:false,
                nzContent: PositionPickeDialogComponent,
                nzOnOk: (data) =>{

                },
                nzOnCancel:(data)=>{
                    if(reject)
                        reject("cancel")
                },
                nzComponentParams: {

                },
                nzFooter: null
            });
            modal.afterClose.subscribe((result) => {
                // console.log(result)
                if(resolve){
                    resolve(result)
                }
            });
        })

    }


    uploaderPicker(setValue:Subject<UploadFile[]>,fileList:UploadFile[],options: { title: string, width: string } = { title: this.translateService.instant("Select the file"),  width: "960px" }) {
            let modal = this.modalService.create({
                nzTitle: options.title,
                nzWidth: options.width,
                nzClosable: true,
                nzMaskClosable:false,
                nzBodyStyle:{padding:"0px"},
                nzContent: UploaderPickeDialogComponent,
                nzOnOk: (data) =>{

                },
                nzOnCancel:(data)=>{

                },
                nzComponentParams: {
                    setValue:setValue,
                    fileList:fileList
                },
                nzFooter: null
            });


    }


    form(formData,options: { title: string, width?: string }) {
        options.width = options.width || "960px"
        return new Promise((resolve,reject)=>{
            let modal = this.modalService.create({
                nzTitle: options.title,
                nzWidth: options.width,
                nzMaskClosable:false,
                nzBodyStyle:{"padding":"2px 2px 2px 15px"},
                nzClosable: true,
                nzContent: FormDialogComponent,
                nzOnOk: (data) =>{

                },
                nzOnCancel:(data)=>{
                    if(reject)
                        reject("cancel")
                },
                nzComponentParams: {
                    formData:formData
                },
                nzFooter: null
            });
            modal.afterClose.subscribe((result) => {
                if(resolve){
                    resolve(result)
                }
            });
        })

    }


    view(formData,options: { title: string, width?: string }) {
        options.width = options.width || "960px"
        let modal = this.modalService.create({
            nzTitle: options.title,
            nzWidth: options.width,
            nzMaskClosable:false,
            nzClosable: true,
            nzContent: ViewDialogComponent,
            nzOnOk: (data) =>{

            },
            nzOnCancel:(data)=>{

            },
            nzComponentParams: {
                formData:formData
            },
            nzFooter: null
        });

    }



}
