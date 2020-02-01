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
  
  selector: 'app-analytics-customers-page',
  templateUrl: './analytics-customers-page.component.html',
  styleUrls: ['./analytics-customers-page.component.css'],
})

export class AnalyticsCustomersPageComponent implements OnInit {

  salesAnalyticsCustomers:any = [];
  chamberName;
  isFrom;
  subTitleName = "";
  titleName = "";

  public pieChartLabels:any = [];
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

  public minSliderValue: number = 0;
  public maxSliderValue: number = 5000;
  public sliderValue = 0;

  public disableTab = true;
  public hideSliderDialog = true;

  constructor(public apiService:ApiService, private router: Router, private route: ActivatedRoute, private appComp: AppComponent, public dialog: MatDialog, private excelExportService: IgxExcelExporterService) {

    this.appComp.hide();
    this.apiService.showheader();
    this.appComp.toggleRightSidenav();

    this.chamberName = localStorage.getItem("SalesAnalyticsChamber");
    this.isFrom = localStorage.getItem("SalesAnalyticsIsFrom");

    if (this.isFrom == 'ChamberFlow') {

      this.titleName = "Chamber";
      this.subTitleName = "CUSTOMERS";
    } else {

      this.titleName = "Customer";
      this.subTitleName = "FABS";
    }
  }

  ngOnInit() {
    
    let showGlobalHeader = localStorage.getItem('ShowGlobalHeader');
    console.log("ngOnInit ShowGlobalHeader ", showGlobalHeader);
    console.log("this.chamberName",this.chamberName);
    if (showGlobalHeader == "true") {

      this.appComp.search();
      localStorage.setItem("ShowGlobalHeader", "false");
    } else {

      this.appComp.searchback();
    }

    localStorage.setItem("isUserLogin", "true");

    if (this.isFrom == 'ChamberFlow') {
      let dummy = [];
      this.apiService.getAllCustomersByChamberFilter(this.chamberName, dummy, this.sliderValue).subscribe(response => {

        console.log("getAllCustomersByChamber-response", response);
        this.salesAnalyticsCustomers = JSON.parse(JSON.stringify(response));
        console.log("getAllCustomersByChamber-salesAnalyticsCustomers", this.salesAnalyticsCustomers);

        this.pieChartColors[0].backgroundColor = [];
        this.pieChartColors[0].backgroundColor = this.pieChartBackgroundColors;
        for(var i = 0; i< this.salesAnalyticsCustomers.items.length ; i++) {

          if(this.salesAnalyticsCustomers.items[i].count > 0) {

            this.pieChartLabels.push(this.salesAnalyticsCustomers.items[i].customer_name);
            this.pieChartData.push(this.salesAnalyticsCustomers.items[i].count);
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
            color: this.pieChartColors[0].backgroundColor[i]
          };
          this.legendList.push(legendListItem);
        }

        this.maxSliderValue = this.legendList[0].count;
        console.log("getAllFabsByCustomer legendList: ", this.legendList);
      });
    } else {

      this.apiService.getAllFabsByCustomer(this.chamberName).subscribe(response => {

        console.log("getAllFabsByCustomer-response", response);
        this.salesAnalyticsCustomers = JSON.parse(JSON.stringify(response));
        console.log("getAllFabsByCustomer-salesAnalyticsCustomers", this.salesAnalyticsCustomers);

        this.pieChartColors[0].backgroundColor = [];
        this.pieChartColors[0].backgroundColor = this.pieChartBackgroundColors;
        for(var i = 0; i< this.salesAnalyticsCustomers.length ; i++) {

          if(this.salesAnalyticsCustomers[i].count > 0) {

            this.pieChartLabels.push(this.salesAnalyticsCustomers[i].FabName);
            this.pieChartData.push(this.salesAnalyticsCustomers[i].count);
            this.pieChartColors[0].backgroundColor.push(this.getRandomColor());
          }
        }

        console.log("getAllFabsByCustomer-pieChartLabels", this.pieChartLabels);
        console.log("getAllFabsByCustomer-pieChartData", this.pieChartData);

        this.legendList = [];
        for(var i = 0; i < this.pieChartLabels.length ; i++) {
          let legendListItem = {
            name: this.pieChartLabels[i],
            count: this.pieChartData[i],
            color: this.pieChartColors[0].backgroundColor[i]
          };
          this.legendList.push(legendListItem);
        }

        console.log("getAllFabsByCustomer legendList: ", this.legendList);
      });
    }
  }

  onSliderValue(value){
    console.log("onSliderValue val: " + value);
    console.log("onSliderValue sliderValue: " + this.sliderValue);
    
    this.pieChartLabels = [];
    this.pieChartData = [];

    this.selectedFilterList = [];
      
    this.filterCount = "All";
    this.showSelectedFilterItems = true;
    
    this.apiService.getAllCustomersByChamberFilter(this.chamberName, this.selectedFilterList, this.sliderValue).subscribe(response => {
        
      console.log("response-getAllCustomersByChamberFilter ", response);
      this.salesAnalyticsCustomers = JSON.parse(JSON.stringify(response));
      console.log("getAllCustomersByChamberFilter customerList: ", this.salesAnalyticsCustomers);

      this.pieChartColors[0].backgroundColor = [];
      this.pieChartColors[0].backgroundColor = this.pieChartBackgroundColors;

      this.pieChartLabels = [];
      this.pieChartData = [];

      this.selectedFilterList = [];
        
      this.filterCount = "All";
      this.showSelectedFilterItems = true;

      for(var i = 0; i < this.salesAnalyticsCustomers.items.length ; i++) {

        if(this.salesAnalyticsCustomers.items[i].count > 0) {
          
          this.pieChartLabels.push(this.salesAnalyticsCustomers.items[i].customer_name);
          this.pieChartData.push(this.salesAnalyticsCustomers.items[i].count);
          this.pieChartColors[0].backgroundColor.push(this.getRandomColor());
        }
      }

      this.legendList = [];
      for(var i = 0; i < this.pieChartLabels.length ; i++) {
        let legendListItem = {
          name: this.pieChartLabels[i],
          count: this.pieChartData[i],
          color: this.pieChartColors[0].backgroundColor[i]
        };
        this.legendList.push(legendListItem);
      }

      console.log("AnalyticsCustomerFilterDialog legendList: ", this.legendList);
    });
  }

  onClickShowSliderDialog() {

    this.hideSliderDialog = false;
  }

  onClickHideSliderDialog() {

    this.hideSliderDialog = true;
  }

  getHideSliderOption() {

    if (this.isFrom == 'ChamberFlow' ) {

      if (this.hideSliderDialog) {

        return false;
      } else {

        return true;
      }
    } else {

      return true;
    }

  }

  public chartClicked(e:any):void {
    console.log(e);
    
    var customerName = e.active[0]._model.label;

    if (customerName == "others") {

    } else {

      localStorage.setItem("SalesAnalyticsCustomer", customerName);
      localStorage.setItem("SalesAnalyticsChamber", this.chamberName);
      localStorage.setItem("SalesAnalyticsIsFrom", this.isFrom);
      this.router.navigate(['../fabs'],{ relativeTo: this.route });
    }
  }
 
  public pieChartLabelItemClicked(customerName):void {

    console.log("pieChartLabelItemClicked customerName ", customerName);

    if (customerName == "others") {

    } else {

      localStorage.setItem("SalesAnalyticsCustomer", customerName);
      localStorage.setItem("SalesAnalyticsChamber", this.chamberName);
      localStorage.setItem("SalesAnalyticsIsFrom", this.isFrom);
      this.router.navigate(['../fabs'],{ relativeTo: this.route });
    }
  }

  public chartHovered(e:any):void {
    // console.log(e);
  }

  public exportCurrentData() {

    console.log("exportCurrentData filterCount ", this.filterCount);

    if (this.isFrom == 'ChamberFlow') {

      if (this.filterCount == "All") {

        this.apiService.getAllSalesAnalyticsChamberFlowCustomerExcel(this.chamberName).subscribe(response => {
            
          console.log("response-getAllSalesAnalyticsChamberFlowCustomerExcel ", response);
          let excelData = JSON.parse(JSON.stringify(response));
          console.log("Response - getAllSalesAnalyticsChamberFlowCustomerExcel excelData: ", excelData);
          
          this.excelExportService.exportData(excelData, new IgxExcelExporterOptions("Analytics Filtered Customer Data"));
        });
      } else {

        let chamberArray = [];
        chamberArray.push(this.chamberName);

        this.apiService.getAllSalesAnalyticsChamberFlowExcelTwo(chamberArray, this.selectedFilterList).subscribe(response => {
            
          console.log("response-getAllSalesAnalyticsChamberFlowExcelTwo ", response);
          let excelData = JSON.parse(JSON.stringify(response));
          console.log("Response - getAllSalesAnalyticsChamberFlowExcelTwo excelData: ", excelData);
          
          this.excelExportService.exportData(excelData, new IgxExcelExporterOptions("Analytics Filtered Customer Data"));
        });
      }
    } else {
      
      if (this.filterCount == "All") {

        this.apiService.getAllSalesAnalyticsCustomerFlowFabAllExcel(this.chamberName).subscribe(response => {
            
          console.log("response-getAllSalesAnalyticsCustomerFlowFabAllExcel ", response);
          let excelData = JSON.parse(JSON.stringify(response));
          console.log("Response - getAllSalesAnalyticsCustomerFlowFabAllExcel excelData: ", excelData);
          
          this.excelExportService.exportData(excelData, new IgxExcelExporterOptions("Analytics Filtered FAB Data"));
        });
      } else {

        this.apiService.getAllSalesAnalyticsCustomerFlowFabFilterExcel(this.chamberName, this.selectedFilterList).subscribe(response => {
            
          console.log("response-getAllSalesAnalyticsCustomerFlowFabFilterExcel ", response);
          let excelData = JSON.parse(JSON.stringify(response));
          console.log("Response - getAllSalesAnalyticsCustomerFlowFabFilterExcel excelData: ", excelData);
          
          this.excelExportService.exportData(excelData, new IgxExcelExporterOptions("Analytics Filtered FAB Data"));
        });
      }
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
  
  public onFilterClick() {

    let filterItemsList = [];

    if (this.isFrom == 'ChamberFlow') {

      // for (let i = 0; i < this.salesAnalyticsCustomers.items.length; i++) {

      //   if(this.salesAnalyticsCustomers.items[i].count > 0) {

      //     filterItemsList.push(this.salesAnalyticsCustomers.items[i].customer_name);
      //   }
      // }

      for (let i = 0; i < this.salesAnalyticsCustomers.items.length; i++) {

        if (this.salesAnalyticsCustomers.items[i].customer_name.toLowerCase() == "others") {
  
        } else {
  
          filterItemsList.push(this.salesAnalyticsCustomers.items[i].customer_name);
        }
      }
  
      for (let i = 0; i < this.salesAnalyticsCustomers.others.length; i++) {
  
        filterItemsList.push(this.salesAnalyticsCustomers.others[i].customer_name);
      }
    } else {

      for (let i = 0; i < this.salesAnalyticsCustomers.length; i++) {

        if(this.salesAnalyticsCustomers[i].count > 0) {
  
          filterItemsList.push(this.salesAnalyticsCustomers[i].FabName);
        }
      }
    }

    console.log("AnalyticsCustomerFilterDialog filterItemsList ", filterItemsList);

    // let dialogHeight = "590px";

    // if (this.isFrom == 'ChamberFlow') {

    //   dialogHeight = '590px';
    // } else {

    //   dialogHeight = '300px';
    // }

    const dialogRef = this.dialog.open(AnalyticsCustomerFilterDialog, {
      width: '1100px',
      // height: dialogHeight,
      data: {filterItemsList: filterItemsList, selectedFilterList: this.selectedFilterList}
    });

    dialogRef.afterClosed().subscribe(result => {
      
      var isFrom = localStorage.getItem('CustomerSelectedClosedFrom');
      var selectedFilterItemsList = JSON.parse(localStorage.getItem('CustomerSelectedFilterItemsList'));
      
      console.log("AnalyticsCustomerFilterDialog afterClosed selectedFilterItemsList ", selectedFilterItemsList);

      if (isFrom == "Done") {

        this.pieChartLabels = [];
        this.pieChartData = [];

        this.selectedFilterList = selectedFilterItemsList;
        this.filterCount = selectedFilterItemsList.length;

        if (this.filterCount == '0') {

          this.filterCount = "All";
          this.showSelectedFilterItems = true;
        } else {
          
          this.showSelectedFilterItems = false;
        }
      
        this.sliderValue = 0;

        if (this.isFrom == 'ChamberFlow') {

          this.apiService.getAllCustomersByChamberFilter(this.chamberName, this.selectedFilterList, this.sliderValue).subscribe(response => {
          
            console.log("response-getAllCustomersByChamberFilter ", response);
            let customerList = JSON.parse(JSON.stringify(response));
            console.log("getAllCustomersByChamberFilter customerList: ", customerList);
      
            this.pieChartColors[0].backgroundColor = [];
            this.pieChartColors[0].backgroundColor = this.pieChartBackgroundColors;
            for(var i = 0; i < customerList.items.length ; i++) {
      
              // if(this.salesAnalyticsCustomers[i].count > 0) {
                
                this.pieChartLabels.push(customerList.items[i].customer_name);
                this.pieChartData.push(customerList.items[i].count);
                this.pieChartColors[0].backgroundColor.push(this.getRandomColor());
              // }
            }

            this.legendList = [];
            for(var i = 0; i < this.pieChartLabels.length ; i++) {
              let legendListItem = {
                name: this.pieChartLabels[i],
                count: this.pieChartData[i],
                color: this.pieChartColors[0].backgroundColor[i]
              };
              this.legendList.push(legendListItem);
            }

            console.log("AnalyticsCustomerFilterDialog legendList: ", this.legendList);
          });
        } else {

          this.apiService.getAllFabsByCustomerFilter(this.chamberName, this.selectedFilterList).subscribe(response => {
          
            console.log("response-getAllCustomersByChamberFilter ", response);
            let customerList = JSON.parse(JSON.stringify(response));
            console.log("getAllCustomersByChamberFilter customerList: ", customerList);
      
            this.pieChartColors[0].backgroundColor = [];
            this.pieChartColors[0].backgroundColor = this.pieChartBackgroundColors;
            for(var i = 0; i < customerList.length ; i++) {
      
              if(this.salesAnalyticsCustomers[i].count > 0) {

                this.pieChartLabels.push(customerList[i].FabName);
                this.pieChartData.push(customerList[i].count);
                this.pieChartColors[0].backgroundColor.push(this.getRandomColor());
              }
            }

            this.legendList = [];
            for(var i = 0; i < this.pieChartLabels.length ; i++) {
              let legendListItem = {
                name: this.pieChartLabels[i],
                count: this.pieChartData[i],
                color: this.pieChartColors[0].backgroundColor[i]
              };
              this.legendList.push(legendListItem);
            }

            console.log("AnalyticsCustomerFilterDialog legendList: ", this.legendList);
          });
        }
      }
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

  selector: 'analytics-customer-filter-dialog',
  templateUrl: 'analytics-customer-filter-dialog.html',
  styleUrls: ['./analytics-customer-filter-dialog.css'],
})

export class AnalyticsCustomerFilterDialog implements OnInit {

  filterType;
  filterItemsList;
  selectedFilterItemsList: any = [];

  selectedFilterList: any = [];
  
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

  constructor(public dialogRef: MatDialogRef<AnalyticsCustomerFilterDialog>, @Inject(MAT_DIALOG_DATA) public data: DialogData) {
  
    this.filterItemsList = data.filterItemsList;
    this.selectedFilterList = data.selectedFilterList;

    console.log("AnalyticsCustomerFilterDialog filterItemsList ", this.filterItemsList);
    console.log("AnalyticsCustomerFilterDialog selectedFilterList ", this.selectedFilterList);

    localStorage.setItem('CustomerSelectedClosedFrom', "Cancel");
    localStorage.setItem('CustomerSelectedFilterType', '');
    let dummy = [];
    localStorage.setItem('CustomerSelectedFilterItemsList', JSON.parse(JSON.stringify(dummy)));

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

    localStorage.setItem('CustomerSelectedClosedFrom', "Cancel");
    localStorage.setItem('CustomerSelectedFilterType', '');
    let dummy = [];
    localStorage.setItem('CustomerSelectedFilterItemsList', JSON.parse(JSON.stringify(dummy)));
    this.dialogRef.close();
  }

  dailogDone() {

    console.log("dailogDone filterType ", this.filterType);
    console.log("dailogDone selectedFilterItemsList ", this.selectedFilterItemsList);

    localStorage.setItem('CustomerSelectedClosedFrom', "Done");
    localStorage.setItem('CustomerSelectedFilterType', this.filterType);
    localStorage.setItem('CustomerSelectedFilterItemsList', JSON.stringify(this.selectedFilterItemsList));
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

  filterItemsList;
  selectedFilterList;
}