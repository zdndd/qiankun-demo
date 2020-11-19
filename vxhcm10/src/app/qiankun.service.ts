import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { SingleSpaProps } from 'src/single-spa/single-spa-props';

@Injectable({
  providedIn: 'root',
})
export class QiankunService {
  props: any;
  appUnmount$ = new Subject();
  state: any = {};
  init(props) {
    this.props = props;
  }
  setState(state: any) {
    // ts-ignore
    this.props?.setGlobalState(state);
  }
  stateChange = (value, prev) => {
    this.state = value;
  };
}
