import { Component,Renderer2, OnInit, ChangeDetectionStrategy,Input,Output,EventEmitter, HostListener,HostBinding,ElementRef} from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'form-item',
    changeDetection: ChangeDetectionStrategy.Default,
    templateUrl: './form-item.component.html',
    styleUrls: ['./form-item.component.less'],
    host:{
        '[class.form-group]':'true'
    }
})
export class FormItemComponent implements OnInit {

    _required = false;
    _data = null;
    constructor(private el:ElementRef,public render:Renderer2) { }

    @HostBinding('class.required')
    get required():Boolean{
        return this._required
    }

    ngOnInit() {
    }

    @Input() 
    set data(val){
        this._data = val;
        if(val["required"]){
            this._required = true;
        }
        this.render.addClass(this.el.nativeElement,`form-${this._data["type"]}`)

    }

    get data(){
        return this._data
    }

    @Input() form: FormGroup;






    



}
