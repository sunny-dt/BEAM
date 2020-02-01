import { ApiService } from './../../Services/api.service';

import { Component, OnInit, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AppComponent } from 'src/app/app.component';

@Component({

  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class LoginComponent implements OnInit {

  title = 'Applied Materials';

  userName: string = "";
  password: string = "";
  disableLoginButton: boolean = true;
  showLoginErrorMessage: boolean = false;
  labelError: boolean = false;
  submitted: boolean = false;
  loginErrorMessage = "Your login information is incorrect. Please try again.";

  constructor(private apiService: ApiService, private router: Router, private route: ActivatedRoute, private appComp: AppComponent) {

    this.appComp.hide();
    this.apiService.showheader();
    this.appComp.toggleRightSidenav();
    this.appComp.searchback();
    localStorage.setItem("ShowGlobalHeader", 'false');

    let selectedCompareItemsList = [];
    localStorage.setItem("SelectedCompareItemsList", JSON.stringify(selectedCompareItemsList));
    
    this.appComp.hideUserInfo = true;
  }

  ngOnInit() {

    localStorage.setItem("isUserLogin", "false");
    let dummy = [];
    localStorage.setItem('UserDetails', JSON.stringify(dummy));
    localStorage.setItem('UserToken', "");
  }

  onKeyUp(event: any) {

    console.log("onKeyUp userName: ", this.userName);
    console.log("onKeyUp password: ", this.password);

    if (this.userName && this.password) {

      console.log('SuccessCase');

      this.disableLoginButton = false;
      this.showLoginErrorMessage = false;
      this.labelError = false;
      this.submitted = false;
    } else {

      console.log('FailureCase');

      this.disableLoginButton = true;     
    }
  }
  onFocus() {

    this.showLoginErrorMessage = false;
    this.labelError = false;
    this.submitted = false;
  }

  login(): void {

    console.log("login userName: ", this.userName);
    console.log("login password: ", this.password);

    // if (this.userName === 'amat@digitaltaas.com' && this.password === 'Amat@1234') {

    //   this.router.navigate(['/launch']);

    //   console.log('login Success');

    //   this.disableLoginButton = false;
    //   this.showLoginErrorMessage = false;

    //   localStorage.setItem("isUserLogin", "true");
    // } else {

    //   console.log('login Failure');

    //   this.disableLoginButton = true;
    //   this.showLoginErrorMessage = true;
    //   this.labelError = true;
    //   this.submitted = true;

    //   localStorage.setItem("isUserLogin", "false");
    // }

    let dummy = [];
    localStorage.setItem("isUserLogin", "false");
    localStorage.setItem('UserDetails', JSON.stringify(dummy));
    localStorage.setItem('UserToken', "");

    this.apiService.getUserRoles(this.userName, this.password).subscribe(response => {
          
      console.log("apiService getUserRoles ", response);
      let userResponse = JSON.parse(JSON.stringify(response));
      console.log("apiService getUserRoles userResponse: ", userResponse);
      console.log("apiService getUserRoles userResponse token: ", userResponse.token);

      if (userResponse.response == "success") {

        console.log('login Success');

        this.disableLoginButton = false;
        this.showLoginErrorMessage = false;

        localStorage.setItem("isUserLogin", "true");
        localStorage.setItem("UserToken", userResponse.token);

        // this.appComp.amatUserName = userResponse.name;

        this.router.navigate(['/launch']);
      } else {

        console.log('login Failure');

        this.disableLoginButton = true;
        this.showLoginErrorMessage = true;
        this.labelError = true;
        this.submitted = true;

        this.loginErrorMessage = userResponse.message;

        localStorage.setItem("isUserLogin", "false");
        let dummy = [];
        localStorage.setItem('UserDetails', JSON.stringify(dummy));
        localStorage.setItem('UserToken', "");
      }
    });
  }
}