import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { QiankunService } from 'src/app/qiankun.service';
import { GlobalEvent } from './core/service/global-event.service';
import {
  singleSpaPropsSubject,
  SingleSpaProps,
} from 'src/single-spa/single-spa-props';

class NavigationEvent {}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'rock-test';
  singleSpaProps: SingleSpaProps;
  constructor(
    public qiankunService: QiankunService,
    private router: Router,
    public globalEvent: GlobalEvent
  ) {
    router.events
      .pipe(takeUntil(this.qiankunService.appUnmount$))
      .subscribe((event: NavigationEvent) => {
        if (event instanceof NavigationStart) {
          console.log('vxhcm 10', event);
        }
      });
  }
  ngOnInit(): void {
    singleSpaPropsSubject
      .pipe(takeUntil(this.qiankunService.appUnmount$))
      .subscribe((props: any) => {
        // console.log('AppComponent event emit');
        this.qiankunService.init(props); // 初始化乾坤
        props.onGlobalStateChange(this.qiankunService.stateChange, true); // 监听 state 的改变
      });
  }
  ngOnDestroy(): void {
    this.qiankunService.appUnmount$.next();
  }
}
