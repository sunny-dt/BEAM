import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ApiService } from 'src/app/Services/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AppComponent } from '../../app.component';
import { UserRolesService } from 'src/app/UserRoles.service';
import { StorageService } from 'src/app/Storage.service';

@Component({
  selector: 'app-launch-page',
  templateUrl: './launch-page.component.html',
  styleUrls: ['./launch-page.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class LaunchPageComponent implements OnInit {

  userRoles = [];
 
  constructor(private apiService: ApiService, private router: Router, private route: ActivatedRoute,
    private appComp: AppComponent, public userRolesService: UserRolesService, private storageService: StorageService) {

    this.appComp.hide();
    this.apiService.showheader();
    this.appComp.toggleRightSidenav();
    this.appComp.searchback();
    localStorage.setItem("ShowGlobalHeader", 'false');

    let selectedCompareItemsList = [];
    localStorage.setItem("SelectedCompareItemsList", JSON.stringify(selectedCompareItemsList));

    this.appComp.hideUserInfo = false;

    let userDetails = JSON.parse(localStorage.getItem('UserDetails'));
    console.log("ngOnInit localStorage userDetails", userDetails);

    this.userRoles = userDetails.roles;
    console.log("ngOnInit localStorage userRoles", this.userRoles);

    this.appComp.amatUserName = userDetails.name;
  }

  ngOnInit() {

    console.log("localStorage isUserLogin", localStorage.getItem("isUserLogin"));

    // if (localStorage.getItem("isUserLogin") == "true") {

    // } else {

    //   this.router.navigate(['/login']);
    // }

    // let userDetails = JSON.parse(localStorage.getItem('UserDetails'));
    // console.log("ngOnInit localStorage userDetails", userDetails);

    // this.userRoles = userDetails.userroles;
    // console.log("ngOnInit localStorage userRoles", this.userRoles);

    // this.appComp.amatUserName = userDetails.name;
  }

  userInfo() {

  }

  /**It will navigate to DashboardComponent i.e Phase-1 flow (Opens Platform page) */
  navigateToG3MapperDashboard() {

    if (this.getModuleUserRole(this.userRolesService.SuperAdmin) || this.getModuleUserRole(this.userRolesService.MapperAdmin) || this.getModuleUserRole(this.userRolesService.MapperUser)) {

      let localStorageItems = ["SelectedOPID", "SelectedPlatform", "SelectedChambersList"];
      this.storageService.removeLocalStorageByItems(localStorageItems);

      this.router.navigate(['/g3mapper'], { relativeTo: this.route });
    }
  }

  /**It will navigate to ExplorerPageComponent */
  navigateToExplorer() {

    if (this.getModuleUserRole(this.userRolesService.SuperAdmin) || this.getModuleUserRole(this.userRolesService.ExplorerAdmin) || this.getModuleUserRole(this.userRolesService.ExplorerUser)) {

      let localStorageItems = ["SelectedSearchItemsList"];
      this.storageService.removeLocalStorageByItems(localStorageItems);

      this.router.navigate(['/explorer'], { relativeTo: this.route });
    }
  }

  navigateToNSOBuilderDashboard() {

    if (this.getModuleUserRole(this.userRolesService.SuperAdmin) || this.getModuleUserRole(this.userRolesService.BuilderAdmin) || this.getModuleUserRole(this.userRolesService.BuilderUser)) {

      let localStorageItems = ["selectedCustomerid", "selectedCustomerName", "SelectedConfigPlatform", "selectedFabID", "selectedProjectNoID",
      "IsFromSystemID", "AuditSVGImage", "currentConfiguration", "newConfiguration", "G3platformID", "customerID", "NSOConfigName", "ShowLocalNSOConfig", "BuilderSVGImage"];
      this.storageService.removeLocalStorageByItems(localStorageItems);

      this.router.navigate(['/builder'], { relativeTo: this.route });
    }
  }

  navigateToAnalyticsDashboard() {

    if (this.getModuleUserRole(this.userRolesService.SuperAdmin) || this.getModuleUserRole(this.userRolesService.AnalyticsAdmin) || this.getModuleUserRole(this.userRolesService.AnalyticsUser)) {
      
      let localStorageItems = ["SalesAnalyticsCustomer", "SalesAnalyticsChamber", "SalesAnalyticsIsFrom", "SalesAnalyticsOthersList"];
      this.storageService.removeLocalStorageByItems(localStorageItems);

      this.router.navigate(['/analytics'], { relativeTo: this.route });
    }
  }

  setStylesForModule(moduleAdminRole, moduleUserRole): Object {

    console.log("setStylesForModule moduleUserRole", moduleUserRole);

    if (this.getModuleUserRole(this.userRolesService.SuperAdmin) || this.getModuleUserRole(moduleAdminRole) || this.getModuleUserRole(moduleUserRole)) {

      return {background: "#FFFFFF", cursor: "pointer"};
    } else {
      
      return {background: "#CCCCCC", cursor: "no-drop"};
    }
  }

  getModuleUserRole(moduleUserRole) {

    console.log("getModuleUserRole userRoles", this.userRoles);
    console.log("getModuleUserRole moduleUserRole", moduleUserRole);

    let isModuleUserRole = false;

    for (let i = 0; i < this.userRoles.length; i++) {

      if (moduleUserRole == this.userRoles[i]) {

        isModuleUserRole = true;
      }
    }

    console.log("getModuleUserRole isModuleUserRole", isModuleUserRole);
    return isModuleUserRole;
  }
}