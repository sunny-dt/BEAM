import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';



@Component({
  selector: 'app-core-data',
  templateUrl: './core-data.component.html',
  styleUrls: ['./core-data.component.css']
})
export class CoreDataComponent implements OnInit {

  public currentSelectedTab = "1"

  constructor(private route : ActivatedRoute, private router : Router) { }

  ngOnInit() {

  
  }

  navigateToPlatforms() {

    console.log('navigateTo platform page');

    this.router.navigate(['platform'], { relativeTo: this.route });
    this.currentSelectedTab = '1';
  }

  navigateToCustomers() {

    console.log('navigateTo customers page');

    this.router.navigate(['customers'], { relativeTo: this.route });
    this.currentSelectedTab = '2';
  }
 
}
