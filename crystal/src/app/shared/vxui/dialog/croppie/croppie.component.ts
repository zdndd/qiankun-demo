import { Component, OnInit, ElementRef, Input } from '@angular/core';
import { Map } from 'immutable';
import { NzModalRef, NzModalService, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '../../../../core/net/http.client';
import { TranslateService } from '@ngx-translate/core';
declare var Croppie;
import {
    FormBuilder,
    NgForm,
    FormControl,
    FormGroup,
    ValidationErrors,
    Validators,
} from '@angular/forms';

@Component({
    selector: 'app-dialog-croppie',
    templateUrl: './croppie.component.html',
    host: {
        '[class.common-popup]': 'true',
    },
    styleUrls: ['./croppie.component.less'],
})
export class CroppieDialogComponent implements OnInit {
    uploadCrop: any;
    userFile: any = null;
    @Input() initPhotoData;
    constructor(public messageService: NzMessageService, public elementRef: ElementRef,public translateService:TranslateService) {}

    ngOnInit() {}

    ngAfterViewInit() {
        var self = this;
        const uploadEle = this.elementRef.nativeElement.querySelector('#upload');
        var croppieElement = this.elementRef.nativeElement.querySelector('#upload-holder');
        this.uploadCrop = new Croppie(croppieElement, {
            viewport: {
                width: 200,
                height: 200,
                type: 'circle',
            },
            enableExif: true,
        });

        if (this.initPhotoData) {
            self.uploadCrop.bind({
                url: this.initPhotoData,
            });
        }

        function readFile(input) {
            var fileSize = 0;
            var fileMaxSize = 2048;
            
            if (input.files && input.files[0]) {
                var reader = new FileReader();
                reader.onload = function(e: any) {
                    self.uploadCrop.bind({
                        url: e.target.result,
                    });
                };
                fileSize = input.files[0].size;
                var size = fileSize / 1024;
                if(size > fileMaxSize){
                    self.messageService.error(self.translateService.instant('The picture must not exceed 2M'));
                    input.value = '';
                    return false;
                }else{
                    self.userFile = input.files[0];
                    reader.readAsDataURL(input.files[0]);
                }
            } else {
                console.log("Sorry - you're browser doesn't support the FileReader API");
            }
        }

        uploadEle.addEventListener('change', evt => {
            readFile(evt.target);
        });
    }

    selectedFile() {
        const uploadEle = this.elementRef.nativeElement.querySelector('#upload');
        uploadEle.click();
    }

    valid() {
        if (!this.userFile) {
            this.messageService.error(this.translateService.instant('Please select the upload avatar'));
            return false;
        }
        return true;
    }

    getData(): Promise<any> {
        return new Promise(resolve => {
            this.uploadCrop
                .result({
                    type: 'base64',
                    format: 'jpeg',
                    size: {
                        width: 150,
                        height: 150,
                    },
                })
                .then(result => {
                    resolve(result);
                });
        });
    }

    ngOnDestroy() {
        if (this.uploadCrop) {
            this.uploadCrop.destroy();
        }
    }
}
