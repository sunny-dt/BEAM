import { Component, OnInit, NgModule } from '@angular/core';
import { AppComponent } from '../.././app.component';

@Component({
  
  selector: 'app-chambermain',
  templateUrl: './chambermain.component.html',
})

export class ChamberMainComponent implements OnInit {

  constructor(private appComp: AppComponent) {}

  ngOnInit() {

    this.appComp.toggleRightSidenav();
  }
}