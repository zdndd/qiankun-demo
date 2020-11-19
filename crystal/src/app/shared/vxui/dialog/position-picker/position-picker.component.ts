import { Component, OnInit, Input,ElementRef,ViewChild } from '@angular/core';
import { _HttpClient } from "../../../../core/net/http.client"
import { HttpClient } from "@angular/common/http"
import { NzModalRef, NzModalService } from 'ng-zorro-antd';
import { NzFormatEmitEvent, NzTreeNode } from 'ng-zorro-antd';
declare var $:any;
import {ScrollBarHelper} from "../../../../utils/scrollbar-helper"
import {VXTableViewComponent} from "../../tableview/table-view.component"
import {AppService} from "../../../../core/app.service"
import * as _ from 'lodash';
import {FormControl} from "@angular/forms"
import { debounceTime } from 'rxjs/operators';
import {TranslateService} from "@ngx-translate/core"

@Component({
    selector: 'vx-dialog-position-picke',
    templateUrl: './position-picker.component.html',
    styleUrls: ['./position-picker.component.less']
})
export class PositionPickeDialogComponent implements OnInit {

    private _treeScrollbar:any;
    @Input() message: string;
    columns = []
    rows = []
    buttons = []
    defaultCheckedKeys = ['0-0-0'];
    defaultSelectedKeys = [];
    defaultExpandedKeys = ['0-0', '0-0-0', '0-0-1'];
    selectedNodeId = "";
    serverUrl = "";
    nodes = [];
    searchControl:FormControl;
    searchData = {OrgID:0,PositionName_like:""}

    constructor(public translateService:TranslateService,private appService:AppService,private http:_HttpClient,private modal: NzModalRef,public element:ElementRef) {
        this.serverUrl = "Candidates/GetPositionByOrg?customerid="+this.appService.cmpid+"&UserID="+this.appService.userId
    }

    @ViewChild(VXTableViewComponent, { static: true }) tableView:VXTableViewComponent;

    ngOnInit() {
        this.searchControl = new FormControl("",[])
        this.searchControl.valueChanges.pipe(debounceTime(250)).subscribe((newVal)=>{
            console.log(newVal);
            this.searchData.PositionName_like = newVal;
            setTimeout(()=>{
                this.tableView.reload();
            },0)
        })
        this.buttons = []

        this.columns = [
            {
                "field": "Id",
                "width": 100,
                "label": this.translateService.instant("Sn"),
                "fixedLeft": true
            },
            {
                "field": "operatorId",
                "width": 150,
                "label": this.translateService.instant("Operation"),
                "fixedRight": true,
                "links":[
                    {
                        "label":this.translateService.instant("Choose"),
                        "value":"selector",
                    }
                ]
            },
            {
                "field": "jobName",
                "width": 150,
                "label": this.translateService.instant("Position Code")
            },
            {
                "field": "hetongBianhao",
                "width": 150,
                "label": this.translateService.instant("Position Name")
            },
            {
                "field": "hetongBianhao",
                "width": 150,
                "label": this.translateService.instant("Superior Positions")
            },
            {
                "field": "hetongBianhao",
                "width": 150,
                "label": this.translateService.instant("Position of Supervisor")
            }

        ]


    }

    cancelHandler(): void {
        this.modal.triggerCancel();
    }

    okHandler(): void {
        this.modal.triggerOk();
    }

    operationLinkClickHandler(data){
        // console.log(data)
        if(data.action=="selector"){
            console.log(data)
            this.modal.close(data["data"])
        }
    }

    bindTreeScrollbar(){
        this._treeScrollbar = ScrollBarHelper.makeScrollbar(this.element.nativeElement.querySelector(".tree-content"))
    }

    nzEvent(evt){
        console.log(evt.node.key)
        this.selectedNodeId = evt.node.key;
        this.searchData.OrgID = evt.node.key;
        setTimeout(()=>{
            this.tableView.reload();
        },0)

    }

    treeExpandChangeHandler(evt){
        if(this._treeScrollbar){
            setTimeout(()=>{
                this._treeScrollbar.update();
            },100)
       }
    }

    loadTreeData(){
        let nodeMap = {}
        function getChildNodes(id){
            let res = []
            _.each(nodeMap,(value,key)=>{
                if(value["pId"] == id){
                    let childrens = getChildNodes(value["id"]);
                    if(childrens.length>0){
                        res.push({
                            title: value["name"],
                            key: value["id"],
                            children: childrens
                        })
                    }else{
                        res.push({
                            title: value["name"],
                            key: value["id"],
                            isLeaf: true
                        })
                    }

                }
            })
            return res;
        }

        this.http.get("Candidates/GetDepTree?customerid="+this.appService.cmpid+"&userid="+this.appService.userId).subscribe((res:any)=>{
            let orglist = res.orglist || [];
            orglist.forEach((nodeData)=>{
                nodeMap[nodeData.id] = nodeData;
            })

            this.nodes = getChildNodes(res.rootorgid);
            console.log(this.nodes)
        })
    }

    ngAfterViewInit(){
        this.loadTreeData()
        this.tableView.queryData = this.searchData;

        setTimeout(()=>{
            this.bindTreeScrollbar();
        },1000)
    }

    ngOnDestroy(){
       if(this._treeScrollbar){
            this._treeScrollbar.destroy();
            this._treeScrollbar = null;
       }
    }



}
