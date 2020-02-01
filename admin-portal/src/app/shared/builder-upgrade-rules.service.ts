import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { HomeLatest } from './home-latest.model';
import { map } from 'rxjs/operators';
import { HttpParams, HttpClient } from '@angular/common/http';
import { Constants } from './constants';
import { EnvService } from '../env.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class BuilderUpgradeRulesService {

  constructor(private httpClient: HttpClient, private env : EnvService) {

    //this.serviceApiUrl = this.env.apiUrl + Constants.PLATFORM_ENDPOINT;
    this.serviceApiUrl = environment.apiUrl + Constants.BUILDERS_ENDPOINT;
   }

  public totalCount = 0;
  public defaultPageSize = Constants.DEFAULT_PAGE_SIZE;
  private serviceApiUrl; 

  public form : FormGroup = new FormGroup({
    id : new FormControl(null),
    product_name : new FormControl('', Validators.required),
    chamber_family_name : new FormControl('', Validators.required),
    chamber_names : new FormControl('', Validators.required),
  });

  initializeFormGroup()
  {
    this.form.setValue({
      id : null,
      product_name : '',
      chamber_family_name : '',
      chamber_names : ''
    });
  }

  getBuilderPlatforms() {

    console.log("ApiService getBuilderPlatforms");

    return this.httpClient.get(`${this.serviceApiUrl}/getBuilderPlatforms`, { headers: Constants.HTTP_HEADERS });
  }

  getBuilderChamberFamilies(platformID) {

    console.log("ApiService getBuilderChamberFamilies");

    return this.httpClient.get(`${this.serviceApiUrl}/getBuilderChamberFamiliesForPlatform?platformId=${platformID}`, { headers: Constants.HTTP_HEADERS });
  }

  getBuilderChambersByFamilyID(chamberFamilyID) {

    console.log("ApiService getBuilderChamberFamilies");

    return this.httpClient.get(`${this.serviceApiUrl}/${chamberFamilyID}/children`, { headers: Constants.HTTP_HEADERS });
  }

  getAllUpgradeChamberRules() {

    console.log("ApiService getBuilderChamberFamilies");
    return this.httpClient.get(`${this.serviceApiUrl}/getAllUpgradeChamberRules`, { headers: Constants.HTTP_HEADERS });
  }

  getUpgradeChamberRulesByChamberFamilyID(chamberFamilyID) {

    console.log("ApiService getUpgradeChamberRulesByChamberFamilyID");
    return this.httpClient.get(`${this.serviceApiUrl}/getUpgradeChamberRules?chamberfamilyid=${chamberFamilyID}`, { headers: Constants.HTTP_HEADERS });
  }

  addUpgradeChamberRules(chamber_family_id, chamber_ids, platform_family_id) {

    console.log("ApiService addUpgradeChamberRules");
    const bodyParams = {
      'chamber_family_id': chamber_family_id,
      'chamber_ids' : chamber_ids,
      'platform_family_id' : platform_family_id
    };

    console.log("ApiService addNewHomeLatest bodyParams: " + JSON.stringify(bodyParams));
    let addUpgradeChamberRulesURL = `${this.serviceApiUrl}/addUpgradeChamberRules`;

    return this.httpClient.post(addUpgradeChamberRulesURL, bodyParams, { headers: Constants.HTTP_HEADERS });
  }

  updateUpgradeChamberRules(chamber_family_id, chamber_ids, platform_family_id, rule_id) {

    console.log("ApiService addUpgradeChamberRules");
    const bodyParams = {
      'rule_id': rule_id,
      'chamber_family_id' : chamber_family_id,
      'chamber_ids' : chamber_ids
    };

    console.log("ApiService addNewHomeLatest bodyParams: " + JSON.stringify(bodyParams));
    let addUpgradeChamberRulesURL = `${this.serviceApiUrl}/updateUpgradeChamberRules`;

    return this.httpClient.post(addUpgradeChamberRulesURL, bodyParams, { headers: Constants.HTTP_HEADERS });
  }

  deleteUpgradeChamberRules(ruleID) {

    console.log("ApiService deleteUpgradeChamberRules");
    return this.httpClient.get(`${this.serviceApiUrl}/deleteUpgradeChamberRules?ruleid=${ruleID}`, { headers: Constants.HTTP_HEADERS });
  }
}