import { AppComponent } from './../../app.component';
import { Observable, fromEvent } from 'rxjs';
import { FormControl } from '@angular/forms';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/Services/api.service';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import {ViewChild, ElementRef} from '@angular/core';
import { MatChipInputEvent, MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material';
import { map, startWith, debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';

@Component({
  selector: 'app-searchpage',
  templateUrl: './searchpage.component.html',
  styleUrls: ['./searchpage.component.css']
})

export class SearchpageComponent implements OnInit, AfterViewInit {

  @ViewChild('firstNameInput') nameInputRef: ElementRef;
  @ViewChild('inputRefVar') inputRefVar: ElementRef;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  panelOpenState: boolean = false;
  isListIcondisabled: boolean = true;
  isgridIcondisabled:boolean = false;

  customCollapsedHeight: string = '40px';
  customExpandedHeight: string = '40px';

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  sortBySelectedTitle = "Relevance";

  separatorKeysCodes: number[] = [ENTER, COMMA];
  fruitCtrl = new FormControl();
  filteredSearchOptions: Observable<string[]>;
  filteredSearchDropDownList:any = [];
  sortByselectOptions:any = [{name:"Relevance"}, {name:"Name"}];
  selectedSearchItem: any = [];

  searchResultCount = 0;

  highlightOptionTerm;

  showHierachyIndex = "-1";

  findSearchResultAPISortBy = "relevance";
  findSearchResultAPIPage: number = 1;
  findSearchResultAPIPageSize: number = 12;
  findSearchResultAPISortOrder = "DESC";

  searchResultItems: any  = [];

  hideShowMoreButton = false;
  isFromShowMore = false;

  constructor(private apiService: ApiService, private router: Router, private route: ActivatedRoute, private location:Location, private appComp: AppComponent) {

    this.apiService.hideHeader();

    this.findSearchResultAPISortBy = "relevance";
    this.findSearchResultAPIPage = 1;
    this.findSearchResultAPIPageSize = 12;
    this.findSearchResultAPISortOrder = "DESC";

    this.isFromShowMore = false;
    this.hideShowMoreButton = true;

    var selectedSearchItemsList: any[] = JSON.parse(localStorage.getItem('SelectedSearchItemsList'));
    console.log("constructor selectedSearchItemsList: ", selectedSearchItemsList);

    this.addItemsToSelectedSearchItemFromLocal(selectedSearchItemsList);
  }

  ngOnInit() {

    this.apiService.hideHeader();
    this.appComp.toggleRightSidenav();
    this.inputRefVar.nativeElement.focus();
  }

  ngAfterViewInit() {
    
    this.autoScrollToTop();

    fromEvent(this.inputRefVar.nativeElement, 'keyup')
    .pipe(debounceTime(150), distinctUntilChanged(), tap(() => {

        console.log('this. _inputElement.nativeElement:', this.inputRefVar.nativeElement.value);
        this.handleSearchTextChanged(this.inputRefVar.nativeElement.value);
      })
    ).subscribe();
  }

  autoScrollToTop() {

    let top = document.getElementById('top');

    if (top !== null) {

      top.scrollIntoView();
      top = null;
    }
  }

  addInputSearchItem(event: MatChipInputEvent): void {

    if (!this.matAutocomplete.isOpen) {

      const input = event.input;
      const value = event.value;

      if ((value || '').trim()) {
        
        this.addItemsToSelectedSearchItem(value.trim(), "rgba(132, 189, 0, 0.25)", "#84bd00", false);
      }

      if (input) {
        input.value = '';
      }

      this.fruitCtrl.setValue(null);
    }
  }

  removeItemFromSearch(item): void {

    const index = this.selectedSearchItem.indexOf(item);

    if (index >= 0) {

      this.selectedSearchItem.splice(index, 1);
    }

    if (item.isFilter) {

      this.checkCheckBoxStatus(item.name, false);
    }

    localStorage.setItem("SelectedSearchItemsList", JSON.stringify(this.selectedSearchItem));

    if (this.selectedSearchItem.length > 0) {

      this.findSearchResultAPIPage = 1;
      this.findSearchResultAPIPageSize = 12;

      this.isFromShowMore = false;

      this.callFindSearchResultsAPI();
    } else {

      localStorage.setItem("ShowGlobalHeader", 'true');
      this.location.back();
    }
  }

  removeItemsFromCheckbox(itemName: string): void {

    for (let i = 0; i < this.selectedSearchItem.length; i++) {
      
      if (itemName == this.selectedSearchItem[i].name) {

        this.selectedSearchItem.splice(i, 1);
      }
    }

    localStorage.setItem("SelectedSearchItemsList", JSON.stringify(this.selectedSearchItem));

    this.findSearchResultAPIPage = 1;
    this.findSearchResultAPIPageSize = 12;
    
    this.isFromShowMore = false;
    this.hideShowMoreButton = true;
    
    this.checkCheckBoxStatus(itemName, false);

    this.callFindSearchResultsAPI();
  }

  filteredSearchSelected(event: MatAutocompleteSelectedEvent): void {

    console.log("selected event.value: ", event.option.viewValue);

    this.addItemsToSelectedSearchItem(event.option.viewValue, "rgba(132, 189, 0, 0.25)", "#84bd00", false);
    this.inputRefVar.nativeElement.value = '';
    this.fruitCtrl.setValue(null);
  }

  addItemsToSelectedSearchItem(name, color, matIconColor, isFromFilter) {

    this.selectedSearchItem.push({name:name, color:color, matIconColor: matIconColor, isFilter: isFromFilter});
    console.log("addItemsToSelectedSearchItem selectedSearchItem ", this.selectedSearchItem);

    localStorage.setItem("SelectedSearchItemsList", JSON.stringify(this.selectedSearchItem));

    this.findSearchResultAPIPage = 1;
    this.findSearchResultAPIPageSize = 12;

    this.isFromShowMore = false;

    this.callFindSearchResultsAPI();
  }

  addItemsToSelectedSearchItemFromLocal(selectedSearchItemsList) {

    for (let i = 0; i < selectedSearchItemsList.length; i++) {

      if (!selectedSearchItemsList[i].isFilter) {

        this.selectedSearchItem.push(selectedSearchItemsList[i]);
      }
    }

    this.callFindSearchResultsAPI();
  }

  callFindSearchResultsAPI() {

    let searchTerms = [];
    let filters = [];

    for (let i = 0; i < this.selectedSearchItem.length; i++) {

      if (!this.selectedSearchItem[i].isFilter) {

        searchTerms.push(this.selectedSearchItem[i].name);
      }
    }

    if (this.searchResultItems.filters) {

      filters = this.searchResultItems.filters;
    } else {

      filters = [];
    }

    this.apiService.findSearchResults(searchTerms, filters, this.findSearchResultAPISortBy, this.findSearchResultAPIPage, this.findSearchResultAPIPageSize, this.findSearchResultAPISortOrder).subscribe(response => {

      console.log("Response findSearchResults: ", response);
      let searchResults = JSON.parse(JSON.stringify(response));
      console.log("Response findSearchResults-json: ", searchResults);

      console.log("Response findSearchResults isFromShowMore: ", this.isFromShowMore);

      if (this.isFromShowMore) {

        for (let i = 0; i < searchResults.items.length; i++) {

          this.searchResultItems.items.push(searchResults.items[i]);
        }
      } else {

        this.searchResultItems = searchResults;
      }

      console.log("Response findSearchResults searchResultItems: ", this.searchResultItems);

      this.searchResultCount = this.searchResultItems.totalCount;

      let displayingItemsCount = this.searchResultItems.items.length;
      let totalCountFromAPI = this.searchResultItems.totalCount;

      console.log("Response findSearchResults displayingItemsCount: ", displayingItemsCount);
      console.log("Response findSearchResults totalCountFromAPI: ", totalCountFromAPI);

      if (totalCountFromAPI > displayingItemsCount) {

        console.log("Response findSearchResultAPIPageSize show more true");
        this.hideShowMoreButton = false;
      } else {

        console.log("Response findSearchResultAPIPageSize show more false");
        this.hideShowMoreButton = true;
      }
    }, error => {
      
      this.searchResultItems = [];
      this.searchResultCount = 0;
      this.hideShowMoreButton = true;
      // this.showHttpErrorDailog(error);
    });
  }

  handleSearchTextChanged(value: any) {

    console.log("valueChangeEvent value: ", value);

     this.highlightOptionTerm = value;

    if(this.highlightOptionTerm === '' || this.highlightOptionTerm == null) {

      this.filteredSearchDropDownList = [];
    } else {

      let partialSearchTerm = this.highlightOptionTerm;
      let otherSearchTerms = [];
      let filters = [];
      let includeLinks = "false";

      for (let i = 0; i < this.selectedSearchItem.length; i++) {

        otherSearchTerms.push(this.selectedSearchItem[i].name);
      }
      
      console.log("valueChangeEvent partialSearchTerm: ", partialSearchTerm);
      console.log("valueChangeEvent otherSearchTerms: ", otherSearchTerms);
      console.log("valueChangeEvent filters: ", filters);
      console.log("valueChangeEvent includeLinks: ", includeLinks);

      this.apiService.findSuggestions(partialSearchTerm, otherSearchTerms, filters, includeLinks).subscribe(response => {

        console.log("Response findSuggestions: ", response);
        this.filteredSearchDropDownList = JSON.parse(JSON.stringify(response));
        console.log("Response findSuggestions-json: ", this.filteredSearchDropDownList);
      }, error => {
        
        // this.showHttpErrorDailog(error);
      });
    }
  }

  closeButton() {

    this.selectedSearchItem = [];
    localStorage.setItem("SelectedSearchItemsList", JSON.stringify(this.selectedSearchItem));
    localStorage.setItem("ShowGlobalHeader", 'false');

    this.location.back();
  }

  checkboxClick(event, childer) {

    console.log('checkboxClick event', event.checked);
    console.log('checkboxClick childer', childer);

    if (event.checked) {

      this.addItemsToSelectedSearchItem(childer.name, "rgba(69, 153, 195, 0.25)", "#4599c3", true);
    } else {

      this.removeItemsFromCheckbox(childer.name);
    }

    this.checkCheckBoxStatus(childer.name, event.checked);
  }

  showMoreButton() {

    this.findSearchResultAPIPage = this.findSearchResultAPIPage + 1;
    this.findSearchResultAPIPageSize = 12;

    this.isFromShowMore = true;

    this.callFindSearchResultsAPI();

    // this.autoScrollToTop();
  }

  navigateToDetailsPage(searchResultItem) {

    // this.router.navigate(['explorer', 'Endura2']);
    // this.router.navigate(['explorer', 'Endura2', 'Process Chambers', 'PVD', 'Versa PVD']);

    console.log("navigateToDetailsPage searchResultItem", searchResultItem);

    let splittedList = searchResultItem.full_path_components; 
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

  listViewIcon() {

    this.isgridIcondisabled = true;
    this.isListIcondisabled = false;
  }

  gridViewIcon() {

    this.isgridIcondisabled = false;
    this.isListIcondisabled = true;
  }

  sortByselectOptionsChange(sortBy) {

    console.log("sortByselectOptionsChange ", sortBy);
    this.sortBySelectedTitle = sortBy.name;

    if (sortBy.name == "Relevance") {

      this.findSearchResultAPISortBy = sortBy.name;
      this.findSearchResultAPIPage = 1;
      this.findSearchResultAPIPageSize = 12;
      this.findSearchResultAPISortOrder = "DESC";
    } else {

      this.findSearchResultAPISortBy = sortBy.name;
      this.findSearchResultAPIPage = 1;
      this.findSearchResultAPIPageSize = 12;
      this.findSearchResultAPISortOrder = "ASC";
    }

    this.isFromShowMore = false;

    this.callFindSearchResultsAPI();
  }

  checkCheckBoxStatus(itemName, status) {

    console.log("checkCheckBoxStatus itemName ", itemName);
    console.log("checkCheckBoxStatus status ", status);
    console.log("checkCheckBoxStatus searchResultItems filters ", this.searchResultItems.filters);

    for (let i = 0; i < this.searchResultItems.filters.length; i++) {

      for (let j = 0; j < this.searchResultItems.filters[i].items.length; j++) {

        if (itemName == this.searchResultItems.filters[i].items[j].name) {
          
          this.searchResultItems.filters[i].items[j].is_active = status;
        }
      }
    }
  }

  focusOutFunction() {

    this.highlightOptionTerm = " ";
    this.inputRefVar.nativeElement.value = '';
  }

  focusInFunction() {

    this.highlightOptionTerm = " ";
    this.inputRefVar.nativeElement.value = '';
    this.filteredSearchDropDownList = [] ;
  }

  showHierachyOnHoveryByItem(index) {

    this.showHierachyIndex = index;
  }

  getSearchItemImage(searchResultItem) {

    let searchItemImageLink = "";
    if (searchResultItem.media_file_url) {

      searchItemImageLink = searchResultItem.media_file_url;
    } else if (searchResultItem.tile_image_link) {

      searchItemImageLink = searchResultItem.tile_image_link;
    } else {

      searchItemImageLink = 'assets/yield_circle_image@3x.png';
    }

    return searchItemImageLink;
  }
}