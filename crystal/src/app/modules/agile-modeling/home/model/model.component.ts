import {
    CdkDragDrop,
    CdkDropList,
    CdkDropListGroup,
    moveItemInArray,
} from '@angular/cdk/drag-drop';
import { ViewportRuler } from '@angular/cdk/overlay';
import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    HostListener,
    OnInit,
    ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { DataState } from 'src/app/constants/app.constants';
import { AppService } from 'src/app/core/app.service';
import { AgileBaseChart } from 'src/app/modules/agile-modeling/components/base-chart';
import { VXDialogService } from 'src/app/shared/vxui/service/dialog.service';
import { HomeService } from '../service/home.service';
import { ModelFormComponent } from './components/model-form/model-form.component';

@Component({
    selector: 'app-model',
    templateUrl: './model.component.html',
    styleUrls: ['./model.component.less'],
})
export class ModelComponent extends AgileBaseChart implements OnInit, AfterViewInit {
    loading = DataState.LOADING;
    list = [];
    modelEditId = null;
    maximumdata = {
        currentmaximum: 0,
        maximum: 0,
    };
    searchKeyword = '';
    // 拖拽
    @ViewChild(CdkDropListGroup, { static: true }) listGroup: CdkDropListGroup<CdkDropList>;
    @ViewChild(CdkDropList, { static: true }) placeholder: CdkDropList;
    public target: CdkDropList;
    public targetIndex: number;
    public source: CdkDropList;
    public sourceIndex: number;
    public dragIndex: number;
    public activeContainer;

    constructor(
        public cd: ChangeDetectorRef,
        public dataService: HomeService,
        public appService: AppService,
        public translateService: TranslateService,
        public messageService: NzMessageService,
        public modalService: NzModalService,
        public router: Router,
        public viewportRuler: ViewportRuler,
        public dialogService: VXDialogService,
    ) {
        super();
        this.target = null;
        this.source = null;
    }

    @HostListener('document:click', ['$event'])
    documentClick(event) {
        this.modelEditId = null;
    }

    ngOnInit() {
        this.loadData();
        // console.log('this.translateService===', this.translateService);
    }
    ngAfterViewInit() {
        const phElement = this.placeholder.element.nativeElement;
        phElement.style.display = 'none';
        phElement.parentElement.removeChild(phElement);
        // setTimeout(() => this.popupAddProject(null, 'add'), 1000);
    }
    get lang() {
        return this.translateService.store.currentLang.replace(/[^a-z].*$/, '');
    }

    filterData() {
        this.list.forEach(element => {
            let visible = true;
            if (this.searchKeyword) {
                visible = visible && element.modelname.includes(this.searchKeyword);
            }
            element.visible = visible;
        });
    }

    loadData() {
        // console.log('this.dataService==', this.dataService);
        this.loading = DataState.LOADING;
        this.dataService.getAbilityModelList().subscribe(data => {
            this.loading = DataState.LOADING;
            this.maximumdata = data.maximumdata;
            this.list = data.data.map(item => {
                item.visible = true;
                if (item.createdate) item.createdate = moment(item.createdate).format('YYYY-MM-DD');
                item.lstabilityproportion = item.lstabilityproportion || [];
                return item;
            });
            if (this.list.length > 0) this.loading = DataState.EXIST_DATA;
            else this.loading = DataState.EMPTY;
            // console.log(this.dataService, 'e==', data);
        });
    }
    onEdit(item) {
        this.popupAddProject(item, 'update');
    }
    onDelete(item) {
        this.dialogService.confirm(this.translateService.instant('是否删除?')).then(() => {
            this.dataService.deleteAbilityModel({ ModelId: item.id }).subscribe(res => {
                // console.log('删除成功');
                this.loadData();
            });
        });
    }
    onCopy(item) {
        const Id = item.id;
        const { currentmaximum, maximum } = this.maximumdata;
        if (
            (currentmaximum && maximum && maximum !== -1 && currentmaximum >= maximum) ||
            maximum === 0
        ) {
            this.modalService.create({
                nzTitle: '提示',
                nzBodyStyle: { 'text-align': 'center', padding: '30px 0 50px 0' },
                nzContent: `您的建模数量超出${maximum}，请与您的顾问联系。<br/>服务热线：400-820-7528`,
                nzMaskClosable: false,
                nzFooter: null,
            });
            return false;
        } else {
            this.dataService.copyAbilityModel({ Id }).subscribe(res => {
                this.loadData();
                this.messageService.success('模型复制成功!');
            });
        }
    }
    itemClick(item) {
        const base = `/agile-modeling/model/${item.id}/`;
        const url = base + (item.isclickcreatemodel ? 'home/details' : 'no-modeling');
        this.router.navigateByUrl(url);
    }

    showOperator(item, event) {
        this.modelEditId = item.id;
        event.preventDefault();
        event.stopPropagation();
    }

    // 新增-问卷预览
    popupAddProject(data: any, title) {
        const { currentmaximum, maximum } = this.maximumdata;
        if (
            (title === 'add' &&
                currentmaximum &&
                maximum &&
                maximum !== -1 &&
                currentmaximum >= maximum) ||
            maximum === 0
        ) {
            this.modalService.create({
                nzTitle: '提示',
                nzBodyStyle: { 'text-align': 'center', padding: '30px 0 50px 0' },
                nzContent: `您的建模数量超出${maximum}，请与您的顾问联系。<br/>服务热线：400-820-7528`,
                nzMaskClosable: false,
                nzFooter: null,
            });
            return false;
        }
        let params: any;
        const isAdd = !data;
        if (isAdd) {
            // 新增
            const userinfo = this.appService.getUserInfo();
            params = {
                list: [userinfo['userid']], // test code
            };
            this.popupModel(isAdd, params, data, title);
        } else {
            params = {
                id: data.id,
                name: data.modelname,
                remark: data.remark,
            };
            this.popupModel(isAdd, params, data, title);
        }
    }
    popupModel(isAdd, params, data, title) {
        const modal = this.modalService.create({
            nzTitle:
                title === 'add'
                    ? this.translateService.instant('Add New')+this.translateService.instant('Model')
                    : this.translateService.instant('Edit')+this.translateService.instant('Model'),
            nzWidth: '583px',
            nzClosable: false,
            nzMaskClosable: false,
            nzWrapClassName: 'vertical-center-modal',
            nzZIndex: 1001,
            nzBodyStyle: { height: '550px' },
            nzContent: ModelFormComponent,
            nzFooter: [
                {
                    label: this.translateService.instant('Ok'),
                    type: 'primary',
                    onClick: componentInstance =>
                        new Promise((resolve, reject) => {
                            if (componentInstance.valid()) {
                                const postData = componentInstance.getData();
                                const values = {
                                    id: isAdd ? '0' : data.id,
                                    modelname: postData.name,
                                    lstadminuser: postData.list,
                                    remark: postData.remark,
                                };
                                this.dataService.postAbilityModel(values).subscribe(res => {
                                    resolve(true);
                                    modal.destroy();
                                    this.loadData();
                                });
                            } else {
                                resolve(true);
                            }
                        }),
                },
                {
                    label: this.translateService.instant('Cancel'),
                    type: 'default',
                    onClick: componentInstance => {
                        modal.destroy();
                    },
                },
            ],
            nzComponentParams: { data: params },
        });
    }
    // 拖拽
    updateMoveItem(sourceIndex, targetIndex) {
        const resetNum = 1; // 去掉新增的占位符
        moveItemInArray(this.list, sourceIndex - resetNum, targetIndex - resetNum);
        const lstid = this.list.map(item => item.id);
        this.dataService.setAbilitySort({ lstid }).subscribe(e => {
            // console.log('拖拽保存成功', lstid);
        });
    }
}
