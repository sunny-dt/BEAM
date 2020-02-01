import { AuthorizationService } from './../shared/authServices/authorization.service';

// Copyright 2018 Ping Identity
//
// Licensed under the MIT License (the "License"); you may not use this file
// except in compliance with the License.
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
// WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { Component, OnInit } from '@angular/core';
import { RedirectRequestHandler } from '@openid/appauth';
import { Router } from '@angular/router';
import { DialogService } from '../shared/dialog.service';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: []
})

export class CallbackComponent implements OnInit {

  constructor(public authorizationService: AuthorizationService, private dialogService : DialogService, public router: Router) { }

  ngOnInit() {

    if( document.readyState !== 'loading' ) {
        console.log( 'document is already ready, just execute code here' );
        this.handleCallback();
    } else {
        document.addEventListener('DOMContentLoaded', this.handleCallback.bind(this));
    }
  
  }

  handleCallback()
  {
    if (!window.location.hash || window.location.hash.length === 0) {
      const queryString = window.location.search.substring(1); // substring strips '?'
      const path = [window.location.pathname, queryString].join('#');
      const newUrl = new URL(path, window.location.href).toString();
      
      window.location.assign(newUrl);

      

    } else if (new URLSearchParams(window.location.hash).has('#code')) {

      this.authorizationService.completeAuthorizationRequest().then((tokenResponse) => {
        this.router.navigate(['/'])
      }).catch((error) => {

        this.dialogService.openHttpErrorDialog(error, 500).afterClosed().subscribe(code => {
            //console.log('dialog response ', code);
        });
      });
    } else {
      this.router.navigate(['/'])
      
    }
  }
}
