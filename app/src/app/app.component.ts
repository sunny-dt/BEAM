import { DomSanitizer } from '@angular/platform-browser';
import { async } from '@angular/core/testing';
import { Location } from '@angular/common';
import {map, startWith, distinctUntilChanged, debounceTime, tap } from 'rxjs/operators';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Observable, fromEvent } from 'rxjs';
import { TokenResponse, AuthorizationServiceConfiguration } from '@openid/appauth';
import { AuthorizationService } from './authorization.service';
import { Component, OnInit , ChangeDetectorRef, EventEmitter, Output, AfterViewInit, DoCheck, ViewChild, ElementRef, PipeTransform, Pipe } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MediaMatcher } from '@angular/cdk/layout';
import { ApiService } from 'src/app/Services/api.service';
import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit, AfterViewInit {

  highlightSearchTerm;
  
  showButtons: boolean = false;
  hideUserInfo: boolean = false;
  isSearchBarHidden  = true;
  focus:boolean = true;
  showLoader;

  @ViewChild('sidenav') rightNav;
  @ViewChild("myInput") private _inputElement: ElementRef;

  isHeaderVisibility$: Observable<boolean>;
  public explorerMenuNodeList: any = [];

  activeNode: any;

  searchDropDownList: any = [];

  form = new FormGroup({

    searchTerm: new FormControl('', Validators.minLength(2))
  });

  get searchTerm(): any { 
    
    return this.form.get('searchTerm'); 
  }
  
  private _transformer = (node, level: number) => {
    return {
      expandable: (!!node.children && node.children.length > 0) && (node.name == "Platforms" || node.name == "Software" || node.name == "Yield Enhancement"),
      name: node.name,
      level: level,
    };
  }

  treeControl = new FlatTreeControl<ExampleFlatNode>(node => node.level, node => node.expandable);
  treeFlattener = new MatTreeFlattener(this._transformer, node => node.level, node => node.expandable, node => node.children);
  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

  hideProgressBar = true;

  constructor(public authorizationService: AuthorizationService, private router: Router ,private location:Location,
    changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private apiService: ApiService,
    private route: ActivatedRoute) {

    this.isSearchBarHidden = true;
  }

  public amatUserName = "";

  ngOnInit() {

    this.isHeaderVisibility$ = this.apiService.isHeaderVisibility;

    let userDetails = JSON.parse(localStorage.getItem('UserDetails'));
    console.log("ngOnInit localStorage userDetails", userDetails);

    this.amatUserName = userDetails.name;
  }

  ngAfterViewInit() {

    fromEvent(this. _inputElement.nativeElement, 'keyup')

    .pipe(debounceTime(150), distinctUntilChanged(), tap(() => {

        console.log('this. _inputElement.nativeElement:', this. _inputElement.nativeElement.value);
        this.handleSearchTextChanged(this. _inputElement.nativeElement.value);
      })
    ).subscribe();
  }

  show() {

    this.showButtons = true;
  }

  hide() {

    this.showButtons = false;
  }

  userInfo() {

  }

  logout() {

    this.router.navigate(['/login'], { relativeTo: this.route });
  }

  logoClick() {

    this.router.navigate(['/launch'], { relativeTo: this.route });
  }

  toggleRightSidenav() {

    // this.rightNav.toggle();
    this.rightNav.close();
  }

  onItemSelected(item) {
    
    this.activeNode = item;
    console.log("onItemSelected item", item);
    console.log("onItemSelected activeNode", this.activeNode);

    if (item.name == "Platforms" || item.name == "Software" || item.name == "Yield Enhancement") {
      // item.id == '2' || item.id == '6' || item.id == '7'
      if (item.children && item.children.length) {

      }
    } else {

      this.rightNav.toggle();

      console.log("onItemSelected item", item);
      
      var platformName = item.name;
      this.router.navigate(['explorer', platformName], { relativeTo: this.route });
    }
  }

  handleErrorCodes(error: any) {

    console.log("error response", error);
    console.log("error status: ", error.status);
    console.log("error message: ", error.message);
    
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

  onClickSuggestedItem(selectedSearchItem) {

    console.log("onClickSuggestedItem selectedSearchItem ", selectedSearchItem);

    this.isSearchBarHidden = true;
    this.showLoader = false;

    let searchListItem = [{name: selectedSearchItem.display_term, color: "rgba(132, 189, 0, 0.25)", matIconColor: "#84bd00", isFilter: false}];
    localStorage.setItem("SelectedSearchItemsList", JSON.stringify(searchListItem));
    localStorage.setItem("ShowGlobalHeader", 'false');

    this.router.navigate(['/search']);
  }

  onClickQuickLinkItem(selectedQuickItem) {

    console.log("onClickQuickLinkItem selectedQuickItem ", selectedQuickItem);

    this.highlightSearchTerm = " ";
    this.showLoader = false;
    this.isSearchBarHidden = true;
    this.apiService.showheader();
    
    // this.router.navigate(['explorer', 'Endura2']);
    // this.router.navigate(['explorer', 'Endura2', 'Process Chambers', 'PVD', 'Versa PVD']);
    console.log("navigateToDetailsPage selectedQuickItem", selectedQuickItem);

    let splittedList = selectedQuickItem.full_path_components; 
    console.log("navigateToDetailsPage splittedList", splittedList);

    splittedList.splice(0, 1); 
    console.log("navigateToDetailsPage after splittedList", splittedList);

    if (splittedList.length == 1) {

      let platformName = this.convertSlashToURL(splittedList[0]);
      this.router.navigate(['explorer', platformName]);
    } else if (splittedList.length == 2) {

      let platformName = this.convertSlashToURL(splittedList[0]);
      let levelOne = this.convertSlashToURL(splittedList[1]);
      this.router.navigate(['explorer', platformName, levelOne]);
    } else if (splittedList.length == 3) {

      let platformName = this.convertSlashToURL(splittedList[0]);
      let levelOne = this.convertSlashToURL(splittedList[1]);
      let levelTwo = splittedList[2];
      this.router.navigate(['explorer', platformName, levelOne, levelTwo]);
    } else if (splittedList.length == 4) {

      let platformName = this.convertSlashToURL(splittedList[0]);
      let levelOne = this.convertSlashToURL(splittedList[1]);
      let levelTwo = this.convertSlashToURL(splittedList[2]);
      let levelThree = this.convertSlashToURL(splittedList[3]);
      this.router.navigate(['explorer', platformName, levelOne, levelTwo, levelThree]);
    } else if (splittedList.length == 5) {

      let platformName = this.convertSlashToURL(splittedList[0]);
      let levelOne = this.convertSlashToURL(splittedList[1]);
      let levelTwo = this.convertSlashToURL(splittedList[2]);
      let levelThree = this.convertSlashToURL(splittedList[3]);
      let levelFour = this.convertSlashToURL(splittedList[4]);
      this.router.navigate(['explorer', platformName, levelOne, levelTwo, levelThree, levelFour]);
    } else if (splittedList.length == 6) {

      let platformName = this.convertSlashToURL(splittedList[0]);
      let levelOne = this.convertSlashToURL(splittedList[1]);
      let levelTwo = this.convertSlashToURL(splittedList[2]);
      let levelThree = this.convertSlashToURL(splittedList[3]);
      let levelFour = this.convertSlashToURL(splittedList[4]);
      let levelFive = this.convertSlashToURL(splittedList[5]);
      this.router.navigate(['explorer', platformName, levelOne, levelTwo, levelThree, levelFour, levelFive]);
    }
  }

  convertSlashToURL(itemName) {

    console.log("convertSlashToURL itemName ", itemName);

    if (itemName.includes("/")) {

      return itemName.split('/').join("%2F");
    } else {
      return itemName;
    }
  }

  ngAfterViewChecked() {
    
    this._inputElement.nativeElement.focus();
  }

  search() {

    this.searchDropDownList = [];
    this.hideProgressBar = true;
    this._inputElement.nativeElement.focus();
    this.showLoader = true;
    this.highlightSearchTerm = " ";
    this.apiService.hideHeader();
    this.isSearchBarHidden = false;
    this.searchTerm.reset();
    this.focus = true;

    this.toggleRightSidenav();
  }
  
  searchback() {

    this.highlightSearchTerm = " ";
    this.showLoader = false;
    this.isSearchBarHidden = true;
    this.apiService.showheader();

    localStorage.setItem("ShowGlobalHeader", 'false');
  }

  handleSearchTextChanged(value) {

    this.highlightSearchTerm = value;
    console.log("highlightSearchTerm: ", this.highlightSearchTerm);

    // this.searchDropDownList = [];
    this.hideProgressBar = false;

    if(this.highlightSearchTerm === '' || this.highlightSearchTerm == null) {

      this.searchDropDownList = [];
      this.hideProgressBar = true;
    } else {

      let partialSearchTerm = this.highlightSearchTerm;
      let otherSearchTerms: any = [];
      let filters: any = [];
      let includeLinks = "true";

      console.log("onKeyPress partialSearchTerm: ", partialSearchTerm);
      console.log("onKeyPress otherSearchTerms: ", otherSearchTerms);
      console.log("onKeyPress filters: ", filters);
      console.log("onKeyPress includeLinks: ", includeLinks);

      this.apiService.findSuggestions(partialSearchTerm, otherSearchTerms, filters, includeLinks).subscribe(response => {

        console.log("Response - AppComponent - findSuggestions: ", response);
        this.searchDropDownList = JSON.parse(JSON.stringify(response));
        console.log("Response - AppComponent - findSuggestions-json: ", this.searchDropDownList);

        if(this.highlightSearchTerm === '' || this.highlightSearchTerm == null) {
          
          this.searchDropDownList = [];
        }

        this.hideProgressBar = true;
      }, error => {
        
        // this.showHttpErrorDailog(error);
      });

    }
  };

  onKeyPress(event) {

    var code = (event.keyCode ? event.keyCode : event.which);

    if (code == 13) {

      this.searchDropDownList = [];
      
      this.hideProgressBar = false;

      this.isSearchBarHidden = true;
      this.showLoader = false;
  
      let searchListItem = [{name: event.target.value, color: "rgba(132, 189, 0, 0.25)", matIconColor: "#84bd00", isFilter: false}];
      localStorage.setItem("SelectedSearchItemsList", JSON.stringify(searchListItem));

      this.router.navigate(['/search']);
    }
  }

  showQuickLinkTitle() {

    if (this.searchDropDownList.links) {

      if (this.searchDropDownList.links.length > 0) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  showSuggestedLinkTitle() {

    if (this.searchDropDownList.keywords) {

      if (this.searchDropDownList.keywords.length > 0) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
}

interface ExampleFlatNode {

  expandable: boolean;
  name: string;
  level: number;
}