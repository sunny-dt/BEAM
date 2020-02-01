import { AppComponent } from '../../app.component';
import { ApiService } from 'src/app/Services/api.service';
import { Component, OnInit, OnDestroy, Inject, ViewChild, ElementRef } from '@angular/core';
import { ScrollDispatcher } from '@angular/cdk/scrolling';
import { DOCUMENT } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { IgxExcelExporterService, IgxExcelExporterOptions } from 'igniteui-angular';

@Component({
  selector: 'app-explorer-platform-compare-page',
  templateUrl: './explorer-platform-compare-page.component.html',
  styleUrls: ['./explorer-platform-compare-page.component.css']
})

export class ExplorerPlatformComparePageComponent implements OnInit {

  platformCompareResultList:any = [];

  @ViewChild('header') header: ElementRef;

  isPlatformCompareStickyVisible:boolean = false;
  isExcelDownloadButtonVisible:boolean = false;

  constructor(@Inject(DOCUMENT) document, private apiService: ApiService, private appComp: AppComponent, 
  private router: Router, private route: ActivatedRoute,private excelExportService: IgxExcelExporterService) { }

  ngOnInit() { 

    this.apiService.showheader();
    this.appComp.show();

    window.addEventListener('scroll', this.scrollEvent, true);
    
    let nodeIDs: any = [8,9,10,11];

    this.apiService.nodesComparisionResult(nodeIDs).subscribe(response => {

      console.log("Response - nodesComparisionResult: ", response);
      this.isExcelDownloadButtonVisible = true;
      this.platformCompareResultList = JSON.parse(JSON.stringify(response));
      console.log("Response - platformCompareResultList-json: ", this.platformCompareResultList);
      }, error => {
    });
  }

  scrollEvent = (event: any): void => {

    const number = event.srcElement.scrollTop;

    if (number >= 400) {

      this.isPlatformCompareStickyVisible = true;
    } else {

      this.isPlatformCompareStickyVisible = false;
    }

    this.reposition(event.srcElement.scrollLeft);
  }

   reposition(scroll_left : any){

    // this.element = document.getElementById('ButtonX') as HTMLElement;
    let el = this.header.nativeElement;
    console.log('reposition e1 ', document.body);

    var ScrollLeft = scroll_left;
    console.log('ScrollLeft ', ScrollLeft);

    if (ScrollLeft == 0) {

      if (window.pageXOffset)
          ScrollLeft = window.pageXOffset;
      else
          ScrollLeft = (document.body.parentElement) ? document.body.parentElement.scrollLeft : 0;
    }

    el.style.left = "-" + ScrollLeft + "px";
  }

  navigateToDetailsPage(platformName) {

    let selectedCompareItemsList = [];
    localStorage.setItem("SelectedCompareItemsList", JSON.stringify(selectedCompareItemsList));

    console.log("navigateToDetailsPage platformName ", platformName);
    this.router.navigate(["explorer/" + platformName]);
  }

  exportPlatformDataAsXLSX() {

    let nodeIDs: any = [8,9,10,11];

    this.apiService.findOtherComparableNodesForFormate(nodeIDs, "simple").subscribe(response => {

      let excelData = JSON.parse(JSON.stringify(response));
      console.log("Response - platform excelData: ", excelData);
      
      this.excelExportService.exportData(excelData, new IgxExcelExporterOptions("Platform Compare Results Data"));
    }, error => {
      
    });

  }
}