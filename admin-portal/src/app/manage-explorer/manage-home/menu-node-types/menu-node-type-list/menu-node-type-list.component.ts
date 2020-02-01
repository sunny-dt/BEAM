import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import {MatPaginator, MatSort, MatDialog, MatDialogConfig} from "@angular/material";
import { MenuNodeTypeService } from 'src/app/shared/menu-node-type.service';
import { MenuNodeTypesDataSource } from 'src/app/shared/menu-node-types.datasource';
import { fromEvent, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { MenuNodeTypeFormComponent } from '../menu-node-type-form/menu-node-type-form.component';
import { NotificationService } from 'src/app/shared/notification.service';
import { DialogService } from 'src/app/shared/dialog.service';
import { ActivatedRoute, Router, Route } from '@angular/router';
import { AuthorizationService } from 'src/app/shared/authServices/authorization.service';

@Component({
  selector: 'app-menu-node-type-list',
  templateUrl: './menu-node-type-list.component.html',
  styleUrls: ['./menu-node-type-list.component.css']
})
export class MenuNodeTypeListComponent implements OnInit, AfterViewInit {

  
  dataSource: MenuNodeTypesDataSource;

  displayedColumns= ["id", "name", "actions"];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild(MatSort) sort: MatSort;

  @ViewChild('input') input: ElementRef;

  searchText : string;

  constructor(public menuNodeTypeService : MenuNodeTypeService, private dialog : MatDialog,
    private notificationService : NotificationService,
    private dialogService : DialogService,
    private authorizationService : AuthorizationService,
    private route : ActivatedRoute,
    private router : Router) { }

  ngOnInit() {

    this.dataSource = new MenuNodeTypesDataSource(this.menuNodeTypeService, this.dialogService, this.authorizationService);

    this.dataSource.loadMenuNodeTypes('','asc','id', 1, this.menuNodeTypeService.defaultPageSize);
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

                this.loadMenuNodeTypesPage();
            })
        )
        .subscribe();

        fromEvent(this.input.nativeElement,'change')
        .pipe(
            debounceTime(150),
            distinctUntilChanged(),
            tap(() => {
                this.paginator.pageIndex = 0;

                this.loadMenuNodeTypesPage();
            })
        )
        .subscribe();

    

    merge(this.sort.sortChange, this.paginator.page)
    .pipe(
        tap(() => this.loadMenuNodeTypesPage())
    )
    .subscribe();
  }

  loadMenuNodeTypesPage() {
    this.dataSource.loadMenuNodeTypes(
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
    this.dialog.open(MenuNodeTypeFormComponent, dialogConfig).afterClosed().subscribe(data => {
      console.log(data);
      if(data)
      {
        this.loadMenuNodeTypesPage();
      }
    });
  }

  onEdit(row)
  {
    this.menuNodeTypeService.populateForm(row);

    const dialogConfig = new MatDialogConfig;
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "60%";
    this.dialog.open(MenuNodeTypeFormComponent, dialogConfig).afterClosed().subscribe(data => {
      console.log(data);
      if(data)
      {
        this.loadMenuNodeTypesPage();
      }
    });
  }

  onDelete(menu_node_type)
  {


    this.dialogService.openConfirmDialog('Confirm Delete ?').afterClosed().subscribe(res => {
      if(res)
      {
        this.menuNodeTypeService.deleteMenuNodeType(menu_node_type).subscribe(response => {

          console.log("Response - deleteMenuNodeType : ", response);
          this.notificationService.success("Deleted successfully");
          this.loadMenuNodeTypesPage();
          
        }, error => {
    
          this.notificationService.failure(error.error);
        });
      }
    });
  }

  onAttributeNames(nodeType)
  {
    this.router.navigate([ '../attribute-names', nodeType.id, `[${nodeType.name}] - Attribute Names`], { relativeTo: this.route });
  }

}
