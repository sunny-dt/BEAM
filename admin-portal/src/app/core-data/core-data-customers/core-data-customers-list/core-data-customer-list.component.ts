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
// import { CoreDataCustomerComponent } from '../core-data-customer/core-data-customer.component';

@Component({
  selector: 'app-core-data-customer-list',
  templateUrl: './core-data-customer-list.component.html',
  styleUrls: ['./core-data-customer-list.component.css']
})
export class CoreDataCustomerListComponent implements OnInit, AfterViewInit {

  dataSource: CustomersDataSource;

  displayedColumns= ["id", "name", "actions"];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild(MatSort) sort: MatSort;

  @ViewChild('input') input: ElementRef;

  searchText : string;

  constructor(public customerService : CustomerService, private dialog : MatDialog,
    private notificationService : NotificationService,
    private dialogService : DialogService,
    private authorizationService : AuthorizationService,
    private route : ActivatedRoute,
    private router : Router) { }

  ngOnInit() {

    this.dataSource = new CustomersDataSource(this.customerService, this.dialogService, this.authorizationService);

    this.dataSource.loadCustomers('','asc','id', 1, this.customerService.defaultPageSize);
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
    this.dataSource.loadCustomers(
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

  onFabs(customer)
  {
    this.router.navigate([ '../fabs', customer.id, `[${customer.name}] - Fab`], { relativeTo: this.route });
  }

}
