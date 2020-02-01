

import {CollectionViewer, DataSource} from "@angular/cdk/collections";

import {catchError, finalize} from "rxjs/operators";

import { ProductConfigMapping } from './product-config-mapping.model';
import { BehaviorSubject, of, Observable } from 'rxjs';
import { ProductConfigMappingService } from './product-config-mapping.service';



export class ProductConfigMappingsDataSource implements DataSource<ProductConfigMapping> {

    private productConfigMappingSubject = new BehaviorSubject<ProductConfigMapping[]>([]);

    private loadingSubject = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingSubject.asObservable();

    constructor(private productConfigMappingsService: ProductConfigMappingService) {

    }

    loadProductConfigMappings() {

        this.loadingSubject.next(true);

        this.productConfigMappingsService.findProductConfigMappings().pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe(productConfigMappings => {
                this.productConfigMappingSubject.next(productConfigMappings);
                this.loadingSubject.next(false);
            });

    }

   

    connect(collectionViewer: CollectionViewer): Observable<ProductConfigMapping[]> {
        console.log("Connecting data source");
        return this.productConfigMappingSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.productConfigMappingSubject.complete();
        this.loadingSubject.complete();
    }

}

