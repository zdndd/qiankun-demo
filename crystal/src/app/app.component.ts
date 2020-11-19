import { Component } from '@angular/core';
import { environment } from "../environments/environment"
if(environment.production){
    console.log = function() {}
}
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})
export class AppComponent {
    constructor() {}
}
