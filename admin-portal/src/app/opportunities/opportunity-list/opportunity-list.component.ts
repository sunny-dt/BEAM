import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import {MatPaginator, MatSort, MatDialog, MatDialogConfig} from "@angular/material";
import { OpportunityService } from 'src/app/shared/opportunity.service';
import { OpportunitiesDataSource } from 'src/app/shared/opportunities.datasource';
import { fromEvent, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { NotificationService } from 'src/app/shared/notification.service';
import { DialogService } from 'src/app/shared/dialog.service';

@Component({
  selector: 'app-opportunity-list',
  templateUrl: './opportunity-list.component.html',
  styleUrls: ['./opportunity-list.component.css']
})
export class OpportunityListComponent implements OnInit, AfterViewInit {


  dataSource: OpportunitiesDataSource;

  displayedColumns= ["id", "op_id", "product_code", "product_name", "platform_name", "c_date","created_by_id", "created_by_name", "actions"];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild(MatSort) sort: MatSort;

  @ViewChild('input') input: ElementRef;

  searchText : string;

  constructor(public opportunityService : OpportunityService, private dialog : MatDialog,
    private notificationService : NotificationService,
    private dialogService : DialogService) { }

  ngOnInit() {

    this.dataSource = new OpportunitiesDataSource(this.opportunityService);

    this.dataSource.loadOpportunitys('','asc','id', 1, this.opportunityService.defaultPageSize);
  }

  ngAfterViewInit()
  {
    

    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    fromEvent(this.input.nativeElement,'keyup')
        .pipe(
            debounceTime(150),
            distinctUntilChanged(),
            tap(() => {
                this.paginator.pageIndex = 0;

                this.loadOpportunitysPage();
            })
        )
        .subscribe();

        fromEvent(this.input.nativeElement,'change')
        .pipe(
            debounceTime(150),
            distinctUntilChanged(),
            tap(() => {
                this.paginator.pageIndex = 0;

                this.loadOpportunitysPage();
            })
        )
        .subscribe();

    

    merge(this.sort.sortChange, this.paginator.page)
    .pipe(
        tap(() => this.loadOpportunitysPage())
    )
    .subscribe();
  }

  loadOpportunitysPage() {
    this.dataSource.loadOpportunitys(
        this.input.nativeElement.value,
        this.sort.active,
        this.sort.direction,
        this.paginator.pageIndex + 1,
        this.paginator.pageSize);
  }

  onSearchClear()
  {
    this.searchText = "";
  }

  

 
  onDelete(opportunity)
  {


    this.dialogService.openConfirmDialog('Confirm Delete ?').afterClosed().subscribe(res => {
      if(res)
      {
        this.opportunityService.deleteOpportunity(opportunity).subscribe(response => {

          console.log("Response - deleteOpportunity : ", response);
          this.notificationService.success("Deleted successfully");
          this.loadOpportunitysPage();
          
        }, error => {
    
          this.notificationService.failure(error.error);
        });
      }
    });
  }

 
}
