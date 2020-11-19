import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AppService } from '@app/core/app.service';
import { AuthService } from '@app/core/auth.service'

@Component({
    selector: 'cms-slider',
    templateUrl: './cms-slider.component.html',
    styleUrls: ['./cms-slider.component.less'],
})
export class CmsSliderComponent implements OnInit {
    menu ;
    goCrystal:boolean = true
    constructor(private router: Router, private appService: AppService, private authService :AuthService) {
        this.menu = this.appService.pageInfo
        if(this.appService.getFirstRoute() == 'cms' && Object.keys(this.authService.getAuthNode().length <=1)
        ){
            this.goCrystal = false
        }
    }

    ngOnInit() {
        
    }

    goBack() {
        let URL = this.appService.getFirstRoute();
        this.router.navigateByUrl('/' + URL);
    }
}
