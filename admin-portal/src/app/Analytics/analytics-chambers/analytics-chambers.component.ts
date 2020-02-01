import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AnalyticsChambersService } from 'src/app/shared/analytics-chambers.service';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { ChartType, ChartOptions } from 'chart.js';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogData } from 'src/app/http-error-dialog/http-error-dialog.component';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { AnalyticsComponent } from '../analytics.component';

@Component({
  selector: 'app-analytics-chambers',
  templateUrl: './analytics-chambers.component.html',
  styleUrls: ['./analytics-chambers.component.css']
})
export class AnalyticsChambersComponent implements OnInit {

  @ViewChild('chamberCount') chamberCount:ElementRef;

  public chambersLegendList: any = [];
  public legendList: any = [];

  public pieChartLabels:any = [] ;
  public pieChartData:any = [];
  public pieChartColors = [{backgroundColor: []}];
  public pieChartBackgroundColors = [
    "#B71C1C", "#880E4F", "#4A148C", "#FF8A80", "#FF80AB",
    "#311B92", "#D50000", "#1A237E", "#C51162", "#0D47A1",
    "#DD2C00", "#B0BEC5", "#29B6F6", "#C62828", "#B39DDB",
    "#303F9F", "#00BCD4", "#263238", "#F9A825", "#EEFF41",
    "#6200EA", "#304FFE", "#29B6F6", "#FFF176", "#2962FF",
    "#69F0AE", "#B2FF59", "#FFB300", "#424242", "#FF5722",
    "#AA00FF", "#FF9100", "#FFB300", "#2962FF", "#C62828",
    "#18FFFF", "#00BFA5", "#1B5E20", "#D81B60", "#33691E",
    "#F57F17", "#F57F17", "#FF7043", "#795548", "#212121",
    "#6200EA", "#304FFE", "#29B6F6", "#26A69A", "#80D8FF",
    "#F4511E", "#00BCD4", "#263238", "#455A64", "#B71C1C",
    "#6200EA", "#E64A19", "#5D4037", "#64DD17", "#AEEA00",
    
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

  constructor(private analyticsChambersService: AnalyticsChambersService, private route : ActivatedRoute, private router : Router, public dialog: MatDialog, private analyticsComponent: AnalyticsComponent) { }

  ngOnInit() {

    this.analyticsComponent.currentSelectedTab = "chambers"

    this.analyticsChambersService.getAllSalesAnalyticsOtherChambersCount().subscribe(response => {
      
      console.log("analyticsChambersService getAllSalesAnalyticsOtherChambersCount ", response);
      let countResponse = JSON.parse(JSON.stringify(response));

      this.chamberCount.nativeElement.value =  countResponse[0].count_value;
    });

    this.analyticsChambersService.getSaleAnalyticsForAllChambersFilter(0).subscribe(response => {
      
      console.log("analyticsChambersService getSaleAnalyticsForAllChambers ", response);
      this.chambersLegendList = JSON.parse(JSON.stringify(response));
      console.log("getSaleAnalyticsForAllChambers chambersLegendList: ", this.chambersLegendList);

      this.pieChartLabels = [];
      this.pieChartData = [];

      this.pieChartColors[0].backgroundColor = [];
      this.pieChartColors[0].backgroundColor = this.pieChartBackgroundColors;

      for(var i = 0; i < this.chambersLegendList.items.length ; i++) {

        this.pieChartLabels.push(this.chambersLegendList.items[i].name);
        this.pieChartData.push(this.chambersLegendList.items[i].count);
      }

      for(var i = 0; i < this.pieChartLabels.length ; i++) {
        let legendListItem = {
          name: this.pieChartLabels[i],
          count: this.pieChartData[i],
          color: this.pieChartColors[0].backgroundColor[i]
        };
        this.legendList.push(legendListItem);
      }
    });

    fromEvent(this.chamberCount.nativeElement, 'keyup')
      .pipe(debounceTime(150), distinctUntilChanged(), tap(() => {

        console.log('fromEvent distinctUntilChanged :', this.chamberCount.nativeElement.value);
        this.onPreview();
      })
    ).subscribe();
  }

  onlyNumber(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  onPreview() {
    
    let value = this.chamberCount.nativeElement.value;
    // this.router.navigate([ '../chambers/preview', value], { relativeTo: this.route });

    this.analyticsChambersService.getSaleAnalyticsForAllChambersFilter(value).subscribe(response => {
      
      console.log("analyticsChambersService getSaleAnalyticsForAllChambersFilter ", response);
      this.chambersLegendList = JSON.parse(JSON.stringify(response));
      console.log("getSaleAnalyticsForAllChambers chambersLegendList: ", this.chambersLegendList);

      this.pieChartLabels = [];
      this.pieChartData = [];

      this.pieChartColors[0].backgroundColor = [];
      this.pieChartColors[0].backgroundColor = this.pieChartBackgroundColors;

      for(var i = 0; i < this.chambersLegendList.items.length ; i++) {

        this.pieChartLabels.push(this.chambersLegendList.items[i].name);
        this.pieChartData.push(this.chambersLegendList.items[i].count);
      }

      for(var i = 0; i < this.pieChartLabels.length ; i++) {
        let legendListItem = {
          name: this.pieChartLabels[i],
          count: this.pieChartData[i],
          color: this.pieChartColors[0].backgroundColor[i]
        };
        this.legendList.push(legendListItem);
      }
    });
  }

  onSubmit() {

    let value = this.chamberCount.nativeElement.value;
    console.log("onSubmit chamberCount ", value);

    this.analyticsChambersService.postAllSalesAnalyticsOtherChambersCount(value).subscribe(response => {
      
      console.log("analyticsChambersService postAllSalesAnalyticsOtherChambersCount ", response);
      let countResponse = JSON.parse(JSON.stringify(response));

      const dialogRef = this.dialog.open(ChambersSuccessDialog, {
        width: '350px',
        data: {}
      });
  
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');

        this.ngOnInit();
      });
    });
  }

  getRandomColor() {

    var color = Math.floor(0x1000000 * Math.random()).toString(16);
    var hex = '#' + ('000000' + color).slice(-6);
    
    return hex;
  }
}

@Component({
  selector: 'success-dialog',
  templateUrl: 'success-dialog.html',
})

export class ChambersSuccessDialog {

  constructor(public dialogRef: MatDialogRef<ChambersSuccessDialog>, @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onOKClick(): void {

    this.dialogRef.close();
  }
}