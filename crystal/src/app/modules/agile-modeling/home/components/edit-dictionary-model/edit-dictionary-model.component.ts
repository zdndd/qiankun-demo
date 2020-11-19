import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { standardConfig } from '../../dict-config';
import * as _ from 'lodash';
import { NgModel } from '@angular/forms';
@Component({
    selector: 'app-edit-dictionary-model',
    templateUrl: './edit-dictionary-model.component.html',
    styleUrls: ['./edit-dictionary-model.component.less']
})
export class EditDictionaryModelComponent implements OnInit {
    @ViewChild('name',{static: true}) name: NgModel;
    @ViewChild('drpdownItem',{static: true}) drpdownItem: NgModel;
    @Input() data;
    dictionaryName: string = '';
    constructor() { }

    ngOnInit() {
        if (typeof (this.data) !== 'undefined' && this.data !== "") {
            this.dictionaryName =this.data.dictionaryName;
        }
    }
    getData() {
        let id = 0;
        if (typeof this.data !== 'undefined') {
            id = this.data.id;
        }

        const param = {
            id: id,
            dictionaryName: this.dictionaryName
        };

        return param;
    }

    //校验必填
    dictionaryNameValid() {
        return true;
    }
}
