import { Component } from '@angular/core';
import { AppService } from '@app/core/app.service';

@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.less'],
})
export class LayoutComponent {
    constructor(private appService: AppService) {}
}
