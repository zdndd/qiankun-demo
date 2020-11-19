import { Component, OnInit, HostListener, ElementRef, AfterViewInit,OnDestroy,ChangeDetectorRef } from '@angular/core';
import { HomeService } from '../service/home.service';
import { TranslateService } from '@ngx-translate/core';
import { VXDialogService } from '../../../../shared/vxui/service/dialog.service';
import { ScrollBarHelper } from '../../../../utils/scrollbar-helper';
import { NzModalService } from 'ng-zorro-antd';
import { VxDialogConfirmComponent } from 'src/app/shared/vxui/dialog/confirm/confirmcomponent';

@Component({
    selector: 'app-dictionary',
    templateUrl: './dictionary.component.html',
    styleUrls: ['./dictionary.component.less'],
})
export class DictionaryComponent implements OnInit,AfterViewInit,OnDestroy {
    tabs: any[] = [];
    nzTabPosition = 'left';
    selectedIndex = 0;
    abilityData = [];
    selectedItem = null;
    descriptionValue = '';
    isOpenModal=false;
    private _scrollBar = null;
    contentEle = null
    // @ViewChild(PrettyScrollDirective, { static: true }) prettyScrollbar: PrettyScrollDirective;

    constructor(
        public elementRef: ElementRef,
        private homeService: HomeService,
        private translateService: TranslateService,
        public dialogService: VXDialogService,
        public cd: ChangeDetectorRef,
        public modalService: NzModalService
    ) {
      this.cancelSelect=this.cancelSelect.bind(this)
    }

    @HostListener('document:click', ['$event'])
    documentClick(event) {
        // 弹出层关闭的情况下,检查失去焦点
      if(!this.isOpenModal){
        this.checkIsDirty()?this.onCheck(this.selectedItem):this.cancelSelect();
      }
    }

    checkIsDirty (){
        return  this.selectedItem && this.selectedItem.description !==this.descriptionValue
    }

    menuSelectChange($event) {
        this.contentEle.scrollTop = 1;
        this._scrollBar.update()
    }

    makeScrollbar() {
        setTimeout(() => {
            this.contentEle  = this.elementRef.nativeElement.querySelector('.ant-tabs-content');
            if (this.contentEle ) {
                this._scrollBar = ScrollBarHelper.makeScrollbar(
                    this.contentEle ,
                );
            }
        }, 200);
    }

    ngOnInit() {
        this.getAbilityData();
    }

    ngAfterViewInit() {
        this.makeScrollbar();
    }

    getAbilityData() {
        this.homeService.getAbilityDicList().subscribe(res => {
            this.abilityData = res;
        });
        this.makeScrollbar();
    }

    onSelect(item, event) {
        event.preventDefault();
        event.stopPropagation();
        if(item === this.selectedItem) return;
        const callback=()=>{
            this.selectedItem = item;
            this.descriptionValue = item.description
        }
        if(this.checkIsDirty())this.onCheck(this.selectedItem, callback)
        else callback()
    }

    cancelSelect() {
        this.selectedItem = null;
    }

    onCheck(item, callback=this.cancelSelect){
      this.isOpenModal=true;
      this.modalService.create({
            nzTitle: this.translateService.instant('Remind'),
            nzWidth: "340",
            nzMaskClosable:false,
            nzClosable: false,
            nzContent: VxDialogConfirmComponent,
            nzOnOk: () =>{
                this.save(item, callback);
                this.isOpenModal=false
            },
            nzOnCancel:()=>{
                callback()
                setTimeout(()=>this.isOpenModal=false,500)
            },
            nzComponentParams: {
                message: "是否保存修改？",
            },
            nzFooter: null
        });
    }

    save(item, callback=this.cancelSelect) {
        event.preventDefault();
        event.stopPropagation();
        const Description	 = this.descriptionValue;
        const Id = item.id;
        item.description = Description;
        this.homeService.setAblityDescription({ Description, Id }).subscribe(e => {
          callback();
        });
    }

    cancel(event) {
        event.preventDefault();
        event.stopPropagation();
        this.cancelSelect();
    }

    restoreDefault(item, callback=this.cancelSelect) {
        event.preventDefault();
        event.stopPropagation();
        const Id = item.id;
        this.homeService.resetAblityDescription({ Id }).subscribe(e => {
          callback();
          this.getAbilityData();
        });
    }

    ngOnDestroy() {
        if (this._scrollBar) {
            this._scrollBar.destroy();
            this._scrollBar = null;
        }
    }
}
