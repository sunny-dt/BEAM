import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import {MatPaginator, MatSort, MatDialog, MatDialogConfig} from "@angular/material";
import { MetadataAttrValueService } from 'src/app/shared/metadata-attr-value.service';
import { MetadataAttrValueDataSource } from 'src/app/shared/metadata-attr-values.datasource';
import { fromEvent, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { MetadataAttrValueFormComponent } from '../metadata-attr-value-form/metadata-attr-value-form.component';
import { NotificationService } from 'src/app/shared/notification.service';
import { DialogService } from 'src/app/shared/dialog.service';
import { ActivatedRoute, Router, Route } from '@angular/router';
import { AuthorizationService } from 'src/app/shared/authServices/authorization.service';
import { MessageService } from 'src/app/shared/global-message.service';
import { Constants } from 'src/app/shared/constants';
import { MenuNodeMetadataService } from 'src/app/shared/menu-node-metadata.service';

@Component({
  selector: 'app-metadata-attr-value-list',
  templateUrl: './metadata-attr-value-list.component.html',
  styleUrls: ['./metadata-attr-value-list.component.css']
})
export class MetadataAttrValueListComponent implements OnInit, AfterViewInit {

  
  dataSource: MetadataAttrValueDataSource;

  displayedColumns= ["id", "attr_type_name", "name", "value", "actions"];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild(MatSort) sort: MatSort;

  @ViewChild('input') input: ElementRef;

  searchText : string;
  private globalMsgSubscription : any;

  constructor(public attrValueService : MetadataAttrValueService, 
    private menuMetadataService : MenuNodeMetadataService,
    private dialog : MatDialog,
    private notificationService : NotificationService,
    private dialogService : DialogService,
    private authorizationService : AuthorizationService,
    private messageService : MessageService,
    private route : ActivatedRoute,
    private router : Router) { }

  ngOnInit() {



    this.dataSource = new MetadataAttrValueDataSource(this.attrValueService, this.menuMetadataService, this.dialogService, this.authorizationService);


    this.globalMsgSubscription = this.messageService.getMessage().subscribe(message => { 

      console.log('global message received ', message);
       if( message.text == Constants.METADATA_LOADED)
       {
         console.log('came inside');
         this.dataSource.loadMetadataAttrValue('','asc','id', 1, this.attrValueService.defaultPageSize);
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

                this.loadMetadataAttrValuePage();
            })
        )
        .subscribe();

        fromEvent(this.input.nativeElement,'change')
        .pipe(
            debounceTime(150),
            distinctUntilChanged(),
            tap(() => {
                this.paginator.pageIndex = 0;

                this.loadMetadataAttrValuePage();
            })
        )
        .subscribe();

    

    merge(this.sort.sortChange, this.paginator.page)
    .pipe(
        tap(() => this.loadMetadataAttrValuePage())
    )
    .subscribe();
  }

  loadMetadataAttrValuePage() {
    this.dataSource.loadMetadataAttrValue(
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
    this.dialog.open(MetadataAttrValueFormComponent, dialogConfig).afterClosed().subscribe(data => {
      console.log(data);
      if(data)
      {
        this.loadMetadataAttrValuePage();
      }
    });
  }

  onEdit(row)
  {

    console.log("onEdit - row : ", row);

    let descriptionValue = row.description;
    let description1 = "";
    let description2 = "";
    let description3 = "";

    console.log("onEdit - row descriptionValue: ", descriptionValue);
    console.log("onEdit - row descriptionValue length: ", descriptionValue.length);

    if (descriptionValue.length == 1) {
      description1 = descriptionValue[0].description;
    } else if (descriptionValue.length == 2) {
      description1 = descriptionValue[0].description;
      description2 = descriptionValue[1].description;
    } else if (descriptionValue.length == 3) {
      description1 = descriptionValue[0].description;
      description2 = descriptionValue[1].description;
      description3 = descriptionValue[2].description;
    }

    console.log("onEdit - row descriptionValue description1: ", description1);
    console.log("onEdit - row descriptionValue description2: ", description2);
    console.log("onEdit - row descriptionValue description3: ", description3);

    this.attrValueService.populateForm(row, "", "", description1, description2, description3);

    const dialogConfig = new MatDialogConfig;
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "60%";
    this.dialog.open(MetadataAttrValueFormComponent, dialogConfig).afterClosed().subscribe(data => {
      console.log(data);
      if(data)
      {
        this.loadMetadataAttrValuePage();
      }
    });
  }

  onDelete(attrValue)
  {


    this.dialogService.openConfirmDialog('Confirm Delete ?').afterClosed().subscribe(res => {
      if(res)
      {
        this.attrValueService.deleteMetadataAttrValue(attrValue).subscribe(response => {

          console.log("Response - deleteMetadataAttrValue : ", response);
          this.notificationService.success("Deleted successfully");
          this.loadMetadataAttrValuePage();
          
        }, error => {
    
          this.notificationService.failure(error.error);
        });
      }
    });
  }


}
