import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AuthService} from "./auth.service"
import {AuthGuardService} from "./auth-guard.service"
import {AppService} from "./app.service"
import {CmpIdGuardService} from "./cmpid-guard.service"
import {KNXDataService} from "./knxdata.service"

@NgModule({
  imports: [
    CommonModule
  ],
  providers:[AuthService,CmpIdGuardService,AppService,AuthGuardService,KNXDataService],
  declarations: []
})
export class CoreModule { }
