import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-manage-home',
  templateUrl: './manage-home.component.html',
  styleUrls: ['./manage-home.component.css']
})
export class ManageHomeComponent implements OnInit {

  private sub: any;
  currentSelectedTab = "featured"


  constructor(private route : ActivatedRoute,
    private router : Router) { }

  ngOnInit() {

    this.sub = this.route.params.subscribe(params => {
      console.log('parent route params: ', params);

        this.handleRoutingToChildren();
       
    });
   
  }

  handleRoutingToChildren()
  {


        if(this.currentSelectedTab == 'featured' || this.currentSelectedTab == undefined)
        {
          this.navigateToFeaturedPage();
        }
        else if(this.currentSelectedTab == 'metadata')
        {
          this.navigateToNodeTypesPage();
        }
       
    
  }

  ngOnDestroy() {
    this.sub.unsubscribe();

  }

  navigateToFeaturedPage() {

    console.log('navigateTo featured page');

    this.router.navigate([ 'featured'], { relativeTo: this.route });

    
    this.currentSelectedTab = 'featured';
  }

  navigateToNodeTypesPage() {
    console.log('navigateTo NodeTypes page ');

    this.router.navigate([ 'node-types'], { relativeTo: this.route });
    this.currentSelectedTab = 'node-types';
  }

}
