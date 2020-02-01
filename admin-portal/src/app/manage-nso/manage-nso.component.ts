import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';



@Component({
  selector: 'app-manage-nso',
  templateUrl: './manage-nso.component.html',
  styleUrls: ['./manage-nso.component.css']
})
export class ManageNSOComponent implements OnInit {

  public currentSelectedTab = "1"

  constructor(private route : ActivatedRoute, private router : Router) { }

  ngOnInit() {

  
  }

  navigateToUpgradeRules() {

    console.log('navigateTo Upgradation Rules page');

    this.router.navigate(['upgraderules'], { relativeTo: this.route });
    this.currentSelectedTab = '1';
  }

  navigateToConfigChangeRules() {

    console.log('navigateTo Upgradation Rules page');

    this.router.navigate(['configchangerules'], { relativeTo: this.route });
    this.currentSelectedTab = '2';
  }

  // navigateToCustomersPage() {

  //   console.log('navigateTo customers page ');

  //   this.router.navigate(['customers'], { relativeTo: this.route });
  //   this.currentSelectedTab = '3';
  // }
}
