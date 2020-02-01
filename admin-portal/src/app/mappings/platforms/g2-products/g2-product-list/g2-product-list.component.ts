import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import {MatPaginator, MatSort, MatDialog, MatDialogConfig} from "@angular/material";
import { G2ProductService } from 'src/app/shared/g2-product.service';
import { G2ProductsDataSource } from 'src/app/shared/g2-products.datasource';
import { fromEvent, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { G2ProductComponent } from '../g2-product/g2-product.component';
import { NotificationService } from 'src/app/shared/notification.service';
import { DialogService } from 'src/app/shared/dialog.service';
import { ActivatedRoute, Router, Route } from '@angular/router';

@Component({
  selector: 'app-g2-product-list',
  templateUrl: './g2-product-list.component.html',
  styleUrls: ['./g2-product-list.component.css']
})
export class G2ProductListComponent implements OnInit {

  private sub: any;
  

  dataSource: G2ProductsDataSource;

  displayedColumns= ["id", "name", "rnd_product_name", "rnd_product_code", "actions"];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild(MatSort) sort: MatSort;

  @ViewChild('input') input: ElementRef;

  searchText : string;

  constructor(public g2productService : G2ProductService, private dialog : MatDialog,
    private notificationService : NotificationService,
    private dialogService : DialogService,
    private route : ActivatedRoute,
    private router : Router) { }

  ngOnInit() {

    this.sub = this.route.parent.params.subscribe(params => {
      console.log('parent route params: ', params);
      this.g2productService.platformId = +params["platform-id"];
    });
    this.dataSource = new G2ProductsDataSource(this.g2productService);

    this.dataSource.loadG2Products('','asc','id', 1, this.g2productService.defaultPageSize);
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

                this.loadG2ProductsPage();
            })
        )
        .subscribe();

        fromEvent(this.input.nativeElement,'change')
        .pipe(
            debounceTime(150),
            distinctUntilChanged(),
            tap(() => {
                this.paginator.pageIndex = 0;

                this.loadG2ProductsPage();
            })
        )
        .subscribe();

    

    merge(this.sort.sortChange, this.paginator.page)
    .pipe(
        tap(() => this.loadG2ProductsPage())
    )
    .subscribe();
  }

  loadG2ProductsPage() {
    this.dataSource.loadG2Products(
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
    this.dialog.open(G2ProductComponent, dialogConfig).afterClosed().subscribe(data => {
      console.log(data);
      if(data)
      {
        this.loadG2ProductsPage();
      }
    });
  }

  onEdit(row)
  {
    this.g2productService.populateForm(row);

    const dialogConfig = new MatDialogConfig;
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "60%";
    this.dialog.open(G2ProductComponent, dialogConfig).afterClosed().subscribe(data => {
      console.log(data);
      if(data)
      {
        this.loadG2ProductsPage();
      }
    });
  }

  onDelete(g2product)
  {


    this.dialogService.openConfirmDialog('Confirm Delete ?').afterClosed().subscribe(res => {
      if(res)
      {
        this.g2productService.deleteG2Product(g2product).subscribe(response => {

          console.log("Response - deleteG2Product : ", response);
          this.notificationService.success("Deleted successfully");
          this.loadG2ProductsPage();
          
        }, error => {
    
          this.notificationService.failure(error.error);
        });
      }
    });
  }



  onG3Products(g2product)
  {
    this.router.navigate(['../g3-products', g2product.id, `[${g2product.name}] - G3 Products`], {relativeTo : this.route});
  }

}
