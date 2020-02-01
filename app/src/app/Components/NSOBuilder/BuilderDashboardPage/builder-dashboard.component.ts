import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ApiService } from 'src/app/Services/api.service';
import { AppComponent } from 'src/app/app.component';

@Component({
  
  selector: 'app-builder-dashboard',
  templateUrl: './builder-dashboard.component.html',
  styleUrls: ['./builder-dashboard.component.css'],
  // encapsulation: ViewEncapsulation.None
})

export class BuilderDashboardComponent implements OnInit {

  constructor(public apiService:ApiService, private appComp: AppComponent) {

    this.apiService.showheader();
  }

  ngOnInit() {
    
    this.appComp.hide();
    this.appComp.toggleRightSidenav();
  }
}