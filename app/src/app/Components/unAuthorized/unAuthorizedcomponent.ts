import { TokenResponse } from '@openid/appauth';
import { AuthorizationService } from './../../authorization.service';
import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../../app.component';
import { ApiService } from 'src/app/Services/api.service';

@Component({
    selector: 'unauthorized',
    templateUrl: 'unAuthorizedcomponent.html',
    styleUrls: ['./unAuthorizedcomponent.css'],
})

export class UnAuthorizedComponent implements OnInit {

    constructor(public authorizationService: AuthorizationService,  private appComp: AppComponent, private apiService: ApiService) {

        this.appComp.hide();
        this.apiService.showheader();
        this.appComp.toggleRightSidenav();
        this.appComp.searchback();
        localStorage.setItem("ShowGlobalHeader", 'false');

        let selectedCompareItemsList = [];
        localStorage.setItem("SelectedCompareItemsList", JSON.stringify(selectedCompareItemsList));

        this.appComp.hideUserInfo = false;

        let userDetails = JSON.parse(localStorage.getItem('UserDetails'));
        console.log("ngOnInit localStorage userDetails", userDetails);

        this.appComp.amatUserName = userDetails.name;
    }

    ngOnInit() {
        
    }
}