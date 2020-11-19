import {
    Component,
    ElementRef,
    Input,
    OnInit,
    Renderer2,
    Output,
    EventEmitter, SimpleChanges,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { KNXDataService } from '../../../../core/knxdata.service';
import { gradientColor } from '../../../../utils/gradient';
@Component({
    selector: 'conclusion-inner-top',
    templateUrl: './conclusion-inner-top.component.html',
    styleUrls: ['./conclusion-inner-top.component.less'],
})
export class ConclusionInnerTopComponent implements OnInit {
    dataObj = {
        conclusionList: [],
        tabid: null,
        modelid: null,
        autotabid: null,
    };
    colors = [];
    @Input() list = [];
    @Output() submit = new EventEmitter<any>();
    @Input() modelid: number;  //模型id
    @Input() tabid: number;  //页签Id ,
    @Input() autotabid: number;  //领导访谈切换方法tabid
    // @Input() itemList= {
    //     conclusionList: [],
    //     tabid: null,
    //     modelid: null,
    // };
    // get itemList() {
    //     return this.dataObj;
    // }
    // set itemList(ls) {
    //     this.dataObj = ls;
    // }
    constructor(
        public translateService: TranslateService,
        public modalService: NzModalService,
        public dataService: KNXDataService,
        private messageService: NzMessageService,
    ) { }
    ngOnInit() {
        // console.log(this.list);
        this.dataObj['tabid'] = this.tabid;
        this.dataObj['modelid'] = this.modelid;
        this.dataObj['autotabid'] = this.autotabid;
        this.colors = gradientColor('#5530d9', '#d8cdfd', this.list.length);
    }
    ngOnChanges(changes: SimpleChanges) {
        if (changes["list"]) {
            this.colors = gradientColor('#5530d9', '#d8cdfd', this.list.length);
        }
    }
    deleteOne(id) {
        // console.log(this.dataObj,'-this.dataObj-');
        const params = {
            tabid: this.dataObj.tabid,
            modelid: this.dataObj.modelid,
            autotabid: this.dataObj.autotabid,
            abilityid: id,
        };
        this.dataService.DeleteProportion(params).subscribe(res => {
            // console.log(res,'-res--');
            if (res.errorcode === 0) {
                this.list = this.list.filter(item => item.abilityid !== id);
                this.colors = gradientColor('#5530d9', '#d8cdfd', this.list.length);
                this.submit.emit(this.list);
            } else {
                this.messageService.error(res.message);
            }

        })
    }
}
