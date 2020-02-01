import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import {MatPaginator, MatSort, MatDialog, MatDialogConfig} from "@angular/material";
import { ProductConfigService } from 'src/app/shared/product-config.service';
import { ProductConfigsDataSource } from 'src/app/shared/product-configs.datasource';
import { fromEvent, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { ProductConfigComponent } from '../product-config/product-config.component';
import { NotificationService } from 'src/app/shared/notification.service';
import { DialogService } from 'src/app/shared/dialog.service';
import { ActivatedRoute, Router, Route } from '@angular/router';

@Component({
  selector: 'app-product-config-list',
  templateUrl: './product-config-list.component.html',
  styleUrls: ['./product-config-list.component.css']
})
export class ProductConfigListComponent implements OnInit {

  private sub: any;
  

  dataSource: ProductConfigsDataSource;

  displayedColumns= ["id", "product_name", "actions"];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild(MatSort) sort: MatSort;

  @ViewChild('input') input: ElementRef;

  searchText : string;

  constructor(public productconfigService : ProductConfigService, private dialog : MatDialog,
    private notificationService : NotificationService,
    private dialogService : DialogService,
    private route : ActivatedRoute,
    private router : Router) { }

  ngOnInit() {

    this.sub = this.route.parent.params.subscribe(params => {
      console.log('parent route params: ', params);
      this.productconfigService.g3productId = +params["g3-product-id"];
    });
    this.dataSource = new ProductConfigsDataSource(this.productconfigService);
    this.dataSource.loadProductConfigs('','asc','id', 1, this.productconfigService.defaultPageSize);
    
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

                this.loadProductConfigsPage();
            })
        )
        .subscribe();

        fromEvent(this.input.nativeElement,'change')
        .pipe(
            debounceTime(150),
            distinctUntilChanged(),
            tap(() => {
                this.paginator.pageIndex = 0;

                this.loadProductConfigsPage();
            })
        )
        .subscribe();

    

    merge(this.sort.sortChange, this.paginator.page)
    .pipe(
        tap(() => this.loadProductConfigsPage())
    )
    .subscribe();
  }

  loadProductConfigsPage() {
    this.dataSource.loadProductConfigs(
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
    this.dialog.open(ProductConfigComponent, dialogConfig).afterClosed().subscribe(data => {
      console.log(data);
      if(data)
      {
        this.loadProductConfigsPage();
      }
    });
  }

  onEdit(row)
  {
    this.productconfigService.populateForm(row);

    const dialogConfig = new MatDialogConfig;
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "60%";
    this.dialog.open(ProductConfigComponent, dialogConfig).afterClosed().subscribe(data => {
      console.log(data);
      if(data)
      {
        this.loadProductConfigsPage();
      }
    });
  }

  onDelete(productconfig)
  {


    this.dialogService.openConfirmDialog('Confirm Delete ?').afterClosed().subscribe(res => {
      if(res)
      {
        this.productconfigService.deleteProductConfig(productconfig).subscribe(response => {

          console.log("Response - deleteProductConfig : ", response);
          this.notificationService.success("Deleted successfully");
          this.loadProductConfigsPage();
          
        }, error => {
    
          this.notificationService.failure(error.error);
        });
      }
    });
  }



  onMappings(productconfig)
  {
    this.router.navigate(['../product-config-mappings', productconfig.id, `[${productconfig.product_name}] - Mappings`], {relativeTo : this.route});
  }


}
