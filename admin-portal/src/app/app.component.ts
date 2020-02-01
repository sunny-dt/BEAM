import { Component, OnInit } from '@angular/core';
import { UserInfo } from './shared/authServices/userinfo';
import { AuthorizationService } from './shared/authServices/authorization.service';
import { TokenResponse } from '@openid/appauth';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'amat-backend-app';


  public userInfo: UserInfo | null;
  public authorized: boolean;

  constructor(public authorizationService: AuthorizationService) {

  }

  ngOnInit() {

    // this.authorizationService.tokenResponse().subscribe((tokenResponse: TokenResponse) => {
    //   console.log("tokenResponse",tokenResponse);
        

    // });
  }
  

}
