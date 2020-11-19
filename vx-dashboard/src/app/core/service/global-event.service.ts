import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GlobalEvent {
  emit(eventname: string, ...args: any) {
    console.log('dashboard emit');
    const event = new CustomEvent(eventname, {
      detail: args,
    });
    window.dispatchEvent(event);
  }

  on(eventname: string, fn, win?): any {
    let _win: any = win ? win : window;
    // Object.assign(this,)
    _win.addEventListener(eventname, (e: any) => fn.apply(this, e.detail));
  }
}
