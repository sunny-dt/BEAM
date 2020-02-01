import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import {MatPaginator, MatSort, MatDialog, MatDialogConfig} from "@angular/material";
import { fromEvent, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { NotificationService } from 'src/app/shared/notification.service';
import { DialogService } from 'src/app/shared/dialog.service';
import { ActivatedRoute, Router, Route } from '@angular/router';
import { AuthorizationService } from 'src/app/shared/authServices/authorization.service';
import { CustomersDataSource } from 'src/app/shared/customers.datasource';
import { CustomerService } from 'src/app/shared/customer.service';
import { FabService } from 'src/app/shared/fab.service';
import { FabsDataSource } from 'src/app/shared/fab.datasource';

@Component({
  selector: 'app-core-data-fab-list',
  templateUrl: './core-data-fab-list.component.html',
  styleUrls: ['./core-data-fab-list.component.css']
})
export class CoreDataFabsListComponent implements OnInit, AfterViewInit {

  private sub: any;

  dataSource: FabsDataSource;

  displayedColumns= ["id", "name", "actions"];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild(MatSort) sort: MatSort;

  @ViewChild('input') input: ElementRef;

  searchText : string;

  constructor(public fabService : FabService, private dialog : MatDialog,
    private notificationService : NotificationService,
    private dialogService : DialogService,
    private authorizationService : AuthorizationService,
    private route : ActivatedRoute,
    private router : Router) { }

  ngOnInit() {

    this.sub = this.route.parent.params.subscribe(params => {
      console.log('parent route params: ', params);
      this.fabService.customerID = +params["customer-id"];
    });

    this.dataSource = new FabsDataSource(this.fabService);

    this.dataSource.loadFabs(this.fabService.customerID, '','asc','id', 1, this.fabService.defaultPageSize);
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

                this.loadCustomersPage();
            })
        )
        .subscribe();

        fromEvent(this.input.nativeElement,'change')
        .pipe(
            debounceTime(150),
            distinctUntilChanged(),
            tap(() => {
                this.paginator.pageIndex = 0;

                this.loadCustomersPage();
            })
        )
        .subscribe();

    

    merge(this.sort.sortChange, this.paginator.page)
    .pipe(
        tap(() => this.loadCustomersPage())
    )
    .subscribe();
  }

  loadCustomersPage() {
    this.dataSource.loadFabs(this.fabService.customerID,
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

  onSystemID(fab)
  {
    this.router.navigate([ '../systemID', fab.id, `[${fab.name}] - System ID`], { relativeTo: this.route });
  }

}
