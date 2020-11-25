import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GlobalEvent {
  emit(eventname: string, ...args: any) {
    console.log('----主 emit------', eventname);
    const event = new CustomEvent(eventname, {
      detail: args,
    });
    window.dispatchEvent(event);
  }

  on(eventname: string, fn, win?): any {
    console.log('----主 on------', eventname);
    let _win: any = win ? win : window;
    _win.addEventListener(eventname, (e: any) => fn.apply(this, e.detail));
  }
}
