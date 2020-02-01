

import {CollectionViewer, DataSource} from "@angular/cdk/collections";

import {catchError, finalize} from "rxjs/operators";

import { ProductConfig } from './product-config.model';
import { BehaviorSubject, of, Observable } from 'rxjs';
import { ProductConfigService } from './product-config.service';



export class ProductConfigsDataSource implements DataSource<ProductConfig> {

    private productconfigsSubject = new BehaviorSubject<ProductConfig[]>([]);

    private loadingSubject = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingSubject.asObservable();

    constructor(private productconfigsService: ProductConfigService) {

    }

    loadProductConfigs(filter:string, 
        sortColumn:string,
        sortOrder:string,
        page:number, 
        pageSize:number) {

        this.loadingSubject.next(true);

        this.productconfigsService.findProductConfigs(filter,
            sortColumn,  
            sortOrder, 
            page, 
            pageSize).pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe(productconfigs => {
                this.productconfigsSubject.next(productconfigs);
                this.loadingSubject.next(false);
            });

    }

   

    connect(collectionViewer: CollectionViewer): Observable<ProductConfig[]> {
        console.log("Connecting data source");
        return this.productconfigsSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.productconfigsSubject.complete();
        this.loadingSubject.complete();
    }

}

