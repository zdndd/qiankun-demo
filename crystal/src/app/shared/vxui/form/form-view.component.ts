import { Component, Output,ChangeDetectorRef,NgZone, OnInit, SimpleChanges, ElementRef, HostBinding, ChangeDetectionStrategy, Input, HostListener, EventEmitter } from '@angular/core';
import { FormGroup, FormControl,FormBuilder, Validators, AbstractControl } from '@angular/forms';
import * as _ from 'lodash';
import {take, takeUntil} from 'rxjs/operators';
import { NzMessageService } from 'ng-zorro-antd';
import { NzModalService } from 'ng-zorro-antd';
import { of, Observable, Subscription } from 'rxjs';
import { VXDialogService } from "../service/dialog.service"
import { _HttpClient } from "../../../core/net/http.client"
import { ScrollBarHelper } from "../../../utils/scrollbar-helper"
import { transition } from '@angular/animations';
declare var $;
import {FormService} from "./form.service"
import { TranslateService } from '@ngx-translate/core';
export function removeSpaces(control: AbstractControl) {
    if (control && control.value && !control.value.replace(/\s/g, '').length) {
      control.setValue('');
    }
    return null;
}

export function noWhitespaceValidator(control: FormControl) {
    try{
        const isWhitespace = (control.value || '').trim().length === 0;
        const isValid = !isWhitespace;
        return isValid ? null : { 'whitespace': true };
    }catch(err){
        return null;
    }

}

function LangInputValidator(control: AbstractControl): { [key: string]: boolean } | null {
    if(control.value && control.value.length>0){
        var splits = control.value.split("_,_")
        if(splits.length>0 && splits[0]==""){
            return { 'lang': true };
        }
    }
    return null
}


function SelectValidator(control: AbstractControl): { [key: string]: boolean } | null {
    if(control.value && control.value.length>0){
        if(control.value=="-1"){
            return { 'select_require': true };
        }

    }
    return null
}




@Component({
    selector: 'form-view',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './form-view.component.html',
    styleUrls: ['./form-view.component.less']
})
export class FormViewComponent implements OnInit {

    form: FormGroup;
    _config;
    _fields = []
    _fieldsByKey = {}
    _height;
    _scrollbar;
    saving = false;
    loading = false;
    formValueChangeSub:Subscription;

    @Output() commit: EventEmitter<any> = new EventEmitter();
    @Output() valueChange: EventEmitter<any> = new EventEmitter();

    @Input()
    editMode = false;

    @Input() showHeader = true;
    @Input() paddingBottom = 0;
    @Input() paddingTop = 0;


    @Input()
    set height(value) {
        this._height = value;
    }

    get height() {
        return this._height;
    }

    @Input()
    set fields(val) {
        //this._fields = val;
        this.clear();
        this._fields = val;
        this._fields.forEach((fieldItem) => {
            fieldItem.field = fieldItem["id"];
            if(typeof(fieldItem.isViewMode)=="boolean" && fieldItem.isViewMode==false){
                fieldItem.disabled = false;
            }else{
                fieldItem.isViewMode = this._config["isViewMode"];
                if(fieldItem.isViewMode)
                    fieldItem.disabled = true;
            }
            // fieldItem.value = fieldItem.value || ""
            fieldItem.errMsg = fieldItem.errMsg || this.getDefaultErrMsg(fieldItem)
        })
        this._fieldsByKey = {}
        this._fields.forEach(config => {
            if(config.type!="subheader"){
                this._fieldsByKey[config.field] = config
                this.form.addControl(config.field, this.createControl(config))
            }

        });

    }

    get fields() {
        return this._fields;
    }


    @Input()
    set config(val) {

        if (!this.form)
            this.form = this.fb.group({});
        if (!val) {
            return;
        }
        // val = Object.assign(this.getDefaultConfig(), val);
        // this._config = _.cloneDeep(val);

        // val = Object.assign(this.getDefaultConfig(), val);
        this._config = val;
        this.fields = this._config["fields"]

    }

    get config() {
        return this._config
    }

    @Input() customSubmitCheck: (formData: any) => boolean;


    constructor(
        private _ngZone: NgZone,
        public translateService:TranslateService,
        public formService:FormService,
        private messageService: NzMessageService,
        public cd:ChangeDetectorRef,
        public http: _HttpClient,
        public elementRef: ElementRef,
        private dialogService: VXDialogService,
        private fb: FormBuilder,
        private modalService: NzModalService) {

    }


    ngOnInit() {
        if (this.config["loadFieldUrl"]) {
            this.loading = true;
            this.loadFieldData();

        }


        if (this.config["loadDataUrl"]) {
            this.loadData();


        }

        if(this.form){
            this.formValueChangeSub = this.form.valueChanges.subscribe(()=>{
                this.valueChange.emit(this.form.value)
            })
        }




    }

    onBeforeSubmitCheck = (value) => {
        return true;
    }




    ngAfterViewInit() {
       this.resizeHeight(0)
    }

    resizeHeight(delay = 0){
        if (this._height) {
            var $hostEle = $(this.elementRef.nativeElement)
            $hostEle.find('.layout-form-content').css('max-height', this._height + 'px')
            $hostEle.find('.layout-form-content').css('overflow', 'hidden')
            setTimeout(()=>{
                this.drawScrollbar()
            },delay)
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        console.log(changes)
        if (changes["height"] && this._scrollbar) {
            var $hostEle = $(this.elementRef.nativeElement);
            $hostEle.find('.layout-form-content').css('max-height', this._height + 'px')
            this._scrollbar.update();
        }
    }

    clear() {
        if (this.form) {
            this._fields = []
            let controls = Object.keys(this.form.controls)
            controls.forEach((controlKey) => {
                this.form.removeControl(controlKey)
            })
        }
    }

    createControl(config) {
        let { required,disabled,type, value,minLength,maxLength,rule } = config;
        let validation = [];
        if(required) {
            validation.push(Validators.required);
            if(type=="text" || type=="textarea"){
                validation.push(noWhitespaceValidator);
            }
        }

        if(type=="text"|| type=="textarea"){
            if(minLength) {
                validation.push(Validators.minLength(minLength))
            }
            if(maxLength) {
                validation.push(Validators.maxLength(maxLength))
            }
        }


        if(config.type == "lang" && required){
            validation.push(LangInputValidator)
        }


        if(type=="select" && required){
            validation.push(SelectValidator)
        }

        if(rule){
            let pattern;
            switch(rule.toLowerCase()){
                case "mobilenumber": //手机号+小灵通
                    pattern = /^([0-9]{8})$|^((0|1)[0-9]{10})$/;
                    break;
                case "phonenumber": //固定电话
                    pattern = /^0\d{2,3}-?\d{7,8}$/;
                    break;
                case "email": //邮件
                    pattern = /^[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?$/;
                    //reg = /^(\w|-)+(\.(\w|-)+)*@(\w|-)+((\.\w{2,3}){1,3})$/;
                    break;
                case "isletter": //英文
                    pattern = /^[A-Za-z\s]+$/;
                    break;
                case "ischinese": //中文
                    pattern = /^[\u4e00-\u9fa5]+$/;
                    break;
                case "iscode": //英文字母、数字、下划线
                    pattern = /^[0-9a-zA-Z_]*$/;
                    break;
                case "idcard": //身份证
                    pattern = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
                    break;
                case "password": //密码
                    pattern = /^[^\s]{6,20}$/;
            }

            if(pattern){
                validation.push(Validators.pattern(pattern))
            }
        }

        if(this._config["disabled"]){
            disabled = true;
        }

        if(this._config.isViewMode){ //预览模式没有验证
            validation = [];
        }
        return this.fb.control({ disabled, value }, validation.length>0?validation:null);
    }

    isValid(){
        return this.form.valid;
    }


    validata(silent = false) {
        if(!silent){
            let controls = Object.keys(this.form.controls)
            controls.forEach((controlKey) => {
                let control: AbstractControl = this.form.controls[controlKey];
                control.updateValueAndValidity();
                control.markAsDirty();
                control.markAsTouched();
            })
            this.cd.detectChanges()
        }

        if (!this.form.valid) {

            const invalidElements = this.elementRef.nativeElement.querySelectorAll('.ng-invalid');
            console.log(invalidElements)
            if (invalidElements.length > 1) {
                let firstErrorElement = invalidElements[1]
                //第一个元素是form
                if(firstErrorElement.tagName!="INPUT" && firstErrorElement.tagName!="SELECT"){
                    if(firstErrorElement.querySelectorAll('input').length>0){
                        firstErrorElement = firstErrorElement.querySelectorAll('input')[0]
                    }
                }
                try{
                    firstErrorElement.focus();
                    // firstErrorElement.scrollIntoView({ behavior: 'smooth' });
                }catch(e){
                    console.error(e)
                }

            }


            _.each(this._fields, (field) => {
                var formControl = this.form.controls[field.field]
                // console.log(formControl.errors)
                if (formControl && formControl.errors) {
                    // console.log(field.errMsg)
                    console.log(formControl)
                    if(formControl.errors["required"]){
                        //this.dialogService.alert(this.getDefaultErrMsg(field))
                        return false;
                    }
                    if(formControl.errors["minlength"]){
                        //this.dialogService.alert(field.label+"最少不少于"+formControl.errors.minlength.requiredLength+"个字符")
                        return false;
                    }
                    if(formControl.errors["maxlength"]){
                        //this.dialogService.alert(field.label+"不得超过"+formControl.errors.maxlength.requiredLength+"个字符")
                        return false;
                    }

                    if(formControl.errors["lang"]){
                        //this.dialogService.alert(this.getDefaultErrMsg(field))
                        return false;
                    }
                }
            })
            return false
        }
        return true;
    }

    getValue() {
        var ret = Object.assign({},this.form.value)
        _.each(ret,(value,key)=>{
            if(typeof(value)=="undefined"){
                ret[key]=""
            }
        })
        return ret;
    }

    /**
     *
     * @param silent  是否沉默
     */
    submitHandler(silent = false) {
        console.log(this.form.value)
        let validataRes = this.validata(silent);
        if(this.customSubmitCheck && validataRes){
            validataRes = this.customSubmitCheck({config:this._config,value:this.form.value})
        }
        if (validataRes) {
            if(this._config["saveUrl"]){
                this.saving = true;
                this.cd.detectChanges();
                console.log("try submit form")
                console.log(this.getValue())
                let postData = this.getValue();
                if(this._config["saveParams"] && this._config["saveKey"]){
                    let saveParams = Object.assign({},this._config["saveParams"])
                    Object.assign(saveParams[this._config["saveKey"]],this.getValue());
                    postData = Object.assign({},saveParams);
                    console.log(postData)
                }
                this.http.post(this._config["saveUrl"],postData).subscribe((res)=>{
                    console.log(res)
                    this.saving = false;
                    this.cd.detectChanges();
                    if(!silent){
                        this.messageService.create("success", this.translateService.instant("Save Success"));
                    }
                    this.commit.emit(res)
                },()=>{
                    if(!silent){
                        //this.messageService.warning(this.translateService.instant("Save Failed"));
                    }
                    this.saving = false;
                    this.cd.detectChanges();
                })

            }
            else{
                this.commit.emit(this.form.value)
            }
        }

    }

    loadData() {
        this.http.get(this.config["loadDataUrl"], {  }).subscribe((res: any) => {
            let data = res;
            let controls = Object.keys(this.form.controls)
            controls.forEach((controlKey) => {
                let control: AbstractControl = this.form.controls[controlKey]
                let value = data[controlKey]
                if (value) {
                    let fieldConfig = this._fieldsByKey[controlKey]
                    control.setValue(value, { emitEvent: true })
                }
            })

            this.cd.detectChanges()


        })
    }

    loadFieldData(){
        this.http.get(this.config["loadFieldUrl"]).subscribe((res:any)=>{
            let formData = this.formService.generateForm(res,this._config["isViewMode"])
            this.fields = formData["fields"];
            this.loading = false;
                    this._ngZone.onStable
                        .asObservable()
                        .pipe(take(1))
                        .subscribe(() => {
                           this.drawScrollbar()
                    });
            this.cd.detectChanges()
        })
    }

    drawScrollbar(){
        //设置了高度才需要滚动条
        if(this._height){
            if(this._scrollbar){
                this._scrollbar.update()
            }else{
                this._scrollbar = ScrollBarHelper.makeScrollbar(this.elementRef.nativeElement.querySelector('.layout-form-content'));
            }
        }

    }

    getExportData() {
        let exportData = Object.assign(this._config)
        exportData["fields"] = this._fields;
        return exportData
    }


    getDefaultErrMsg(fieldData) {
        var msg = "";
        let label = fieldData.label;
        if (fieldData.type == "text" || fieldData.type == "password" || fieldData.type == "lang" || fieldData.type == "number" || fieldData.type == "textarea") {
            msg = this.translateService.instant("Please Input",{"field":label});
        } else if (fieldData.type == "radio") {
            msg = this.translateService.instant("Please Choose",{"field":label});
        } else if (fieldData.type == "uploader") {
            msg =  this.translateService.instant("Please Choose",{"field":label});
        } else if (fieldData.type == "date" || fieldData.type == "datetime" || fieldData.type == "time" || fieldData.type == "year" || fieldData.type == "month") {
            msg =  this.translateService.instant("Please Choose",{"field":label});
        } else if (fieldData.type == "checkbox") {
            msg = this.translateService.instant("Please Select At Least One Option",{"field":label});
        } else if (fieldData.type == "select" || fieldData.type == "itemselect" || fieldData.type == "select3") {
            if (fieldData.multiple)
                msg = this.translateService.instant("Please Select At Least One Option",{"field":label});
            else
                msg = this.translateService.instant("Please Choose",{"field":label});
        }
        return msg;
    }


    static getDefaultConfig(){
        // return {
        //     "name":  this.translateService.instant("Empty form"),
        //     "width": "100%",
        //     "colNum": 1,
        //     "buttonPosition": "left",
        //     "buttons": [],
        //     "loadFieldUrl":"",
        //     "loadUrl":"",
        //     "fields": []
        // }

    }

    ngOnDestroy() {
        if (this._scrollbar) {
            this._scrollbar.destroy();
            this._scrollbar = null;
        }

        if(this.formValueChangeSub){
            this.formValueChangeSub.unsubscribe();
            this.formValueChangeSub = null;
        }
    }


}
