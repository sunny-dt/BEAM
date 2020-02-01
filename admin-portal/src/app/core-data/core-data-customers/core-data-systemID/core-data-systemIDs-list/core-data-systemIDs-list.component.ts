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
import { SystemIDService } from 'src/app/shared/systemID.service';
import { SystemIDDataSource } from 'src/app/shared/systemID.datasource';
import { CoreDataSystemIDsConfigurationComponent } from './core-data-systemIDs_configuration.component';

@Component({
  selector: 'app-core-data-systemIDs-list',
  templateUrl: './core-data-systemIDs-list.component.html',
  styleUrls: ['./core-data-systemIDs-list.component.css']
})
export class CoreDataSystemIDsListComponent implements OnInit, AfterViewInit {

  private sub: any;

  dataSource: SystemIDDataSource;

  displayedColumns= ["id", "name", "actions"];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild(MatSort) sort: MatSort;

  @ViewChild('input') input: ElementRef;

  searchText : string;

  constructor(public systemIDService : SystemIDService, private dialog : MatDialog,
    private notificationService : NotificationService,
    private dialogService : DialogService,
    private authorizationService : AuthorizationService,
    private route : ActivatedRoute,
    private router : Router) { }

  ngOnInit() {

    this.sub = this.route.parent.params.subscribe(params => {
      console.log('parent route params: ', params);
      this.systemIDService.fabID = +params["fab-id"];
    });

    this.dataSource = new SystemIDDataSource(this.systemIDService);

    this.dataSource.loadSystemID(this.systemIDService.fabID, '','asc','id', 1, this.systemIDService.defaultPageSize);
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
    this.dataSource.loadSystemID(this.systemIDService.fabID,
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

  onSystemID(systemID)
  {
    const dialogConfig = new MatDialogConfig;
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.width = "80%";
    console.log('onSystemID fabID: ', this.systemIDService.fabID);
    console.log('onSystemID customerID: ', systemID.customer_id);
    console.log('onSystemID systemID: ', systemID);
    
    dialogConfig.data = {fabID : this.systemIDService.fabID, customerID: systemID.customer_id,
      systemID : systemID.name}
    
    this.dialog.open(CoreDataSystemIDsConfigurationComponent, dialogConfig).afterClosed().subscribe(data => {
     
       
    });
  }

}
