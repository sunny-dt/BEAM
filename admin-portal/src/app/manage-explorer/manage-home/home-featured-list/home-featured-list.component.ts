import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import {MatPaginator, MatSort, MatDialog, MatDialogConfig} from "@angular/material";
import { HomeFeaturedService } from 'src/app/shared/home-featured.service';
import { HomeFeaturedsDataSource } from 'src/app/shared/home-featured.datasource';
import { fromEvent, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { HomeFeaturedFormComponent } from '../home-featured-form/home-featured-form.component';
import { NotificationService } from 'src/app/shared/notification.service';
import { DialogService } from 'src/app/shared/dialog.service';
import { ActivatedRoute, Router, Route } from '@angular/router';
import { AuthorizationService } from 'src/app/shared/authServices/authorization.service';
import { MenuNodeService } from 'src/app/shared/menu-node.service';

@Component({
  selector: 'app-home-featured-list',
  templateUrl: './home-featured-list.component.html',
  styleUrls: ['./home-featured-list.component.css']
})
export class HomeFeaturedListComponent implements OnInit, AfterViewInit {

  
  dataSource: HomeFeaturedsDataSource;

  displayedColumns= ["id", "title", "sub_title","tile_fg_color", "tile_bg_color", "created_by_id", "created_by_name", "modified_by_id", "modified_by_name","c_date", "m_date", "actions"];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild(MatSort) sort: MatSort;

  @ViewChild('input') input: ElementRef;

  searchText : string;
  private sub: any;

  constructor(public featuredService : HomeFeaturedService, private dialog : MatDialog,
    private notificationService : NotificationService,
    private dialogService : DialogService,
    private authorizationService : AuthorizationService,
    private route : ActivatedRoute,
    private router : Router,
    private menuNodeService : MenuNodeService) { }

  ngOnInit() {

    this.sub = this.route.params.subscribe(params => {
      console.log('parent route params: ', params);
      this.menuNodeService.currentSelectedNode = null;
      this.menuNodeService.currentSelectedNodeId = 0;

      
    });
    this.dataSource = new HomeFeaturedsDataSource(this.featuredService, this.dialogService, this.authorizationService);

    this.dataSource.loadHomeFeatureds('','asc','id', 1, this.featuredService.defaultPageSize);
  }

  
  ngOnDestroy() {
    this.sub.unsubscribe();
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

                this.loadHomeFeaturedsPage();
            })
        )
        .subscribe();

        fromEvent(this.input.nativeElement,'change')
        .pipe(
            debounceTime(150),
            distinctUntilChanged(),
            tap(() => {
                this.paginator.pageIndex = 0;

                this.loadHomeFeaturedsPage();
            })
        )
        .subscribe();

    

    merge(this.sort.sortChange, this.paginator.page)
    .pipe(
        tap(() => this.loadHomeFeaturedsPage())
    )
    .subscribe();
  }

  loadHomeFeaturedsPage() {
    this.dataSource.loadHomeFeatureds(
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
    this.dialog.open(HomeFeaturedFormComponent, dialogConfig).afterClosed().subscribe(data => {
      console.log(data);
      if(data)
      {
        this.loadHomeFeaturedsPage();
      }
    });
  }

  onEdit(row)
  {
    this.featuredService.populateForm(row);

    const dialogConfig = new MatDialogConfig;
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "60%";
    this.dialog.open(HomeFeaturedFormComponent, dialogConfig).afterClosed().subscribe(data => {
      console.log(data);
      if(data)
      {
        this.loadHomeFeaturedsPage();
      }
    });
  }

  onDelete(featured)
  {


    this.dialogService.openConfirmDialog('Confirm Delete ?').afterClosed().subscribe(res => {
      if(res)
      {
        this.featuredService.deleteHomeFeatured(featured).subscribe(response => {

          console.log("Response - deleteHomeFeatured : ", response);
          this.notificationService.success("Deleted successfully");
          this.loadHomeFeaturedsPage();
          
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
