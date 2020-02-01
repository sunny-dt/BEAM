import { Component, OnInit, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserRolesService } from '../shared/login.service';

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

  constructor(private router: Router, private route: ActivatedRoute, private userRolesService: UserRolesService) {

  }

  ngOnInit() {

    window.localStorage.setItem("isAdminUserLogin", "false");
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

    //   window.localStorage.setItem("isUserLogin", "true");
    // } else {

    //   console.log('login Failure');

    //   this.disableLoginButton = true;
    //   this.showLoginErrorMessage = true;
    //   this.labelError = true;
    //   this.submitted = true;

    //   window.localStorage.setItem("isUserLogin", "false");
    // }

    this.userRolesService.getUserRoles(this.userName, this.password).subscribe(response => {
          
      console.log("apiService getUserRoles ", response);
      let userResponse = JSON.parse(JSON.stringify(response));
      console.log("apiService getUserRoles userResponse: ", userResponse);
      console.log("apiService getUserRoles userResponse token: ", userResponse.token);

      if (userResponse.response == "success") {

        console.log('login Success');

        this.disableLoginButton = false;
        this.showLoginErrorMessage = false;

        localStorage.setItem("isAdminUserLogin", "true");
        localStorage.setItem("AdminUserToken", userResponse.token);

        // this.appComp.amatUserName = userResponse.name;

        this.router.navigate(['/launch']);
      } else {

        console.log('login Failure');

        this.disableLoginButton = true;
        this.showLoginErrorMessage = true;
        this.labelError = true;
        this.submitted = true;

        this.loginErrorMessage = userResponse.message;

        localStorage.setItem("isAdminUserLogin", "false");
        let dummy = [];
        localStorage.setItem('AdminUserDetails', JSON.stringify(dummy));
        localStorage.setItem('AdminUserToken', "");
      }
    });
  }
}