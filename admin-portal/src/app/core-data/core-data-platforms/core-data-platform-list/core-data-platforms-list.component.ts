import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import {MatPaginator, MatSort, MatDialog, MatDialogConfig} from "@angular/material";
import { PlatformService } from 'src/app/shared/platform.service';
import { PlatformsDataSource } from 'src/app/shared/platforms.datasource';
import { fromEvent, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { NotificationService } from 'src/app/shared/notification.service';
import { DialogService } from 'src/app/shared/dialog.service';
import { ActivatedRoute, Router, Route } from '@angular/router';
import { AuthorizationService } from 'src/app/shared/authServices/authorization.service';
import { CoreDataPlatformsDataSource } from 'src/app/shared/core-data-platforms.datasource';
import { CoreDataPlatformService } from 'src/app/shared/core-data-platform.service';
import { CoreDataPlatformComponent } from '../core-data-platform/core-data-platform.component';

@Component({
  selector: 'app-core-data-platforms-list',
  templateUrl: './core-data-platforms-list.component.html',
  styleUrls: ['./core-data-platforms-list.component.css']
})
export class CoreDataPlatformsListComponent implements OnInit, AfterViewInit {

  
  dataSource: CoreDataPlatformsDataSource;

  displayedColumns= ["id", "name", "feed", "actions"];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild(MatSort) sort: MatSort;

  @ViewChild('input') input: ElementRef;

  searchText : string;

  constructor(public platformService : CoreDataPlatformService, private dialog : MatDialog,
    private notificationService : NotificationService,
    private dialogService : DialogService,
    private authorizationService : AuthorizationService,
    private route : ActivatedRoute,
    private router : Router) { }

  ngOnInit() {

    this.dataSource = new CoreDataPlatformsDataSource(this.platformService, this.dialogService, this.authorizationService);
 
    console.log('this.dataSource', this.dataSource);
    this.dataSource.loadPlatforms('','asc','id', 1, this.platformService.defaultPageSize);
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

                this.loadPlatformsPage();
            })
        )
        .subscribe();

        fromEvent(this.input.nativeElement,'change')
        .pipe(
            debounceTime(150),
            distinctUntilChanged(),
            tap(() => {
                this.paginator.pageIndex = 0;

                this.loadPlatformsPage();
            })
        )
        .subscribe();

    

    merge(this.sort.sortChange, this.paginator.page)
    .pipe(
        tap(() => this.loadPlatformsPage())
    )
    .subscribe();
  }

  loadPlatformsPage() {
    this.dataSource.loadPlatforms(
        this.input.nativeElement.value,
        this.sort.active,
        this.sort.direction,
        this.paginator.pageIndex + 1,
        this.paginator.pageSize);
  }

  onCreate()  {
    const dialogConfig = new MatDialogConfig;
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "60%";
    this.dialog.open(CoreDataPlatformComponent, dialogConfig).afterClosed().subscribe(data => {
      console.log(data);
      if(data)
      {
        this.loadPlatformsPage();
      }
    });
  }

  onSearchClear()
  {
    this.searchText = "";
  }
  
  onEdit(row)
  {
    console.log('row', row);
     this.platformService.populateForm(row);

    const dialogConfig = new MatDialogConfig;
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "60%";
    this.dialog.open(CoreDataPlatformComponent, dialogConfig).afterClosed().subscribe(data => {
      console.log(data);
      if(data)
      {
        this.loadPlatformsPage();
      }
    });
  }

  onDelete(platform)
  {


    this.dialogService.openConfirmDialog('Confirm Delete ?').afterClosed().subscribe(res => {
      if(res)
      {
        this.platformService.deletePlatform(platform).subscribe(response => {

          console.log("Response - deletePlatform : ", response);
          this.notificationService.success("Deleted successfully");
          this.loadPlatformsPage();
          
        }, error => {
    
          this.notificationService.failure(error.error);
        });
      }
    });
  }

  onFacets(platform)
  {
    this.router.navigate([ '../facets', platform.id, `[${platform.name}] - Facets`], { relativeTo: this.route });
  }

  onChambers(platform)
  {
    this.router.navigate([ '../chambers', platform.id, `[${platform.name}] - Chambers`], { relativeTo: this.route });
  }

  onChamberFamilies(platform)
  {
    console.log('parent onChamberFamilies: ', platform);
    this.router.navigate([ '../chamberfamilies', platform.id, `[${platform.name}] - Chamber Families`], { relativeTo: this.route });
  }
}
