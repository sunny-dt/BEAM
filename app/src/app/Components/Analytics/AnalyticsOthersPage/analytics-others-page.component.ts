import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { ApiService } from 'src/app/Services/api.service';
import { AppComponent } from 'src/app/app.component';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { ChartType, ChartOptions } from 'chart.js';
import { MatDialog, MatChipInputEvent, MatAutocompleteSelectedEvent, MAT_DIALOG_DATA, MatDialogRef, MatAutocomplete } from '@angular/material';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { IgxExcelExporterService, IgxExcelExporterOptions } from 'igniteui-angular';

@Component({
  
  selector: 'app-analytics-others-page',
  templateUrl: './analytics-others-page.component.html',
  styleUrls: ['./analytics-others-page.component.css'],
})

export class AnalyticsOthersPageComponent implements OnInit {

  salesAnalyticsOthersList:any = [];
  isFrom;
  subTitleName = "";
  titleName = "";

  public pieChartLabels:any = [];
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
  public pieChartType:string = 'pie';
  public pieChartPlugins = [pluginDataLabels];
  public pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'left',
    },
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          return "";;
        },
      },
    },
    tooltips: {
      callbacks: {
        label: function (tooltipItems, data) {
          
          console.log("formatter tooltipItems index ", tooltipItems.index);
          console.log("formatter data ", data.labels[tooltipItems.index]);
          console.log("formatter data ", data);
          let value = +data.datasets[0].data[tooltipItems.index];
          console.log("formatter data ", value);
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
    }
  };

  public selectedFilterList: any = [] ;
  public filterCount = "All";

  public legendList: any = [];
  public searchText = "";

  public showSelectedFilterItems = true;

  constructor(public apiService:ApiService, private router: Router, private route: ActivatedRoute, private appComp: AppComponent, public dialog: MatDialog, private excelExportService: IgxExcelExporterService) {

    this.appComp.hide();
    this.apiService.showheader();
    this.appComp.toggleRightSidenav();

    this.salesAnalyticsOthersList = JSON.parse(localStorage.getItem("SalesAnalyticsOthersList"));
    this.isFrom = localStorage.getItem("SalesAnalyticsIsFrom");

    if (this.isFrom == 'ChamberFlow') {

      this.titleName = "Other Chambers";
      this.subTitleName = "OTHER CHAMBERS";
    } else {

      this.titleName = "Other Customers";
      this.subTitleName = "OTHER CUSTOMERS";
    }
  }

  ngOnInit() {
    
    let showGlobalHeader = localStorage.getItem('ShowGlobalHeader');
    console.log("ngOnInit ShowGlobalHeader ", showGlobalHeader);
    
    if (showGlobalHeader == "true") {

      this.appComp.search();
      localStorage.setItem("ShowGlobalHeader", "false");
    } else {

      this.appComp.searchback();
    }

    localStorage.setItem("isUserLogin", "true");

    this.pieChartColors[0].backgroundColor = [];
    this.pieChartColors[0].backgroundColor = this.pieChartBackgroundColors;

    for(var i = 0; i< this.salesAnalyticsOthersList.length ; i++) {

      if(this.salesAnalyticsOthersList[i].count > 0) {

        this.pieChartLabels.push(this.salesAnalyticsOthersList[i].name);
        this.pieChartGotCodeLabels.push(this.salesAnalyticsOthersList[i].gotCode);
        this.pieChartData.push(this.salesAnalyticsOthersList[i].count);
        this.pieChartColors[0].backgroundColor.push(this.getRandomColor());
      }
    }

    console.log("getAllCustomersByChamber-pieChartLabels", this.pieChartLabels);
    console.log("getAllCustomersByChamber-pieChartData", this.pieChartData);

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

    console.log("getAllFabsByCustomer legendList: ", this.legendList);
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
    console.log(e);
    
    var customerName = e.active[0]._model.label;
    localStorage.setItem("SalesAnalyticsChamber", customerName);
    localStorage.setItem("SalesAnalyticsIsFrom", this.isFrom);
    this.router.navigate(['analytics/customers']);
  }
 
  public pieChartLabelItemClicked(customerName):void {

    console.log("pieChartLabelItemClicked customerName ", customerName);

    localStorage.setItem("SalesAnalyticsChamber", customerName);
    localStorage.setItem("SalesAnalyticsIsFrom", this.isFrom);
    this.router.navigate(['analytics/customers']);
  }

  public chartHovered(e:any):void {
    // console.log(e);
  }

  public exportCurrentData() {

  }

  public exportAllData() {
    
    this.apiService.getAllSalesAnalyticsExcelData().subscribe(response => {
          
      console.log("response-getAllSalesAnalyticsExcelData ", response);
      let excelData = JSON.parse(JSON.stringify(response));
      console.log("Response - platform excelData: ", excelData);
      
      this.excelExportService.exportData(excelData, new IgxExcelExporterOptions("AnalyticsTotalData"));
    });
  }
  
  public onFilterClick() {

    let filterItemsList = [];
    for (let i = 0; i < this.salesAnalyticsOthersList.length; i++) {

      if(this.salesAnalyticsOthersList[i].count > 0) {

        filterItemsList.push(this.salesAnalyticsOthersList[i].name);
      }
    }

    console.log("AnalyticsCustomerFilterDialog filterItemsList ", filterItemsList);

    const dialogRef = this.dialog.open(AnalyticsOthersFilterDialog, {
      width: '1100px',
      // height: dialogHeight,
      data: {filterItemsList: filterItemsList, selectedFilterList: this.selectedFilterList}
    });

    dialogRef.afterClosed().subscribe(result => {
      
      var selectedFilterItemsList = JSON.parse(localStorage.getItem('OthersSelectedFilterItemsList'));
      console.log("AnalyticsCustomerFilterDialog afterClosed selectedFilterItemsList ", selectedFilterItemsList);

      this.pieChartLabels = [];
      this.pieChartGotCodeLabels = [];
      this.pieChartData = [];

      this.selectedFilterList = selectedFilterItemsList;
      this.filterCount = selectedFilterItemsList.length;

      this.pieChartColors[0].backgroundColor = [];
      this.pieChartColors[0].backgroundColor = this.pieChartBackgroundColors;

      if (this.filterCount == '0') {

        this.filterCount = "All";
        this.showSelectedFilterItems = true;
      } else {
        
        this.showSelectedFilterItems = false;
      }

      for(var i = 0; i < this.salesAnalyticsOthersList.length ; i++) {
      
        if(this.salesAnalyticsOthersList[i].count > 0) {
          
          if (this.filterCount == 'All') {

            this.pieChartLabels.push(this.salesAnalyticsOthersList[i].name);
            this.pieChartGotCodeLabels.push(this.salesAnalyticsOthersList[i].gotCode);
            this.pieChartData.push(this.salesAnalyticsOthersList[i].count);
            this.pieChartColors[0].backgroundColor.push(this.getRandomColor());   
          } else {

            for (let j = 0; j < selectedFilterItemsList.length; j++) {

              if (this.salesAnalyticsOthersList[i].name == selectedFilterItemsList[j]) {
  
                this.pieChartLabels.push(this.salesAnalyticsOthersList[i].name);
                this.pieChartGotCodeLabels.push(this.salesAnalyticsOthersList[i].gotCode);
                this.pieChartData.push(this.salesAnalyticsOthersList[i].count);
                this.pieChartColors[0].backgroundColor.push(this.getRandomColor());   
              }
            }
          }
        }
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

      console.log("AnalyticsCustomerFilterDialog legendList: ", this.legendList);

      // if (isFrom == "Done") {

      //   this.pieChartLabels = [];
      //   this.pieChartData = [];

      //   this.selectedFilterList = selectedFilterItemsList;
      //   this.filterCount = selectedFilterItemsList.length;

      //   if (this.filterCount == '0') {

      //     this.filterCount = "All";
      //     this.showSelectedFilterItems = true;
      //   } else {
          
      //     this.showSelectedFilterItems = false;
      //   }
      
      //   if (this.isFrom == 'ChamberFlow') {

      //     this.apiService.getAllCustomersByChamberFilter(this.chamberName, this.selectedFilterList).subscribe(response => {
          
      //       console.log("response-getAllCustomersByChamberFilter ", response);
      //       let customerList = JSON.parse(JSON.stringify(response));
      //       console.log("getAllCustomersByChamberFilter customerList: ", customerList);
      
      //       this.pieChartColors[0].backgroundColor = [];
      //       this.pieChartColors[0].backgroundColor = this.pieChartBackgroundColors;
      //       for(var i = 0; i < customerList.length ; i++) {
      
      //         if(this.salesAnalyticsOthersList[i].count > 0) {
                
      //           this.pieChartLabels.push(customerList[i].customer_name);
      //           this.pieChartData.push(customerList[i].count);
      //           this.pieChartColors[0].backgroundColor.push(this.getRandomColor());
      //         }
      //       }

      //       this.legendList = [];
      //       for(var i = 0; i < this.pieChartLabels.length ; i++) {
      //         let legendListItem = {
      //           name: this.pieChartLabels[i],
      //           count: this.pieChartData[i],
      //           color: this.pieChartColors[0].backgroundColor[i]
      //         };
      //         this.legendList.push(legendListItem);
      //       }

      //       console.log("AnalyticsCustomerFilterDialog legendList: ", this.legendList);
      //     });
      //   } else {

      //     this.apiService.getAllFabsByCustomerFilter(this.chamberName, this.selectedFilterList).subscribe(response => {
          
      //       console.log("response-getAllCustomersByChamberFilter ", response);
      //       let customerList = JSON.parse(JSON.stringify(response));
      //       console.log("getAllCustomersByChamberFilter customerList: ", customerList);
      
      //       this.pieChartColors[0].backgroundColor = [];
      //       this.pieChartColors[0].backgroundColor = this.pieChartBackgroundColors;
      //       for(var i = 0; i < customerList.length ; i++) {
      
      //         if(this.salesAnalyticsCustomers[i].count > 0) {

      //           this.pieChartLabels.push(customerList[i].FabName);
      //           this.pieChartData.push(customerList[i].count);
      //           this.pieChartColors[0].backgroundColor.push(this.getRandomColor());
      //         }
      //       }

      //       this.legendList = [];
      //       for(var i = 0; i < this.pieChartLabels.length ; i++) {
      //         let legendListItem = {
      //           name: this.pieChartLabels[i],
      //           count: this.pieChartData[i],
      //           color: this.pieChartColors[0].backgroundColor[i]
      //         };
      //         this.legendList.push(legendListItem);
      //       }

      //       console.log("AnalyticsCustomerFilterDialog legendList: ", this.legendList);
      //     });
      //   }
      // }
    });
  }

  public doFilter(value) {

    console.log("doFilter value ", value);
    this.searchText = value;
  }

  goToPreviousPage() {

    this.router.navigate(['analytics']);
  }

  getRandomColor() {

    var color = Math.floor(0x1000000 * Math.random()).toString(16);
    var hex = '#' + ('000000' + color).slice(-6);
    
    return hex;
  }

  public onChartToggleChange(val: string) {
    
    console.log(val);
    this.pieChartType = val;
  }

  public getChartPercentage(chartData) {

    // console.log("getChartPercentage chartData ", chartData);
    let sum = 0;
    for (let i = 0; i < this.pieChartData.length; i++) {
      sum = sum + Number(this.pieChartData[i]);
    }

    let percentage = (chartData*100 / sum).toFixed(2)+"%";
    
    return percentage;
  }
}

@Component({

  selector: 'analytics-others-filter-dialog',
  templateUrl: 'analytics-others-filter-dialog.html',
  styleUrls: ['./analytics-others-filter-dialog.css'],
})

export class AnalyticsOthersFilterDialog implements OnInit {

  filterType;
  filterItemsList;
  selectedFilterItemsList: any = [];

  selectedFilterList: any = [];
  
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;

  dropDownChambersList:any = [];

  separatorKeysCodes: number[] = [ENTER, COMMA];
  searchFormControl = new FormControl();

  showFilerAllClearButton = true;

  @ViewChild('SearchFilterInput') searchFilterInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor(public dialogRef: MatDialogRef<AnalyticsOthersFilterDialog>, @Inject(MAT_DIALOG_DATA) public data: DialogData) {
  
    this.filterItemsList = data.filterItemsList;
    this.selectedFilterList = data.selectedFilterList;

    console.log("AnalyticsOthersFilterDialog filterItemsList ", this.filterItemsList);
    console.log("AnalyticsOthersFilterDialog selectedFilterList ", this.selectedFilterList);

    localStorage.setItem('OthersSelectedClosedFrom', "Cancel");
    localStorage.setItem('OthersSelectedFilterType', '');
    let dummy = [];
    localStorage.setItem('OthersSelectedFilterItemsList', JSON.parse(JSON.stringify(dummy)));

    this.selectedFilterItemsList = this.selectedFilterList;

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

    localStorage.setItem('OthersSelectedClosedFrom', "Cancel");
    localStorage.setItem('OthersSelectedFilterType', '');
    let dummy = [];
    localStorage.setItem('OthersSelectedFilterItemsList', JSON.parse(JSON.stringify(dummy)));
    this.dialogRef.close();
  }

  dailogDone() {

    console.log("dailogDone filterType ", this.filterType);
    console.log("dailogDone selectedFilterItemsList ", this.selectedFilterItemsList);

    localStorage.setItem('OthersSelectedClosedFrom', "Done");
    localStorage.setItem('OthersSelectedFilterType', this.filterType);
    localStorage.setItem('OthersSelectedFilterItemsList', JSON.stringify(this.selectedFilterItemsList));
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
  }
}

export interface DialogData {

  filterItemsList;
  selectedFilterList;
}