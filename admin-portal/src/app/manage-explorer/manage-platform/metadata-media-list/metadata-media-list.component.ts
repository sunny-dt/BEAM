import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import {MatPaginator, MatSort, MatDialog, MatDialogConfig} from "@angular/material";
import { MetadataMediaService } from 'src/app/shared/metadata-media.service';
import { MetadataMediaDataSource } from 'src/app/shared/metadata-media.datasource';
import { fromEvent, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { MetadataMediaFormComponent } from '../metadata-media-form/metadata-media-form.component';
import { NotificationService } from 'src/app/shared/notification.service';
import { DialogService } from 'src/app/shared/dialog.service';
import { ActivatedRoute, Router, Route } from '@angular/router';
import { AuthorizationService } from 'src/app/shared/authServices/authorization.service';
import { MessageService } from 'src/app/shared/global-message.service';
import { Constants } from 'src/app/shared/constants';
import { MenuNodeMetadataService } from 'src/app/shared/menu-node-metadata.service';

@Component({
  selector: 'app-metadata-media-list',
  templateUrl: './metadata-media-list.component.html',
  styleUrls: ['./metadata-media-list.component.css']
})
export class MetadataMediaListComponent implements OnInit, AfterViewInit {

  
  dataSource: MetadataMediaDataSource;

  displayedColumns= ["id", "media_type", "serial_order", "created_by_id", "created_by_name", "modified_by_id", "modified_by_name","c_date", "m_date", "actions"];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild(MatSort) sort: MatSort;

  @ViewChild('input') input: ElementRef;

  searchText : string;
  private globalMsgSubscription : any;

  constructor(public mediaService : MetadataMediaService, 
    private menuMetadataService : MenuNodeMetadataService,
    private dialog : MatDialog,
    private notificationService : NotificationService,
    private dialogService : DialogService,
    private authorizationService : AuthorizationService,
    private messageService : MessageService,
    private route : ActivatedRoute,
    private router : Router) { }

  ngOnInit() {



    this.dataSource = new MetadataMediaDataSource(this.mediaService, this.menuMetadataService ,this.dialogService, this.authorizationService);


    this.globalMsgSubscription = this.messageService.getMessage().subscribe(message => { 

      console.log('global message received ', message);
       if( message.text == Constants.METADATA_LOADED)
       {
         console.log('came inside');
         this.dataSource.loadMetadataMedia('','asc','id', 1, this.mediaService.defaultPageSize);
       }
    });



  }

  ngOnDestroy()
  {
    this.globalMsgSubscription.unsubscribe();
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

                this.loadMetadataMediaPage();
            })
        )
        .subscribe();

        fromEvent(this.input.nativeElement,'change')
        .pipe(
            debounceTime(150),
            distinctUntilChanged(),
            tap(() => {
                this.paginator.pageIndex = 0;

                this.loadMetadataMediaPage();
            })
        )
        .subscribe();

    

    merge(this.sort.sortChange, this.paginator.page)
    .pipe(
        tap(() => this.loadMetadataMediaPage())
    )
    .subscribe();
  }

  loadMetadataMediaPage() {
    this.dataSource.loadMetadataMedia(
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
    this.dialog.open(MetadataMediaFormComponent, dialogConfig).afterClosed().subscribe(data => {
      console.log(data);
      if(data)
      {
        this.loadMetadataMediaPage();
      }
    });
  }

  onEdit(row)
  {
    this.mediaService.populateForm(row);

    const dialogConfig = new MatDialogConfig;
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "60%";
    this.dialog.open(MetadataMediaFormComponent, dialogConfig).afterClosed().subscribe(data => {
      console.log(data);
      if(data)
      {
        this.loadMetadataMediaPage();
      }
    });
  }

  onDelete(media)
  {


    this.dialogService.openConfirmDialog('Confirm Delete ?').afterClosed().subscribe(res => {
      if(res)
      {
        this.mediaService.deleteMetadataMedia(media).subscribe(response => {

          console.log("Response - deleteMetadataMedia : ", response);
          this.notificationService.success("Deleted successfully");
          this.loadMetadataMediaPage();
          
        }, error => {
    
          this.notificationService.failure(error.error);
        });
      }
    });
  }


}
