import { ApiService } from './../../Services/api.service';
import { TokenResponse } from '@openid/appauth';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatAutocomplete, MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthorizationService } from '../../authorization.service';
import { AppComponent } from '../../app.component';
import { StorageService } from 'src/app/Storage.service';

@Component({
  
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  // encapsulation: ViewEncapsulation.None
})

export class DashboardComponent implements OnInit {

  currentUserInfo:any= {}
  currentUser;
  showExitButton: boolean = false;
  constructor(public dialog: MatDialog,public authorizationService: AuthorizationService,
  public apiService:ApiService, private appComp: AppComponent) {

    this.apiService.hideHeader();
  }

  ngOnInit() {
    
    this.appComp.hide();
    this.appComp.toggleRightSidenav();

    this.authorizationService.tokenResponse().subscribe((tokenResponse: TokenResponse) => {
        if(tokenResponse != null) {
          this.apiService.getUserInfo().subscribe((userInfo => {
            this.currentUserInfo  = userInfo;
            this.currentUser = this.currentUserInfo.logonUser
          }));
        } else {}
    });

  }

  ngDoCheck() {

    if (localStorage.getItem('ExitButtonVisibility') == 'true') {

      this.showExitButton = true;
    } else {

      this.showExitButton = false;
    }
  }

  showExitDialog() {

    const dialogRef = this.dialog.open(ExitDialog, {
      width: '350px',
      height: '170px',
    });
    dialogRef.afterClosed().subscribe(result => {

    });
  }
}

@Component({

  selector: 'exit-dialog',
  templateUrl: 'exit_dialog.html',
})

export class ExitDialog {


  constructor(public dialogRef: MatDialogRef<ExitDialog>, private router: Router, private route: ActivatedRoute, private storageService: StorageService) { }

  dialogCancel(): void {

    this.dialogRef.close();
  }

  dialogExit() {

    this.dialogRef.close();
    
    let localStorageItems = ["SelectedOPID", "SelectedPlatform", "SelectedChambersList"]
    this.storageService.removeLocalStorageByItems(localStorageItems);

    this.router.navigate(['/g3mapper']);
  }
}