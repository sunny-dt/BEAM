import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MetadataAttrValueService } from 'src/app/shared/metadata-attr-value.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { MatDialogRef, MatIconRegistry, MatAutocomplete } from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';
import { UploadService } from 'src/app/shared/upload.service';
import { HttpEventType } from '@angular/common/http';
import { timeout } from 'rxjs/operators';
import { MetadataAttrValue } from 'src/app/shared/metadata-attr-value.model';
import { NodeTypeAttributeName } from 'src/app/shared/node-type-attribute-name.model';
import { NodeTypeAttributeNameService } from 'src/app/shared/node-type-attribute-name.service';
import { MenuNodeService } from 'src/app/shared/menu-node.service';


@Component({
  selector: 'app-metadata-attr-value-form',
  templateUrl: './metadata-attr-value-form.component.html',
  styleUrls: ['./metadata-attr-value-form.component.css']
})
export class MetadataAttrValueFormComponent implements OnInit {


  attrNamesList : NodeTypeAttributeName[] = [];
  dropDownAttrNamesList: NodeTypeAttributeName[] = [];
  @ViewChild('attrnameauto') matAttrNameAutocomplete: MatAutocomplete;
  @ViewChild('attrNameInput') attrNameInput: ElementRef<HTMLInputElement>;

  count: number = 0;

  hideValueTwo = true;
  hideValueThree = true;
  hideAddValueOneButton = true;
  hidedecone = true;
  hideclearvalue2 = true;
  hideclearvalue3 = true;

  constructor(public service : MetadataAttrValueService,
    private attrNameService : NodeTypeAttributeNameService,
    private menuNodeService : MenuNodeService,
    private uploadService : UploadService,
    private notificationService : NotificationService,
    public dialogRef : MatDialogRef<MetadataAttrValueFormComponent>) { }
    public saveAndAddNewTapped = false;
  
  
  ngOnInit() {

    this.loadAttributeNames();

  }

  loadAttributeNames()
  {
    
     this.attrNameService.getNodeTypeAttributeNamesByNodeTypeId( this.menuNodeService.currentSelectedNode.node_type_id,'', 'name', 'asc', 1, 50).subscribe(attrNames => {

       console.log('attrNames' , attrNames);
       this.attrNamesList = attrNames;
      
       for (var i = 0; i < this.attrNamesList.length; i++) {
        this.dropDownAttrNamesList.push(this.attrNamesList[i]);
      }

      if(this.service.form.valid) {

        console.log('loadAttributeNames value: ' , this.service.form.value);

        let value = this.service.form.value.value;
        console.log("onEdit - value : ", value);
        var splittedValue = value.split("||"); 
        console.log("onEdit - splittedValue : ", splittedValue);

        this.count = 0;

        if (splittedValue[1] == "") {

          this.hideValueTwo = true;
          this.hideclearvalue2 = true;

          this.service.form.value.value = splittedValue[0];

          this.service.populateForm(this.service.form.value, "", "", this.service.form.value.description, this.service.form.value.description2, this.service.form.value.description3);
        } else {

          if (splittedValue.length >= 2) {
            
            this.hideValueTwo = false;
            this.hideclearvalue2 = false;

            this.service.form.value.value = splittedValue[0];

            this.count = 1;
            
            this.service.populateForm(this.service.form.value, splittedValue[1], "", this.service.form.value.description, this.service.form.value.description2, this.service.form.value.description3);
          }
        }

        if (splittedValue[2] == "") {

          // hideValueTwo = true;
          this.hideValueThree = true;
          this.hideclearvalue3 = true;

          this.count = 1;

          this.service.populateForm(this.service.form.value, splittedValue[1], "", this.service.form.value.description, this.service.form.value.description2, this.service.form.value.description3);
        } else {

          if (splittedValue.length >= 3) {

            this.hideValueTwo = false;
            this.hideclearvalue2 = true;
            this.hideValueThree = false;
            this.hideclearvalue3 = false;

            this.count = 2;
            this.hideAddValueOneButton = true;

            this.service.form.value.value = splittedValue[0];
            
            console.log("populateForm - description3 : ", this.service.form.value.description3);
            
            this.service.populateForm(this.service.form.value, splittedValue[1], splittedValue[2], this.service.form.value.description, this.service.form.value.description2, this.service.form.value.description3);
          }
        }

      } else {
        this.service.populateForm(this.service.form.value, "", "", "", "", "");
      }
      
    });
  }


  getAttrName(value: any) {
    console.log('value', value);
    const results = this.attrNamesList.filter(attrName => attrName.id == value);
    if (results.length) {

      let attributeType = "";
      if (results[0].attr_type_name.length > 0) {

        attributeType = results[0].attr_type_name.charAt(0).toUpperCase()
      }

      if (attributeType == "C") {

        console.log('getAttrName count', this.count);

        if (this.count == 2) {

          this.hideAddValueOneButton = true;
        } else {
          
          this.hideAddValueOneButton = false;
        }
        
        this.hidedecone = false;
      } else {
        this.hideAddValueOneButton = true;
        this.hidedecone = true;

        this.count = 0;

        this.hideValueTwo = true;
        this.hideValueThree = true;
        this.hideAddValueOneButton = true;
        this.hideclearvalue2 = true;
        this.hideclearvalue3 = true;
      }

      return results[0].name;
    }
    else
        return '';
    
  }

  
  onKeyPress(event:any){

    this.dropDownAttrNamesList = [];

    for (var i = 0; i < this.attrNamesList.length; i++) {

      if (this.attrNamesList[i].name.toLowerCase().startsWith(event.target.value.toLowerCase())) {
        
        this.dropDownAttrNamesList.push(this.attrNamesList[i]);
      
      }
    }
  }

  onClear()
  {
    this.service.form.reset();
  }

  onCancel()
  {
    if(this.saveAndAddNewTapped)
      this.onClose('created');
    else
      this.onClose(null);
  }

  onSubmit()
  {
    if(this.service.form.valid)
    {
        if(this.service.form.get('id').value)
        {
          this.service.updateMetadataAttrValue(this.service.form.value, this.count).subscribe(response => {

            console.log("Response - update metadata-attr-value-form : ", response);
            this.notificationService.success("Updated successfully");
            this.onClose('edited');
            
          }, error => {
    
            this.notificationService.failure(error.error);
          });
        }
        else
        {
          this.service.insertMetadataAttrValue(this.service.form.value, this.count).subscribe(response => {

            console.log("Response - add new metadata-attr-value-form : ", response);

            if (response == null) {

              this.notificationService.failure("You cant add duplicate values");
            } else {
              
              this.notificationService.success("Saved successfully");
              this.onClose('created');
            }
          }, error => {
    
            this.notificationService.failure(error.error);
          });
        }

     
    }
  }

  onSubmitnAddNew()
  {
    if(this.service.form.valid)
    {
      this.service.insertMetadataAttrValue(this.service.form.value, this.count).subscribe(response => {
        this.saveAndAddNewTapped = true;
        console.log("Response - add new metadata-attr-value-form : ", response);
        this.notificationService.success("Saved successfully");
        this.service.form.reset();
        
        this.hideAddValueOneButton = true;
        this.hidedecone = true;

        this.count = 0;

        this.hideValueTwo = true;
        this.hideValueThree = true;
        this.hideAddValueOneButton = true;
        this.hideclearvalue2 = true;
        this.hideclearvalue3 = true;

        this.service.populateForm(this.service.form.value, "", "", "", "", "");
      }, error => {

        this.notificationService.failure(error.error);
      });
    }
  }

  onClose(data)
  {
    this.service.form.reset();
    this.service.initializeFormGroup();
    this.dialogRef.close(data);
  }


  onOneValueClick() {

    console.log('count', this.count);
    this.count++
    console.log('count2', this.count);

    if (this.count === 1){
      console.log('count 1 true', this.count);
      this.hideValueTwo = false;
      this.hideValueThree = true;
      this.hideAddValueOneButton = false;
      this.hideclearvalue2 = false;
      this.hideclearvalue3 = true;
    }else{
      if(this.count === 2){
        console.log('count 2 true', this.count);
        this.hideValueTwo = false;
        this.hideValueThree = false;
        this.hideAddValueOneButton = true;
        this.hideclearvalue2 = true;
        this.hideclearvalue3 = false;
      }
      this.hideAddValueOneButton = true;
      // console.log('count 0 false', this.count);
      // this.hideValueTwo = true;
      // this.hideValueThree = true;
    }
    
  }

  valueDecriment() {
    console.log('count', this.count);
    this.count--
    console.log('count2', this.count);
    if (this.count === 0){
      this.hideValueTwo = true;
      this.hideAddValueOneButton = false;
      this.hideclearvalue2 = true;
      this.hideclearvalue3 = true;

      this.service.populateForm(this.service.form.value, "", "", this.service.form.value.description, "", "");
    }
    if (this.count === 1){
      console.log('count 1 true', this.count);
      this.hideValueTwo = false;
      this.hideValueThree = true;
      this.hideAddValueOneButton = false;
      this.hideclearvalue2 = false;
      this.hideclearvalue3 = true;

      this.service.populateForm(this.service.form.value, this.service.form.value.value2, "", this.service.form.value.description, this.service.form.value.description2, "");
    }else{
      if(this.count === 2){
        console.log('count 2 true', this.count);
        this.hideValueTwo = false;
        this.hideValueThree = false;
        this.hideAddValueOneButton = true;
        this.hideclearvalue2 = true;
        this.hideclearvalue3 = true;
      }
      console.log('count 0 false', this.count);
      this.hideAddValueOneButton = false;
      // this.hideValueTwo = true;
      // this.hideValueThree = true;
    }
  }

}
