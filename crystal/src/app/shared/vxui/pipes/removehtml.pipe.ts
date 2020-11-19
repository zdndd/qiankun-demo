import { PipeTransform, Pipe } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';


@Pipe({ name: 'removeHtml' })
export class RemoveHtmlPipe implements PipeTransform {
    constructor() { }
    transform(value) {
        if (value) {
            try{
                value = value.replace(/<\/?[^>]*>/g, '');
                value = value.replace(/[ | ]*\n/g, '\n');
            }catch(e){

            }
            
        }
        return value;
    }
}
