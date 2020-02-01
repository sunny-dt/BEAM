import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ApiService } from 'src/app/Services/api.service';
import { AppComponent } from 'src/app/app.component';

@Component({
  
  selector: 'app-analytics-dashboard',
  templateUrl: './analytics-dashboard.component.html',
  styleUrls: ['./analytics-dashboard.component.css'],
  // encapsulation: ViewEncapsulation.None
})

export class AnalyticsDashboardComponent implements OnInit {

  constructor(public apiService:ApiService, private appComp: AppComponent) {

    this.apiService.showheader();
  }

  ngOnInit() {
    
    this.appComp.hide();
    this.appComp.toggleRightSidenav();
  }
}