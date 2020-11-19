import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-other',
  templateUrl: './other.component.html',
  styleUrls: ['./other.component.scss'],
})
export class OtherComponent implements OnInit {
  constructor(public location: Location) {}
  get routeUrl() {
    return this.location.path();
  }
  ngOnInit(): void {
    console.log('this.location=', this.location);
  }
}
