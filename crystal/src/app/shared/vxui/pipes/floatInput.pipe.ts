/**
浮点树输入
1、长度为6
2、小数点只有一位
3、正数
4、不等于0
**/


import { Input, HostListener, ViewChild, ContentChild, Directive, Renderer, ElementRef } from '@angular/core';
import { NzInputNumberComponent } from 'ng-zorro-antd';


@Directive({

    selector: "[floatInput]",
    host: {

    }

})
export class FloatInputDirective {

    @Input() selectedColor: string = '';
    @Input() decimalNumber: Number = 6; //保留小数位数,默认不限制


    @HostListener("input", ["$event"])
    oninputHandler(event) {
        let oldValue = event.target.value
        oldValue = oldValue.replace(/[^\d\.]/g, '');
        let newValue = "";
        if (oldValue == ".") {
            newValue = "";
        }
        else if (oldValue.indexOf(".") >= 0) {
            if (this.decimalNumber > 0) {
                newValue = oldValue.split('.')[0].substr(0, 6) + '.' + oldValue.split('.')[1].substr(0, this.decimalNumber);
            } else {
                newValue = oldValue.split('.')[0].substr(0, 6) + '.' + oldValue.split('.')[1].substr(0);
            }
        }
        else {
            newValue = oldValue.substr(0, 6)
        }
        if (newValue.substr(0, 1) == "0" && newValue.substr(1, 1) != ".") {
            newValue = "0";
        }

        //event.target.value = newValue
        console.log(newValue)
        this._input.setValue(Number(newValue),true)

    }

    @ContentChild(NzInputNumberComponent, { static: true }) _input: NzInputNumberComponent;

    constructor(public el: ElementRef, renderer: Renderer) {

    }

    ngAfterViewInit() {


    }


}
