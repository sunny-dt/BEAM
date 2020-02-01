

import {CollectionViewer, DataSource} from "@angular/cdk/collections";

import {catchError, finalize} from "rxjs/operators";

import { Platform } from './platform.model';
import { BehaviorSubject, of, Observable } from 'rxjs';
import { PlatformService } from './platform.service';
import { DialogService } from './dialog.service';
import { AuthorizationService } from './authServices/authorization.service';
import { CustomerService } from './customer.service';



export class CustomersDataSource implements DataSource<Platform> {

    private customersSubject = new BehaviorSubject<Platform[]>([]);

    private loadingSubject = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingSubject.asObservable();

    constructor(private customerService: CustomerService, private dialogService : DialogService, private authorizationService : AuthorizationService) {

    }

    loadCustomers(filter:string, 
        sortColumn:string,
        sortOrder:string, 
        page:number, 
        pageSize:number) {

        this.loadingSubject.next(true);

        this.customerService.findPCustomers(filter,
            sortColumn,  
            sortOrder, 
            page, 
            pageSize).pipe(
                catchError(err => {
                    console.log('find customerService error ', err);
                    
                    this.dialogService.openHttpErrorDialog(err.error, err.status).afterClosed().subscribe(code => {
                        console.log('dialog response ', code);
                        if(code == 401)
                        {
                            this.authorizationService.authorize();
                        }
                    });

                    return of([]);
                }),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe(customers => {
                console.log("customers: ", customers);
                this.customersSubject.next(customers);
                this.loadingSubject.next(false);
            });

    }

   

    connect(collectionViewer: CollectionViewer): Observable<Platform[]> {
        console.log("Connecting data source");
        return this.customersSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.customersSubject.complete();
        this.loadingSubject.complete();
    }

}

