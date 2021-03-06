import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GlobalEvent {
  emit(eventname: string, args: any, win?) {
    let _win: any = win ? win : window;
    console.log('---emit vxhcm 10 ', _win);
    const event = new CustomEvent(eventname, {
      detail: args,
    });
    _win.dispatchEvent(event);
  }

  on(eventname: string, fn, win?): any {
    let _win: any = win ? win : window;
    _win.addEventListener(eventname, (e: any) => fn.apply(this, e.detail));
    // console.log('win: ', _win);
  }
}
