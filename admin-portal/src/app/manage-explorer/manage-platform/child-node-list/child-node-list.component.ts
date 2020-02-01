import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import {MatPaginator, MatSort, MatDialog, MatDialogConfig} from "@angular/material";
import { fromEvent, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { ChildNodeFormComponent } from '../child-node-form/child-node-form.component';
import { NotificationService } from 'src/app/shared/notification.service';
import { DialogService } from 'src/app/shared/dialog.service';
import { ActivatedRoute, Router, Route } from '@angular/router';
import { AuthorizationService } from 'src/app/shared/authServices/authorization.service';
import { MenuNodeService } from 'src/app/shared/menu-node.service';
import { ChildMenuNodesDataSource } from 'src/app/shared/child-menu-nodes.datasource';
import { Constants } from 'src/app/shared/constants';
import { MessageService } from 'src/app/shared/global-message.service';

@Component({
  selector: 'app-child-node-list',
  templateUrl: './child-node-list.component.html',
  styleUrls: ['./child-node-list.component.css']
})
export class ChildNodeListComponent implements OnInit, AfterViewInit {

  
  dataSource: ChildMenuNodesDataSource;

  displayedColumns= ["id", "name", "node_type_name", "created_by_id", "created_by_name", "modified_by_id", "modified_by_name","c_date", "m_date", "seq", "actions"];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild(MatSort) sort: MatSort;

  @ViewChild('input') input: ElementRef;

  searchText : string;
  
  private sub: any;

  constructor(public menuNodeService : MenuNodeService,  
    private dialog : MatDialog,
    private notificationService : NotificationService,
    private dialogService : DialogService,
    private authorizationService : AuthorizationService,
    private messageService : MessageService,
    private route : ActivatedRoute,
    private router : Router) { }

  ngOnInit() {

    this.dataSource = new ChildMenuNodesDataSource(this.menuNodeService, this.dialogService, this.authorizationService);

    this.sub = this.route.params.subscribe(params => {
      console.log('parent route params: ', params);
      this.menuNodeService.currentSelectedNodeId = +params["node-id"];
      
     // const currentSelectedNode = this.menuNodeService.getNodeByIdLocally(this.menuNodeService.currentSelectedNodeId);
     // console.log('current selected node: ', currentSelectedNode);
      //this.menuNodeService.currentSelectedNode = currentSelectedNode;

      if(this.dataSource != undefined)
      {
        this.dataSource.loadChildNodes();
      }
    });


    // this.dataSource.loadChildNodes();
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

                this.loadChildNodesPage();
            })
        )
        .subscribe();

        fromEvent(this.input.nativeElement,'change')
        .pipe(
            debounceTime(150),
            distinctUntilChanged(),
            tap(() => {
                this.paginator.pageIndex = 0;

                this.loadChildNodesPage();
            })
        )
        .subscribe();

    

    merge(this.sort.sortChange, this.paginator.page)
    .pipe(
        tap(() => this.loadChildNodesPage())
    )
    .subscribe();
  }

  loadChildNodesPage() {
    this.dataSource.loadChildNodes();
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
    this.dialog.open(ChildNodeFormComponent, dialogConfig).afterClosed().subscribe(data => {
      console.log(data);
      if(data)
      {
        this.loadChildNodesPage();
      }
    });
  }

  onEdit(row)
  {
    this.menuNodeService.populateForm(row, "", "", "");

    const dialogConfig = new MatDialogConfig;
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "60%";
    this.dialog.open(ChildNodeFormComponent, dialogConfig).afterClosed().subscribe(data => {
      console.log(data);
      if(data)
      {
        this.loadChildNodesPage();
      }
    });
  }

  onDelete(node)
  {


    this.dialogService.openConfirmDialog('Confirm Delete ?').afterClosed().subscribe(res => {
      if(res)
      {
        this.menuNodeService.deleteMenuNode(node).subscribe(response => {

          this.messageService.sendMessage(Constants.CHILD_NODE_DELETED);

          console.log("Response - deleteChildNode : ", response);
          this.notificationService.success("Deleted successfully");
          this.loadChildNodesPage();
          
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
