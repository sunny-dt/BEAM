import { Observable } from 'rxjs';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { Component, OnInit, ViewChild, ElementRef, ViewEncapsulation, Inject } from '@angular/core';
import { ApiService } from 'src/app/Services/api.service';
import { AppComponent } from 'src/app/app.component';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { ChartType, ChartOptions } from 'chart.js';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatAutocomplete, MatAutocompleteSelectedEvent, MatChipInputEvent } from '@angular/material';
import { IgxExcelExporterService, IgxExcelExporterOptions } from 'igniteui-angular';

@Component({
  
  selector: 'app-analytics-home-page',
  templateUrl: './analytics-home-page.component.html',
  styleUrls: ['./analytics-home-page.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class AnalyticsHomePageComponent implements OnInit {

  public innerWidth: any;  
  public pieChartLabels:any = [] ;
  public pieChartGotCodeLabels:any = [];
  public pieChartData:any = [];
  public pieChartColors = [{backgroundColor: []}];
  public pieChartBackgroundColors = [
    "#4599C3", "#E87722", "#6244BB", "#FFCD00", "#84BD00", "#00B5E2", "#53565A", "#888B8D", "#D9D9D6", "#99D6EA", "#D22630",

    "#4D4599C3", "#4DE87722", "#4D6244BB", "#FFCD00", "#84BD00", "#4D00B5E2", "#4D53565A", "#4D888B8D", "#4DD9D9D6", "#4D99D6EA", "#4DD22630",

    "#804599C3", "#80E87722", "#806244BB", "#FFCD00", "#84BD00", "#8000B5E2", "#8053565A", "#80888B8D", "#80D9D9D6", "#8099D6EA", "#80D22630",

    "#4599C3", "#E87722", "#6244BB", "#FFCD00", "#84BD00", "#00B5E2", "#53565A", "#888B8D", "#D9D9D6", "#99D6EA", "#D22630",

    "#E64599C3", "#E6E87722", "#6244BB", "#FFCD00", "#E684BD00", "#E600B5E2", "#E653565A", "#E6888B8D", "#E6D9D9D6", "#E699D6EA", "#E6D22630",

    "#1A4599C3", "#1AE87722", "#1A6244BB", "#FFCD00", "#84BD00", "#1A00B5E2", "#1A53565A", "#1A888B8D", "#1AD9D9D6", "#1A99D6EA", "#1AD22630",

    "#4599C3", "#E87722", "#6244BB", "#FFCD00", "#84BD00", "#00B5E2", "#53565A", "#888B8D", "#D9D9D6", "#99D6EA", "#D22630",

    "#E64599C3", "#E6E87722", "#E66244BB", "#E6FFCD00", "#E684BD00", "#E600B5E2", "#E653565A", "#E6888B8D", "#E6D9D9D6", "#E699D6EA", "#E6D22630",

    "#804599C3", "#80E87722", "#806244BB", "#FFCD00", "#84BD00", "#8000B5E2", "#8053565A", "#80888B8D", "#80D9D9D6", "#8099D6EA", "#80D22630",

    "#4599C3", "#E87722", "#6244BB", "#FFCD00", "#84BD00", "#00B5E2", "#53565A", "#888B8D", "#D9D9D6", "#99D6EA", "#D22630",

    "#1A4599C3", "#1AE87722", "#1A6244BB", "#FFCD00", "#84BD00", "#1A00B5E2", "#1A53565A", "#1A888B8D", "#1AD9D9D6", "#1A99D6EA", "#1AD22630",

    "#4599C3", "#E87722", "#6244BB", "#FFCD00", "#84BD00", "#00B5E2", "#53565A", "#888B8D", "#D9D9D6", "#99D6EA", "#D22630",

    "#4D4599C3", "#4DE87722", "#4D6244BB", "#FFCD00", "#84BD00", "#4D00B5E2", "#4D53565A", "#4D888B8D", "#4DD9D9D6", "#4D99D6EA", "#4DD22630",

    "#804599C3", "#80E87722", "#806244BB", "#FFCD00", "#84BD00", "#8000B5E2", "#8053565A", "#80888B8D", "#80D9D9D6", "#8099D6EA", "#80D22630",

    "#4599C3", "#E87722", "#6244BB", "#FFCD00", "#84BD00", "#00B5E2", "#53565A", "#888B8D", "#D9D9D6", "#99D6EA", "#D22630",
  ];
  public pieChartType = 'pie';
  public pieChartPlugins = [pluginDataLabels];
  public pieChartOptions: ChartOptions = {
    responsive: true,
    legend: { position: 'bottom'},
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          return "";
        },
      },
    },
    tooltips: {
      callbacks: {
        label: function (tooltipItems, data) {
          
          console.log("formatter tooltipItems index ", tooltipItems.index);
          console.log("formatter data.labels ", data.labels[tooltipItems.index]);
          console.log("formatter data ", data);
          let value = +data.datasets[0].data[tooltipItems.index];
          console.log("formatter value ", value);
          let sum = 0;
          for (let i = 0; i < data.datasets[0].data.length; i++) {
            sum = sum + Number(data.datasets[0].data[i]);
          }

          let percentage = (value*100 / sum).toFixed(2)+"%";
          return data.labels[tooltipItems.index] + ' - ' + value + ' (' + percentage + ')';
        },
        title: function (tooltipItems, data) {
          return '';
        }
      }
    },
    // scales: {
    //   yAxes: [
    //     {
    //       ticks: {
    //         // min: 0,
    //         // max: this.max,// Your absolute max value
    //         // callback: function (value) {
    //         //   return (value / this.max * 100).toFixed(0) + '%'; // convert it to percentage
    //         // },
    //       }
    //     }
    //   ]
    // }
  };
  
  tabsList: any = ["CHAMBERS", "CUSTOMERS"];
  selectedTab = 0;

  subpage = "Chambers";

  public chambersList: any = [];
  public customersList: any = [];

  public selectedFilterChambersList: any = [];
  public selectedFilterCustomersList: any = [];

  public chamberFilterCount = "All";
  public customerFilterCount = "All";

  public legendList: any = [];
  public searchText = "";

  public selectedFilterList: any = [];

  public showSelectedFilterItems = true;

  public minSliderValue: number = 0;
  public maxSliderValue: number = 5000;
  public sliderValue = 0;

  public disableTab = true;
  public hideSliderDialog = true;

  @ViewChild('legendSearch') legendSearch: ElementRef<HTMLInputElement>;
  
  constructor(public apiService:ApiService, private router: Router, private route: ActivatedRoute, private appComp: AppComponent, public dialog: MatDialog, private excelExportService: IgxExcelExporterService) {

    this.appComp.hide();
    this.apiService.showheader();
    this.appComp.toggleRightSidenav();
  }

  ngOnInit() {

    this.innerWidth = window.innerWidth;    
    let showGlobalHeader = localStorage.getItem('ShowGlobalHeader');
    console.log("ngOnInit ShowGlobalHeader ", showGlobalHeader);
    
    if (showGlobalHeader == "true") {

      this.appComp.search();
      localStorage.setItem("ShowGlobalHeader", "false");
    } else {

      this.appComp.searchback();
    }

    let dummy = [];
    this.apiService.getSaleAnalyticsForAllChambersFilter(dummy, dummy, this.sliderValue).subscribe(response => {
      
      console.log("response-getSaleAnalyticsForAllChambers ", response);
      this.chambersList = JSON.parse(JSON.stringify(response));
      console.log("getSaleAnalyticsForAllChambers chambersList: ", this.chambersList);

      this.pieChartColors[0].backgroundColor = [];
      this.pieChartColors[0].backgroundColor = this.pieChartBackgroundColors;

      for(var i = 0; i < this.chambersList.items.length ; i++) {

        this.pieChartColors[0].backgroundColor.push(this.getRandomColor());          
        this.pieChartLabels.push(this.chambersList.items[i].name);
        this.pieChartGotCodeLabels.push(this.chambersList.items[i].gotCode);
        this.pieChartData.push(this.chambersList.items[i].count);
      }

      for(var i = 0; i < this.pieChartLabels.length ; i++) {
        let legendListItem = {
          name: this.pieChartLabels[i],
          count: this.pieChartData[i],
          color: this.pieChartColors[0].backgroundColor[i],
          gotCode: this.pieChartGotCodeLabels[i],
        };
        this.legendList.push(legendListItem);
      }

      this.maxSliderValue = this.legendList[0].count;
      console.log("getSaleAnalyticsForAllChambers legendList: ", this.legendList);
    });

    this.apiService.getSaleAnalyticsCustomersNameFilter(dummy, dummy, this.sliderValue).subscribe(response => {
      
      console.log("response-getSaleAnalyticsCustomersName ", response);
      this.customersList = JSON.parse(JSON.stringify(response));
      console.log("getSaleAnalyticsCustomersName customersList ", this.customersList);

      this.disableTab = false;
    });

    console.log("getSaleAnalyticsCustomersName sliderValue ", this.sliderValue);
  }

  onSliderValue(value){
    console.log("onSliderValue val: " + value);
    console.log("onSliderValue sliderValue: " + this.sliderValue);
    
    this.pieChartLabels = [];
    this.pieChartGotCodeLabels = [];
    this.pieChartData = [];

    this.chamberFilterCount = "All";
    this.customerFilterCount = "All";
    
    this.selectedFilterChambersList = [];
    this.selectedFilterCustomersList = [];

    this.selectedFilterList = [];
    this.showSelectedFilterItems = true;
    this.searchText = "";

    this.legendList = [];

    this.legendSearch.nativeElement.value = '';

    if (this.selectedTab == 0) {

      this.apiService.getSaleAnalyticsForAllChambersFilter(this.selectedFilterChambersList, this.selectedFilterCustomersList, this.sliderValue).subscribe(response => {
        
        console.log("response-getSaleAnalyticsForAllChambers ", response);
        this.chambersList = JSON.parse(JSON.stringify(response));
        console.log("getSaleAnalyticsForAllChambersFilter chambersList: ", this.chambersList);
  
        console.log("response-chamberFilterCount ", this.chamberFilterCount);
        console.log("response-customerFilterCount ", this.customerFilterCount);

        this.pieChartColors[0].backgroundColor = [];
        this.pieChartColors[0].backgroundColor = this.pieChartBackgroundColors;

        this.pieChartLabels = [];
        this.pieChartGotCodeLabels = [];
        this.pieChartData = [];

        this.chamberFilterCount = "All";
        this.customerFilterCount = "All";
        
        this.selectedFilterChambersList = [];
        this.selectedFilterCustomersList = [];

        this.selectedFilterList = [];
        this.showSelectedFilterItems = true;
        this.searchText = "";

        this.legendList = [];

        for(var i = 0; i < this.chambersList.items.length ; i++) {

          this.pieChartColors[0].backgroundColor.push(this.getRandomColor());
          this.pieChartLabels.push(this.chambersList.items[i].name);
          this.pieChartGotCodeLabels.push(this.chambersList.items[i].gotCode);
          this.pieChartData.push(this.chambersList.items[i].count);
        }

        this.legendList = [];
        for(var i = 0; i < this.pieChartLabels.length ; i++) {
          let legendListItem = {
            name: this.pieChartLabels[i],
            count: this.pieChartData[i],
            color: this.pieChartColors[0].backgroundColor[i],
            gotCode: this.pieChartGotCodeLabels[i],
          };
          this.legendList.push(legendListItem);
        }

        if (value == 0) {
          this.maxSliderValue = this.legendList[0].count;
        }
        // this.maxSliderValue = this.legendList[0].count;
        console.log("AnalyticsHomeFilterDialog legendList: ", this.legendList);

        this.disableTab = false;
      });
    } else {

      this.apiService.getSaleAnalyticsCustomersNameFilter(this.selectedFilterChambersList, this.selectedFilterCustomersList, this.sliderValue).subscribe(response => {
        
        console.log("response-getSaleAnalyticsForAllChambers ", response);
        this.customersList = JSON.parse(JSON.stringify(response));
        console.log("getSaleAnalyticsForAllChambersFilter chambersList: ", this.customersList);
  
        this.pieChartColors[0].backgroundColor = [];
        this.pieChartColors[0].backgroundColor = this.pieChartBackgroundColors;

        this.pieChartLabels = [];
        this.pieChartGotCodeLabels = [];
        this.pieChartData = [];

        this.chamberFilterCount = "All";
        this.customerFilterCount = "All";
        
        this.selectedFilterChambersList = [];
        this.selectedFilterCustomersList = [];

        this.selectedFilterList = [];
        this.showSelectedFilterItems = true;
        this.searchText = "";

        this.legendList = [];

        for(var i = 0; i < this.customersList.items.length ; i++) {

          this.pieChartColors[0].backgroundColor.push(this.getRandomColor());
          this.pieChartLabels.push(this.customersList.items[i].customer_name);
          this.pieChartGotCodeLabels.push('');
          this.pieChartData.push(this.customersList.items[i].count);
        }

        this.legendList = [];
        for(var i = 0; i < this.pieChartLabels.length ; i++) {
          let legendListItem = {
            name: this.pieChartLabels[i],
            count: this.pieChartData[i],
            color: this.pieChartColors[0].backgroundColor[i],
            gotCode: this.pieChartGotCodeLabels[i],
          };
          this.legendList.push(legendListItem);
        }

        if (value == 0) {
          this.maxSliderValue = this.legendList[0].count;
        }
        // this.maxSliderValue = this.legendList[0].count;
        console.log("AnalyticsHomeFilterDialog legendList: ", this.legendList);

        this.disableTab = false;
      });
    }
  }

  onClickShowSliderDialog() {

    this.hideSliderDialog = false;
  }

  onClickHideSliderDialog() {

    this.hideSliderDialog = true;
  }

  getSelectedTab(tabPosition) {

    this.selectedTab = tabPosition.index;
    console.log("getSelectedTab selectedTab ", this.selectedTab);

    this.pieChartLabels = [];
    this.pieChartGotCodeLabels = [];
    this.pieChartData = [];

    this.chamberFilterCount = "All";
    this.customerFilterCount = "All";
    
    this.selectedFilterChambersList = [];
    this.selectedFilterCustomersList = [];

    this.selectedFilterList = [];
    this.showSelectedFilterItems = true;
    this.searchText = "";
    
    this.sliderValue = 0;
    this.hideSliderDialog = true;

    this.legendList = [];

    this.disableTab = true;
    this.onSliderValue(0);

    // if (this.selectedTab == 0) {

    //   this.subpage = "Chambers";

    //   this.pieChartColors[0].backgroundColor = [];
    //   this.pieChartColors[0].backgroundColor = this.pieChartBackgroundColors;

    //   for(var i = 0; i < this.chambersList.items.length ; i++) {

    //     this.pieChartColors[0].backgroundColor.push(this.getRandomColor());          
    //     this.pieChartLabels.push(this.chambersList.items[i].name);
    //     this.pieChartGotCodeLabels.push(this.chambersList.items[i].gotCode);
    //     this.pieChartData.push(this.chambersList.items[i].count);
    //   }
    //   // this.pieChartType = 'pie';
    // } else {

    //   this.subpage = "Customers";

    //   this.pieChartColors[0].backgroundColor = [];
    //   this.pieChartColors[0].backgroundColor = this.pieChartBackgroundColors;

    //   for(var i = 0; i < this.customersList.items.length ; i++) {
        
    //     this.pieChartColors[0].backgroundColor.push(this.getRandomColor());
    //     this.pieChartLabels.push(this.customersList.items[i].customer_name);
    //     this.pieChartGotCodeLabels.push('');
    //     this.pieChartData.push(this.customersList.items[i].count);
    //   }
    //   // this.pieChartType = 'pie';
    // }
    // this.legendList = [];
    // for(var i = 0; i < this.pieChartLabels.length ; i++) {
    //   let legendListItem = {
    //     name: this.pieChartLabels[i],
    //     count: this.pieChartData[i],
    //     color: this.pieChartColors[0].backgroundColor[i],
    //     gotCode: this.pieChartGotCodeLabels[i],
    //   };
    //   this.legendList.push(legendListItem);
    // }

    // this.maxSliderValue = this.legendList[0].count;
    // console.log("getSaleAnalyticsForAllChambers legendList: ", this.legendList);
  }

  public doFilter(value) {

    console.log("doFilter value ", value);
    this.searchText = value;
  }

  public displayGotCode(gotCode) {

    if (typeof gotCode!='undefined' && gotCode) {

      let gotCodeValue = "(" + gotCode + ")";
      return gotCodeValue;
    } else {
       
      return "";
    }
  }

  public chartClicked(e:any):void {

    console.log("chartClicked ", e.active[0]._model.label);

    var chamberName = e.active[0]._model.label;

    if (chamberName == "others") {

      let othersList = [];
      if (this.selectedTab == 0) {

        console.log("chartClicked chambersList others ", this.chambersList.others);

        for(var i = 0; i < this.chambersList.others.length ; i++) {

          let otherItem = { name: this.chambersList.others[i].name, count: this.chambersList.others[i].count, gotCode: this.chambersList.others[i].gotCode};
          othersList.push(otherItem);
        }

        // othersList = this.chambersList.others;
      } else {

        console.log("chartClicked customersList others ", this.customersList.others);

        for(var i = 0; i < this.customersList.others.length ; i++) {

          let otherItem = { name: this.customersList.others[i].customer_name, count: this.customersList.others[i].count, gotCode: ""};
          othersList.push(otherItem);
        }

        // othersList = this.customersList.others;
      }

      console.log("chartClicked othersList ", othersList);

      let isFrom = "ChamberFlow";
      if (this.selectedTab == 0) {

        isFrom = "ChamberFlow";
      } else {

        isFrom = "CustomerFlow";
      }

      localStorage.setItem("SalesAnalyticsIsFrom", isFrom);
      localStorage.setItem('SalesAnalyticsOthersList', JSON.stringify(othersList));
      this.router.navigate(['others'], { relativeTo: this.route });
    } else {

      let isFrom = "ChamberFlow";
      if (this.selectedTab == 0) {

        isFrom = "ChamberFlow";
      } else {

        isFrom = "CustomerFlow";
      }

      localStorage.setItem("SalesAnalyticsChamber", chamberName);
      localStorage.setItem("SalesAnalyticsIsFrom", isFrom);
      this.router.navigate(['customers'], { relativeTo: this.route });
    }
  }

  public pieChartLabelItemClicked(chamberName):void {

    console.log("pieChartLabelItemClicked chamberName ", chamberName);

    if (chamberName == "others") {

      let othersList = [];
      if (this.selectedTab == 0) {

        console.log("pieChartLabelItemClicked chambersList others ", this.chambersList.others);

        for(var i = 0; i < this.chambersList.others.length ; i++) {

          let otherItem = { name: this.chambersList.others[i].name, count: this.chambersList.others[i].count, gotCode: this.chambersList.others[i].gotCode};
          othersList.push(otherItem);
        }

        // othersList = this.chambersList.others;
      } else {

        console.log("pieChartLabelItemClicked customersList others ", this.customersList.others);

        for(var i = 0; i < this.customersList.others.length ; i++) {

          let otherItem = { name: this.customersList.others[i].customer_name, count: this.customersList.others[i].count, gotCode: ""};
          othersList.push(otherItem);
        }

        // othersList = this.customersList.others;
      }

      console.log("chartClicked othersList ", othersList);

      let isFrom = "ChamberFlow";
      if (this.selectedTab == 0) {

        isFrom = "ChamberFlow";
      } else {

        isFrom = "CustomerFlow";
      }

      localStorage.setItem("SalesAnalyticsIsFrom", isFrom);
      localStorage.setItem('SalesAnalyticsOthersList', JSON.stringify(othersList));
      this.router.navigate(['others'], { relativeTo: this.route });
    } else {

      let isFrom = "ChamberFlow";
      if (this.selectedTab == 0) {

        isFrom = "ChamberFlow";
      } else {

        isFrom = "CustomerFlow";
      }

      localStorage.setItem("SalesAnalyticsChamber", chamberName);
      localStorage.setItem("SalesAnalyticsIsFrom", isFrom);
      this.router.navigate(['customers'], { relativeTo: this.route });
    }
  }

  public exportCurrentData() {

    console.log("exportCurrentData selectedFilterChambersList ", this.selectedFilterChambersList);
    console.log("exportCurrentData selectedFilterCustomersList ", this.selectedFilterCustomersList);

    console.log("exportCurrentData chamberFilterCount ", this.chamberFilterCount);
    console.log("exportCurrentData customerFilterCount ", this.customerFilterCount);

    if (this.chamberFilterCount == "All" && this.customerFilterCount == "All") {

      this.apiService.getAllSalesAnalyticsExcelData().subscribe(response => {
          
        console.log("response-getAllSalesAnalyticsExcelData ", response);
        let excelData = JSON.parse(JSON.stringify(response));
        console.log("Response - platform excelData: ", excelData);
        
        this.excelExportService.exportData(excelData, new IgxExcelExporterOptions("AnalyticsTotalData"));
      });
    } else if (this.chamberFilterCount == "All" || this.customerFilterCount == "All") {

      this.apiService.getAllSalesAnalyticsChamberFlowExcelOne(this.selectedFilterChambersList, this.selectedFilterCustomersList).subscribe(response => {
          
        console.log("response-getAllSalesAnalyticsChamberFlowExcelOne ", response);
        let excelData = JSON.parse(JSON.stringify(response));
        console.log("Response - getAllSalesAnalyticsChamberFlowExcelOne excelData: ", excelData);
        
        this.excelExportService.exportData(excelData, new IgxExcelExporterOptions("AnalyticsFilterData"));
      });     
    } else {

      this.apiService.getAllSalesAnalyticsChamberFlowExcelTwo(this.selectedFilterChambersList, this.selectedFilterCustomersList).subscribe(response => {
          
        console.log("response-getAllSalesAnalyticsChamberFlowExcelTwo ", response);
        let excelData = JSON.parse(JSON.stringify(response));
        console.log("Response - getAllSalesAnalyticsChamberFlowExcelTwo excelData: ", excelData);
        
        this.excelExportService.exportData(excelData, new IgxExcelExporterOptions("AnalyticsFilterData"));
      });
    }
  }

  public exportAllData() {
    
    this.apiService.getAllSalesAnalyticsExcelData().subscribe(response => {
          
      console.log("response-getAllSalesAnalyticsExcelData ", response);
      let excelData = JSON.parse(JSON.stringify(response));
      console.log("Response - platform excelData: ", excelData);
      
      this.excelExportService.exportData(excelData, new IgxExcelExporterOptions("AnalyticsTotalData"));
    });
  }

  public showFilterDialog(filterType, filterItemsList) {

    const dialogRef = this.dialog.open(AnalyticsHomeFilterDialog, {
      width: '1100px',
      // height: '590px',
      data: {filterType: filterType, filterItemsList: filterItemsList, selectedFilterChambersList: this.selectedFilterChambersList, selectedFilterCustomersList: this.selectedFilterCustomersList}
    });

    dialogRef.afterClosed().subscribe(result => {
      
      var isFrom = localStorage.getItem('HomeSelectedClosedFrom');
      var filterType = localStorage.getItem('HomeSelectedFilterType');
      var selectedFilterItemsList = JSON.parse(localStorage.getItem('HomeSelectedFilterItemsList'));
      
      console.log("AnalyticsHomeFilterDialog afterClosed filterType ", filterType);
      console.log("AnalyticsHomeFilterDialog afterClosed selectedFilterItemsList ", selectedFilterItemsList);

      if (isFrom == "Done") {

        this.sliderValue = 0;

        this.pieChartLabels = [];
        this.pieChartGotCodeLabels = [];
        this.pieChartData = [];

        this.legendSearch.nativeElement.value = '';

        if (this.selectedTab == 0) {

          if (filterType == "Chambers") {

            this.selectedFilterChambersList = selectedFilterItemsList;
            this.chamberFilterCount = selectedFilterItemsList.length;
  
            if (this.chamberFilterCount == '0') {
  
              this.chamberFilterCount = "All";
            }
          } else {
  
            this.selectedFilterCustomersList = selectedFilterItemsList;
            this.customerFilterCount = selectedFilterItemsList.length;
  
            if (this.customerFilterCount == '0') {
  
              this.customerFilterCount = "All";
              this.showSelectedFilterItems = true;
            } else {
  
              if (this.pieChartType == "pie") {

                this.showSelectedFilterItems = false;
              } else {
                
                this.showSelectedFilterItems = true;
              }
            }
          }
        } else {

          if (filterType == "Chambers") {

            this.selectedFilterChambersList = selectedFilterItemsList;
            this.chamberFilterCount = selectedFilterItemsList.length;
  
            if (this.chamberFilterCount == '0') {
  
              this.chamberFilterCount = "All";
              this.showSelectedFilterItems = true;
            } else {

              if (this.pieChartType == "pie") {

                this.showSelectedFilterItems = false;
              } else {
                
                this.showSelectedFilterItems = true;
              }
            }
          } else {
  
            this.selectedFilterCustomersList = selectedFilterItemsList;
            this.customerFilterCount = selectedFilterItemsList.length;
  
            if (this.customerFilterCount == '0') {

              this.customerFilterCount = "All";
            }
          }
        }
        
        if (this.selectedTab == 0) {

          this.selectedFilterList = this.selectedFilterCustomersList;

          this.apiService.getSaleAnalyticsForAllChambersFilter(this.selectedFilterChambersList, this.selectedFilterCustomersList, this.sliderValue).subscribe(response => {
          
            console.log("response-getSaleAnalyticsForAllChambers ", response);
            let chambersList = JSON.parse(JSON.stringify(response));
            console.log("getSaleAnalyticsForAllChambersFilter chambersList: ", chambersList);
      
            console.log("response-chamberFilterCount ", this.chamberFilterCount);
            console.log("response-customerFilterCount ", this.customerFilterCount);

            this.pieChartColors[0].backgroundColor = [];
            this.pieChartColors[0].backgroundColor = this.pieChartBackgroundColors;

            for(var i = 0; i < chambersList.items.length ; i++) {

              this.pieChartColors[0].backgroundColor.push(this.getRandomColor());
              this.pieChartLabels.push(chambersList.items[i].name);
              this.pieChartGotCodeLabels.push(chambersList.items[i].gotCode);
              this.pieChartData.push(chambersList.items[i].count);
            }

            this.legendList = [];
            for(var i = 0; i < this.pieChartLabels.length ; i++) {
              let legendListItem = {
                name: this.pieChartLabels[i],
                count: this.pieChartData[i],
                color: this.pieChartColors[0].backgroundColor[i],
                gotCode: this.pieChartGotCodeLabels[i],
              };
              this.legendList.push(legendListItem);
            }

            // this.maxSliderValue = this.legendList[0].count;
            console.log("AnalyticsHomeFilterDialog legendList: ", this.legendList);

            if (this.legendList.length == 0) {
              
              const dialogRef = this.dialog.open(NoFilterResultDialog, {

                width: '350px',
                // height: '600px'
              });
            }
          });
        } else {

          this.selectedFilterList = this.selectedFilterChambersList;

          this.apiService.getSaleAnalyticsCustomersNameFilter(this.selectedFilterChambersList, this.selectedFilterCustomersList, this.sliderValue).subscribe(response => {
          
            console.log("response-getSaleAnalyticsForAllChambers ", response);
            let customerList = JSON.parse(JSON.stringify(response));
            console.log("getSaleAnalyticsForAllChambersFilter chambersList: ", customerList);
      
            this.pieChartColors[0].backgroundColor = [];
            this.pieChartColors[0].backgroundColor = this.pieChartBackgroundColors;

            for(var i = 0; i < customerList.items.length ; i++) {

              this.pieChartColors[0].backgroundColor.push(this.getRandomColor());
              this.pieChartLabels.push(customerList.items[i].customer_name);
              this.pieChartGotCodeLabels.push('');
              this.pieChartData.push(customerList.items[i].count);
            }

            this.legendList = [];
            for(var i = 0; i < this.pieChartLabels.length ; i++) {
              let legendListItem = {
                name: this.pieChartLabels[i],
                count: this.pieChartData[i],
                color: this.pieChartColors[0].backgroundColor[i],
                gotCode: this.pieChartGotCodeLabels[i],
              };
              this.legendList.push(legendListItem);
            }

            // this.maxSliderValue = this.legendList[0].count;
            console.log("AnalyticsHomeFilterDialog legendList: ", this.legendList);

            if (this.legendList.length == 0) {
              
              const dialogRef = this.dialog.open(NoFilterResultDialog, {

                width: '350px',
                // height: '600px'
              });
            }
          });
        }

        // if (this.pieChartType == "pie") {

        //   this.showSelectedFilterItems = false;
        // } else {
        //   this.showSelectedFilterItems = true;
        // }
      }
    });
  }
 
  public chartHovered(e:any):void {
    // console.log(e);
  }

  filterByChambers() {

    let filterItems = [];
    
    for (let i = 0; i < this.chambersList.items.length; i++) {

      if (this.chambersList.items[i].name.toLowerCase() == "others") {

      } else {

        filterItems.push(this.chambersList.items[i].name);
      }
    }

    for (let i = 0; i < this.chambersList.others.length; i++) {

      filterItems.push(this.chambersList.others[i].name);
    }

    this.showFilterDialog("Chambers", filterItems);
  }

  filterByCustomers() {

    let filterItems = [];
    
    for (let i = 0; i < this.customersList.items.length; i++) {

      if (this.customersList.items[i].customer_name.toLowerCase() == "others") {

      } else {

        filterItems.push(this.customersList.items[i].customer_name);
      }
    }

    for (let i = 0; i < this.customersList.others.length; i++) {

      filterItems.push(this.customersList.others[i].customer_name);
    }

    this.showFilterDialog("Customers", filterItems);
  }

  goToPreviousPage() {

    this.router.navigate(['launch']);
  }

  getRandomColor() {

    var color = Math.floor(0x1000000 * Math.random()).toString(16);
    var hex = '#' + ('000000' + color).slice(-6);
    
    return hex;
  }

  public onChartToggleChange(val: string) {
    
    console.log(val);
    this.pieChartType = val;

    if (this.pieChartType == "pie") {

      if (this.customerFilterCount == "All") {

        this.showSelectedFilterItems = true;
      } else {

        this.showSelectedFilterItems = false;
      }
    } else {
      this.showSelectedFilterItems = true;
    }
  }

  public getChartPercentage(chartData) {

    // console.log("getChartPercentage chartData ", chartData);
    let sum = 0;
    for (let i = 0; i < this.legendList.length; i++) {
      sum = sum + Number(this.legendList[i].count);
    }

    let percentage = (chartData*100 / sum).toFixed(2)+"%";
    
    return percentage;
  }
}

@Component({

  selector: 'analytics-home-filter-dialog',
  templateUrl: 'analytics-home-filter-dialog.html',
  styleUrls: ['./analytics-home-filter-dialog.css'],
})

export class AnalyticsHomeFilterDialog implements OnInit {

  filterType;
  filterItemsList;
  selectedFilterItemsList: any = [];

  selectedFilterChambersList: any = [];
  selectedFilterCustomersList: any = [];
  
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;

  dropDownChambersList:any = [];

  separatorKeysCodes: number[] = [ENTER];
  searchFormControl = new FormControl();

  showFilerAllClearButton = true;

  @ViewChild('SearchFilterInput') searchFilterInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor(public dialogRef: MatDialogRef<AnalyticsHomeFilterDialog>, @Inject(MAT_DIALOG_DATA) public data: DialogData) {
  
    this.filterType = data.filterType;
    this.filterItemsList = data.filterItemsList;
    this.selectedFilterChambersList = data.selectedFilterChambersList;
    this.selectedFilterCustomersList = data.selectedFilterCustomersList;

    console.log("AnalyticsHomeFilterDialog filterType ", this.filterType);
    console.log("AnalyticsHomeFilterDialog filterItemsList ", this.filterItemsList);
    console.log("AnalyticsHomeFilterDialog selectedFilterChambersList ", this.selectedFilterChambersList);
    console.log("AnalyticsHomeFilterDialog selectedFilterCustomersList ", this.selectedFilterCustomersList);

    localStorage.setItem('HomeSelectedClosedFrom', "Cancel");
    localStorage.setItem('HomeSelectedFilterType', '');
    let dummy = [];
    localStorage.setItem('HomeSelectedFilterItemsList', JSON.parse(JSON.stringify(dummy)));

    if (this.filterType == "Chambers") {

      this.selectedFilterItemsList = this.selectedFilterChambersList;
    } else {

      this.selectedFilterItemsList = this.selectedFilterCustomersList;
    }

    if (this.selectedFilterItemsList.length > 0) {

      this.showFilerAllClearButton = true;
    } else {

      this.showFilerAllClearButton = false;
    }

    for (let i = 0; i < this.filterItemsList.length; i++) {

      for (let j = 0; j < this.selectedFilterItemsList.length; j++) {
        
        if (this.filterItemsList[i] == this.selectedFilterItemsList[j]) {
          
          this.filterItemsList.splice(i, 1);
        }
      }
    }
  }

  ngOnInit() {

  }

  dailogCancel() {

    localStorage.setItem('HomeSelectedClosedFrom', "Cancel");
    localStorage.setItem('HomeSelectedFilterType', '');
    let dummy = [];
    localStorage.setItem('HomeSelectedFilterItemsList', JSON.parse(JSON.stringify(dummy)));
    this.dialogRef.close();
  }

  dailogDone() {

    console.log("dailogDone filterType ", this.filterType);
    console.log("dailogDone selectedFilterItemsList ", this.selectedFilterItemsList);

    localStorage.setItem('HomeSelectedClosedFrom', "Done");
    localStorage.setItem('HomeSelectedFilterType', this.filterType);
    localStorage.setItem('HomeSelectedFilterItemsList', JSON.stringify(this.selectedFilterItemsList));
    this.dialogRef.close();
  }

  add(event: MatChipInputEvent): void {

    if (!this.matAutocomplete.isOpen) {

      const input = event.input;
      const value = event.value;

      if ((value || '').trim()) {
        this.selectedFilterItemsList.push(value.trim());
      }

      if (input) {
        input.value = '';
      }

      this.searchFormControl.setValue(null);

      const index = this.filterItemsList.indexOf(value.trim());
      console.log("add index: ", index);

      if (index >= 0) {
        this.filterItemsList.splice(index, 1);
      }
    }
  }

  remove(item: string): void {

    const index = this.selectedFilterItemsList.indexOf(item);

    if (index >= 0) {
      this.selectedFilterItemsList.splice(index, 1);
    }

    this.filterItemsList.push(item);
  }

  selected(event: MatAutocompleteSelectedEvent): void {

    this.selectedFilterItemsList.push(event.option.viewValue);
    this.searchFilterInput.nativeElement.value = '';
    this.searchFormControl.setValue(null);

    console.log("selected selectedFilterItemsList ", this.selectedFilterItemsList);

    const index = this.filterItemsList.indexOf(event.option.viewValue);
    console.log("selected index: ", index);

    if (index >= 0) {
      this.filterItemsList.splice(index, 1);
    }
  }

  onKeyPress(event: any) {

    console.log("onKeyPress",event.target.value);
    this.dropDownChambersList = this.filterKeyPressedValue(event.target.value, this.filterItemsList);
    console.log("dropDownChambersList", this.dropDownChambersList);
  }

  filterKeyPressedValue(searchValue, mChambersList) {

    var mDropDownChambersList: any[] = [];

    for (var i = 0; i < mChambersList.length; i++) {

      if (mChambersList[i].toLowerCase().includes(searchValue.toLowerCase())) {
        
        mDropDownChambersList.push(mChambersList[i]);
      }
    }

    return mDropDownChambersList;
  }

  filterItemClick(item) {

    this.selectedFilterItemsList.push(item);

    const index = this.filterItemsList.indexOf(item);

    console.log("filterItemClick index: ", index);
    if (index >= 0) {
      this.filterItemsList.splice(index, 1);
    }
  }

  clearAllSelectedFilters() {

    for (let i = 0; i < this.selectedFilterItemsList.length; i++) {
      this.filterItemsList.push(this.selectedFilterItemsList[i]);
    }
    this.selectedFilterItemsList = [];
    this.searchFilterInput.nativeElement.value = '';
  }
}

export interface DialogData {

  filterType;
  filterItemsList;
  selectedFilterChambersList,
  selectedFilterCustomersList
}

@Component({

  selector: 'no-filter-result-dialog_dialog',
  templateUrl: 'no_filter_result_dialog.html',
  styleUrls: ['no_filter_result_dialog.css'],
})

export class NoFilterResultDialog {

  constructor(public dialogRef: MatDialogRef<NoFilterResultDialog>) { 

  }

  dailogCancel(): void {
    this.dialogRef.close();
  }

  trackByIndex(index) {
    return index;
  }

}