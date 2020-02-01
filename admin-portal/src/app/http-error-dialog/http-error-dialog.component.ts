import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-http-error-dialog',
  templateUrl: './http-error-dialog.component.html',
  styleUrls: []
})
export class HttpErrorDialogComponent implements OnInit {


  constructor(@Inject(MAT_DIALOG_DATA) public data : DialogData, private dialogRef :MatDialogRef<HttpErrorDialogComponent>) {}

  ngOnInit() {
  }

  ok()
  {
    this.dialogRef.close(this.data.errorCode || 0);
  }

}

export interface DialogData {
    errorMessage: string;
    errorCode: any;
  }