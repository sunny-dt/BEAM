import { ApiService } from './../../Services/api.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SwiperComponent } from 'angular2-useful-swiper';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { ViewEncapsulation } from '@angular/core'
import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import { AppComponent } from '../../app.component';
import { IgxExcelExporterOptions, IgxExcelExporterService } from "igniteui-angular";

@Component({
  selector: 'app-explorer-platform-details-page',
  templateUrl: './explorer-platform-details-page.component.html',
  styleUrls: ['./explorer-platform-details-page.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class ExplorerPlatformDetailsPageComponent implements OnInit {

  featuredEndPoint: string = "featured";
  recommendedEndPoint: string = "featured";
  explorerMenuNodeEndPoint: string = "ExplorerMenuNode";
  metaDataByMenuNodeIDEndPoint: string = "metadata";
  recommendedByMenuNodeIDEndPoint: string = "recommended";
  featuredByMenuNodeIDEndPoint: string = "featured";
  childrenByMenuNodeIDEndPoint: string = "children";
  attributeValuesByMenuNodeIDEndPoint: string = "AttributeValues";
  UIType: string = "platform";
  page: any = 1;
  pageSize: any = 1000;
  sortBy: string = "serial_order";
  sortOrder: string = "asc";
  filter: string = "";

  tableHeading;
  characteristicsTableTitle;
  characteristicsDefaultTableTitle;
  optionalCharacteristicsTableTitle;
  inThisSectionTitle;
  public selectedIndex;
  metaDataContentText;
  metaDataContentSubText
  overviewSubContent;
  overviewHeaderTitle;
  recommendedSelectedIndex;
  selectedPlatformPositionName;
  isSessionMargin: boolean;

  public featuredList: any = [];
  public recommendedList: any = [];
  public explorerMenuNodeList: any = [];
  public detailsMenuNodeList: any = [];
  public metaDataList: any = [];
  public featuredMenuNodeList: any = [];
  public metaDataMediaList: any = [];
  public childrenListByNodeID: any = [];
  public attributeValuesListByNodeID: any = [];
  selectedPlatformName = "";
  selectedPlatformPosition = 0;

  routeParamsList: any = [];

  tableBlock:boolean ;
  characteristicsTableBlock: boolean;
  optionalCharacteristicsTableBlock: boolean;

  featuredListBgColor = "#4599c3";
  featuredListfgColor ="#fffff";
  featuredListImageLink = "assets/endura.png";

  mainItemNodeName;
  hierachyHorizontalList: any[];

  hideRecommendedTitleBlock: boolean = true;
  isCompareResultsHeaderBlockHidden:boolean = true;

  showCompareButton = true;
  selectedCompareItemsList: any = [];
  compareButtonColor = "#4599C3";
  compareButtonDisabled = false;

  selectedCompareTypeName = "";

  attributesList: any = [];
  characteristicsList: any = [];
  optionalCharacteristicsList: any = [];
  optionsCharacteristicsList: any = [];
  finalCharacteristicsList: any = [];

  hideFooterContent = true;
  showProductCompareResultsPage = false;
  
  compareListMap = new Map();
  compareResultList: any = [];
  compareResultMapList = new Map();
  otherComparableNodes: any = [];

  compareItemChangePosition;

  isPlatformCompareStickyVisible:boolean = false;

  heightOfSwiperInPixel = 0;

  // @ViewChild('usefulSwiper') public usefulSwiper: SwiperComponent;
  @ViewChild('videoSwiper') public videoSwiper: SwiperComponent;
  @ViewChild('StickyHeader') stickyHeader: ElementRef;

  public config: Object = {

    paginationClickable: true,
    pagination: '.swiper-pagination',
    nextButton: '.swiper-button-next',
    prevButton: '.swiper-button-prev',
    spaceBetween: 0
  };

  public videoConfig: Object = {

    paginationClickable: true,
    pagination: '.swiper-pagination',
    nextButton: '.swiper-button-next',
    prevButton: '.swiper-button-prev',
    spaceBetween: 0
  };

  activeNode: any;

  private _transformer = (node, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
      id: node.id,
      metadata_count: node.metadata_count,
      recommended_count: node.recommended_count,
      featured_count: node.featured_count,
      parent_node_id: node.parent_node_id,
      parent_node_name: node.parent_node_name,
      children: node.children,
      lvl: node.lvl,
      node_type_id: node.node_type_id,
      node_type_name: node.node_type_name,
    };
  }

  treeControl = new FlatTreeControl<ExampleFlatNode>(node => node.level, node => node.expandable);
  treeFlattener = new MatTreeFlattener(this._transformer, node => node.level, node => node.expandable, node => node.children);
  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

  constructor(private apiService: ApiService, private router: Router, private route: ActivatedRoute, 
    private location: Location, private appComp: AppComponent,private excelExportService: IgxExcelExporterService) {

    this.selectedIndex = 0;

    this.route.params.subscribe(val => {

      console.log("constructor - val: ", val);

      this.selectedPlatformName = val.PlatformName;
      let routeLevelOne = val.LevelOne;
      let routeLevelTwo = val.LevelTwo;
      let routeLevelThree = val.LevelThree;
      let routeLevelFour = val.LevelFour;
      let routeLevelFive = val.LevelFive;
      let routeLevelSix = val.LevelSix;
      let routeLevelSeven = val.LevelSeven;
      
      console.log("constructor - selectedPlatformName: ", this.selectedPlatformName);
      console.log("constructor - routeLevelOne: ", routeLevelOne);
      console.log("constructor - routeLevelTwo: ", routeLevelTwo);
      console.log("constructor - routeLevelThree: ", routeLevelThree);
      console.log("constructor - routeLevelFour: ", routeLevelFour);
      console.log("constructor - routeLevelFive: ", routeLevelFive);
      console.log("constructor - routeLevelSix: ", routeLevelSix);
      console.log("constructor - routeLevelSeven: ", routeLevelSeven);
    
      this.routeParamsList = [];

      if (this.selectedPlatformName) {
        this.routeParamsList.push(this.convertURLToSlash(this.selectedPlatformName));
      }
      if (routeLevelOne) {
        this.routeParamsList.push(this.convertURLToSlash(routeLevelOne));
      }
      if (routeLevelTwo) {
        this.routeParamsList.push(this.convertURLToSlash(routeLevelTwo));
      }
      if (routeLevelThree) {
        this.routeParamsList.push(this.convertURLToSlash(routeLevelThree));
      }
      if (routeLevelFour) {
        this.routeParamsList.push(this.convertURLToSlash(routeLevelFour));
      }
      if (routeLevelFive) {
        this.routeParamsList.push(this.convertURLToSlash(routeLevelFive));
      }
      if (routeLevelSix) {
        this.routeParamsList.push(this.convertURLToSlash(routeLevelSix));
      }
      if (routeLevelSeven) {
        this.routeParamsList.push(this.convertURLToSlash(routeLevelSeven));
      }

      console.log("constructor - routeParamsList: ", this.routeParamsList);

      this.getExplorerMenuNodes();

      this.appComp.show();
      this.apiService.showheader();
    });
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

    // this.compareListMap = JSON.parse(localStorage.getItem('SelectedCompareItemsMapList'));
    // this.selectedCompareTypeName = localStorage.getItem('SelectedCompareTypeName');
    // console.log("ngOnInit compareListMap ", this.compareListMap);
    // console.log("ngOnInit selectedCompareTypeName ", this.selectedCompareTypeName);

    // if (this.compareListMap == null) {
    //   this.compareListMap = new Map();
    // }

    // if (this.selectedCompareTypeName == null) {
    //   this.selectedCompareTypeName = "";
    // }

    window.addEventListener('scroll', this.scrollEvent, true);
  }

  ngAfterViewInit() {
    
    let top = document.getElementById('top');
    if (top !== null) {
      top.scrollIntoView();
      top = null;
    }
  }

  convertURLToSlash(itemName) {
    
    console.log("convertURLToSlash itemName ", itemName);

    if (itemName.includes("%2F")) {

      return itemName.split('%2F').join("/");
    } else {
      return itemName;
    }
  }


  scrollEvent = (event: any): void => {

    if (this.showProductCompareResultsPage) {
      
      const number = event.srcElement.scrollTop;

      if (number >= 300) {

        this.isPlatformCompareStickyVisible = true;
      } else {

        this.isPlatformCompareStickyVisible = false;
      }
      this.reposition(event.srcElement.scrollLeft);
      
    }
  }

  reposition(scroll_left : any) {

    if (this.stickyHeader) {
      
      let el = this.stickyHeader.nativeElement;

      var ScrollLeft = scroll_left;

      if (ScrollLeft == 0)
      {
          if (window.pageXOffset)
              ScrollLeft = window.pageXOffset;
          else
              ScrollLeft = (document.body.parentElement) ? document.body.parentElement.scrollLeft : 0;
      }
      el.style.left = "-" + ScrollLeft + "px";
    }
  }

  getExplorerMenuNodes() {

    this.hierachyHorizontalList = [];
    
    this.apiService.getExplorerMenuNodes().subscribe(response => {

      console.log("Response - getExplorerMenuNodes: ", response);
      this.explorerMenuNodeList = JSON.parse(JSON.stringify(response));
      console.log("Response - getExplorerMenuNodes-json: ", this.explorerMenuNodeList);

      this.showCompareButton = false;

      for(let i = 0; i < this.explorerMenuNodeList.length; i++) {

        for(let j = 0; j < this.explorerMenuNodeList[i].children.length; j++) {

          if (this.routeParamsList[0] == this.explorerMenuNodeList[i].children[j].name) {

            this.selectedPlatformPositionName = this.selectedPlatformName;
            this.selectedPlatformPosition = j;
            this.detailsMenuNodeList = this.explorerMenuNodeList[i].children[j].children;

            this.dataSource.data = this.detailsMenuNodeList;

            this.featuredMenuNodeList = this.explorerMenuNodeList[i].children; 
            this.mainItemNodeName = this.explorerMenuNodeList[i];

            console.log("Response - mainItemNodeName: ", this.mainItemNodeName);
            console.log("Response - featuredMenuNodeList: ", this.featuredMenuNodeList);

            console.log("Response - routeParamsList routeParamsList.length: ", this.routeParamsList.length);

            if (this.routeParamsList.length > 1) {
              
              for(let k = 0; k < this.explorerMenuNodeList[i].children[j].children.length; k++) {

                if (this.routeParamsList[1] == this.explorerMenuNodeList[i].children[j].children[k].name) {

                  if (this.routeParamsList.length > 2) {

                    for(let l = 0; l < this.explorerMenuNodeList[i].children[j].children[k].children.length; l++) {

                      if (this.routeParamsList[2] == this.explorerMenuNodeList[i].children[j].children[k].children[l].name) {

                        if (this.routeParamsList.length > 3) {

                          for(let m = 0; m < this.explorerMenuNodeList[i].children[j].children[k].children[l].children.length; m++) {

                            if (this.routeParamsList[3] == this.explorerMenuNodeList[i].children[j].children[k].children[l].children[m].name) {
      
                              if (this.routeParamsList.length > 4) {

                                for(let n = 0; n < this.explorerMenuNodeList[i].children[j].children[k].children[l].children[m].children.length; n++) {
      
                                  if (this.routeParamsList[4] == this.explorerMenuNodeList[i].children[j].children[k].children[l].children[m].children[n].name) {
            
                                    if (this.routeParamsList.length > 5) {

                                      for(let o = 0; o < this.explorerMenuNodeList[i].children[j].children[k].children[l].children[m].children[n].children.length; n++) {
            
                                        if (this.routeParamsList[5] == this.explorerMenuNodeList[i].children[j].children[k].children[l].children[m].children[n].children[o].name) {
                  
                                        }
                                      }
                                    }  else {
            
                                      // this.hierachyHorizontalList = [];
                                      // this.hierachyHorizontalList.push(this.mainItemNodeName);
                                      // this.hierachyHorizontalList.push(this.explorerMenuNodeList[i].children[j]);
                                      // this.hierachyHorizontalList.push(this.explorerMenuNodeList[i].children[j].children[k]);
                                      // this.hierachyHorizontalList.push(this.explorerMenuNodeList[i].children[j].children[k].children[l]);
                                      // this.hierachyHorizontalList.push(this.explorerMenuNodeList[i].children[j].children[k].children[l].children[m]);
                                      // this.hierachyHorizontalList.push(this.explorerMenuNodeList[i].children[j].children[k].children[l].children[m].children[n]);

                                      // console.log("Response - hierachyHorizontalList: ", this.hierachyHorizontalList);

                                      this.featuredListBgColor = this.explorerMenuNodeList[i].children[j].tile_bg_color;
                                      this.featuredListfgColor= this.explorerMenuNodeList[i].children[j].tile_fg_color;
                                      this.featuredListImageLink = this.explorerMenuNodeList[i].children[j].tile_image_link;

                                      this.onExplorerMenuNodeSelected(this.explorerMenuNodeList[i].children[j].children[k].children[l].children[m].children[n]);
                                      this.expandList();
                                    }
                                  }
                                }
                              }  else {
      
                                // this.hierachyHorizontalList = [];
                                // this.hierachyHorizontalList.push(this.mainItemNodeName);
                                // this.hierachyHorizontalList.push(this.explorerMenuNodeList[i].children[j]);
                                // this.hierachyHorizontalList.push(this.explorerMenuNodeList[i].children[j].children[k]);
                                // this.hierachyHorizontalList.push(this.explorerMenuNodeList[i].children[j].children[k].children[l]);
                                // this.hierachyHorizontalList.push(this.explorerMenuNodeList[i].children[j].children[k].children[l].children[m]);

                                // console.log("Response - hierachyHorizontalList: ", this.hierachyHorizontalList);

                                this.featuredListBgColor = this.explorerMenuNodeList[i].children[j].tile_bg_color;
                                this.featuredListfgColor= this.explorerMenuNodeList[i].children[j].tile_fg_color;
                                this.featuredListImageLink = this.explorerMenuNodeList[i].children[j].tile_image_link;

                                this.onExplorerMenuNodeSelected(this.explorerMenuNodeList[i].children[j].children[k].children[l].children[m]);
                                this.expandList();
                              }
                            }
                          }
                        }  else {

                          // this.hierachyHorizontalList = [];
                          // this.hierachyHorizontalList.push(this.mainItemNodeName);
                          // this.hierachyHorizontalList.push(this.explorerMenuNodeList[i].children[j]);
                          // this.hierachyHorizontalList.push(this.explorerMenuNodeList[i].children[j].children[k]);
                          // this.hierachyHorizontalList.push(this.explorerMenuNodeList[i].children[j].children[k].children[l]);
  
                          // console.log("Response - hierachyHorizontalList: ", this.hierachyHorizontalList);

                          this.featuredListBgColor = this.explorerMenuNodeList[i].children[j].tile_bg_color;
                          this.featuredListfgColor= this.explorerMenuNodeList[i].children[j].tile_fg_color;
                          this.featuredListImageLink = this.explorerMenuNodeList[i].children[j].tile_image_link;

                          this.onExplorerMenuNodeSelected(this.explorerMenuNodeList[i].children[j].children[k].children[l]);
                          this.expandList();
                        }
                      }
                    }
                  } else {

                    // this.hierachyHorizontalList = [];
                    // this.hierachyHorizontalList.push(this.mainItemNodeName);
                    // this.hierachyHorizontalList.push(this.explorerMenuNodeList[i].children[j]);
                    // this.hierachyHorizontalList.push(this.explorerMenuNodeList[i].children[j].children[k]);

                    // console.log("Response - hierachyHorizontalList: ", this.hierachyHorizontalList);

                    this.featuredListBgColor = this.explorerMenuNodeList[i].children[j].tile_bg_color;
                    this.featuredListfgColor= this.explorerMenuNodeList[i].children[j].tile_fg_color;
                    this.featuredListImageLink = this.explorerMenuNodeList[i].children[j].tile_image_link;

                    this.onExplorerMenuNodeSelected(this.explorerMenuNodeList[i].children[j].children[k]);
                    this.expandList();
                  }
                }
              }
            } else {

              // this.hierachyHorizontalList = [];
              // this.hierachyHorizontalList.push(this.mainItemNodeName);
              // this.hierachyHorizontalList.push(this.explorerMenuNodeList[i].children[j]);

              // console.log("Response - hierachyHorizontalList: ", this.hierachyHorizontalList);

              this.featuredListBgColor = this.explorerMenuNodeList[i].children[j].tile_bg_color;
              this.featuredListfgColor= this.explorerMenuNodeList[i].children[j].tile_fg_color;
              this.featuredListImageLink = this.explorerMenuNodeList[i].children[j].tile_image_link;

              this.onExplorerMenuNodeSelected(this.explorerMenuNodeList[i].children[j]);
            }
          }
        }
      }

      // let compareItemArray = this.compareListMap.get(this.selectedCompareTypeName);
      // console.log("ngOnInit compareItemArray ", compareItemArray);

      // this.selectedCompareItemsList = compareItemArray;
      // if (this.selectedCompareItemsList.length > 0) {
  
      //   this.hideFooterContent = false;
      // } else {
  
      //   this.hideFooterContent = true;
      // }
    }, error => {
      
      this.handleErrorCodes(error, this.explorerMenuNodeEndPoint);
    });
  }

  updatePlatfrom() {

    this.hierachyHorizontalList = [];
    
    this.apiService.getExplorerMenuNodes().subscribe(response => {

      console.log("Response - getExplorerMenuNodes updatePlatfrom: ", response);
      this.explorerMenuNodeList = JSON.parse(JSON.stringify(response));
      console.log("Response - getExplorerMenuNodes updatePlatfrom-json: ", this.explorerMenuNodeList);

      for(let i = 0; i < this.explorerMenuNodeList.length; i++) {

        for(let j = 0; j < this.explorerMenuNodeList[i].children.length; j++) {

          if (this.selectedPlatformName == this.explorerMenuNodeList[i].children[j].name) {

            this.selectedPlatformPositionName = this.selectedPlatformName;
            this.selectedPlatformPosition = j;
            this.detailsMenuNodeList = this.explorerMenuNodeList[i].children[j].children;

            this.dataSource.data = this.detailsMenuNodeList;

            this.featuredMenuNodeList = this.explorerMenuNodeList[i].children; 
            this.mainItemNodeName = this.explorerMenuNodeList[i];

            console.log("Response - mainItemNodeName: ", this.mainItemNodeName);
            console.log("Response - featuredMenuNodeList: ", this.featuredMenuNodeList);

            this.hierachyHorizontalList = [];
            this.hierachyHorizontalList.push(this.mainItemNodeName);
            this.hierachyHorizontalList.push(this.explorerMenuNodeList[i].children[j]);

            console.log("Response - hierachyHorizontalList: ", this.hierachyHorizontalList);

            this.featuredListBgColor = this.explorerMenuNodeList[i].children[j].tile_bg_color;
            this.featuredListfgColor= this.explorerMenuNodeList[i].children[j].tile_fg_color;
            this.featuredListImageLink = this.explorerMenuNodeList[i].children[j].tile_image_link;

            this.onExplorerMenuNodeSelected(this.explorerMenuNodeList[i].children[j]);
          }
        }
      }
    }, error => {
      
      this.handleErrorCodes(error, this.explorerMenuNodeEndPoint);
    });
  }

  onPlatFormListChange(selectedPlatformPosition) {

    console.log("onPlatFormListChange - selectedPlatformPosition: ", selectedPlatformPosition);

    this.selectedPlatformName = this.featuredMenuNodeList[selectedPlatformPosition].name;
    this.selectedPlatformPositionName = this.selectedPlatformName;
    console.log("onPlatFormListChange - selectedPlatformName: ", this.selectedPlatformName);

    this.location.replaceState('explorer/' + this.selectedPlatformName);
    this.updatePlatfrom();
  }

  onExplorerMenuNodeSelected(item) {

    console.log("onExplorerMenuNodeSelected item", item);
    console.log("onExplorerMenuNodeSelected explorerMenuNodeList", this.explorerMenuNodeList);

    this.activeNode = item;

    this.hideCompareButton(item);

    this.heightOfSwiperInPixel = 0;
    this.metaDataMediaList = [];
    
    this.videoSwiper.swiper.slideTo(0);

    for(let i = 0; i < this.explorerMenuNodeList.length; i++) {

      for(let j = 0; j < this.explorerMenuNodeList[i].children.length; j++) {

        if (item.id == this.explorerMenuNodeList[i].children[j].id) {

          this.hierachyHorizontalList = [];
          this.hierachyHorizontalList.push(this.mainItemNodeName);
          this.hierachyHorizontalList.push(this.explorerMenuNodeList[i].children[j]);
          break;
        }

        for(let k = 0; k < this.explorerMenuNodeList[i].children[j].children.length; k++) {

          if (item.id == this.explorerMenuNodeList[i].children[j].children[k].id) {

            this.hierachyHorizontalList = [];
            this.hierachyHorizontalList.push(this.mainItemNodeName);
            this.hierachyHorizontalList.push(this.explorerMenuNodeList[i].children[j]);
            this.hierachyHorizontalList.push(this.explorerMenuNodeList[i].children[j].children[k]);
            break;
          }

          for(let l = 0; l < this.explorerMenuNodeList[i].children[j].children[k].children.length; l++) {


            if (item.id == this.explorerMenuNodeList[i].children[j].children[k].children[l].id) {

              this.hierachyHorizontalList = [];
              this.hierachyHorizontalList.push(this.mainItemNodeName);
              this.hierachyHorizontalList.push(this.explorerMenuNodeList[i].children[j]);
              this.hierachyHorizontalList.push(this.explorerMenuNodeList[i].children[j].children[k]);
              this.hierachyHorizontalList.push(this.explorerMenuNodeList[i].children[j].children[k].children[l]);
              break;
            }

            for(let m = 0; m < this.explorerMenuNodeList[i].children[j].children[k].children[l].children.length; m++) {

              if (item.id == this.explorerMenuNodeList[i].children[j].children[k].children[l].children[m].id) { //cubs pvd

                this.hierachyHorizontalList = [];
                this.hierachyHorizontalList.push(this.mainItemNodeName);
                this.hierachyHorizontalList.push(this.explorerMenuNodeList[i].children[j]);
                this.hierachyHorizontalList.push(this.explorerMenuNodeList[i].children[j].children[k]);
                this.hierachyHorizontalList.push(this.explorerMenuNodeList[i].children[j].children[k].children[l]);
                this.hierachyHorizontalList.push(this.explorerMenuNodeList[i].children[j].children[k].children[l].children[m]);
                break;
              }

              for(let n = 0; n < this.explorerMenuNodeList[i].children[j].children[k].children[l].children[m].children.length; n++) {

                if (item.id == this.explorerMenuNodeList[i].children[j].children[k].children[l].children[m].children[n].id) { //cubs pvd
    
                  this.hierachyHorizontalList = [];
                  this.hierachyHorizontalList.push(this.mainItemNodeName);
                  this.hierachyHorizontalList.push(this.explorerMenuNodeList[i].children[j]);
                  this.hierachyHorizontalList.push(this.explorerMenuNodeList[i].children[j].children[k]);
                  this.hierachyHorizontalList.push(this.explorerMenuNodeList[i].children[j].children[k].children[l]);
                  this.hierachyHorizontalList.push(this.explorerMenuNodeList[i].children[j].children[k].children[l].children[m]);
                  this.hierachyHorizontalList.push(this.explorerMenuNodeList[i].children[j].children[k].children[l].children[m].children[n]);
                  break;
                }
              }
            }
          }
        }
      }
    }

    console.log("onExplorerMenuNodeSelected - hierachyHorizontalList: ", this.hierachyHorizontalList);
      
    let url = "";
    for (let i = 1; i < this.hierachyHorizontalList.length; i++) {

      let hierachyHorizontalName = this.hierachyHorizontalList[i].name;
      if (hierachyHorizontalName.includes("/")) {
        hierachyHorizontalName = hierachyHorizontalName.split('/').join("%2F");
      }
      
      url = url + hierachyHorizontalName + "/";
    }

    console.log("onExplorerMenuNodeSelected - url : ", url );
    this.location.replaceState('explorer/' + url);

    this.isSessionMargin = false;

    this.apiService.getRecommendedByMenuNodeID(item.id, this.metaDataByMenuNodeIDEndPoint).subscribe(response => {

      console.log("Response - metaDataByMenuNodeIDEndPoint: ", response);
      this.metaDataList = JSON.parse(JSON.stringify(response));
      console.log("Response-text - metaDataByMenuNodeIDEndPoint-json: ", this.metaDataList);

      if (this.metaDataList && this.metaDataList.id) {

        this.metaDataContentText = this.metaDataList.text;
        console.log("this.metaDataList.sub_text",this.metaDataList.sub_text);
        this.metaDataContentSubText = this.metaDataList.sub_text;

        this.isSessionMargin = false;

        this.apiService.getMetaDataMediaByMenuNodeID(this.metaDataList.id, this.filter, this.sortBy, this.page, this.pageSize, this.sortOrder).subscribe(response => {

          console.log("Response - getMetaDataMediaByMenuNodeID: ", response);
          this.metaDataMediaList = JSON.parse(JSON.stringify(response));
          console.log("Response - getMetaDataMediaByMenuNodeID-json: ", this.metaDataMediaList.items.length);

          if (this.metaDataMediaList.items.length) {

            this.heightOfSwiperInPixel = 350;

            // let dymmyItems =
            // [
            //   {
            //     media_file_url: "https://s.yimg.com/ny/api/res/1.2/X7uPX47huAbQT8lOJ4vZ2A--~A/YXBwaWQ9aGlnaGxhbmRlcjtzbT0xO3c9NjAwO2g9NDAwO2lsPXBsYW5l/https://cdn2.benzinga.com/files/imagecache/600x400xUP/images/story/2012/services_4.jpg",
            //     media_type: "image"
            //   }, {
            //     media_file_url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
            //     media_type: "video"
            //   }, {
            //     media_file_url: "www.tfzr.rs/Content/files/0/Angular2Bootstrap3.pptx",
            //     media_type: "ppt"
            //   }, {
            //     media_file_url: "www.iiswc.org/iiswc2013/sample.doc",
            //     media_type: "doc"
            //   }, {
            //     media_file_url: "https://media.glassdoor.com/l/e4/1d/2e/6d/building-12.jpg",
            //     media_type: "image"
            //   }
            // ];

            // for (let i = 0; i < dymmyItems.length; i++) {

            //   this.metaDataMediaList.items.push(dymmyItems[i]);   
            // }
             
            console.log("Response - metaDataMediaList-items: ", this.metaDataMediaList.items);
          } else {

            this.heightOfSwiperInPixel = 0;
            this.metaDataMediaList = [];
          }
        }, error => {
          
          this.handleErrorCodes(error, "MetaDataMediaByMenuNodeID");
        });

        this.apiService.getAttributeValuesByMenuNodeID(this.metaDataList.id, this.filter, this.sortBy, this.page, this.pageSize, this.sortOrder).subscribe(response => {

          console.log("Response - getAttributeValuesByMenuNodeID: ", response);
          this.attributeValuesListByNodeID = JSON.parse(JSON.stringify(response));
          console.log("Response - getAttributeValuesByMenuNodeID-json: ", this.attributeValuesListByNodeID);

          this.attributesList = [];
          this.characteristicsList = [];
          this.optionalCharacteristicsList = [];
          this.optionsCharacteristicsList = [];
          this.finalCharacteristicsList = [];
          
          if(this.attributeValuesListByNodeID.items.length > 0) {

            for (let i = 0; i < this.attributeValuesListByNodeID.items.length; i++) {
            
              if (this.attributeValuesListByNodeID.items[i].attr_type_id == "1") {

                this.attributesList.push(this.attributeValuesListByNodeID.items[i]);
              } else if (this.attributeValuesListByNodeID.items[i].attr_type_id == "2") {

                let finalObject;
                if (this.attributeValuesListByNodeID.items[i].value.includes("||")) {

                  // let value = this.attributeValuesListByNodeID.items[i].value.replace("||", ',');
                  // let value = this.attributeValuesListByNodeID.items[i].value.split("||").join(', ');
                  // this.attributeValuesListByNodeID.items[i].value = value;

                  this.optionalCharacteristicsTableTitle = this.attributeValuesListByNodeID.items[i].attr_type_name;
                  this.optionalCharacteristicsList.push(this.attributeValuesListByNodeID.items[i]);

                  var splittedValue = this.attributeValuesListByNodeID.items[i].value.split("||"); 
                  console.log("onEdit - splittedValue : ", splittedValue);

                  let values = [];
                  let defaultValues = [];
                  let otherValues = [];
                  for (let j = 0; j < splittedValue.length; j++) {

                    let checkValue = "";
                    if (this.attributeValuesListByNodeID.items[i].description[j]) {

                      checkValue = this.attributeValuesListByNodeID.items[i].description[j].description;
                      if (checkValue == "") {
                        checkValue = ""
                      }
                    }
                    
                    values.push({name: splittedValue[j], dec: checkValue});
                    if (j == 0) {
                      defaultValues.push({name: splittedValue[j], dec: checkValue});
                    } else {
                      otherValues.push({name: splittedValue[j], dec: checkValue});
                    }
                  }

                  let finalItemValue = {name: this.attributeValuesListByNodeID.items[i].name, Values: values};
                  this.optionsCharacteristicsList.push(finalItemValue);


                  finalObject = {name: this.attributeValuesListByNodeID.items[i].name, default: [{value: splittedValue[0], dec: defaultValues[0].dec}],  optional: otherValues}; 
                  this.finalCharacteristicsList.push(finalObject);
                } else {

                  this.characteristicsTableTitle = this.attributeValuesListByNodeID.items[i].attr_type_name;
                  this.characteristicsList.push(this.attributeValuesListByNodeID.items[i]);

                  let description = "";
                  if (this.attributeValuesListByNodeID.items[i].description[0]) {
                    description = this.attributeValuesListByNodeID.items[i].description[0].description;
                  }

                  finalObject = {name: this.attributeValuesListByNodeID.items[i].name, default: [{value: this.attributeValuesListByNodeID.items[i].value, dec: description}],  optional: []}; 
                  this.finalCharacteristicsList.push(finalObject);
                }
              } else if (this.attributeValuesListByNodeID.items[i].attr_type_id == "3") {

                // this.optionalCharacteristicsTableTitle = this.attributeValuesListByNodeID.items[i].attr_type_name;
                // this.optionalCharacteristicsList.push(this.attributeValuesListByNodeID.items[i]);
              }
            }

            console.log("Response - getAttributeValuesByMenuNodeID-attributesList: ", this.attributesList);
            console.log("Response - getAttributeValuesByMenuNodeID-characteristicsList: ", this.characteristicsList);
            console.log("Response - getAttributeValuesByMenuNodeID-optionalCharacteristicsList: ", this.optionalCharacteristicsList);
            console.log("Response - getAttributeValuesByMenuNodeID-finalCharacteristicsList: ", this.finalCharacteristicsList);

            if(this.attributesList.length > 0) {

              this.tableHeading = "Attributes";
              this.tableBlock = false;
            } else {
              
              this.tableHeading = "";
              this.tableBlock = true;
            }

            if (this.characteristicsList.length || this.finalCharacteristicsList.length > 0) {

              this.characteristicsTableTitle = "Characteristics";
              this.characteristicsTableBlock = false;
            } else {

              this.characteristicsTableTitle = "";
              this.characteristicsTableBlock = true;
            }

            // if (this.characteristicsList.length > 0 || this.optionalCharacteristicsList.length > 0) {

            //   this.characteristicsTableTitle = "Characteristics";
            // } else {

            //   this.characteristicsTableTitle = "";
            // }

            // if(this.characteristicsList.length > 0) {

            //   this.characteristicsDefaultTableTitle = "Default";
            //   this.characteristicsTableBlock = false;
            // } else {
              
            //   this.characteristicsDefaultTableTitle = "";
            //   this.characteristicsTableBlock = true;
            // }

            // if(this.optionalCharacteristicsList.length > 0) {

            //   this.optionalCharacteristicsTableTitle = "Options";
            //   this.optionalCharacteristicsTableBlock = false;
            // } else {
              
            //   this.optionalCharacteristicsTableTitle = "";
            //   this.optionalCharacteristicsTableBlock = true;
            // }
          } else {
      
            this.tableHeading = "";
            this.tableBlock = true;

            this.characteristicsTableTitle = "";
            this.characteristicsTableBlock = true;

            this.optionalCharacteristicsTableTitle = "";
            this.optionalCharacteristicsTableBlock = true;
          }
        }, error => {
          
          this.handleErrorCodes(error, this.attributeValuesByMenuNodeIDEndPoint);
        });
      } else {

        this.metaDataList = [];
        this.metaDataContentText = "";
        this.metaDataContentSubText = "";

        this.metaDataMediaList = [];

        this.isSessionMargin = true;
        this.tableBlock = true;

        this.characteristicsTableTitle = "";
        this.characteristicsTableBlock = true;

        this.optionalCharacteristicsTableTitle = "";
        this.optionalCharacteristicsTableBlock = true;
      }
    }, error => {

      this.metaDataList = [];
      this.metaDataContentText = "";
      this.metaDataContentSubText = "";

      this.metaDataMediaList = [];

      this.isSessionMargin = true;
      this.tableBlock = true;

      this.characteristicsTableTitle = "";
      this.characteristicsTableBlock = true;

      this.optionalCharacteristicsTableTitle = "";
      this.optionalCharacteristicsTableBlock = true;
      
      this.handleErrorCodes(error, this.metaDataByMenuNodeIDEndPoint);
    });

    if (item.recommended_count > 0) {

      this.apiService.getRecommendedByMenuNodeID(item.id, this.recommendedByMenuNodeIDEndPoint).subscribe(response => {

        console.log("Response - recommendedByMenuNodeIDEndPoint: ", response);
        this.recommendedList = JSON.parse(JSON.stringify(response));
        console.log("Response - recommendedByMenuNodeIDEndPoint-json: ", this.recommendedList);

        if (this.recommendedList.items.length) {

          this.hideRecommendedTitleBlock = false;
        } else {
          this.hideRecommendedTitleBlock = true;
        }
      }, error => {
        
        this.handleErrorCodes(error, this.recommendedByMenuNodeIDEndPoint);
      });
    } else {

      this.recommendedList = [];
      this.hideRecommendedTitleBlock = true;
    }

    this.apiService.getRecommendedByMenuNodeID(item.id, this.childrenByMenuNodeIDEndPoint).subscribe(response => {

      console.log("Response - childrenByMenuNodeIDEndPoint: ", response);
      this.childrenListByNodeID = JSON.parse(JSON.stringify(response));
      console.log("Response - childrenByMenuNodeIDEndPoint-json: ", this.childrenListByNodeID);

      if (this.childrenListByNodeID.items.length) {

        this.inThisSectionTitle = "In This Section";
      } else {
        this.inThisSectionTitle = "";
      }
      
    }, error => {
      
      this.handleErrorCodes(error, this.childrenByMenuNodeIDEndPoint);
    });

    // if (item.featured_count > 0) {

    //   this.apiService.getRecommendedByMenuNodeID(item.id, this.featuredByMenuNodeIDEndPoint).subscribe(response => {

    //     console.log("Response - featuredByMenuNodeIDEndPoint: ", response);
    //     this.featuredList = JSON.parse(JSON.stringify(response));
    //     console.log("Response - featuredByMenuNodeIDEndPoint-json: ", this.featuredList);
    //   }, error => {
        
    //     this.handleErrorCodes(error, this.featuredByMenuNodeIDEndPoint);
    //   });
    // }
  }

  hideCharacteristicsDefaultlBlock(characteristicsValues) {

    // console.log("hideCharacteristicsDefaultlBlock - characteristicsValues: ", characteristicsValues);

    if (characteristicsValues.optional.length > 0) {

      return "Default:"
    } else {
      return ""
    }
  }

  hideCharacteristicsOptionalBlock(optional) {

    if (optional.length > 0) {
      
      return false;
    } else {

      return true;
    }
  }

  checkCharacteristicsValue(desc) {

    if (desc == "") {

      return true;
    } else {

      return false;
    }
  }

  expandList() {

    for (let i = 0; i < this.treeControl.dataNodes.length; i++) {

        this.treeControl.collapse(this.treeControl.dataNodes[i]);
    }

    for (let i = 0; i < this.treeControl.dataNodes.length; i++) {

      for (let j = 0; j < this.hierachyHorizontalList.length; j++) {
        
        console.log("Response - treeControl: ", this.hierachyHorizontalList[j]);
        if (this.hierachyHorizontalList[j].name == this.treeControl.dataNodes[i].name) {
          this.treeControl.expand(this.treeControl.dataNodes[i])
        }
      }
    }
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

      errorMessage = 'Youâ€™re not authorized to access the resource that you requested. Please login with ok button';
    } else if(errorCode == '403') {

      errorMessage = 'Sorry, You donâ€™t have permission to access this application';
    } else if(errorCode == '404') {

      errorMessage = 'The resource youâ€™re looking for was not found';
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

  recommendedtItemsMouseover(index,recommended) {

    this.recommendedSelectedIndex = index;
  }

  recommendedItemsMouseLeave(index) {

    this.recommendedSelectedIndex = -1;
  }

  recommendedSectionItemsClick(recommendedItem) {

    console.log("recommendedSectionItemsClick recommendedItem", recommendedItem);

    let item = findByIdInList(this.explorerMenuNodeList, recommendedItem.recommended_node_id);
    console.log("recommendedSectionItemsClick item", item);

    let top = document.getElementById('top');
    if (top !== null) {
      top.scrollIntoView();
      top = null;
    }

    this.onExplorerMenuNodeSelected(item);
    this.expandList();
  }

  selectedBreadcrumbPath(item) {

    console.log("selectedBreadcrumbPath item", item);

    this.onExplorerMenuNodeSelected(item);
    this.expandList();
  }

  childSectionItemsClick(childItem) {

    console.log("childSectionItemsClick childItem", childItem);

    let item = findByIdInList(this.explorerMenuNodeList, childItem.id);
    console.log("childSectionItemsClick item", item);

    let top = document.getElementById('top');
    if (top !== null) {
      top.scrollIntoView();
      top = null;
    }

    this.onExplorerMenuNodeSelected(item);
    this.expandList();
  }

  compareButtonClicked() {
    
    console.log("compareButtonClicked this.activeNode ", this.activeNode);
    console.log("compareButtonClicked this.compareButtonDisabled ", this.compareButtonDisabled);

    if (this.compareButtonDisabled) {

    } else {

      this.selectedCompareTypeName = this.activeNode.node_type_name;
      console.log("compareButtonClicked this.selectedCompareTypeName ", this.selectedCompareTypeName);

      let compareItemArray = this.compareListMap.get(this.selectedCompareTypeName);
      console.log("compareButtonClicked compareItemArray ", compareItemArray);

      if (compareItemArray && compareItemArray.length > 0) {

      } else {

        compareItemArray = [];
      }

      compareItemArray.push(this.activeNode);

      this.compareListMap.set(this.selectedCompareTypeName, compareItemArray);
      console.log("compareButtonClicked compareListMap ", this.compareListMap);

      this.selectedCompareItemsList = compareItemArray;
      console.log("compareButtonClicked selectedCompareItemsList ", this.selectedCompareItemsList);

      this.compareButtonColor = "rgba(0, 0, 0, 0.2)";
      this.compareButtonDisabled = true;
      
      this.hideFooterContent = false;

      let nodeIDs: any = [];
      for (let i = 0; i < this.selectedCompareItemsList.length; i++) {

        nodeIDs.push(this.selectedCompareItemsList[i].id);
      }

      this.apiService.nodesComparisionResult(nodeIDs).subscribe(response => {

      console.log("Response - nodesComparisionResult: ", response);
      let compareResultList = JSON.parse(JSON.stringify(response));
      console.log("Response - nodesComparisionResult-json: ", compareResultList);

      this.compareResultMapList.set(this.selectedCompareTypeName, compareResultList);

      this.compareResultList = this.compareResultMapList.get(this.selectedCompareTypeName);
      console.log("Response - nodesComparisionResult compareResultList ", this.compareResultList);
      }, error => {
        
        this.handleErrorCodes(error, "NodesComparisionResult");
      });
    }
  }

  hideCompareButton(item) {

    let nodeTypeName = item.node_type_name;
    console.log("hideCompareButton nodeTypeName", nodeTypeName);

    if (nodeTypeName == 'PRODUCT' || nodeTypeName == 'CHAMBER') {

      this.compareButtonColor = "#4599C3";
      this.compareButtonDisabled = false;

      this.selectedCompareTypeName = nodeTypeName;

      let compareItemArray = this.compareListMap.get(nodeTypeName);
      console.log("hideCompareButton compareItemArray ", compareItemArray);

      if (compareItemArray && compareItemArray.length > 0) {
        
      } else {

        compareItemArray = [];
      }

      this.selectedCompareItemsList = compareItemArray;

      let isFoundInCompareList = false;

      for (let i = 0; i < this.selectedCompareItemsList.length; i++) {

        if (item.id == this.selectedCompareItemsList[i].id) {

          isFoundInCompareList = true;
        }
      }

      if (isFoundInCompareList) {

        this.compareButtonColor = "rgba(0, 0, 0, 0.2)";
        this.compareButtonDisabled = true;
      }
      
      if (this.selectedCompareItemsList.length > 0) {

        this.hideFooterContent = false;
      } else {

        this.hideFooterContent = true;
      }

      this.compareResultList = this.compareResultMapList.get(this.selectedCompareTypeName);
      console.log("hideCompareButton compareResultList ", this.compareResultList);

      if (this.compareResultList) {

      } else {
        this.compareResultList = [];
      }

      console.log("hideCompareButton compareResultList after condition ", this.compareResultList);
    } else {

      this.hideFooterContent = true;
      
      this.compareButtonColor = "rgba(0, 0, 0, 0.2)";
      this.compareButtonDisabled = true;
    }
  }

  removeCompareItem(position) {
    
    console.log("removeCompareItem position ", position);
    console.log("removeCompareItem this.selectedCompareTypeName ", this.selectedCompareTypeName);

    console.log("removeCompareItem selectedCompareItemsList ", this.selectedCompareItemsList);

    let removingItem = this.selectedCompareItemsList[position];
    console.log("removeCompareItem removingItem ", removingItem);

    this.selectedCompareItemsList.splice(position, 1);
    console.log("removeCompareItem this.selectedCompareItemsList ", this.selectedCompareItemsList);

    this.compareListMap.set(this.selectedCompareTypeName, this.selectedCompareItemsList);
    console.log("removeCompareItem compareListMap ", this.compareListMap);

    if (removingItem.id == this.activeNode.id) {

      this.compareButtonColor = "#4599C3";
      this.compareButtonDisabled = false;
    } else {

      let isFoundInCompareList = false;
      
      for (let i = 0; i < this.selectedCompareItemsList.length; i++) {

        if (this.activeNode.id == this.selectedCompareItemsList[i].id) {
  
          isFoundInCompareList = true;
        }
      }
  
      if (isFoundInCompareList) {
  
        this.compareButtonColor = "rgba(0, 0, 0, 0.2)";
        this.compareButtonDisabled = true;
      } else {

        this.compareButtonColor = "#4599C3";
        this.compareButtonDisabled = false;
      }
    }

    if(this.selectedCompareItemsList.length > 0) {

      this.hideFooterContent = false;

      let nodeIDs: any = [];
      for (let i = 0; i < this.selectedCompareItemsList.length; i++) {

        nodeIDs.push(this.selectedCompareItemsList[i].id);
      }

      this.apiService.nodesComparisionResult(nodeIDs).subscribe(response => {

      console.log("Response - nodesComparisionResult: ", response);
      let compareResultList = JSON.parse(JSON.stringify(response));
      console.log("Response - nodesComparisionResult-json: ", compareResultList);

      this.compareResultMapList.set(this.selectedCompareTypeName, compareResultList);

      this.compareResultList = this.compareResultMapList.get(this.selectedCompareTypeName);
      console.log("Response - nodesComparisionResult compareResultList ", this.compareResultList);
      }, error => {
        
        this.handleErrorCodes(error, "NodesComparisionResult");
      });
    } else {

      this.hideFooterContent = true;
    }
  }

  upArrowClicked() {

    let top = document.getElementById('top');
    if (top !== null) {
      top.scrollIntoView();
      top = null;
    }
    
    this.showProductCompareResultsPage = true;
    this.isPlatformCompareStickyVisible = false;
    
    // localStorage.setItem("SelectedCompareItemsMapList", JSON.stringify(this.compareListMap));
    // localStorage.setItem("SelectedCompareTypeName", this.selectedCompareTypeName);

    setTimeout(() => {

      this.apiService.hideHeader();
    }, 600);
    
    // localStorage.setItem("SelectedCompareItemsList", JSON.stringify(this.selectedCompareItemsList));
    // this.router.navigate(['/productcompare']);
  }

  compareItemCloseButtonClick(position) {

    console.log("compareItemCloseButtonClick position ", position);
    
    if (this.selectedCompareItemsList.length == 1) {

      this.showProductCompareResultsPage = false;
      this.apiService.showheader(); 
    }

    this.removeCompareItem(position);
  }

  exportAsXLSX() {

    let nodeIDs: any = [];

    for (let i = 0; i < this.selectedCompareItemsList.length; i++) {

      nodeIDs.push(this.selectedCompareItemsList[i].id);
    }

    this.apiService.findOtherComparableNodesForFormate(nodeIDs, "simple").subscribe(response => {

      console.log("Response - findOtherComparableNodesForFormate: ", response);
      let excelData = JSON.parse(JSON.stringify(response));
      console.log("Response - findOtherComparableNodesForFormate-json: ", excelData);
      
      this.excelExportService.exportData(excelData, new IgxExcelExporterOptions("Product Compare Results Data"));
    }, error => {
      
      this.handleErrorCodes(error, "FindOtherComparableNodesForFormate");
    });
  }

  compareItemChangeButtonClick(position) {

    console.log("compareItemChangeButtonClick position ", position);

    this.compareItemChangePosition = position;

    let nodeIDs: any = [];
    for (let i = 0; i < this.selectedCompareItemsList.length; i++) {

      nodeIDs.push(this.selectedCompareItemsList[i].id);
    }

    this.apiService.findOtherComparableNodes(nodeIDs).subscribe(response => {

      console.log("Response - findOtherComparableNodes: ", response);
      this.otherComparableNodes = JSON.parse(JSON.stringify(response));
      console.log("Response - findOtherComparableNodes-json: ", this.otherComparableNodes);
    }, error => {
      
      this.handleErrorCodes(error, "FindOtherComparableNodes");
    });
  }

  onOtherComparableNodesClick(comparableNode) {

    console.log("onOtherComparableNodesClick comparableNode ", comparableNode);
    console.log("onOtherComparableNodesClick compareItemChangePosition ", this.compareItemChangePosition);

    let compareResultList = this.compareListMap.get(this.selectedCompareTypeName);
    console.log("onOtherComparableNodesClick compareResultList ", compareResultList);

    let item = findByIdInList(this.explorerMenuNodeList, comparableNode.id);
    console.log("onOtherComparableNodesClick item", item);

    compareResultList.splice(this.compareItemChangePosition, 1, item);

    this.selectedCompareItemsList = compareResultList;

    let nodeIDs: any = [];
    for (let i = 0; i < this.selectedCompareItemsList.length; i++) {

      nodeIDs.push(this.selectedCompareItemsList[i].id);

      if (this.selectedCompareItemsList[i].id == this.activeNode.id) {

        this.compareButtonColor = "rgba(0, 0, 0, 0.2)";
        this.compareButtonDisabled = true;
      } else {

        this.compareButtonColor = "#4599C3";
        this.compareButtonDisabled = false;
      }
    }

    this.apiService.nodesComparisionResult(nodeIDs).subscribe(response => {

      console.log("Response - nodesComparisionResult: ", response);
      let compareResultList = JSON.parse(JSON.stringify(response));
      console.log("Response - nodesComparisionResult-json: ", compareResultList);

      this.compareResultMapList.set(this.selectedCompareTypeName, compareResultList);

      this.compareResultList = this.compareResultMapList.get(this.selectedCompareTypeName);
      console.log("Response - nodesComparisionResult compareResultList ", this.compareResultList);
    }, error => {
      
      this.handleErrorCodes(error, "NodesComparisionResult");
    });
  }

  onStickyHeaderExploreClick(position) {

    console.log("onStickyHeaderExploreClick position", position);

    this.showProductCompareResultsPage = false;
    this.apiService.showheader(); 

    let item = this.selectedCompareItemsList[position];
    console.log("onStickyHeaderExploreClick item", item);

    this.onExplorerMenuNodeSelected(item);
    this.expandList();
  }

  resultsPageCloseButton() {

    this.apiService.showheader();
    this.hideFooterContent = false;
  }

  getChildImageLinkByItem(item) {

    if (item.tile_image_link) {

      return item.tile_image_link;
    } else {

      return "assets/yield_circle_image@3x.png";
    }
  }

  headerCloseButtonClick() {

    this.showProductCompareResultsPage = false;
    this.apiService.showheader(); 
  }

  showMediaContent(mediaName) {

    if(mediaName == "medias") {
      
      return true;
    } else {

      return false;
    }
  }

  getCompareButtonCursor() {

    if(this.compareButtonDisabled) {

      return "not-allowed"
    } else {

      return "pointer"
    }
  }

  compareChangeMenuOpened() {

    window.removeEventListener('scroll', this.scrollEvent, true);
  }
    
  compareChangeMenuClosed() {

    window.addEventListener('scroll', this.scrollEvent, true);
  }
  
  compareCurrentNode(activeNode, node) {

    if (activeNode) {
      if (activeNode.id == node.id) {

        return true;
      } else {

        return false;
      }
    } else {

      return false;
    }
  }

  public getColorByIndex(index: number): string{
    return index == this.hierachyHorizontalList.length-1 ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.4)';
  }

  public getCursorByIndex(index: number): string{
    return index == this.hierachyHorizontalList.length-1 ? 'default' : 'pointer';
  }

  public getFontWeightByIndex(index: number): string{
    return index == this.hierachyHorizontalList.length-1 ? '600' : '600';
  }

  isMediaTypeImage(mediaType) {

    if (mediaType == "image") {
      return true;
    } else {
      return false;
    }
  }

  isMediaTypePPTorDOC(mediaType) {

    if (mediaType == "ppt" || mediaType == "doc" || mediaType == "excel") {
      return true;
    } else {
      return false;
    }
  }

  isMediaTypeVideo(mediaType) {

    if (mediaType == "video") {
      return true;
    } else {
      return false;
    }
  }

  isMediaTypePDF(mediaType) {

    if (mediaType == "pdf") {
      return true;
    } else {
      return false;
    }
  }
}

interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
  id: any;
  metadata_count: any;
  recommended_count: any;
  featured_count: any;
  parent_node_id: any;
  parent_node_name: any;
  children: any;
  lvl: any;
  node_type_id: any;
  node_type_name: any;
}

function findByIdInList(list, id) {
  let node;
  list.some(function(currentItem) {
    return node = currentItem.id == id ? currentItem : findByIdInList(currentItem.children, id);
  });
  return node;
}