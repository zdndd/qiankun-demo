import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Location } from '@angular/common';
import { NzMessageService } from 'ng-zorro-antd';
import { ChooseType, DataState } from '../../../constants/app.constants';
import { KNXDataService } from '../../../core/knxdata.service';
import { CmpService } from '../components/service/component.service';
import { DetailService } from './detail.service';
import { InlineEditorComponent } from '../../../shared/components/inline-editor/inline-editor.comonent ';
import { HomeService } from '../home/service/home.service';
import { AppService } from '../../../core/app.service';
import { AuthService } from '../../../core/auth.service';

declare var TagCanvas: any;

// from http://www.goat1000.com/tagcanvas-options.php
const tagOption = {
    textColour: '#314f9f',
    shadow: '#c3c8e0',
    shadowBlur: 1,
    shadowOffset: [6, 5],
    shape: 'vcylinder',
    initial: [0.02, 0.02], // 初始化标签 x,y轴运行速度
    lock: 'xy',
    minBrightness: 0.5,
    minSpeed: 0,
    maxSpeed: 0.05,
    weight: true,
    weightFrom: 'data-weight',
    shuffleTags: true, // 随机变迁顺序12

    outlineColour: 'tagbg',
    noTagsMessage: false,
    wheelZoom: false,
    radiusX: 0.8,
    radiusY: 0.8,
    radiusZ: 0.8,
};

@Component({
    selector: 'model-detail',
    changeDetection: ChangeDetectionStrategy.Default,
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.less'],
})
export class DetailComponent implements OnInit, AfterViewInit, OnDestroy {
    constructor(
        public activatedRoute: ActivatedRoute,
        private detailService: DetailService,
        private cd: ChangeDetectorRef,
        public cmpService: CmpService,
        public dataService: KNXDataService,
        private messageService: NzMessageService,
        public translateService: TranslateService,
        public router: Router,
        private _location: Location,
        public homeService: HomeService,
        public appService: AppService,
        private authService: AuthService,
    ) {}
    useEditor = false; //是否显示富文本框
    selectedDataId = null;
    noteValue = '';
    data: any = {};
    abilityData = [];
    tags = [[], [], [], []];
    loading = DataState.LOADING;
    tagsLoading = DataState.LOADING;
    moduleName = '';
    modelId = this.activatedRoute.snapshot.params.modelid;

    tagsMap = [
        {
            title: this.translateService.instant('Leader Interview'),
            typeid: EnumsConclusionType.LeaderInterview,
            path: 'leader-interview',
        },
        {
            title: this.translateService.instant('Ability Comparison'),
            typeid: EnumsConclusionType.AbilityComparison,
            path: 'ability-comparison',
        },
        {
            title: this.translateService.instant('Employee Survey'),
            typeid: EnumsConclusionType.EmployeeSurvey,
            path: 'employee-survey',
        },
        {
            title: this.translateService.instant('Task Analysis'),
            typeid: EnumsConclusionType.TaskAnalysis,
            path: 'task-analysis',
        },
    ];
    @ViewChild(InlineEditorComponent, { static: true }) inlineEditorComponent: InlineEditorComponent;
    get lang() {
        return this.translateService.store.currentLang.replace(/[^a-z].*$/, '');
    }
    get isEmpty() {
        return this.loading === DataState.EMPTY && this.tagsLoading === DataState.EMPTY;
    }
    ngOnInit() {
        const id = this.activatedRoute.snapshot.params.modelid;
        const params = { ModelId: id, TabId: EnumsConclusionType.CreateModel };
        this.getTags(params);
        this.getConclusion(params);
        this.getModelName(id);
    }
    getModelName(id) {
        this.homeService.getAbilityModel({ ModelId: id }).subscribe((res) => {
            this.moduleName = res.modelname;
        });
    }
    goBack() {
        // this._location.back();
        const url = `/agile-modeling/home/model`;
        this.router.navigateByUrl(url);
    }
    getConclusion(params) {
        this.loading = DataState.LOADING;
        this.detailService.getModelConclusion(params).subscribe(
            (res) => {
                res = res || {};
                if (res.errorcode === 0) res = {};
                const { lstabilityproportion = [], ...data } = res;
                lstabilityproportion.forEach((item) => {
                    item['showInput'] = false;
                });
                this.abilityData = lstabilityproportion;
                this.data = data;
                if (this.abilityData.length) this.loading = DataState.EXIST_DATA;
                else this.loading = DataState.EMPTY;
                this.cd.detectChanges();
                // console.log(res, 'this.abilityData=', this.abilityData);
            },
            () => (this.loading = DataState.EMPTY),
        );
    }
    getTags(params) {
        this.tagsLoading = DataState.LOADING;
        this.detailService.getListModelConclusion(params).subscribe(
            (res) => {
                this.tags = this.tagsMap.map((item) => {
                    let list = [];
                    const targetItem = res.find((sub) => sub.parentid === item.typeid);
                    if (targetItem) list = targetItem.lstabilityproportion || list;
                    return list.map((i) => i.abilityname);
                });

                if (this.tags.some((list) => list.length > 0)) this.tagsLoading = DataState.EXIST_DATA;
                else this.tagsLoading = DataState.EMPTY;
                setTimeout(() => this.startTagCloud(), 200);
            },
            () => (this.tagsLoading = DataState.EMPTY),
        );
    }
    startTagCloud() {
        this.tags.forEach((item, index) => {
            TagCanvas.Start(`cloud${index}`, null, tagOption);
        });
    }
    endTagCloud() {
        this.tags.forEach((item, index) => {
            TagCanvas.Delete(`cloud${index}`);
        });
    }
    cloudStop(index) {
        TagCanvas.SetSpeed(`cloud${index}`, [0, 0]);
    }
    cloudStart(index) {
        // console.log('cloudLeave==', index);
        TagCanvas.SetSpeed(`cloud${index}`, tagOption.initial);
    }
    onBulletClick(path) {
        const id = this.activatedRoute.snapshot.params.modelid;
        const url = `/agile-modeling/model/${id}/${path}`;
        this.router.navigateByUrl(url);
    }
    onUpdate(data) {
        // console.log('onUpdate == ', data);
        const id = this.activatedRoute.snapshot.params.modelid;
        this.detailService
            .postModelConclusionSort({
                ModelId: id,
                TabId: EnumsConclusionType.CreateModel,
                lstid: data.map((item) => item.abilityid),
            })
            .subscribe((res) => {
                // console.log('更新能力排序成功');
            });
    }

    saveDescrip() {
        const id = this.activatedRoute.snapshot.params.modelid;
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
        this.data['description'] = noteValue;
        this.useEditor = false;
        const params = {
            tabid: EnumsConclusionType.CreateModel,
            modelid: id,
            abilityid: 0,
            description: this.data['description'],
        };
        this.dataService.UpdateDescription(params).subscribe((res) => {
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

    changeInput(id, index, event) {
        this.selectedDataId = id;
        this.abilityData[index]['showInput'] = true;
        setTimeout(() => {
            if (event.target && event.target.querySelector('textarea')) {
                event.target.querySelector('textarea').focus();
            }
        }, 500);
    }

    setuseEditor() {
        const useEditor = this.useEditor;
        if (!useEditor) {
            this.useEditor = true;
            this.noteValue = this.data['description'];
        } else {
            return;
        }
    }

    blue(id, description, index) {
        this.selectedDataId = null;
        const modelid = this.activatedRoute.snapshot.params.modelid;
        const params = {
            tabid: EnumsConclusionType.CreateModel,
            modelid: Number(modelid),
            abilityid: id,
            description: description,
        };
        this.abilityData[index]['showInput'] = false;
        this.dataService.UpdateDescription(params).subscribe((res) => {
            if (res.errorcode === 0) {
                // this.messageService.success(!res.message ? '提交成功' : res.message);
            } else {
                this.messageService.error(!res.message ? '提交失败' : res.message);
            }
        });
    }

    //更新结论
    updatetModal() {
        const params = {
            ModelId: this.activatedRoute.snapshot.params.modelid,
            TabId: EnumsConclusionType.CreateModel,
            needRefresh: true,
        };
        this.getConclusion(params);
        this.messageService.success(this.translateService.instant('operate successfully'));
    }

    // 选择能力
    showSelectModal() {
        this.cmpService.popupAbilitySelectDialogNew(
            //this.cmpService.popupAbilitySelectDialog(
            {
                conclusionList: this.abilityData,
                chooseType: ChooseType.isModel,
                isDisabled: false,
                modelid: this.activatedRoute.snapshot.params.modelid,
            },
            (data) => {
                const params = {
                    tabid: EnumsConclusionType.CreateModel,
                    modelid: this.activatedRoute.snapshot.params.modelid,
                    lstabilityproportion: data, //data.map(abilityid => ({ abilityid }))
                };
                this.dataService.insertModelConclusion(params).subscribe(() => {
                    // console.log('修改模型能力成功');
                    this.getConclusion({ ModelId: params.modelid, TabId: params.tabid });
                });
            },
        );
    }

    onClickWord(event) {
        event.preventDefault();
    }

    //导出报告
    exportPdf() {
        console.log(this.abilityData);
        console.log(this.abilityData.length);
        if (this.abilityData.length <= 0) {
            this.messageService.error('尚未建立模型，无法导出报告');
            return;
        }
        const userInfo = this.appService.getUserInfo();
        let token = this.authService.getToken();
        token = token.replace('Bearer ', '');
        let url: string =
            this.appService.getServerUrl() +
            'ExportPdf/ModelHtmlGeneratePdf?modelid=' +
            this.modelId +
            '&access_token=' +
            token;
        if (userInfo['customerid']) {
            url += '&customerid=' + userInfo['customerid'];
        }
        url = url.replace('/api/v1', '');
        window.open(url);
    }

    ngAfterViewInit() {
        if (this.inlineEditorComponent) {
            setTimeout(() => {
                this.inlineEditorComponent.focus();
            }, 500);
        }
    }
    ngOnDestroy() {
        this.endTagCloud();
    }
}
