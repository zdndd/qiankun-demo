import {
    Component,
    ElementRef,
    EventEmitter,
    HostListener,
    Input,
    OnInit,
    Output,
    ViewChild,
    AfterViewInit,
    SimpleChange,
    OnChanges,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ScrollBarHelper } from 'src/app/utils/scrollbar-helper';
import { ChartType, DataState } from '../../../../constants/app.constants';
import { KNXDataService } from '../../../../core/knxdata.service';
import { InlineEditorComponent } from '../../../../shared/components/inline-editor/inline-editor.comonent ';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
    selector: 'conclusion-common',
    templateUrl: './conclusion-common.component.html',
    styleUrls: ['./conclusion-common.component.less'],
})
export class ConclusionCommonComponent implements OnChanges, OnInit, AfterViewInit {
    pageState = DataState.LOADING;
    imgChange = 'zh';
    conclusionData = {
        tabid: null, //页签Id ,
        modelid: null, //模型id
        autotabid: '', //选择的方法value
        sourcetabinfo: '', //数据库记录上次选择的方法id
        conclusionList: [],
    };
    description = '';
    chartList = [];
    useEditor = false;
    noteValue = '';
    editContent: HTMLElement;
    editBox: HTMLElement;
    ckeChrome: HTMLElement;
    @Input() modelid: number; //模型id
    @Input() tabid: number; //页签Id ,
    @Input() autotabid: string; //领导访谈切换方法tabid
    @Output() checkData = new EventEmitter<any>();
    @ViewChild(InlineEditorComponent, { static: true }) inlineEditorComponent: InlineEditorComponent;
    constructor(
        public dataService: KNXDataService,
        public translateService: TranslateService,
        private messageService: NzMessageService,
        public elementRef: ElementRef,
    ) {}

    ngOnInit() {
        this.conclusionData['tabid'] = this.tabid;
        this.conclusionData['modelid'] = this.modelid;
        this.conclusionData['autotabid'] = this.autotabid;
        this.imgChange = this.translateService.instant('Image language switching');
        this.getLoadData(false);
    }

    ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
        if (changes['autotabid'] && !changes['autotabid'].isFirstChange()) {
            this.conclusionData.autotabid = this.autotabid;
            this.getLoadData(false);
        }
    }

    ngAfterViewInit() {
        this.resizeEdit();
        if (this.inlineEditorComponent) {
            setTimeout(() => {
                this.inlineEditorComponent.focus();
            }, 500);
        }
    }
    // cke_contents

    @HostListener('window:resize', [])
    resize() {
        this.resizeEdit();
    }
    resizeEdit() {
        setTimeout(() => {
            this.editBox = this.elementRef.nativeElement.querySelector('.editor-div');
            this.editContent = this.elementRef.nativeElement.querySelector('.cke_contents');
            this.ckeChrome = this.elementRef.nativeElement.querySelector('.cke_chrome');
            if (this.editContent && this.editBox && this.ckeChrome) {
                this.editContent.style.height = this.editBox.clientHeight - 40 + 'px';
                this.ckeChrome.style.border = '1px solid #d1d1d1';
                // console.log(this.editBox.clientHeight,'this.editContent && this.editBox111',this.editContent.style.height );
            }
        }, 150);
    }

    // 提交描述
    saveDescription() {
        let noteValue = this.noteValue;
        const description = noteValue.replace(/<.*?>/gi, '');
        if (description.length > 2000) {
            this.messageService.warning(
                this.translateService.instant('The maximum length should not exceed', { num: '2000' }),
            );
            return;
        }
        const noteValueLen = noteValue.replace(/\s/g, '').length;
        if (noteValueLen < 1) {
            noteValue = '';
        }
        this.description = noteValue;
        this.useEditor = false;
        const params = {
            tabid: Number(this.conclusionData.tabid),
            modelid: Number(this.conclusionData.modelid),
            abilityid: 0,
            description: this.description,
        };
        this.dataService.UpdateDescription(params).subscribe(res => {
            if (res.errorcode === 0) {
                this.messageService.success(!res.message ? '提交成功' : res.message);
            } else {
                this.messageService.error(!res.message ? '提交失败' : res.message);
            }
        });
    }
    cancel() {
        this.useEditor = false;
    }
    onSubmit(values) {
        this.conclusionData.conclusionList = values;
        // this.getChartData(values);
        // this.checkData.emit(this.conclusionData);
        this.getLoadData(false);
    }
    setuseEditor() {
        const useEditor = this.useEditor;
        if (!useEditor) {
            this.noteValue = this.description;
            this.useEditor = true;
            setTimeout(() => {
                this.resizeEdit();
            }, 250);
        } else {
            return;
        }
    }

    getLoadData(needRefresh) {
        const params = {
            tabid: Number(this.conclusionData.tabid), //页签Id ,
            modelid: Number(this.conclusionData.modelid), //模型id
            autotabid: this.conclusionData.autotabid, //选择的方法拼接成的字符串
            needRefresh: needRefresh,
        };

        this.dataService.getModelConclusion(params).subscribe(res => {
            if (res) {
                this.description = res.description;
                this.conclusionData['sourcetabinfo'] = res.sourcetabinfo;
                if (res.lstabilityproportion && res.lstabilityproportion.length > 0) {
                    this.pageState = DataState.EXIST_DATA;
                    const data = res.lstabilityproportion;
                    this.conclusionData['conclusionList'] = data;
                    this.getChartData(data);
                } else {
                    this.pageState = DataState.EMPTY;
                }
                this.checkData.emit(this.conclusionData); //同步数据到父级页面
            }
        });
    }

    //领导访谈更新结论
    getLoadDataByLeadershipInterview(needRefresh, autotabId) {
        const params = {
            tabid: Number(this.conclusionData.tabid), //页签Id ,
            modelid: Number(this.conclusionData.modelid), //模型id
            autotabid: autotabId, //选择的方法拼接成的字符串
            needRefresh: needRefresh,
        };

        this.dataService.getModelConclusion(params).subscribe(res => {
            if (res) {
                this.description = res.description;
                this.conclusionData['sourcetabinfo'] = res.sourcetabinfo;
                if (res.lstabilityproportion && res.lstabilityproportion.length > 0) {
                    this.pageState = DataState.EXIST_DATA;
                    const data = res.lstabilityproportion;
                    this.conclusionData['conclusionList'] = data;
                    this.getChartData(data);
                } else {
                    this.pageState = DataState.EMPTY;
                }
                this.checkData.emit(this.conclusionData); //同步数据到父级页面
            }
        });
    }

    getChartData(data) {
        const chartArr = [];
        data.forEach(item => {
            const obj = {
                name: '',
                value: '',
            };
            obj['name'] = item['abilityname'];
            obj['value'] = item['proportion'];
            chartArr.push(obj);
        });
        this.chartList = chartArr;
    }
}
