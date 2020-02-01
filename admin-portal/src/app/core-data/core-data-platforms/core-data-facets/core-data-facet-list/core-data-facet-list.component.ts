import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import {MatPaginator, MatSort, MatDialog, MatDialogConfig} from "@angular/material";
import { FacetService } from 'src/app/shared/facet.service';
import { FacetsDataSource } from 'src/app/shared/facets.datasource';
import { fromEvent, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { NotificationService } from 'src/app/shared/notification.service';
import { DialogService } from 'src/app/shared/dialog.service';
import { ActivatedRoute, Router, Route } from '@angular/router';
import { CoreDataFacetComponent } from '../core-data-facet/core-data-facet.component';

@Component({
  selector: 'app-core-data-facet-list',
  templateUrl: './core-data-facet-list.component.html',
  styleUrls: ['./core-data-facet-list.component.css']
})
export class CoreDataFacetListComponent implements OnInit {

  private sub: any;
  

  dataSource: FacetsDataSource;

  displayedColumns= ["id", "name", "actions"];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild(MatSort) sort: MatSort;

  @ViewChild('input') input: ElementRef;

  searchText : string;

  constructor(public facetService : FacetService, private dialog : MatDialog,
    private notificationService : NotificationService,
    private dialogService : DialogService,
    private route : ActivatedRoute,
    private router : Router) { }

  ngOnInit() {

    this.sub = this.route.params.subscribe(params => {
      console.log('parent route params: ', params);
      this.facetService.platformId = +params["platform-id"];
    });
    this.dataSource = new FacetsDataSource(this.facetService);
    this.dataSource.loadFacets('','asc','id', 1, this.facetService.defaultPageSize);
    
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

                this.loadFacetsPage();
            })
        )
        .subscribe();

        fromEvent(this.input.nativeElement,'change')
        .pipe(
            debounceTime(150),
            distinctUntilChanged(),
            tap(() => {
                this.paginator.pageIndex = 0;

                this.loadFacetsPage();
            })
        )
        .subscribe();

    

    merge(this.sort.sortChange, this.paginator.page)
    .pipe(
        tap(() => this.loadFacetsPage())
    )
    .subscribe();
  }

  loadFacetsPage() {
    this.dataSource.loadFacets(
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
    this.dialog.open(CoreDataFacetComponent, dialogConfig).afterClosed().subscribe(data => {
      console.log(data);
      if(data)
      {
        this.loadFacetsPage();
      }
    });
  }

  onEdit(row)
  {
    this.facetService.populateForm(row);

    const dialogConfig = new MatDialogConfig;
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "60%";
    this.dialog.open(CoreDataFacetComponent, dialogConfig).afterClosed().subscribe(data => {
      console.log(data);
      if(data)
      {
        this.loadFacetsPage();
      }
    });
  }

  onDelete(facet)
  {


    this.dialogService.openConfirmDialog('Confirm Delete ?').afterClosed().subscribe(res => {
      if(res)
      {
        this.facetService.deleteFacet(facet).subscribe(response => {

          console.log("Response - deleteFacet : ", response);
          this.notificationService.success("Deleted successfully");
          this.loadFacetsPage();
          
        }, error => {
    
          this.notificationService.failure(error.error);
        });
      }
    });
  }


}
