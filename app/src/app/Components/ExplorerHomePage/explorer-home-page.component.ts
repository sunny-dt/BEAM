import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/Services/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SwiperComponent } from 'angular2-useful-swiper';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-explorer-home-page',
  templateUrl: './explorer-home-page.component.html',
  styleUrls: ['./explorer-home-page.component.css']
})

export class ExplorerHomePageComponent implements OnInit {

  public softwareSelectedIndex;
  public yieldEnhanceSelectedIndex;
  public platformSelectedIndex;

  featuredEndPoint: string = "featured";
  platformEndPoint: string = "platform";
  latestEndPoint: string = "latest";
  UIType: string = "home";
  page: any = 1;
  pageSize: any = 10;
  sortBy: string = "serial_order";
  sortOrder: string = "asc";

  platformTitle;
  compareTitle;
  softwareTitle;
  seeAllTitle;
  yieldEnhancementsTitle;

  platformList: any = [];
  softwareList: any = [];
  yieldEnhancementsList: any = [];

  public featuredList: any = [];
  public explorerMenuNodeList: any = [];

  hideBelowSection: boolean = true;
  hidePlatformInfo: boolean = true;
  hidePlatformSeeAll: boolean = true;
  hideLatestInfo: boolean = true;
  hideLatestSeeAll: boolean = true;
  hideSoftwareInfo: boolean = true;
  hideSoftwareSeeAll: boolean = true;
  hideYieldInfo: boolean = true;
  hideYieldSeeAll: boolean = true;

  hideFeaturedExplore: boolean = true;
  exploreButtonText = "";

  // @ViewChild('usefulSwiper') public usefulSwiper: SwiperComponent;

  public config: Object = {

    autoplay: 3000,
    paginationClickable: true,
    pagination: '.swiper-pagination',
    nextButton: '.swiper-button-next',
    prevButton: '.swiper-button-prev',
    spaceBetween: 0
  };
  
  constructor(private apiService: ApiService, private router: Router, private route: ActivatedRoute, private appComp: AppComponent) { 

    this.platformTitle = "Platforms";
    this.compareTitle = "Compare";
    this.softwareTitle = "Software";
    this.seeAllTitle = "See All";
    this.yieldEnhancementsTitle = "Yield Enhancements"
  }

  ngOnInit() {

    this.appComp.show();
    this.apiService.showheader();
    this.appComp.toggleRightSidenav();

    let showGlobalHeader = localStorage.getItem('ShowGlobalHeader');
    console.log("ngOnInit ShowGlobalHeader ", showGlobalHeader);
    
    if (showGlobalHeader == "true") {

      this.appComp.search();
      localStorage.setItem("ShowGlobalHeader", "false");
    } else {

      this.appComp.searchback();
    }
    
    this.hideBelowSection = true;
    this.hidePlatformInfo = true;
    this.hideSoftwareInfo = true;
    this.hideYieldInfo = true;

    this.apiService.getFeaturedList(this.featuredEndPoint, this.UIType, this.page, this.pageSize, this.sortBy, this.sortOrder).subscribe(response => {

      console.log("Response - featuredList: ", response);
      this.featuredList = JSON.parse(JSON.stringify(response));
      console.log("Response - featuredList-json: ", this.featuredList);

      this.hideFeaturedExplore = false;
      this.exploreButtonText = "Explore >>";
    }, error => {
      
      this.handleErrorCodes(error, this.featuredEndPoint);
    });

    this.apiService.getExplorerMenuNodes().subscribe(response => {

      this.explorerMenuNodeList = JSON.parse(JSON.stringify(response));
      console.log("Response - DetailsComponent - explorerMenuNodeList-json: ", this.explorerMenuNodeList);

      this.hideBelowSection = false;
      this.hidePlatformInfo = false;
      this.hideSoftwareInfo = false;
      this.hideYieldInfo = false;

      this.platformTitle = this.explorerMenuNodeList[0].name;
      this.softwareTitle = this.explorerMenuNodeList[1].name;
      this.yieldEnhancementsTitle = this.explorerMenuNodeList[2].name;

      this.platformList = this.explorerMenuNodeList[0];
      this.softwareList = this.explorerMenuNodeList[1];
      this.yieldEnhancementsList = this.explorerMenuNodeList[2];

      this.appComp.dataSource.data = this.explorerMenuNodeList;
    }, error => {
        
        this.handleErrorCodes(error, "ExplorerMenuNodes");
    });

    // this.apiService.getPlatformsDetails().subscribe(response => {

    //   console.log("Response - platformList: ", response);
    //   this.platformList = JSON.parse(JSON.stringify(response));
    //   console.log("Response - platformList-json: ", this.platformList);

    //   this.hidePlatformInfo = false;

    //   if (this.platformList.items.length > 3) {

    //     this.hidePlatformSeeAll = false;
    //   } else {

    //     this.hidePlatformSeeAll = true;
    //   }
    // }, error => {
      
    //   this.hidePlatformInfo = true;
    //   this.handleErrorCodes(error, this.platformEndPoint);
    // });

    // this.apiService.getFeaturedList(this.latestEndPoint, this.UIType, this.page, this.pageSize, this.sortBy, this.sortOrder).subscribe(response => {

    //   console.log("Response - latestList: ", response);
    //   this.latestList = JSON.parse(JSON.stringify(response));
    //   console.log("Response - latestList-json: ", this.latestList);

    //   this.hideLatestInfo = false;

    //   if (this.latestList.items.length > 3) {

    //     this.hideLatestSeeAll = false;
    //   } else {

    //     this.hideLatestSeeAll = true;
    //   }
    // }, error => {
      
    //   this.hideLatestInfo = true;
    //   this.handleErrorCodes(error, this.latestEndPoint);
    // });
  }

  navigateToDetailsPage(platformName) {

    let selectedCompareItemsList = [];
    localStorage.setItem("SelectedCompareItemsList", JSON.stringify(selectedCompareItemsList));

    console.log("Platform Name", platformName);
    this.router.navigate(['.', platformName], { relativeTo: this.route });
  }

  onNavigate(url) {

    window.open(url, "_blank");
  }

  handleErrorCodes(error: any, endPoint: string) {

    console.log("error response", error);
    console.log("error status: ", error.status);
    console.log("error message: ", error.message);
    console.log("error endPoint", endPoint);
    
    var errorCode = error.status;
    var errorMessage: string = '';
    
    if(errorCode == '0') {

      errorMessage = 'The server encountered an error. Please try again later';
    } else if(errorCode == '401') {

      errorMessage = 'You’re not authorized to access the resource that you requested. Please login with ok button';
    } else if(errorCode == '403') {

      errorMessage = 'Sorry, You don’t have permission to access this application';
    } else if(errorCode == '404') {

      errorMessage = 'The resource you’re looking for was not found';
    } else if(errorCode == '500') {

      errorMessage = 'The server encountered an error. Please try again later';
    } else {

      errorMessage = 'Something went wrong and we couldn\'t process your request';
    }

    console.log("error status after if: ", error.status);
    console.log("error message after if: ", error.message);

    // const dialogRef = this.dialog.open(PlatformHttpErrorDialog, {

    //   panelClass: 'platformHttpErrorDialogBorderRadius',
    //   width: '460px',
    //   // height: 'auto',
    //   data: {errorMessage: errorMessage, errorCode: errorCode}
    // });
  }

  softwareItemsMouseover(index,software) {

    this.softwareSelectedIndex = index;
  }

  softwareItemsMouseLeave(index) {

    this.softwareSelectedIndex = -1;
  }

  yieldEnhancmentItemsMouseover(index,yieldEnhancment) {

    this.yieldEnhanceSelectedIndex = index;
  }

  yieldEnhancmentItemsMouseLeave(index) {

    this.yieldEnhanceSelectedIndex = -1;
  }

  platformItemsMouseOver(index,platform) {

    this.platformSelectedIndex = index;
  }

  platformItemsMouseLeave(index) {

    this.platformSelectedIndex = -1;
  }

  compareButtonClick() {

    this.router.navigate(['platformcompare']);
  }
}