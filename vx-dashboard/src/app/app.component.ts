import { Component, AfterViewInit } from '@angular/core';
import start from './core/mirco/start';
import { GlobalEvent } from './core/service/global-event.service';

@Component({
  selector: 'vx-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent implements AfterViewInit {
  title = 'vx-dashboard';
  constructor(public globalEvent: GlobalEvent) {}
  ngAfterViewInit() {
    start(); // 开启微应用
    this.globalEvent.emit('app', {
      detail: '我是小航',
    });
  }
}
