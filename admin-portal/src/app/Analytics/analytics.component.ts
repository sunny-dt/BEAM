import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css']
})
export class AnalyticsComponent implements OnInit {

  private sub: any;
  public currentSelectedTab = "chambers"

  constructor(private route : ActivatedRoute, private router : Router) { }

  ngOnInit() {

    this.sub = this.route.params.subscribe(params => {

      console.log('parent route params: ', params);

      this.currentSelectedTab = "chambers"

      this.handleRoutingToChildren();
    });
  }

  handleRoutingToChildren() {

    if(this.currentSelectedTab == 'chambers' || this.currentSelectedTab == undefined) {

      this.navigateToChambersPage();
    } else if(this.currentSelectedTab == 'customers') {

      this.navigateToCustomersPage();
    }
  }

  ngOnDestroy() {

    this.sub.unsubscribe();
  }

  navigateToChambersPage() {

    console.log('navigateTo chambers page');

    this.router.navigate([ 'chambers'], { relativeTo: this.route });
    this.currentSelectedTab = 'chambers';
  }

  navigateToCustomersPage() {

    console.log('navigateTo customers page ');

    this.router.navigate([ 'customers'], { relativeTo: this.route });
    this.currentSelectedTab = 'customers';
  }
}