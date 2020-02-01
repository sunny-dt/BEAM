import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import {MatPaginator, MatSort, MatDialog, MatDialogConfig} from "@angular/material";
import { ChamberService } from 'src/app/shared/chamber.service';
import { ChambersDataSource } from 'src/app/shared/chambers.datasource';
import { fromEvent, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { NotificationService } from 'src/app/shared/notification.service';
import { DialogService } from 'src/app/shared/dialog.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CoreDataChamberFamilyComponent } from './core-data-chamber-family/core-data-chamber-family.component';
import { CoreDataChamberFamiliesService } from 'src/app/shared/core-data-chambers-families.service';
import { CoreDataChambersFamilyDataSource } from 'src/app/shared/core-data-chambers-families.datasource';

@Component({
  selector: 'app-core-data-chamber-families-list',
  templateUrl: './core-data-chamber-families-list.component.html',
  styleUrls: ['./core-data-chamber-families-list.component.css']
})
export class CoreDataChamberFamiliesListComponent implements OnInit, AfterViewInit {

  private sub: any;

  dataSource: CoreDataChambersFamilyDataSource;

  displayedColumns= ["id", "name", "feed", "actions"];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild(MatSort) sort: MatSort;

  @ViewChild('input') input: ElementRef;

  searchText : string;

  constructor(public chamberFamiliesService : CoreDataChamberFamiliesService, private dialog : MatDialog,
    private notificationService : NotificationService,
    private dialogService : DialogService,
    private route : ActivatedRoute,
    private router : Router) { }

  ngOnInit() {

    this.sub = this.route.parent.params.subscribe(params => {
      console.log('parent route params: ', params);
      this.chamberFamiliesService.platformId = +params["platform-id"];
    });
    
    this.dataSource = new CoreDataChambersFamilyDataSource(this.chamberFamiliesService);
    this.dataSource.loadChambers('','asc','id', 1, this.chamberFamiliesService.defaultPageSize);
    
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
    this.dialog.open(CoreDataChamberFamilyComponent, dialogConfig).afterClosed().subscribe(data => {
      console.log(data);
      if(data)
      {
        this.loadChambersPage();
      }
    });
  }

  onEdit(row)
  {
    console.log('chamberFamilis', row);
    this.chamberFamiliesService.populateForm(row);

    const dialogConfig = new MatDialogConfig;
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "60%";
    this.dialog.open(CoreDataChamberFamilyComponent, dialogConfig).afterClosed().subscribe(data => {
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
        this.chamberFamiliesService.deleteChamber(chamber).subscribe(response => {

          console.log("Response - deleteChamber : ", response);
          this.notificationService.success("Deleted successfully");
          this.loadChambersPage();
          
        }, error => {
    
          this.notificationService.failure(error.error);
        });
      }
    });
  }

  onChambers(chamberFamily)
  {

    console.log('onChambers: ', chamberFamily);
    console.log('onChambers platformId : ', this.chamberFamiliesService.platformId);
    this.router.navigate([ '../chambers', this.chamberFamiliesService.platformId, chamberFamily.id, `[${chamberFamily.name}] - Chambers`], { relativeTo: this.route });
  }
}
