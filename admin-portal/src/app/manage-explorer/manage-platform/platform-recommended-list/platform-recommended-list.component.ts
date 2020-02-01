import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import {MatPaginator, MatSort, MatDialog, MatDialogConfig} from "@angular/material";
import { PlatformRecommendedService } from 'src/app/shared/platform-recommended.service';
import { PlatformRecommendedsDataSource } from 'src/app/shared/platform-recommended.datasource';
import { fromEvent, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { PlatformRecommendedFormComponent } from '../platform-recommended-form/platform-recommended-form.component';
import { NotificationService } from 'src/app/shared/notification.service';
import { DialogService } from 'src/app/shared/dialog.service';
import { ActivatedRoute, Router, Route } from '@angular/router';
import { AuthorizationService } from 'src/app/shared/authServices/authorization.service';

@Component({
  selector: 'app-platform-recommended-list',
  templateUrl: './platform-recommended-list.component.html',
  styleUrls: ['./platform-recommended-list.component.css']
})
export class PlatformRecommendedListComponent implements OnInit, AfterViewInit {

  
  dataSource: PlatformRecommendedsDataSource;

  displayedColumns= ["id", "linked_element_type", "linked_element_id", "type_title", "title", "sub_title", "created_by_id", "created_by_name", "modified_by_id", "modified_by_name","c_date", "m_date", "serial_order", "actions"];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild(MatSort) sort: MatSort;

  @ViewChild('input') input: ElementRef;

  searchText : string;

  constructor(public recommendedService : PlatformRecommendedService, private dialog : MatDialog,
    private notificationService : NotificationService,
    private dialogService : DialogService,
    private authorizationService : AuthorizationService,
    private route : ActivatedRoute,
    private router : Router) { }

  ngOnInit() {

    this.dataSource = new PlatformRecommendedsDataSource(this.recommendedService, this.dialogService, this.authorizationService);

    this.dataSource.loadPlatformRecommendeds('','asc','id', 1, this.recommendedService.defaultPageSize);
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

                this.loadPlatformRecommendedsPage();
            })
        )
        .subscribe();

        fromEvent(this.input.nativeElement,'change')
        .pipe(
            debounceTime(150),
            distinctUntilChanged(),
            tap(() => {
                this.paginator.pageIndex = 0;

                this.loadPlatformRecommendedsPage();
            })
        )
        .subscribe();

    

    merge(this.sort.sortChange, this.paginator.page)
    .pipe(
        tap(() => this.loadPlatformRecommendedsPage())
    )
    .subscribe();
  }

  loadPlatformRecommendedsPage() {
    this.dataSource.loadPlatformRecommendeds(
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

  onCreate()
  {
    const dialogConfig = new MatDialogConfig;
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "60%";
    this.dialog.open(PlatformRecommendedFormComponent, dialogConfig).afterClosed().subscribe(data => {
      console.log(data);
      if(data)
      {
        this.loadPlatformRecommendedsPage();
      }
    });
  }

  onEdit(row)
  {
    this.recommendedService.populateForm(row);

    const dialogConfig = new MatDialogConfig;
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "60%";
    this.dialog.open(PlatformRecommendedFormComponent, dialogConfig).afterClosed().subscribe(data => {
      console.log(data);
      if(data)
      {
        this.loadPlatformRecommendedsPage();
      }
    });
  }

  onDelete(recommended)
  {


    this.dialogService.openConfirmDialog('Confirm Delete ?').afterClosed().subscribe(res => {
      if(res)
      {
        this.recommendedService.deletePlatformRecommended(recommended).subscribe(response => {

          console.log("Response - deletePlatformRecommended : ", response);
          this.notificationService.success("Deleted successfully");
          this.loadPlatformRecommendedsPage();
          
        }, error => {
    
          this.notificationService.failure(error.error);
        });
      }
    });
  }

  // printpath(parent: String, config: Route[]) {
  //   for (let i = 0; i < config.length; i++) {
  //     let route = config[i];
  //     console.log(parent + '/' + route.path);
  //     if (route.children) {
  //       const currentPath = route.path ? parent + '/' + route.path : parent;
  //       this.printpath(currentPath, route.children);
  //     }
  //   }
  // }

 

}
