

import {CollectionViewer, DataSource} from "@angular/cdk/collections";

import {catchError, finalize} from "rxjs/operators";

import { G2Product } from './g2-product.model';
import { BehaviorSubject, of, Observable } from 'rxjs';
import { G2ProductService } from './g2-product.service';



export class G2ProductsDataSource implements DataSource<G2Product> {

    private g2productsSubject = new BehaviorSubject<G2Product[]>([]);

    private loadingSubject = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingSubject.asObservable();

    constructor(private g2productsService: G2ProductService) {

    }

    loadG2Products(filter:string, 
        sortColumn:string,
        sortOrder:string, 
        page:number, 
        pageSize:number) {

        this.loadingSubject.next(true);

        this.g2productsService.findG2Products(filter,
            sortColumn,  
            sortOrder, 
            page, 
            pageSize).pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe(g2products => {
                this.g2productsSubject.next(g2products);
                this.loadingSubject.next(false);
            });

    }

   

    connect(collectionViewer: CollectionViewer): Observable<G2Product[]> {
        console.log("Connecting data source");
        return this.g2productsSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.g2productsSubject.complete();
        this.loadingSubject.complete();
    }

}

