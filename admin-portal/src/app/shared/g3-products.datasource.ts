

import {CollectionViewer, DataSource} from "@angular/cdk/collections";

import {catchError, finalize} from "rxjs/operators";

import { G3Product } from './g3-product.model';
import { BehaviorSubject, of, Observable } from 'rxjs';
import { G3ProductService } from './g3-product.service';



export class G3ProductsDataSource implements DataSource<G3Product> {

    private g3productsSubject = new BehaviorSubject<G3Product[]>([]);

    private loadingSubject = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingSubject.asObservable();

    constructor(private g3productsService: G3ProductService) {

    }

    loadG3Products(filter:string, 
        sortColumn:string,
        sortOrder:string, 
        page:number, 
        pageSize:number) {

        this.loadingSubject.next(true);

        this.g3productsService.findG3Products(filter,
            sortColumn,  
            sortOrder, 
            page, 
            pageSize).pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe(g3products => {
                this.g3productsSubject.next(g3products);
                this.loadingSubject.next(false);
            });

    }

   

    connect(collectionViewer: CollectionViewer): Observable<G3Product[]> {
        console.log("Connecting data source");
        return this.g3productsSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.g3productsSubject.complete();
        this.loadingSubject.complete();
    }

}

