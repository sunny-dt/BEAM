import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import {MatPaginator, MatSort, MatDialog, MatDialogConfig} from "@angular/material";
import { MenuNodeMetadataService } from 'src/app/shared/menu-node-metadata.service';
import { MenuNodeMetadataDataSource } from 'src/app/shared/menu-node-metadata.datasource';
import { fromEvent, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { MenuNodeMetadataFormComponent } from '../menu-node-metadata-form/menu-node-metadata-form.component';
import { NotificationService } from 'src/app/shared/notification.service';
import { DialogService } from 'src/app/shared/dialog.service';
import { ActivatedRoute, Router, Route } from '@angular/router';
import { AuthorizationService } from 'src/app/shared/authServices/authorization.service';

@Component({
  selector: 'app-menu-node-metadata-list',
  templateUrl: './menu-node-metadata-list.component.html',
  styleUrls: ['./menu-node-metadata-list.component.css']
})
export class MenuNodeMetadataListComponent implements OnInit, AfterViewInit {

  
  dataSource: MenuNodeMetadataDataSource;

  //, "tile_bg_color", "tile_fg_color", "created_by_id", "created_by_name", "modified_by_id", "modified_by_name","c_date", "m_date"
  displayedColumns= ["id", "text", "search_keywords", "url", "actions"];

  // @ViewChild(MatPaginator) paginator: MatPaginator;

  // @ViewChild(MatSort) sort: MatSort;

  @ViewChild('input') input: ElementRef;

  searchText : string;


  constructor(public metadataService : MenuNodeMetadataService, private dialog : MatDialog,
    private notificationService : NotificationService,
    private dialogService : DialogService,
    private authorizationService : AuthorizationService,
    private route : ActivatedRoute,
    private router : Router) { }

  ngOnInit() {

    this.dataSource = new MenuNodeMetadataDataSource(this.metadataService, this.dialogService, this.authorizationService);

    this.dataSource.loadMenuNodeMetadata();
  }

  ngAfterViewInit()
  {
    
  }

 

  loadMenuNodeMetadataPage() {
    this.dataSource.loadMenuNodeMetadata(
        );
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
    this.dialog.open(MenuNodeMetadataFormComponent, dialogConfig).afterClosed().subscribe(data => {
      console.log(data);
      if(data)
      {
        this.loadMenuNodeMetadataPage();
      }
    });
  }

  onEdit(row)
  {
    this.metadataService.populateForm(row);

    const dialogConfig = new MatDialogConfig;
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "60%";
    this.dialog.open(MenuNodeMetadataFormComponent, dialogConfig).afterClosed().subscribe(data => {
      console.log(data);
      if(data)
      {
        this.loadMenuNodeMetadataPage();
      }
    });
  }

  onDelete(featured)
  {


    this.dialogService.openConfirmDialog('Confirm Delete ?').afterClosed().subscribe(res => {
      if(res)
      {
        this.metadataService.deleteMenuNodeMetadata(featured).subscribe(response => {

          console.log("Response - deleteMenuNodeMetadata : ", response);
          this.notificationService.success("Deleted successfully");
          this.loadMenuNodeMetadataPage();
          
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
