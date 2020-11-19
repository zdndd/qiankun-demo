import { Component, OnInit } from '@angular/core';
import { GlobalEvent } from '../../core/service/global-event.service';

@Component({
  selector: 'vx-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less'],
})
export class DashboardComponent implements OnInit {
  constructor(public globalEvent: GlobalEvent) {}

  ngOnInit(): void {}
  push(subapp) {
    history.pushState(null, subapp, subapp);
  }
}
