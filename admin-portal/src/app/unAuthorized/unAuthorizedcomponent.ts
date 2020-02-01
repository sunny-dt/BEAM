import { TokenResponse } from '@openid/appauth';
import { AuthorizationService } from './../shared/authServices/authorization.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'unauthorized',
    templateUrl: 'unAuthorizedcomponent.html',
    styleUrls: ['./unAuthorizedcomponent.css'],
})

export class UnAuthorizedComponent implements OnInit {

    userDetails;
    
    constructor(public authorizationService: AuthorizationService, private router: Router, private route: ActivatedRoute) {

        this.userDetails = JSON.parse(localStorage.getItem('AdminUserDetails'));
        console.log("ngOnInit localStorage userDetails", this.userDetails);
    }

    ngOnInit() {

    }

    logout() {

        this.router.navigate(['/login'], { relativeTo: this.route });
    }
}
