import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import {MatPaginator, MatSort, MatDialog, MatDialogConfig, MatTable, MatTableDataSource} from "@angular/material";
import { NodeTypeAttributeNameService } from 'src/app/shared/node-type-attribute-name.service';
import { NodeTypeAttributeNamesDataSource } from 'src/app/shared/node-type-attribute-names.datasource';
import { fromEvent, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap, catchError, finalize } from 'rxjs/operators';
import { NodeTypeAttributeNameFormComponent } from '../node-type-attribute-name-form/node-type-attribute-name-form.component';
import { NotificationService } from 'src/app/shared/notification.service';
import { DialogService } from 'src/app/shared/dialog.service';
import { ActivatedRoute, Router, Route } from '@angular/router';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { NodeTypeAttributeName } from 'src/app/shared/node-type-attribute-name.model';
import { DataSource } from '@angular/cdk/table';

@Component({
  selector: 'app-node-type-attribute-name-list',
  templateUrl: './node-type-attribute-name-list.component.html',
  styleUrls: ['./node-type-attribute-name-list.component.css']
})
export class NodeTypeAttributeNameListComponent implements OnInit {

  private sub: any;
  

  dataSource: NodeTypeAttributeNamesDataSource;

  displayedColumns= ["id", "name", "attr_type_name", "actions", "position"];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild(MatSort) sort: MatSort;

  @ViewChild('input') input: ElementRef;

  @ViewChild('table') table: MatTable<any>;

  searchText : string;

  constructor(public nodeTypeAttributeNameService : NodeTypeAttributeNameService, private dialog : MatDialog,
    private notificationService : NotificationService,
    private dialogService : DialogService,
    private route : ActivatedRoute,
    private router : Router) { }

  ngOnInit() {

    this.sub = this.route.params.subscribe(params => {
      console.log('parent route params: ', params);
      this.nodeTypeAttributeNameService.nodeTypeId = +params["node-type-id"];
    });
    this.dataSource = new NodeTypeAttributeNamesDataSource(this.nodeTypeAttributeNameService);
    this.dataSource.loadNodeTypeAttributeNames('','attr_type_id','asc', 1, this.nodeTypeAttributeNameService.defaultPageSize);
    
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

                this.loadNodeTypeAttributeNamesPage();
            })
        )
        .subscribe();

        fromEvent(this.input.nativeElement,'change')
        .pipe(
            debounceTime(150),
            distinctUntilChanged(),
            tap(() => {
                this.paginator.pageIndex = 0;

                this.loadNodeTypeAttributeNamesPage();
            })
        )
        .subscribe();

    

    merge(this.sort.sortChange, this.paginator.page)
    .pipe(
        tap(() => this.loadNodeTypeAttributeNamesPage())
    )
    .subscribe();
  }

  loadNodeTypeAttributeNamesPage() {
    this.dataSource.loadNodeTypeAttributeNames(
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
    this.dialog.open(NodeTypeAttributeNameFormComponent, dialogConfig).afterClosed().subscribe(data => {
      console.log(data);
      if(data)
      {
        this.loadNodeTypeAttributeNamesPage();
      }
    });
  }

  onEdit(row)
  {
    this.nodeTypeAttributeNameService.populateForm(row);

    const dialogConfig = new MatDialogConfig;
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "60%";
    this.dialog.open(NodeTypeAttributeNameFormComponent, dialogConfig).afterClosed().subscribe(data => {
      console.log(data);
      if(data)
      {
        this.loadNodeTypeAttributeNamesPage();
      }
    });
  }

  onDelete(nodeTypeAttributeName)
  {


    this.dialogService.openConfirmDialog('Confirm Delete ?').afterClosed().subscribe(res => {
      if(res)
      {
        this.nodeTypeAttributeNameService.deleteNodeTypeAttributeName(nodeTypeAttributeName).subscribe(response => {

          console.log("Response - deleteNodeTypeAttributeName : ", response);
          this.notificationService.success("Deleted successfully");
          this.loadNodeTypeAttributeNamesPage();
          
        }, error => {
    
          this.notificationService.failure(error.error);
        });
      }
    });
  }


  dropTable(event: CdkDragDrop<any[]>) {
    if (this.isInvalidDragEvent) {
            this.isInvalidDragEvent = false;
            return;
        }

    console.log('table datasource : ', this.table.dataSource)
    const prevIndex = (this.table.dataSource as MatTableDataSource<NodeTypeAttributeName>).data.findIndex((d) => d === event.item.data);

    const draggedItem = (this.table.dataSource as MatTableDataSource<NodeTypeAttributeName>).data[prevIndex];
    const  swappedItem = (this.table.dataSource as MatTableDataSource<NodeTypeAttributeName>).data[event.currentIndex];

    if(draggedItem.attr_type_id != swappedItem.attr_type_id)
        return;

    moveItemInArray( (this.table.dataSource as MatTableDataSource<NodeTypeAttributeName>).data, prevIndex, event.currentIndex);
    this.table.renderRows();

    this.syncReorderChanges(draggedItem, swappedItem);
  }
  isInvalidDragEvent:boolean=false;
  onInvalidDragEventMouseDown(){
    this.isInvalidDragEvent=true;
  }
  dragStarted(event){
    if(this.isInvalidDragEvent){
       document.dispatchEvent(new Event('mouseup'));
    }
  }

  
  syncReorderChanges(draggedItem : NodeTypeAttributeName, swappedItem : NodeTypeAttributeName)
  {
    this.nodeTypeAttributeNameService.reorderAttributeName(draggedItem.id, swappedItem.position)
      .subscribe(response => {
          
          console.log("reoordering response ", response);
          this.loadNodeTypeAttributeNamesPage();

      });
  }



}
