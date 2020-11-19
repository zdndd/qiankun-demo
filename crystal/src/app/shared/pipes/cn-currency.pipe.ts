import { PipeTransform, Pipe } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Pipe({ name: '_currency' })
export class CNCurrencyPipe extends CurrencyPipe implements PipeTransform {
    transform(
        value: any,
        currencyCode: string = '￥',
        display: 'code' | 'symbol' | 'symbol-narrow' | boolean = 'code',
        digits?: string): string | null {
        return super.transform(value, currencyCode, <any>display, digits);
    }
}
