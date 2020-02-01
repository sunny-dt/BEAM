import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import {MatPaginator, MatSort, MatDialog, MatDialogConfig} from "@angular/material";
import { G3ProductService } from 'src/app/shared/g3-product.service';
import { G3ProductsDataSource } from 'src/app/shared/g3-products.datasource';
import { fromEvent, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { G3ProductComponent } from '../g3-product/g3-product.component';
import { NotificationService } from 'src/app/shared/notification.service';
import { DialogService } from 'src/app/shared/dialog.service';
import { ActivatedRoute, Router, Route } from '@angular/router';

@Component({
  selector: 'app-g3-product-list',
  templateUrl: './g3-product-list.component.html',
  styleUrls: ['./g3-product-list.component.css']
})
export class G3ProductListComponent implements OnInit {

  private sub: any;
  

  dataSource: G3ProductsDataSource;

  displayedColumns= ["id", "name", "code", "actions"];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild(MatSort) sort: MatSort;

  @ViewChild('input') input: ElementRef;

  searchText : string;

  constructor(public g3productService : G3ProductService, private dialog : MatDialog,
    private notificationService : NotificationService,
    private dialogService : DialogService,
    private route : ActivatedRoute,
    private router : Router) { }

  ngOnInit() {

    this.sub = this.route.parent.params.subscribe(params => {
      console.log('parent route params: ', params);
      this.g3productService.g2ProductTypeId = +params["g2-product-id"];
    });
    this.dataSource = new G3ProductsDataSource(this.g3productService);

    this.dataSource.loadG3Products('','asc','id', 1, this.g3productService.defaultPageSize);
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

                this.loadG3ProductsPage();
            })
        )
        .subscribe();

        fromEvent(this.input.nativeElement,'change')
        .pipe(
            debounceTime(150),
            distinctUntilChanged(),
            tap(() => {
                this.paginator.pageIndex = 0;

                this.loadG3ProductsPage();
            })
        )
        .subscribe();

    

    merge(this.sort.sortChange, this.paginator.page)
    .pipe(
        tap(() => this.loadG3ProductsPage())
    )
    .subscribe();
  }

  loadG3ProductsPage() {
    this.dataSource.loadG3Products(
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
    this.dialog.open(G3ProductComponent, dialogConfig).afterClosed().subscribe(data => {
      console.log(data);
      if(data)
      {
        this.loadG3ProductsPage();
      }
    });
  }

  onEdit(row)
  {
    this.g3productService.populateForm(row);

    const dialogConfig = new MatDialogConfig;
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "60%";
    this.dialog.open(G3ProductComponent, dialogConfig).afterClosed().subscribe(data => {
      console.log(data);
      if(data)
      {
        this.loadG3ProductsPage();
      }
    });
  }

  onDelete(g3product)
  {


    this.dialogService.openConfirmDialog('Confirm Delete ?').afterClosed().subscribe(res => {
      if(res)
      {
        this.g3productService.deleteG3Product(g3product).subscribe(response => {

          console.log("Response - deleteG3Product : ", response);
          this.notificationService.success("Deleted successfully");
          this.loadG3ProductsPage();
          
        }, error => {
    
          this.notificationService.failure(error.error);
        });
      }
    });
  }



  onProductConfigs(g3product)
  {
    this.router.navigate(['../product-configs', g3product.id, `[${g3product.name}] - Configs`], {relativeTo : this.route});
  }


}
