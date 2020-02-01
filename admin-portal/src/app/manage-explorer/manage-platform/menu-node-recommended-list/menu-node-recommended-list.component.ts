import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import {MatPaginator, MatSort, MatDialog, MatDialogConfig} from "@angular/material";
import { MenunodeRecommendedService } from 'src/app/shared/menu-node-recommended.service';
import { MenunodeRecommendedsDataSource } from 'src/app/shared/menu-node-recommended.datasource';
import { fromEvent, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { MenunodeRecommendedComponent } from '../menu-node-recommended-form/menu-node-recommended-form.component';
import { NotificationService } from 'src/app/shared/notification.service';
import { DialogService } from 'src/app/shared/dialog.service';
import { ActivatedRoute, Router, Route } from '@angular/router';
import { AuthorizationService } from 'src/app/shared/authServices/authorization.service';

@Component({
  selector: 'app-menu-node-recommended-list',
  templateUrl: './menu-node-recommended-list.component.html',
  styleUrls: ['./menu-node-recommended-list.component.css']
})
export class MenunodeRecommendedListComponent implements OnInit, AfterViewInit {

  
  dataSource: MenunodeRecommendedsDataSource;

  displayedColumns= ["recommended_node_id", "name", "serial_order", "created_by_id", "created_by_name", "modified_by_id", "modified_by_name"];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild(MatSort) sort: MatSort;

  @ViewChild('input') input: ElementRef;

  searchText : string;

  constructor(public recommendedService : MenunodeRecommendedService, private dialog : MatDialog,
    private notificationService : NotificationService,
    private dialogService : DialogService,
    private authorizationService : AuthorizationService,
    private route : ActivatedRoute,
    private router : Router) { }

  ngOnInit() {

    this.dataSource = new MenunodeRecommendedsDataSource(this.recommendedService, this.dialogService, this.authorizationService);

    this.dataSource.loadMenunodeRecommendeds();
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

                this.loadMenunodeRecommendedsPage();
            })
        )
        .subscribe();

        fromEvent(this.input.nativeElement,'change')
        .pipe(
            debounceTime(150),
            distinctUntilChanged(),
            tap(() => {
                this.paginator.pageIndex = 0;

                this.loadMenunodeRecommendedsPage();
            })
        )
        .subscribe();

    

    merge(this.sort.sortChange, this.paginator.page)
    .pipe(
        tap(() => this.loadMenunodeRecommendedsPage())
    )
    .subscribe();
  }

  loadMenunodeRecommendedsPage() {
    this.dataSource.loadMenunodeRecommendeds();
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
    this.dialog.open(MenunodeRecommendedComponent, dialogConfig).afterClosed().subscribe(data => {
      console.log(data);
      if(data)
      {
        this.loadMenunodeRecommendedsPage();
      }
    });
  }

  // onEdit(row)
  // {
  //   this.recommendedService.populateForm(row);

  //   const dialogConfig = new MatDialogConfig;
  //   dialogConfig.disableClose = true;
  //   dialogConfig.autoFocus = true;
  //   dialogConfig.width = "60%";
  //   this.dialog.open(MenunodeRecommendedFormComponent, dialogConfig).afterClosed().subscribe(data => {
  //     console.log(data);
  //     if(data)
  //     {
  //       this.loadMenunodeRecommendedsPage();
  //     }
  //   });
  // }

  // onDelete(recommended)
  // {


  //   this.dialogService.openConfirmDialog('Confirm Delete ?').afterClosed().subscribe(res => {
  //     if(res)
  //     {
  //       this.recommendedService.deleteMenunodeRecommended(recommended).subscribe(response => {

  //         console.log("Response - deleteMenunodeRecommended : ", response);
  //         this.notificationService.success("Deleted successfully");
  //         this.loadMenunodeRecommendedsPage();
          
  //       }, error => {
    
  //         this.notificationService.failure(error.error);
  //       });
  //     }
  //   });
  // }

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
