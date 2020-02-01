import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { ApiService } from 'src/app/Services/api.service';
import { AppComponent } from 'src/app/app.component';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { ChartType, ChartOptions } from 'chart.js';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA, MatAutocompleteSelectedEvent, MatChipInputEvent, MatAutocomplete } from '@angular/material';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { IgxExcelExporterOptions, IgxExcelExporterService } from 'igniteui-angular';

@Component({
  
  selector: 'app-analytics-fab-page',
  templateUrl: './analytics-fab-page.component.html',
  styleUrls: ['./analytics-fab-page.component.css'],
})

export class AnalyticsFabPageComponent implements OnInit {

  customerName;
  chamberName;
  isFrom;
  subTitleName;
  titleName = "";

  salesAnalyticsFabs: any = [];
  public pieChartLabels:string[] = [];
  public pieChartGotCodeLabels:any = [];
  public pieChartData:number[] = [];
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
  public pieChartLegend = true;
  public pieChartPlugins = [pluginDataLabels];
  public pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'left',
    },
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
    },
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
  public hideSliderOption = true;
  
  constructor(public apiService:ApiService, private router: Router, private route: ActivatedRoute, private appComp: AppComponent, public dialog: MatDialog, private excelExportService: IgxExcelExporterService) {

    this.appComp.hide();
    this.apiService.showheader();
    this.appComp.toggleRightSidenav();

    this.customerName = localStorage.getItem("SalesAnalyticsCustomer");
    this.chamberName = localStorage.getItem("SalesAnalyticsChamber");
    this.isFrom = localStorage.getItem("SalesAnalyticsIsFrom");

    console.log("constructor customerName",this.customerName);
    console.log("constructor chamberName",this.chamberName);
    console.log("constructor isFrom",this.isFrom);

    if (this.isFrom == 'ChamberFlow') {

      this.titleName = "Chamber";
      this.subTitleName = "FABS";
    } else {

      this.titleName = "Customer";
      this.subTitleName = "CHAMBERS";
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

    if (this.isFrom == 'ChamberFlow') {

      let dummy = [];
      this.apiService.getAllFabsByChamberFilter(this.chamberName, this.customerName, dummy).subscribe(response => {

        console.log("getAllFabsByChamber-response", response);
        this.salesAnalyticsFabs = JSON.parse(JSON.stringify(response));
        console.log("getAllCustomersByChamber-salesAnalyticsFabs", this.salesAnalyticsFabs);

        this.pieChartColors[0].backgroundColor = [];
        this.pieChartColors[0].backgroundColor = this.pieChartBackgroundColors;
        for(var i = 0; i < this.salesAnalyticsFabs.length ; i++) {

          if(this.salesAnalyticsFabs[i].count > 0) {

            this.pieChartLabels.push(this.salesAnalyticsFabs[i].FabName);
            this.pieChartGotCodeLabels.push("");
            this.pieChartData.push(this.salesAnalyticsFabs[i].count);
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

        console.log("AnalyticsCustomerFilterDialog legendList: ", this.legendList);
      });
    } else {

      let dummy = [];
      this.apiService.getAllChambersByFabForCustomerFilter(this.chamberName, this.customerName, dummy, this.sliderValue).subscribe(response => {

        console.log("getAllChambersByFabForCustomer-response", response);
        this.salesAnalyticsFabs = JSON.parse(JSON.stringify(response));
        console.log("getAllChambersByFabForCustomer-salesAnalyticsFabs", this.salesAnalyticsFabs);

        this.pieChartColors[0].backgroundColor = [];
        this.pieChartColors[0].backgroundColor = this.pieChartBackgroundColors;
        for(var i = 0; i < this.salesAnalyticsFabs.items.length ; i++) {

          if(this.salesAnalyticsFabs.items[i].count > 0) {

            this.pieChartLabels.push(this.salesAnalyticsFabs.items[i].name);
            this.pieChartGotCodeLabels.push(this.salesAnalyticsFabs.items[i].gotCode);
            this.pieChartData.push(this.salesAnalyticsFabs.items[i].count);
            this.pieChartColors[0].backgroundColor.push(this.getRandomColor());
          }
        }

        console.log("getAllChambersByFabForCustomer-pieChartLabels", this.pieChartLabels);
        console.log("getAllChambersByFabForCustomer-pieChartData", this.pieChartData);

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

        this.maxSliderValue = this.legendList[0].count;
        console.log("AnalyticsCustomerFilterDialog legendList: ", this.legendList);
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
    
    let dummy = [];
    this.apiService.getAllChambersByFabForCustomerFilter(this.chamberName, this.customerName, dummy, this.sliderValue).subscribe(response => {

      console.log("getAllChambersByFabForCustomer-response", response);
      this.salesAnalyticsFabs = JSON.parse(JSON.stringify(response));
      console.log("getAllChambersByFabForCustomer-salesAnalyticsFabs", this.salesAnalyticsFabs);

      this.pieChartColors[0].backgroundColor = [];
      this.pieChartColors[0].backgroundColor = this.pieChartBackgroundColors;

      this.pieChartLabels = [];
      this.pieChartGotCodeLabels = [];
      this.pieChartData = [];
      
      this.selectedFilterList = [];
      this.filterCount = "All";
      this.showSelectedFilterItems = true;

      for(var i = 0; i < this.salesAnalyticsFabs.items.length ; i++) {

        if(this.salesAnalyticsFabs.items[i].count > 0) {

          this.pieChartLabels.push(this.salesAnalyticsFabs.items[i].name);
          this.pieChartGotCodeLabels.push(this.salesAnalyticsFabs.items[i].gotCode);
          this.pieChartData.push(this.salesAnalyticsFabs.items[i].count);
          this.pieChartColors[0].backgroundColor.push(this.getRandomColor());
        }
      }

      console.log("getAllChambersByFabForCustomer-pieChartLabels", this.pieChartLabels);
      console.log("getAllChambersByFabForCustomer-pieChartData", this.pieChartData);

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

      return true;
    } else {

      if (this.hideSliderDialog) {

        return false;
      } else {

        return true;
      }
    }
  }

  public chartClicked(e:any):void {
    console.log(e);
    this.showUpgradeChamberDialog(e.active[0]._model.label);
  }

  public pieChartLabelItemClicked(selectedChamberName):void {

    console.log("pieChartLabelItemClicked selectedChamberName ", selectedChamberName);
    this.showUpgradeChamberDialog(selectedChamberName);
  }

  public exportCurrentData() {

    console.log("exportCurrentData filterCount ", this.filterCount);

    if (this.isFrom == 'ChamberFlow') {

      if (this.filterCount == "All") {

        this.apiService.getAllSalesAnalyticsChamberFlowFabAllExcel(this.chamberName, this.customerName).subscribe(response => {
            
          console.log("response-getAllSalesAnalyticsChamberFlowFabAllExcel ", response);
          let excelData = JSON.parse(JSON.stringify(response));
          console.log("Response - getAllSalesAnalyticsChamberFlowFabAllExcel excelData: ", excelData);
          
          this.excelExportService.exportData(excelData, new IgxExcelExporterOptions("Analytics Filtered FAB Data"));
        });
      } else {

        let chamberArray = [];
        chamberArray.push(this.chamberName);

        this.apiService.getAllSalesAnalyticsChamberFlowFabFilterExcel(this.chamberName, this.customerName, this.selectedFilterList).subscribe(response => {
            
          console.log("response-getAllSalesAnalyticsChamberFlowFabFilterExcel ", response);
          let excelData = JSON.parse(JSON.stringify(response));
          console.log("Response - getAllSalesAnalyticsChamberFlowFabFilterExcel excelData: ", excelData);
          
          this.excelExportService.exportData(excelData, new IgxExcelExporterOptions("Analytics Filtered FAB Data"));
        });
      }
    } else {
      
      if (this.filterCount == "All") {

        this.apiService.getAllSalesAnalyticsCustomerFlowChambersAllExcel(this.chamberName, this.customerName).subscribe(response => {
            
          console.log("response-getAllSalesAnalyticsCustomerFlowChambersAllExcel ", response);
          let excelData = JSON.parse(JSON.stringify(response));
          console.log("Response - getAllSalesAnalyticsCustomerFlowChambersAllExcel excelData: ", excelData);
          
          this.excelExportService.exportData(excelData, new IgxExcelExporterOptions("Analytics Filtered Chamber Data"));
        });
      } else {

        this.apiService.getAllSalesAnalyticsCustomerFlowChambersFilterExcel(this.chamberName, this.customerName, this.selectedFilterList).subscribe(response => {
            
          console.log("response-getAllSalesAnalyticsCustomerFlowChambersFilterExcel ", response);
          let excelData = JSON.parse(JSON.stringify(response));
          console.log("Response - getAllSalesAnalyticsCustomerFlowChambersFilterExcel excelData: ", excelData);
          
          this.excelExportService.exportData(excelData, new IgxExcelExporterOptions("Analytics Filtered Chamber Data"));
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

  public showUpgradeChamberDialog(selectedChamberName) {

    let chamberCount = 0;

    if (this.isFrom == 'ChamberFlow') {

      selectedChamberName = this.chamberName;
    } else {

      this.apiService.getAnalyticsUpgradeChamberName(selectedChamberName).subscribe(response => {

        console.log("getAnalyticsUpgradeChamberName-response", response);
        let upgradeChamberNames = JSON.parse(JSON.stringify(response));
        
        if (upgradeChamberNames.length > 0) {
          
          for (let i = 0; i < this.pieChartLabels.length; i++) {

            if (this.pieChartLabels[i] == selectedChamberName) {
              
              chamberCount = +this.pieChartData[i];
            }
          }
    
          const dialogRef = this.dialog.open(UpgradeChamberSalesPriceDialog, {
            width: '530px',
            height: '290px',
            data: {chamberName: selectedChamberName, chamberCount: chamberCount, upgradeChamberNames: upgradeChamberNames}
          });
      
          dialogRef.afterClosed().subscribe(result => {
            
          });
        } else {

          const dialogRef = this.dialog.open(NoUpgradeChamberDialog, {
            width: '350px',
            height: '200px',
            data: {chamberName: selectedChamberName, chamberCount: chamberCount, upgradeChamberNames: upgradeChamberNames}
          });
      
          dialogRef.afterClosed().subscribe(result => {
            
          });
        }
      });
    }
  }
 
  public displayGotCode(gotCode) {

    if (typeof gotCode!='undefined' && gotCode) {

      let gotCodeValue = "(" + gotCode + ")";

      return gotCodeValue;
    } else {
       
      return "";
    }
  }

  public chartHovered(e:any):void {
    // console.log(e);
  }

  public onFilterClick() {

    let filterItemsList = [];
    // for (let i = 0; i < this.salesAnalyticsFabs.length; i++) {

    //   if (this.isFrom == 'ChamberFlow') {
    //     filterItemsList.push(this.salesAnalyticsFabs[i].FabName);
    //   } else {
    //     filterItemsList.push(this.salesAnalyticsFabs[i].name);
    //   }
    // }

    console.log("onFilterClick-salesAnalyticsFabs", this.salesAnalyticsFabs);

    if (this.isFrom == 'ChamberFlow') {

      for (let i = 0; i < this.salesAnalyticsFabs.length; i++) {
    
        filterItemsList.push(this.salesAnalyticsFabs[i].FabName);
      }
    } else {

      for (let i = 0; i < this.salesAnalyticsFabs.items.length; i++) {

        if (this.salesAnalyticsFabs.items[i].name.toLowerCase() == "others") {
  
        } else {
  
          filterItemsList.push(this.salesAnalyticsFabs.items[i].name);
        }
      }
  
      for (let i = 0; i < this.salesAnalyticsFabs.others.length; i++) {
  
        filterItemsList.push(this.salesAnalyticsFabs.others[i].name);
      }
    }

    // let dialogHeight = "590px";

    // if (this.isFrom == 'ChamberFlow') {

    //   dialogHeight = '300px';
    // } else {

    //   dialogHeight = '500px';
    // }

    const dialogRef = this.dialog.open(AnalyticsFabFilterDialog, {
      width: '1100px',
      // height: dialogHeight,
      data: {filterItemsList: filterItemsList, selectedFilterList: this.selectedFilterList}
    });

    dialogRef.afterClosed().subscribe(result => {
      
      var isFrom = localStorage.getItem('FabSelectedClosedFrom');
      var selectedFilterItemsList = JSON.parse(localStorage.getItem('FabSelectedFilterItemsList'));
      
      console.log("AnalyticsFabFilterDialog afterClosed selectedFilterItemsList ", selectedFilterItemsList);

      if (isFrom == "Done") {

        this.pieChartLabels = [];
        this.pieChartGotCodeLabels = [];
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

          this.apiService.getAllFabsByChamberFilter(this.chamberName, this.customerName, this.selectedFilterList).subscribe(response => {
          
            console.log("response-getAllFabsByChamberFilter ", response);
            let customerList = JSON.parse(JSON.stringify(response));
            console.log("getAllFabsByChamberFilter customerList: ", customerList);
      
            this.pieChartColors[0].backgroundColor = [];
            this.pieChartColors[0].backgroundColor = this.pieChartBackgroundColors;
            for(var i = 0; i < customerList.length ; i++) {
      
              if(this.salesAnalyticsFabs[i].count > 0) {
                
                this.pieChartLabels.push(customerList[i].FabName);
                this.pieChartGotCodeLabels.push("");
                this.pieChartData.push(customerList[i].count);
                this.pieChartColors[0].backgroundColor.push(this.getRandomColor());
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
          });
        } else {

          this.apiService.getAllChambersByFabForCustomerFilter(this.chamberName, this.customerName, this.selectedFilterList, this.sliderValue).subscribe(response => {
          
            console.log("response-getAllCustomersByChamberFilter ", response);
            let customerList = JSON.parse(JSON.stringify(response));
            console.log("getAllCustomersByChamberFilter customerList: ", customerList);
      
            this.pieChartColors[0].backgroundColor = [];
            this.pieChartColors[0].backgroundColor = this.pieChartBackgroundColors;
            for(var i = 0; i < customerList.items.length ; i++) {
      
              this.pieChartLabels.push(customerList.items[i].name);
              this.pieChartGotCodeLabels.push(customerList.items[i].gotCode);
              this.pieChartData.push(customerList.items[i].count);
              this.pieChartColors[0].backgroundColor.push(this.getRandomColor());
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

    this.router.navigate(['analytics/customers']);
  }

  goToHomePage() {

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

  selector: 'upgrade_chamber_sales_price_dialog',
  templateUrl: 'upgrade_chamber_sales_price_dialog.html',
  styleUrls: ['upgrade_chamber_sales_price_dialog.css'],
})

export class UpgradeChamberSalesPriceDialog implements OnInit {

  chamberName = "";
  chamberCount;
  totalCount = 0;
  quantity = 0;
  upgradeChamberNames;
  selectedPosition = 0;
  systemIDSubmitButtonEnable = false;
  @ViewChild('costPerUnit') private _enterCostPerUnit: ElementRef;

  constructor(public dialogRef: MatDialogRef<UpgradeChamberSalesPriceDialog>, @Inject(MAT_DIALOG_DATA) public data: DialogData) { 

    this.chamberName = data.chamberName;
    this.chamberCount = data.chamberCount;
    this.upgradeChamberNames = data.upgradeChamberNames;

    console.log("UpgradeChamberSalesPriceDialog constructor-chamberName", this.chamberName);
    console.log("UpgradeChamberSalesPriceDialog constructor-chamberCount", this.chamberCount);
    console.log("UpgradeChamberSalesPriceDialog constructor-upgradeChamberNames", this.upgradeChamberNames);
  }
  
  ngOnInit() {

    // this.totalCount = this.chamberCount * this.quantity;
  }

  dailogCancel() {

    this.dialogRef.close();
  }

  onKeyUp(event) {

    this.totalCount = this.chamberCount * this.quantity;
    if (this._enterCostPerUnit.nativeElement.value > 0) {
      this.systemIDSubmitButtonEnable = true;
    } else {
      this.systemIDSubmitButtonEnable = false;
    }
  }

  onlyNumber(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
}

export interface DialogData {

  chamberName: string;
  chamberCount: number;
  upgradeChamberNames;
}

@Component({

  selector: 'no-upgrade-chamber-dialog',
  templateUrl: 'no_upgrade_chamber_dialog.html',
  styleUrls: ['no_upgrade_chamber_dialog.css'],
})

export class NoUpgradeChamberDialog {

  constructor(public dialogRef: MatDialogRef<NoUpgradeChamberDialog>) { 

  }

  dailogCancel(): void {
    this.dialogRef.close();
  }
}

@Component({

  selector: 'analytics-fab-filter-dialog',
  templateUrl: 'analytics-fab-filter-dialog.html',
  styleUrls: ['./analytics-fab-filter-dialog.css'],
})

export class AnalyticsFabFilterDialog implements OnInit {

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

  constructor(public dialogRef: MatDialogRef<AnalyticsFabFilterDialog>, @Inject(MAT_DIALOG_DATA) public data: DialogData) {
  
    this.filterItemsList = data.filterItemsList;
    this.selectedFilterList = data.selectedFilterList;

    console.log("AnalyticsFabFilterDialog filterItemsList ", this.filterItemsList);
    console.log("AnalyticsFabFilterDialog selectedFilterList ", this.selectedFilterList);

    localStorage.setItem('FabSelectedClosedFrom', "Cancel");
    localStorage.setItem('FabSelectedFilterType', '');
    let dummy = [];
    localStorage.setItem('FabSelectedFilterItemsList', JSON.parse(JSON.stringify(dummy)));

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

    localStorage.setItem('FabSelectedClosedFrom', "Cancel");
    localStorage.setItem('FabSelectedFilterType', '');
    let dummy = [];
    localStorage.setItem('FabSelectedFilterItemsList', JSON.parse(JSON.stringify(dummy)));
    this.dialogRef.close();
  }

  dailogDone() {

    console.log("dailogDone filterType ", this.filterType);
    console.log("dailogDone selectedFilterItemsList ", this.selectedFilterItemsList);

    localStorage.setItem('FabSelectedClosedFrom', "Done");
    localStorage.setItem('FabSelectedFilterType', this.filterType);
    localStorage.setItem('FabSelectedFilterItemsList', JSON.stringify(this.selectedFilterItemsList));
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