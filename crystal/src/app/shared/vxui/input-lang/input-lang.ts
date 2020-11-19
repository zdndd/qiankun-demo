import { Component, ViewChild, ElementRef,Optional,Inject, ChangeDetectionStrategy,Input, forwardRef, ChangeDetectorRef } from '@angular/core';
import { FormGroup, ControlValueAccessor, NG_VALUE_ACCESSOR, ValidatorFn, NG_VALIDATORS, AbstractControl, ValidationErrors } from '@angular/forms';
import { Subject, Subscription, fromEvent, merge } from 'rxjs';
import { debounceTime,distinctUntilChanged } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';
import * as _ from 'lodash';

import {
    CdkConnectedOverlay,
    CdkOverlayOrigin,
    ConnectedOverlayPositionChange,
    ConnectionPositionPair
} from '@angular/cdk/overlay';

const FORM_POSITION_PICKER_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => VxInputLangComponent),
    multi: true
};


@Component({
    selector: 'vx-input-lang',
    providers: [FORM_POSITION_PICKER_VALUE_ACCESSOR],
    changeDetection: ChangeDetectionStrategy.Default,
    template: `
    <div  cdkOverlayOrigin
    #origin="cdkOverlayOrigin" class="input-icon">
    <a (click)="openPicker()"><i class="vx-icon-yuyan"></i></a>
    <input (focus)="handleFocus($event)" (click)="onClickInputBox()" #langinput (ngModelChange)="onValueChange(0,$event)" [(ngModel)]="values[0].value" type="text" [placeholder]="values[0].label">
</div>
<!-- Overlay -->
<ng-template
  cdkConnectedOverlay
  [cdkConnectedOverlayOrigin]="origin"
  [cdkConnectedOverlayOpen]="realOpenState"
  [cdkConnectedOverlayHasBackdrop]="false"
  [cdkConnectedOverlayPositions]="overlayPositions"
  (positionChange)="onPositionChange($event)"
  (backdropClick)="onClickBackdrop()"
  (detach)="onOverlayDetach()"
>
  <div
    class="input-lang input-lang-popup"
    style="position: relative;"
    [style.width]="inputWidth+'px'"
    [style.left]="currentPositionX === 'start' ? '0px' : '0px'"
    [style.top]="currentPositionY === 'top' ? '0px' : '0px'"
  > <!-- Compatible for overlay that not support offset dynamically and immediately -->
    <div class="drop-down-list input-lang-item" style="display:block">
        <ul>
        <ng-container *ngFor="let item of values;let i=index">
            <li *ngIf="i>0">
                <label>{{item.label}}</label>
                <input [(ngModel)]="item.value" (ngModelChange)="onValueChange(i,$event)" type="text" placeholder="{{item.label}}">
            </li>
        </ng-container>
        </ul>
    </div>
  </div>
</ng-template>
  `
})
export class VxInputLangComponent implements ControlValueAccessor {

    private _values = [{value:"",label:"中"}, {value:"",label:"英"}]
    private _subjects:Subject<string>[] = []
    overlayBackdropClickSubscription:Subscription;
    overlayOpen: boolean = false; // Available when "open"=undefined
    dropdownAnimation: 'top' | 'bottom' = 'bottom';
    currentPositionX: 'start' | 'end' = 'start';
    currentPositionY: 'top' | 'bottom' = 'top';
    inputWidth = ""
    overlayPositions: ConnectionPositionPair[] = [
        {
          offsetY: 28,
          originX : 'start',
          originY : 'top',
          overlayX: 'start',
          overlayY: 'top'
        },
        {
          offsetY: -28,
          originX : 'start',
          originY : 'bottom',
          overlayX: 'start',
          overlayY: 'bottom'
        },
        {
          originX : 'end',
          originY : 'top',
          overlayX: 'end',
          overlayY: 'top'
        },
        {
          originX : 'end',
          originY : 'bottom',
          overlayX: 'end',
          overlayY: 'bottom'
        }
      ] as ConnectionPositionPair[];

    @ViewChild('origin',{static: true}) origin: CdkOverlayOrigin;
    @ViewChild(CdkConnectedOverlay, { static: true }) cdkConnectedOverlay: CdkConnectedOverlay;
    @ViewChild('langinput',{static: true}) langInput: ElementRef;


    constructor(public elementRef: ElementRef, public cd: ChangeDetectorRef,@Optional() @Inject(DOCUMENT) private _document: any) {

    }

    get realOpenState(): boolean { // The value that really decide the open state of overlay
        return this.overlayOpen;
    }



    openPicker() {
        this.showOverlay();

    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.inputWidth = this.langInput.nativeElement.offsetWidth
            // this.langInput.nativeElement.focus();
        }, 100)
    }


    onClickBackdrop(): void {
        this.hideOverlay();
    }

    onOverlayDetach(): void {
        this.hideOverlay();
    }

    get values(){
        return this._values;
    }

    set values(value){
        this._values =value
    }


    onPositionChange(position: ConnectedOverlayPositionChange): void {
        this.dropdownAnimation = position.connectionPair.originY === 'top' ? 'bottom' : 'top';
        this.currentPositionX = position.connectionPair.originX as 'start' | 'end';
        this.currentPositionY = position.connectionPair.originY as 'top' | 'bottom';
        this.cd.detectChanges(); // Take side-effects to position styles
        // console.log(this.currentPositionX,this.currentPositionY)
    }


    subscribeOverlayBackdropClick():Subscription{
        return fromEvent(this._document,"click").subscribe((event:MouseEvent)=>{
            const clickTarget = event.target as HTMLElement;
            // console.log(clickTarget==this.elementRef.nativeElement)
            // console.log(this.elementRef.nativeElement.contains(clickTarget))
            // console.log(this.cdkConnectedOverlay.overlayRef.overlayElement.contains(clickTarget))
            if(clickTarget!=this.elementRef.nativeElement && !this.elementRef.nativeElement.contains(clickTarget)  && this.overlayOpen && !this.cdkConnectedOverlay.overlayRef.overlayElement.contains(clickTarget)){
                this.hideOverlay()
            }
        })
    }


    _onTouched: any = () => { }
    _valueChange: any = (value: any) => { }


    ngOnInit(){
        this.syncSubjects()
    }

    writeValue(value: any) {
        if (value) {
            let splits = value.split("_,_")
            let initValues = [];
            _.each(splits,(item,index)=>{
                if(index==0)
                    initValues.push({value:item,label:"中"})
                else
                    initValues.push({value:item,label:"英"})
            })
            this._values = initValues;
            this.syncSubjects()
            this.cd.detectChanges(); // Take side-effects to position styles
        }
    }

    syncSubjects(){
        this._subjects = [];
        this._values.forEach(()=>{
            let subject = new Subject<string>();
            subject.pipe(debounceTime(100),distinctUntilChanged()).subscribe((model)=>{
                var arr = this._values.map((item)=>{
                    return item.value
                });
                let realValue = arr.join("_,_")
                if(realValue=="_,_"){
                    realValue = ""
                }
                console.log("changeValue"+realValue)
                this._valueChange(realValue)
            })
            this._subjects.push(subject)
        })

    }

    registerOnChange(fn: any) {
        this._valueChange = fn;
    }

    registerOnTouched(fn: any) {
        this._onTouched = fn
    }

    onValueChange(index,model) {
        if(this._subjects[index]){
            this._subjects[index].next(model)
        }
    }


    onClickInputBox(){
        this.showOverlay();

    }

    handleFocus(event): void {
        event.preventDefault()
        this._onTouched();
    }



    showOverlay(): void {
        if (!this.realOpenState) {
            this.inputWidth = this.langInput.nativeElement.offsetWidth
            this.overlayOpen = true;
            this.overlayBackdropClickSubscription = this.subscribeOverlayBackdropClick()
            setTimeout(() => {
                if (this.cdkConnectedOverlay && this.cdkConnectedOverlay.overlayRef) {
                   this.cdkConnectedOverlay.overlayRef.updatePosition();
                }
            });
        }
    }

    hideOverlay(): void {
        if (this.realOpenState) {
            this.overlayOpen = false;
            this.cd.detectChanges()
        }


        if(this.overlayBackdropClickSubscription){
            this.overlayBackdropClickSubscription.unsubscribe()
        }
    }


    ngOnDestroy() {

        if(this.overlayBackdropClickSubscription){
            this.overlayBackdropClickSubscription.unsubscribe()
        }

    }
}
