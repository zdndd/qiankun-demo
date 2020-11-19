import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { _HttpClient } from '../../../../core/net/http.client';
import { AppService } from '../../../../core/app.service';
import { NzModalRef, NzModalService } from 'ng-zorro-antd';
import { NzFormatEmitEvent, NzTreeNode } from 'ng-zorro-antd';
declare var $: any;
import { ScrollBarHelper } from '../../../../utils/scrollbar-helper';
import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import { NzMessageService, UploadFile, UploadFileStatus } from 'ng-zorro-antd';
import { filter } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'vx-dialog-uploader-picke',
    templateUrl: './uploader-picker.component.html',
    styleUrls: ['./uploader-picker.component.less'],
})
export class UploaderPickeDialogComponent implements OnInit {
    @Input() message: string;
    @Input() setValue: Subject<UploadFile[]>;

    @Input() fileList: UploadFile[] = [];
    uploading = false;

    constructor(
        public translateService: TranslateService,
        public appService: AppService,
        private http: HttpClient,
        private msg: NzMessageService,
        private modal: NzModalRef,
        public element: ElementRef,
    ) {}

    ngOnInit() {}

    beforeUpload = (file: UploadFile): boolean => {
        console.log('before upload');
        console.log(file);
        const unacceptedFiles = '.aspx,.asp';
        const unacceptedFilesArray = unacceptedFiles.split(',');
        const fileName = '' + file.name;
        const mimeType = '' + file.type;
        const baseMimeType = mimeType.replace(/\/.*$/, '');

        let fileTypeValid = unacceptedFilesArray.some(type => {
            const validType = type.trim();
            if (validType.charAt(0) === '.') {
                return (
                    fileName
                        .toLowerCase()
                        .indexOf(
                            validType.toLowerCase(),
                            fileName.toLowerCase().length - validType.toLowerCase().length,
                        ) !== -1
                );
            } else if (/\/\*$/.test(validType)) {
                // This is something like a image/* mime type
                return baseMimeType === validType.replace(/\/.*$/, '');
            }
            return mimeType === validType;
        });
        if (fileTypeValid) {
            this.msg.info(this.translateService.instant('Invalid file Format Tip1'));
            return false;
        }
        file.status = 'success';
        this.fileList[0] = file;
        return false;
    };

    removeItem(item, index) {
        this.fileList.splice(index, 1);
        if (item.status == 'done') {
            this.setValue.next(this.fileList);
        }
    }

    handleUpload(): void {
        const formData = new FormData();
        formData.append('customerid', this.appService.cmpid);
        // tslint:disable-next-line:no-any
        let penddingUploadFileNum = 0;
        this.fileList.forEach((file: any) => {
            if (file.status == 'success' || file.status == 'error') {
                penddingUploadFileNum++;
                formData.append('file', file);
            }
        });
        if (penddingUploadFileNum == 0) {
            this.msg.error(this.translateService.instant('No files to upload'));
            return;
        }
        this.uploading = false;
        // You can use any AJAX library you like
        const req = new HttpRequest(
            'POST',
            this.appService.getServerUrl() + 'Candidates/AddFile',
            formData,
            {
                // reportProgress: true
            },
        );

        this.fileList.forEach((file: any) => {
            if (file.status == 'success' || file.status == 'error') {
                file.status = 'uploading';
            }
        });

        this.uploading = true;
        //setTimeout(()=>{
        // this.fileList.forEach((file: any) => {
        //     if(file.status=="uploading"){
        //         file.status = "error";
        //     }
        // });

        // this.fileList.forEach((file: any) => {
        //     if(file.status=="uploading"){
        //         file.status = "done";
        //     }
        // });
        // this.uploading = false;
        // this.setValue.next(this.fileList)

        // },1000)

        this.http
            .request(req)
            .pipe(filter(e => e instanceof HttpResponse))
            .subscribe(
                (event: any) => {
                    console.log(event.body);
                    this.uploading = false;
                    this.fileList.forEach((file: any) => {
                        if (file.status == 'uploading') {
                            file.response = event.body;
                            file.status = 'done';
                        }
                    });
                    this.setValue.next(this.fileList);
                    this.msg.success(this.translateService.instant('Upload success'));
                },
                err => {
                    this.uploading = false;
                    this.msg.error(this.translateService.instant('Upload failed'));
                },
            );
    }

    handleChnage(data) {
        console.log(data);
        console.log(this.fileList);
    }

    cancelHandler(): void {
        this.modal.triggerCancel();
    }

    okHandler(): void {
        this.modal.triggerOk();
    }

    operationLinkClickHandler(data) {
        // console.log(data)
        if (data.action == 'selector') {
            this.modal.close(data['data']);
        }
    }

    ngAfterViewInit() {}

    ngOnDestroy() {}
}
