import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MenuNodeService } from 'src/app/shared/menu-node.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { MatDialogRef, MatIconRegistry, MatAutocomplete } from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';
import { UploadService } from 'src/app/shared/upload.service';
import { HttpEventType } from '@angular/common/http';
import { timeout } from 'rxjs/operators';
import { MessageService } from 'src/app/shared/global-message.service';
import { Constants } from 'src/app/shared/constants';
import { MenuNodeTypeService } from 'src/app/shared/menu-node-type.service';
import { MenuNodeType } from 'src/app/shared/menu-node-type.model';
import { FormControl } from '@angular/forms';
import { PlatformService } from 'src/app/shared/platform.service';
import { ChamberService } from 'src/app/shared/chamber.service';
import { G2ProductService } from 'src/app/shared/g2-product.service';
import { G3ProductService } from 'src/app/shared/g3-product.service';


@Component({
  selector: 'app-child-node-form',
  templateUrl: './child-node-form.component.html',
  styleUrls: ['./child-node-form.component.css']
})
export class ChildNodeFormComponent implements OnInit {




  // linkableElementTypes = [{name : 'product'}, {name : 'chamber'}];
  // linkableElements  = {products : [{id : 1, name : 'Cubs PVD'}, {id : 2, name : 'Cubs CVD'}],
  //                           chambers : [{id : 1, name : 'Access2 Cu'}, {id : 2, name : 'Cu Ni Chamber'}]};

  // currentLinkableElements : any[] = [];

  // selectedLinkableElementType : any = null;
  // selectedLinkableElement : any = null;


  // disableLinkableElementSelection = true;

  nodeTypesList : MenuNodeType[] = [];
  dropDownNodeTypesList: MenuNodeType[] = [];
  @ViewChild('nodetypeauto') matNodeAutocomplete: MatAutocomplete;
  @ViewChild('nodetypeInput') nodeTypeInput: ElementRef<HTMLInputElement>;
  @ViewChild('g3MapperPlatformInput') g3MapperPlatformInput: ElementRef<HTMLInputElement>;
  @ViewChild('g3MapperInputOne') g3MapperInputOne: ElementRef<HTMLInputElement>;
  @ViewChild('g3MapperInputTwo') g3MapperInputTwo: ElementRef<HTMLInputElement>;
  @ViewChild('g3_mapper_auto_one') matG3MapperAutocompleteOne: MatAutocomplete;
  @ViewChild('g3_mapper_auto_two') matG3MapperAutocompleteTwo: MatAutocomplete;

  g3MapperPlatformList : any = [];
  dropDownG3MapperPlatformList: any = [];

  g3MapperList : any = [];
  dropDownG3MapperList: any = [];

  g3MapperListTwo : any = [];
  dropDownG3MapperListTwo: any = [];

  hideG3MapperPlatfromFormField = true;
  hideG3MapperFormFieldOne = true;
  hideG3MapperFormFieldTwo = true;

  g3mapperType = "";
  nodeTypeName = "";
  g3MapperId = 0;

  explorerPlatformResponse;

  g3MapperFormFileLabelPlatform = "";
  g3MapperFormFileLabelOne = "";
  g3MapperFormFileLabelTwo = "";

  constructor(public service : MenuNodeService, 
    private menuNodeTypeService : MenuNodeTypeService,
    private notificationService : NotificationService,
    private messageService : MessageService,
    public dialogRef : MatDialogRef<ChildNodeFormComponent>,
    public platformService : PlatformService,
    public chamberService : ChamberService,
    public G2ProductService : G2ProductService,
    public g3ProductService : G3ProductService) { }
    public saveAndAddNewTapped = false;
  
  
  ngOnInit() {
    
    this.loadMenuNodeTypes();

    console.log("ngOnInit service id: ", this.service.form.get('id').value);
    if(this.service.form.get('id').value) {

      this.service.getMapperPlatformByNodeID(this.service.form.get('id').value).subscribe(response => {

        console.log("menuNodeTypeService getMapperPlatformByNodeID response: ", response);
        this.explorerPlatformResponse = response;

        this.platformService.getPlatforms('', 'name', 'asc', 1, 50).subscribe(platforms => {

          this.g3MapperPlatformList = platforms;
          console.log("getNodeTypeName getPlatforms g3MapperPlatformList: ", this.g3MapperPlatformList);
  
          for (var i = 0; i < this.g3MapperPlatformList.length; i++) {
              this.dropDownG3MapperPlatformList.push(this.g3MapperPlatformList[i]);
          }

          if (this.explorerPlatformResponse[0].node_type_name == "PLATFORM") {

            this.chamberService.platformId = this.explorerPlatformResponse[0].platform_id;
            this.chamberService.getChambers('', 'name', 'asc', 1, 1000).subscribe(chambers => {

              this.g3MapperList = chambers;
              console.log("getNodeTypeName getChambers g3MapperList: ", this.g3MapperList);

              for (var i = 0; i < this.g3MapperList.length; i++) {
                this.dropDownG3MapperList.push(this.g3MapperList[i]);
              }
            });

            console.log("menuNodeTypeService getMapperPlatformByNodeID platform_id: ", this.explorerPlatformResponse[0].platform_id);
            this.service.populateForm(this.service.form.value, this.explorerPlatformResponse[0].platform_name, this.explorerPlatformResponse[0].mapper_name, "");
          } else if (this.explorerPlatformResponse[0].node_type_name == "PRODUCT") {

            this.G2ProductService.platformId = this.explorerPlatformResponse[0].platform_id;
            this.G2ProductService.getG2Products('', 'name', 'asc', 1, 1000).subscribe(g2Products => {

              this.g3MapperList = g2Products;
              console.log("getNodeTypeName getG2Products g3MapperList: ", this.g3MapperList);

              for (var i = 0; i < this.g3MapperList.length; i++) {
                this.dropDownG3MapperList.push(this.g3MapperList[i]);
              }

              this.g3ProductService.g2ProductTypeId = this.explorerPlatformResponse[0].product_family_id;
              this.g3ProductService.findG3Products('', 'name', 'asc', 1, 1000).subscribe(g3products => {

                this.g3MapperListTwo = g3products;
                console.log("g3ProductService findG3Products g3MapperListTwo: ", this.g3MapperListTwo);

                for (var i = 0; i < this.g3MapperListTwo.length; i++) {
                  this.dropDownG3MapperListTwo.push(this.g3MapperListTwo[i]);
                }
              });
            });

            console.log("menuNodeTypeService getMapperPlatformByNodeID platform_id: ", this.explorerPlatformResponse[0].platform_id);
            this.service.populateForm(this.service.form.value, this.explorerPlatformResponse[0].platform_name, this.explorerPlatformResponse[0].product_family_name, this.explorerPlatformResponse[0].product_name);
          } else {

            this.chamberService.platformId = this.explorerPlatformResponse[0].platform_id;
            this.chamberService.getChambers('', 'name', 'asc', 1, 1000).subscribe(chambers => {

              this.g3MapperList = chambers;
              console.log("getNodeTypeName getChambers g3MapperList: ", this.g3MapperList);

              for (var i = 0; i < this.g3MapperList.length; i++) {
                this.dropDownG3MapperList.push(this.g3MapperList[i]);
              }
            });

            console.log("menuNodeTypeService getMapperPlatformByNodeID platform_id: ", this.explorerPlatformResponse[0].platform_id);
            this.service.populateForm(this.service.form.value, this.explorerPlatformResponse[0].platform_name, this.explorerPlatformResponse[0].mapper_name, "");
          }
          
          this.hideG3MapperPlatfromFormField = false;
          this.hideG3MapperFormFieldOne = false;
          this.hideG3MapperFormFieldTwo = false;

          // console.log("menuNodeTypeService getMapperPlatformByNodeID platform_id: ", this.explorerPlatformResponse[0].platform_id);
          // this.service.populateForm(this.service.form.value, this.explorerPlatformResponse[0].platform_name, this.explorerPlatformResponse[0].mapper_name);
        });
      });
    }
  }

  ngOnViewInit(){

   
  }

  loadMenuNodeTypes()
  {
    
     this.menuNodeTypeService.findMenuNodeTypes('', 'name', 'asc', 1, 50).subscribe(menuNodeTypes => {

       this.nodeTypesList = menuNodeTypes;
      
       for (var i = 0; i < this.nodeTypesList.length; i++) {
          this.dropDownNodeTypesList.push(this.nodeTypesList[i]);
      
      }


      this.service.populateForm(this.service.form.value, "", "", "");

    });
  }

  

  onKeyPress(event:any){

    this.dropDownNodeTypesList = [];

    for (var i = 0; i < this.nodeTypesList.length; i++) {

      if (this.nodeTypesList[i].name.toLowerCase().includes(event.target.value.toLowerCase())) {
        
        this.dropDownNodeTypesList.push(this.nodeTypesList[i]);
      
      }
    }
  }

  onG3MapperKeyPress(event:any){

    this.dropDownG3MapperPlatformList = [];

    for (var i = 0; i < this.g3MapperPlatformList.length; i++) {

      if (this.g3MapperPlatformList[i].name.toLowerCase().includes(event.target.value.toLowerCase())) {
        
        this.dropDownG3MapperPlatformList.push(this.g3MapperPlatformList[i]);
      
      }
    }
  }

  onG3MapperFieldOneKeyPress(event:any){

    this.dropDownG3MapperList = [];

    for (var i = 0; i < this.g3MapperList.length; i++) {

      if (this.g3MapperList[i].name.toLowerCase().includes(event.target.value.toLowerCase())) {
        
        this.dropDownG3MapperList.push(this.g3MapperList[i]);
      
      }
    }
  }

  onG3MapperFieldTwoKeyPress(event:any){

    this.dropDownG3MapperListTwo = [];

    for (var i = 0; i < this.g3MapperListTwo.length; i++) {

      if (this.g3MapperListTwo[i].name.toLowerCase().includes(event.target.value.toLowerCase())) {
        
        this.dropDownG3MapperListTwo.push(this.g3MapperListTwo[i]);
      
      }
    }
  }

  getNodeTypeName(value: any) {

    console.log('getNodeTypeName', value);

    const results = this.nodeTypesList.filter(nodeType => nodeType.id == value);

    if (results.length) {

      console.log("getNodeTypeName: ", results[0].name);
      this.nodeTypeName = results[0].name;

      this.g3MapperPlatformInput.nativeElement.value = "";
      this.g3MapperInputOne.nativeElement.value = "";
      this.g3MapperInputTwo.nativeElement.value = "";

      if (this.nodeTypeName == "PLATFORM" || this.nodeTypeName == "CHAMBER" || this.nodeTypeName == "PRODUCT") {

        this.hideG3MapperPlatfromFormField = false;
        this.hideG3MapperFormFieldOne = true;
        this.hideG3MapperFormFieldTwo = true;

        if(this.service.form.get('id').value) {

          if (this.nodeTypeName == "PLATFORM" || this.nodeTypeName == "PRODUCT") {

            this.hideG3MapperFormFieldOne = true;

            if (this.nodeTypeName == "PRODUCT") {

              this.hideG3MapperFormFieldOne = false;
              this.hideG3MapperFormFieldTwo = false;
            } else {
  
              this.hideG3MapperFormFieldOne = true;
               this.hideG3MapperFormFieldTwo = true;
            }
          } else {

            if (this.nodeTypeName == "CHAMBER") {

              this.hideG3MapperFormFieldOne = false;
            } else {
              this.hideG3MapperFormFieldOne = true;
            }
          }
        } else {

          this.hideG3MapperFormFieldOne = true;
          this.hideG3MapperFormFieldTwo = true;
        }

        if (this.nodeTypeName == "PLATFORM") {

          this.g3MapperFormFileLabelPlatform = "Connect platform from G3Mapper";
          this.g3MapperFormFileLabelOne = "";
          this.g3MapperFormFileLabelTwo = "";
        } else if(this.nodeTypeName == "PRODUCT") {

          this.g3MapperFormFileLabelPlatform = "Select platform from G3Mapper to fetch product families";
          this.g3MapperFormFileLabelOne = "Select product families from G3Mapper to fetch products";
          this.g3MapperFormFileLabelTwo = "Connect products from G3Mapper";
        } else if(this.nodeTypeName == "CHAMBER") {

          this.g3MapperFormFileLabelPlatform = "Select platform from G3Mapper to fetch chambers";
          this.g3MapperFormFileLabelOne = "Connect chambers from G3Mapper";
          this.g3MapperFormFileLabelTwo = "";
        }

        this.g3MapperPlatformList = [];
        this.dropDownG3MapperPlatformList = [];

        this.g3MapperList = [];
        this.dropDownG3MapperList = [];

        this.platformService.getPlatforms('', 'name', 'asc', 1, 50).subscribe(platforms => {

          this.g3MapperPlatformList = platforms;
          console.log("getNodeTypeName getPlatforms g3MapperPlatformList: ", this.g3MapperPlatformList);

          for (var i = 0; i < this.g3MapperPlatformList.length; i++) {
              this.dropDownG3MapperPlatformList.push(this.g3MapperPlatformList[i]);
          }
        });
      } else {

        this.g3mapperType = "";
        this.hideG3MapperPlatfromFormField = true;
        this.hideG3MapperFormFieldOne = true;
        this.hideG3MapperFormFieldTwo = true;
      }
        return results[0].name;
    }
    return value;
  }

  getG3MapperPlatform(value: any) {

    console.log('getG3MapperPlatform', value);
    const results = this.g3MapperPlatformList.filter(nodeType => nodeType.id == value);
    
    this.g3MapperList = [];
    this.dropDownG3MapperList = [];

    if (results.length) {
      
      this.g3MapperInputOne.nativeElement.value = "";
      this.g3MapperInputTwo.nativeElement.value = "";

      if (this.nodeTypeName == "PLATFORM") {

        this.g3MapperId = results[0].id;

        this.hideG3MapperFormFieldOne = true;
        this.hideG3MapperFormFieldTwo = true;
      }

      if (this.nodeTypeName == "CHAMBER") {

        this.hideG3MapperFormFieldOne = false;
        this.hideG3MapperFormFieldTwo = true;

        this.g3mapperType = this.nodeTypeName;

        this.chamberService.platformId = value;
        this.chamberService.getChambers('', 'name', 'asc', 1, 1000).subscribe(chambers => {

          this.g3MapperList = chambers;
          console.log("getNodeTypeName getChambers g3MapperList: ", this.g3MapperList);

          for (var i = 0; i < this.g3MapperList.length; i++) {
             this.dropDownG3MapperList.push(this.g3MapperList[i]);
          }
        });
      }
       else if (this.nodeTypeName == "PRODUCT") {

        this.hideG3MapperFormFieldOne = false;
        this.hideG3MapperFormFieldTwo = true;

        this.g3mapperType =this.nodeTypeName;

        this.G2ProductService.platformId = value;
        this.G2ProductService.getG2Products('', 'name', 'asc', 1, 1000).subscribe(g2Products => {

          this.g3MapperList = g2Products;
          console.log("getNodeTypeName getG2Products g3MapperList: ", this.g3MapperList);

          for (var i = 0; i < this.g3MapperList.length; i++) {
             this.dropDownG3MapperList.push(this.g3MapperList[i]);
          }
        });
      }
      return results[0].name;
    } else {
      if (this.nodeTypeName == "PLATFORM") {

        this.g3MapperId = 0;
      }
    }
    return value;
  }

  getG3MapperNameOne(value: any) {
    console.log('getG3MapperNameOne', value);
    const results = this.g3MapperList.filter(nodeType => nodeType.id == value);
    if (results.length) {

      if (this.nodeTypeName == "PRODUCT") {

        this.hideG3MapperFormFieldTwo = false;

        this.g3ProductService.g2ProductTypeId = value;
        this.g3ProductService.findG3Products('', 'name', 'asc', 1, 1000).subscribe(g3products => {

          this.g3MapperListTwo = g3products;
          console.log("g3ProductService findG3Products g3MapperListTwo: ", this.g3MapperListTwo);

          for (var i = 0; i < this.g3MapperListTwo.length; i++) {
             this.dropDownG3MapperListTwo.push(this.g3MapperListTwo[i]);
          }
        });
      } else {

        this.g3MapperId = results[0].id;
      }

      return results[0].name;
    } else {
      this.g3MapperId = 0;
    }
    return value;
  }

  getG3MapperNameTwo(value: any) {
    console.log('getG3MapperNameTwo', value);
    const results = this.g3MapperListTwo.filter(nodeType => nodeType.id == value);
    if (results.length) {

        this.g3MapperId = results[0].id;
        return results[0].name;
    } else {
      this.g3MapperId = 0;
    }
    return value;
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
      // let gMapperId;
      // if (this.nodeTypeName == "PLATFORM") {

      //   gMapperId = this.service.form.get('g3_mapper_platform_id');
      // } else {

      //   gMapperId = this.service.form.get('g3_mapper_id');
      // }
      
      this.service.setG3mapperID(this.g3MapperId);
      
        if(this.service.form.get('id').value)
        {
          
          this.service.updateMenuNode(this.service.form.value).subscribe(response => {

            this.messageService.sendMessage(Constants.CHILD_NODE_UPDATED);

            console.log("Response - update menu node response : ", response);
            this.notificationService.success("Updated successfully");
            this.onClose('edited');
            
          }, error => {
    
            this.notificationService.failure(error.error);
          });
        }
        else
        {

          this.service.insertMenuNode(this.service.form.value).subscribe(response => {

            this.messageService.sendMessage(Constants.NEW_CHILD_NODE_ADDED);

            console.log("Response - add new menu node : ", response);
            this.notificationService.success("Saved successfully");
            this.onClose('created');

            
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
      this.service.insertMenuNode(this.service.form.value).subscribe(response => {
        this.saveAndAddNewTapped = true;

        this.messageService.sendMessage(Constants.NEW_CHILD_NODE_ADDED);


        console.log("Response - add new menu-node : ", response);
        this.notificationService.success("Saved successfully");
        // this.imageURL = null;
        this.service.form.reset();
        
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

  

}
