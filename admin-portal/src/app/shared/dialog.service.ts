import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { HttpErrorDialogComponent } from '../http-error-dialog/http-error-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private dialog : MatDialog) { }

  openConfirmDialog(msg)
  {
    return this.dialog.open(ConfirmDialogComponent, 
      {
         width :"390px",
        disableClose : true,
        panelClass: "confirm-dialog-container",
        data : {
          message : msg
        }
      }
    )
  }

  openHttpErrorDialog(errorMessage, errorCode)
  {
    return this.dialog.open(HttpErrorDialogComponent, 
      {
         width :"460px",
        disableClose : true,
        panelClass: "http-error-dialog-container",
        data : {errorMessage: errorMessage, errorCode: errorCode}
      }
    )
  }

}
