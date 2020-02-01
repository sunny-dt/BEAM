import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import {MatPaginator, MatSort, MatDialog, MatDialogConfig} from "@angular/material";
import { ProductConfigMappingService } from 'src/app/shared/product-config-mapping.service';
import { ProductConfigMappingsDataSource } from 'src/app/shared/product-config-mappings.datasource';
import { fromEvent, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { ProductConfigMappingComponent } from './product-config-mapping.component';
import { NotificationService } from 'src/app/shared/notification.service';
import { DialogService } from 'src/app/shared/dialog.service';
import { ActivatedRoute, Router, Route } from '@angular/router';

@Component({
  selector: 'app-product-config-mapping-list',
  templateUrl: './product-config-mapping-list.component.html',
  styleUrls: ['./product-config-mapping-list.component.css']
})
export class ProductConfigMappingListComponent implements OnInit {

  private sub: any;
  

  dataSource: ProductConfigMappingsDataSource;

  displayedColumns= ["facet_group_name", "chambers", "actions"];

  title = "";

  constructor(public productConfigMappingService : ProductConfigMappingService, private dialog : MatDialog,
    private notificationService : NotificationService,
    private dialogService : DialogService,
    private route : ActivatedRoute,
    private router : Router) { }

  ngOnInit() {

    this.sub = this.route.parent.params.subscribe(params => {
      console.log('parent route params: ', params);
      this.productConfigMappingService.productConfigId = +params["product-config-id"];
      this.title = params["breadcrumb"];
    });

    this.dataSource = new ProductConfigMappingsDataSource(this.productConfigMappingService);
    
    this.loadProductConfigMappingsPage()
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  ngAfterViewInit()
  {
     
  }

  loadProductConfigMappingsPage() {
    this.dataSource.loadProductConfigMappings();
  }

  

  onCreate()
  {

    const dialogConfig = new MatDialogConfig;
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.width = "60%";
    dialogConfig.data = {productConfigId : this.productConfigMappingService.productConfigId}
    this.dialog.open(ProductConfigMappingComponent, dialogConfig).afterClosed().subscribe(data => {
      console.log(data);
      if(data)
      {
        this.loadProductConfigMappingsPage();
      }
    });
  }

  onEdit(row)
  {
    this.productConfigMappingService.populateForm(row);

    const dialogConfig = new MatDialogConfig;
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "60%";
    this.dialog.open(ProductConfigMappingComponent, dialogConfig).afterClosed().subscribe(data => {
      console.log(data);
      if(data)
      {
        this.loadProductConfigMappingsPage();
      }
    });
  }

  onDelete(productConfigMapping)
  {


    this.dialogService.openConfirmDialog('Confirm Delete ?').afterClosed().subscribe(res => {
      if(res)
      {
        this.productConfigMappingService.deleteProductConfigMapping(productConfigMapping).subscribe(response => {

          console.log("Response - deleteProductConfigMapping : ", response);
          this.notificationService.success("Deleted successfully");
          this.loadProductConfigMappingsPage();
          
        }, error => {
    
          this.notificationService.failure(error.error);
        });
      }
    });
  }

  


}
