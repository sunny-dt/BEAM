import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ApiService } from 'src/app/Services/api.service';
import { AppComponent } from 'src/app/app.component';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  
  selector: 'app-builder-home-page',
  templateUrl: './builder-home-page.component.html',
  styleUrls: ['./builder-home-page.component.css'],
})

export class BuilderHomePageComponent implements OnInit {

  selectCustomerList:any = [];

  selectCustomerPosition;

  builderCustomerIDForm: FormGroup;

  customerName;
  customerID;
  searcCustomerDropDownList:any = [];
  custSubmitButtonEnable = false;

  @ViewChild('customerInput') private _enterCustomerID: ElementRef;

  constructor(public apiService:ApiService, private router: Router, private route: ActivatedRoute, private appComp: AppComponent, private formBuilder: FormBuilder) {

    this.appComp.hide();
    this.apiService.showheader();
    this.appComp.toggleRightSidenav();
  }

  ngOnInit() {
    
    // this.appComp.hide();
    let showGlobalHeader = localStorage.getItem('ShowGlobalHeader');
    console.log("ngOnInit ShowGlobalHeader ", showGlobalHeader);
    
    if (showGlobalHeader == "true") {

      this.appComp.search();
      localStorage.setItem("ShowGlobalHeader", "false");
    } else {

      this.appComp.searchback();
    }

    this.builderCustomerIDForm = this.formBuilder.group({
      builderCustomerIDFormControl: [null, [Validators.required]],
    });

    this.apiService.getMasterCustomers(0, 999999, 'name', 'asc', '').subscribe(response => {

     this.selectCustomerList = JSON.parse(JSON.stringify(response));
      console.log("Response -getMasterCustomers ", this.selectCustomerList);

      this.searcCustomerDropDownList = this.selectCustomerList.items;

      this._enterCustomerID.nativeElement.focus();
    }, error => {

    });
  }

  fetchCustomer() {

    if (this.selectCustomerList.length > 0) {

    } else {

      this.getCustomers();
    }
  }

  getCustomers() {
    
    this.selectCustomerList = JSON.parse(JSON.stringify(this.selectCustomerList));
  }
 
  clearCustomerSearch() {

    this.builderCustomerIDForm.reset();
    this.custSubmitButtonEnable = false;
    this.searcCustomerDropDownList = this.selectCustomerList.items;
  }

  onCustomerSearchKeyUp(event: any) {
    
    console.log('onCustomerSearchKeyUp event value ', event.target.value);
    this.custSubmitButtonEnable = false;
    this.searcCustomerDropDownList = this.filterKeyPressedValue(event.target.value, this.selectCustomerList.items);
  }

  searchCustomerClick(customer) {

    this.customerName = customer.name;

    localStorage.setItem('selectedCustomerid', customer.id);
    localStorage.setItem('selectedCustomerName', customer.name);

    this.custSubmitButtonEnable = true;
  }
  
  filterKeyPressedValue(searchValue, customerList) {
    
    var msearchSystemIDDropDownList: any[] = [];

    for (var i = 0; i < customerList.length; i++) {
    
      if (customerList[i].name.toLowerCase().includes(searchValue.toLowerCase())) {

        msearchSystemIDDropDownList.push(customerList[i]);
        console.log('msearchSystemIDDropDownList1:', msearchSystemIDDropDownList);
      }
    }

    console.log('msearchSystemIDDropDownList return:', msearchSystemIDDropDownList);
    return msearchSystemIDDropDownList;
  }

  onCustomerListChange(event, index) {}

  backButton() {

    this.router.navigate(['/launch']);
  }
  
  next() {

    this.router.navigate(['configuration'], { relativeTo: this.route });
  }

  selectCustomeridclick(type) {
    
    // localStorage.setItem('selectedCustomerid', type.id);
    // localStorage.setItem('selectedCustomerName', type.name);
    console.log('localstorege selectedCustomerid', localStorage.getItem('selectedCustomerid'));
    }
}