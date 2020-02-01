import { CoreDataChambersDataSource } from './../../../shared/core-data-chambers.datasource';
import { CoreDataChamberService } from './../../../shared/core-data-chamber.service';
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import {MatPaginator, MatSort, MatDialog, MatDialogConfig} from "@angular/material";
import { ChamberService } from 'src/app/shared/chamber.service';
import { ChambersDataSource } from 'src/app/shared/chambers.datasource';
import { fromEvent, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { NotificationService } from 'src/app/shared/notification.service';
import { DialogService } from 'src/app/shared/dialog.service';
import { ActivatedRoute } from '@angular/router';
import { CoreDataChamberComponent } from './core-data-chamber/core-data-chamber.component';

@Component({
  selector: 'app-core-data-chamber-list',
  templateUrl: './core-data-chamber-list.component.html',
  styleUrls: ['./core-data-chamber-list.component.css']
})
export class CoreDataChamberListComponent implements OnInit, AfterViewInit {

  private sub: any;

  dataSource: CoreDataChambersDataSource;

  displayedColumns= ["id", "name", "got_code", "actions"];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild(MatSort) sort: MatSort;

  @ViewChild('input') input: ElementRef;

  searchText : string;

  constructor(public chamberService : CoreDataChamberService, private dialog : MatDialog,
    private notificationService : NotificationService,
    private dialogService : DialogService,
    private route : ActivatedRoute) { }

  ngOnInit() {

    this.sub = this.route.parent.params.subscribe(params => {
      console.log('parent route params: ', params);
      this.chamberService.chamberFamilyID = +params["chamber-family-id"];
      this.chamberService.platformID = +params["platform-id"];
    });

    this.dataSource = new CoreDataChambersDataSource(this.chamberService);
    this.dataSource.loadChambers('','asc','id', 1, this.chamberService.defaultPageSize);
    
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

                this.loadChambersPage();
            })
        )
        .subscribe();

        fromEvent(this.input.nativeElement,'change')
        .pipe(
            debounceTime(150),
            distinctUntilChanged(),
            tap(() => {
                this.paginator.pageIndex = 0;

                this.loadChambersPage();
            })
        )
        .subscribe();

    

    merge(this.sort.sortChange, this.paginator.page)
    .pipe(
        tap(() => this.loadChambersPage())
    )
    .subscribe();
  }

  loadChambersPage() {
    this.dataSource.loadChambers(
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
    dialogConfig.data = {PlatformID: this.chamberService.platformID, ChamberFamilyID:  this.chamberService.chamberFamilyID};
    this.dialog.open(CoreDataChamberComponent, dialogConfig).afterClosed().subscribe(data => {
      console.log(data);
      if(data)
      {
        this.loadChambersPage();
      }
    });
  }

  onEdit(row)
  {
    this.chamberService.populateForm(row);

    const dialogConfig = new MatDialogConfig;
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "60%";
    dialogConfig.data = {PlatformID: this.chamberService.platformID, ChamberFamilyID:  this.chamberService.chamberFamilyID};
    this.dialog.open(CoreDataChamberComponent, dialogConfig).afterClosed().subscribe(data => {
      console.log(data);
      if(data)
      {
        this.loadChambersPage();
      }
    });
  }

  onDelete(chamber)
  {


    this.dialogService.openConfirmDialog('Confirm Delete ?').afterClosed().subscribe(res => {
      if(res)
      {
        this.chamberService.deleteChamber(chamber).subscribe(response => {

          console.log("Response - deleteChamber : ", response);
          this.notificationService.success("Deleted successfully");
          this.loadChambersPage();
          
        }, error => {
    
          this.notificationService.failure(error.error);
        });
      }
    });
  }
}
