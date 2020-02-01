import { Component, OnInit } from '@angular/core';
import { BreadcrumbsService, IBreadcrumb } from 'ng6-breadcrumbs';
import { UserService } from '../shared/user.service';
import { AuthorizationService } from '../shared/authServices/authorization.service';
import { TokenResponse } from '@openid/appauth';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-base-container',
  templateUrl: './base-container.component.html',
  styleUrls: ['./base-container.component.css']
})
export class BaseContainerComponent implements OnInit {

  constructor(public breadcrumbService : BreadcrumbsService, public userService : UserService, public authorizationService: AuthorizationService,
    private router: Router, private route: ActivatedRoute) { }

  private sub: any;

  breadcrumbs : IBreadcrumb[];

  ngOnInit() {

    this.sub = this.breadcrumbService.breadcrumbsChanged$.subscribe(crumbs => {
      
      this.breadcrumbs = crumbs.filter(crumb => {
        let label =  crumb.label.toLowerCase();
        return label != 'admin' && label != 'mappings';
      });
      //console.log('breadcrumbs: ', JSON.stringify(this.breadcrumbs) );
     
    },
    error => {
     // console.log('breadcrumbs ERROR');
    });


    this.authorizationService.tokenResponse().subscribe((tokenResponse: TokenResponse) => {

      if(tokenResponse != null) {
        this.userService.loadCurrentUserInfo().subscribe(user => {
          console.log("curent user ", user);
        });

      } else {

      }
  });
    
    
  }

  showExitDialog()
  {
    // this.authorizationService.signOut();
    // this.authorizationService.authorize();
  }

  logout() {

    this.router.navigate(['/login'], { relativeTo: this.route });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
