import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Map } from 'immutable';
import { NzModalRef, NzModalService, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '../../../../../core/net/http.client';
import {
    NgForm,
    NgModel,
    FormBuilder,
    FormGroup,
    FormArray,
    NG_VALUE_ACCESSOR,
    FormControl,
    ControlValueAccessor,
    Validators,
} from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from '../../../../../core/app.service';
import { PrettyScrollDirective } from '../../../../../shared/vxui/directives/pretty-scroll-directive';
@Component({
    selector: 'app-modal-generate-link',
    templateUrl: './generate-link.component.html',
    host: {
        '[class.common-popup]': 'true',
    },
    styleUrls: ['./generate-link.component.less'],
})
export class GenerateLinkComponent implements OnInit {
    tooltipStyle = {
        'max-width':'none'
    }
    selectedColumn = null;
    avaiableColumns: any[];
    title = '';
    description = '';
    @Input() columnData: any[];
    @Input() modelId = null;
    @Input() tabId = null;

    @ViewChild(PrettyScrollDirective, { static: true }) scrollDirective: PrettyScrollDirective;
    enabledTransform = false;
    enabledTransformResult = false;
    mapList = [];
    linkValue = '';

    @ViewChild('linkInput',{static: true}) linkInput: ElementRef;

    constructor(
        public appService: AppService,
        private fb: FormBuilder,
        public translateService: TranslateService,
        private http: _HttpClient,
        private messageService: NzMessageService,
        private modal: NzModalRef,
    ) {}
    ngOnInit() {
        this.http.get('/abilitymodel/GenerateLink?ModelId=' + this.modelId).subscribe(dataStr => {
            let linkUrl = 'http://' + window.location.host + '/s/' + dataStr;
            this.linkValue = linkUrl;
        });

        this.http.get('/abilitymodel/GetSurveyInfo?ModelId=' + this.modelId).subscribe(data => {
            if (data) {
                this.title = data['title'];
                this.description = data['description'];
            }
        });
    }

    updateSurvey() {
        this.http
            .post('/abilitymodel/UpdateSurvey', {
                modelid: this.modelId,
                title: this.title,
                description: this.description,
            })
            .subscribe(data => {
                this.messageService.success('更新成功');
            });
    }

    getData() {
        return null;
    }

    copyUrl() {
        this.linkInput.nativeElement.select();
        document.execCommand('Copy');
        this.messageService.success(
            this.translateService.instant('链接已生成并复制，直接粘贴使用'),
        );
    }

    downqrcode() {
        window.open(
            this.appService.getServerUrl() +
                '/abilitymodel/GetQrImg?token=&url=' +
                encodeURIComponent(this.linkValue),
        );
    }

    save() {}
}
