import { FormControl } from '@angular/forms';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { Component, OnInit, ElementRef, ViewChild, Inject } from '@angular/core';
import { MatAutocompleteSelectedEvent, MatChipInputEvent, MatAutocomplete, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Observable } from 'rxjs';
import { ProductConfigMappingService } from 'src/app/shared/product-config-mapping.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { ProductConfigService } from 'src/app/shared/product-config.service';

@Component({
  selector: 'app-product-config-mapping',
  templateUrl: './product-config-mapping.component.html',
  styleUrls: ['./product-config-mapping.component.css']
})
export class ProductConfigMappingComponent implements OnInit {

  facetPartitionArray:any[] = [];
  selectedfacetsList: any[] = [];
  facetsList: any[] = [];
  dropDownfacetsList: any[] = [];

  showSelectedfacetsClearButton: boolean = false;
  facetselectable = true;
  public term;
  removable = true;
  addOnBlur = true;
  facetFormControl = new FormControl();


  selectedchambersList: any[] = [];
  chambersList: any[] = [];
  dropDownchambersList: any[] = [];

  showSelectedchambersClearButton: boolean = false;
  chamberselectable = true;
  chamberFormControl = new FormControl();

  separatorKeysCodes: number[] = [ENTER, COMMA];

  @ViewChild('facetInput') facetInput: ElementRef<HTMLInputElement>;
  @ViewChild('facetauto') matfacetAutocomplete: MatAutocomplete;

  @ViewChild('chamberInput') chamberInput: ElementRef<HTMLInputElement>;
   @ViewChild('chamberauto') matchamberAutocomplete: MatAutocomplete;

  constructor( @Inject(MAT_DIALOG_DATA) public data: any, 
  public service : ProductConfigMappingService,
   public productConfigService : ProductConfigService,
    private notificationService : NotificationService,
    public dialogRef : MatDialogRef<ProductConfigMappingComponent>) {
  

this.facetsList = [];
this.chambersList = [];


  }

  ngOnInit(){

    console.log('passed product-config-id',this.data);

    this.productConfigService.getFacetsByProductConfigId(this.data.productConfigId)
    .subscribe(facets => {
      this.facetsList = facets;

    });

    this.productConfigService.getChambersByProductConfigId(this.data.productConfigId)
    .subscribe(chambers => {
      this.chambersList = chambers;
    });

    
    // this.chamberService.getChambers('','asc', 'id', 1, 1000)
    // .subscribe(chambers => {
    //   this.chambersList = chambers;
    // });

    
  }


  facetsRemove(facet: string): void {

    const index = this.selectedfacetsList.indexOf(facet);

    this.selectedfacetsList.splice(index, 1);
    this.facetsList.push(facet);
    console.log("selectedfacetsList",this.selectedfacetsList);
    if(this.selectedfacetsList.length > 0) {

      this.showSelectedfacetsClearButton = true;
    } else {

      this.showSelectedfacetsClearButton = false;
    }

}



facetsOnClick(facet) {

    console.log('facetsOnClick', facet);
    this.selectedfacetsList.push(facet);
    // console.log('facetsOnClick--i', i);
    const index = this.facetsList.indexOf(facet);

    this.facetsList.splice(index, 1);


    console.log("selectedfacetsList",this.selectedfacetsList);
    
    if(this.selectedfacetsList.length > 0) {

      this.showSelectedfacetsClearButton = true;
    } else {

      this.showSelectedfacetsClearButton = false;
    }

}


facetOptionSelected(event){


  this.selectedfacetsList.push(event.option.value);

  if(this.selectedfacetsList.length > 0) {

    this.showSelectedfacetsClearButton = true;
  } else {

    this.showSelectedfacetsClearButton = false;
  }

    this.dropDownfacetsList = [];
    this.facetInput.nativeElement.value = '';
    this.facetFormControl.setValue(null);

}

clearAllSelectedfacets(){

  for(var i = 0; i < this.selectedfacetsList.length; i++) {

    this.facetsList.push(this.selectedfacetsList[i]);
  }

// this.facetsList = this.facetsList;

  this.selectedfacetsList = [];
  if(this.selectedfacetsList.length > 0) {

    this.showSelectedfacetsClearButton = true;
    
  } else {

    this.showSelectedfacetsClearButton = false;
  }
  console.log("clearAllSelectedfacets",this.selectedfacetsList);
}


onKeyPress(event:any){

    this.dropDownfacetsList = [];

  for (var i = 0; i < this.facetsList.length; i++) {

    if (this.facetsList[i].name.toLowerCase().includes(event.target.value.toLowerCase())) {
      
      this.dropDownfacetsList.push(this.facetsList[i]);
     
    }
  }
}


// chambers


chambersRemove(chamber: string): void {

  const index = this.selectedchambersList.indexOf(chamber);

  this.chambersList.push(this.selectedchambersList[index]);

  this.selectedchambersList.splice(index, 1);
  console.log("selectedchambersList",this.selectedchambersList);
  if(this.selectedchambersList.length > 0) {

    this.showSelectedchambersClearButton = true;
  } else {

    this.showSelectedchambersClearButton = false;
  }

}



chambersOnClick(chamber) {

  console.log('chambersOnClick', chamber);
  this.selectedchambersList.push(chamber);

  const index = this.chambersList.indexOf(chamber);

  this.chambersList.splice(index, 1);

  console.log("selectedchambersList",this.selectedchambersList);
  
  if(this.selectedchambersList.length > 0) {

    this.showSelectedchambersClearButton = true;
  } else {

    this.showSelectedchambersClearButton = false;
  }

}


chamberOptionSelected(event){

  console.log("selectedchambersList",this.selectedchambersList);

  this.selectedchambersList.push(event.option.value);

  if(this.selectedchambersList.length > 0) {

    this.showSelectedchambersClearButton = true;
  } else {

    this.showSelectedchambersClearButton = false;
  }

  this.dropDownchambersList = [];
  this.chamberInput.nativeElement.value = '';
  this.chamberFormControl.setValue(null);

}

clearAllSelectedchambers(){

for(var i = 0; i < this.selectedchambersList.length; i++) {

  this.chambersList.push(this.selectedchambersList[i]);
}

this.selectedchambersList = [];
if(this.selectedchambersList.length > 0) {

  this.showSelectedchambersClearButton = true;
} else {

  this.showSelectedchambersClearButton = false;
}
console.log("clearAllSelectedchambers",this.selectedchambersList);
}


onChambersKeyPress(event:any){

  this.dropDownchambersList = [];

for (var i = 0; i < this.chambersList.length; i++) {

  if (this.chambersList[i].name.toLowerCase().includes(event.target.value.toLowerCase()) || this.chambersList[i].got_code.toLowerCase().includes(event.target.value.toLowerCase())) {
    
    this.dropDownchambersList.push(this.chambersList[i]);
  }
}
}

onSave()
{
    if(this.selectedfacetsList.length <= 0)
    {
      this.notificationService.failure("selected facets list can't be empty");
      return;
    }
    if(this.selectedchambersList.length <= 0)
    {
      this.notificationService.failure("selected chambers list can't be empty");
      return;
    }
    let facetsChambersGrouping = {facetIds : this.selectedfacetsList.map(f => f.id), chamberIds : this.selectedchambersList.map(ch => ch.id)};
    this.service.addNewProductConfigMapping(facetsChambersGrouping)
    .subscribe(res => {

      this.onClose("created");
      this.notificationService.success('added successfully');
    },
    error => {

      this.notificationService.failure(error.error);
    });
}

onClose(data)
  {
    this.service.form.reset();
    this.service.initializeFormGroup();
    this.dialogRef.close(data);
  }

}
