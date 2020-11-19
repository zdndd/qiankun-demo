import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'empcodeFilter',
})
export class EmpcodeFilterPipe implements PipeTransform {
    transform(value: any, ...args: any[]): any {
        let Arr = value.split('@');
        return Arr[0];
    }
}
