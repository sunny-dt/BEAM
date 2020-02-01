import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { ApiService } from 'src/app/Services/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AppComponent } from '../../app.component';

@Component({
  selector: 'app-explorer-page',
  templateUrl: './explorer-page.component.html',
  styleUrls: ['./explorer-page.component.css']
})

export class ExplorerPageComponent implements OnInit {

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private apiService: ApiService,
     private router: Router, private route: ActivatedRoute, private appComp:AppComponent) {}

  ngOnInit() {

    this.appComp.show();
  }
}
