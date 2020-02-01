import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { PlatformService } from 'src/app/shared/platform.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { MatDialogRef, MatIconRegistry } from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';
import { UploadService } from 'src/app/shared/upload.service';
import { HttpEventType } from '@angular/common/http';
import { timeout } from 'rxjs/operators';
import { BuilderPlatformService } from 'src/app/shared/builder-platform.service';
import { CoreDataPlatformService } from 'src/app/shared/core-data-platform.service';

@Component({
  selector: 'app-platform',
  templateUrl: './platform.component.html',
  styleUrls: ['./platform.component.css']
})
export class PlatformComponent implements OnInit {

  platformDropDownPlatformList:any =[];
  platformList: any = [];
  imageURL: string = "";
  showSVGImage: boolean = false;
  uploadingFile : boolean = false;
  uploadedPercntValue : number = 0;

  filter:string;
  sortColumn:string;
  sortOrder:string;
  page:number;
  pageSize:number

  @ViewChild('platoformNameInput') platoformNameInput: ElementRef<HTMLInputElement>;

  constructor(public service : PlatformService,  private coredataservice:CoreDataPlatformService,
    private platformsService: BuilderPlatformService,
    private uploadService : UploadService,
    private notificationService : NotificationService,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    public dialogRef : MatDialogRef<PlatformComponent>) { }
    public saveAndAddNewTapped = false;
  
  
  ngOnInit() {

    this.coredataservice.getCoreDataPlatforms()
      .subscribe(platforms => {
          console.log(' getPlatforms', platforms);
          this.platformList = platforms;
          this.platformDropDownPlatformList = platforms;
      });
    // this.coredataservice.getcoredataplatforms(this.filter,this.sortColumn, this.sortOrder, this.page, this.pageSize)
    //   .subscribe(platforms => {
    //       console.log(' getPlatforms', platforms);
    //       this.platformList = platforms;
    //   });

    // this.platformList= [
    //   {id: "1", name: "Endura2", svg_image: "Endura2New.svg ", model_svg_url: "https://www.digitaas.io/amat/beamplatform/dev/client-assets/Endura2New.svg ", facets_count: "11"},
    //   {id: "2", name: "Producer Metal", svg_image: "ProducerMetalNew.svg ", model_svg_url: "https://www.digitaas.io/amat/beamplatform/dev/client-assets/ProducerMetalNew.svg ", facets_count: "3"},
    //   {id: "3", name: "P5 300MM Endura", svg_image: "EnduraP5New.svg ", model_svg_url: "https://www.digitaas.io/amat/beamplatform/dev/client-assets/EnduraP5New.svg ", facets_count: "11"},
    //   {id: "4", name: "P4 300MM Endura", svg_image: "EnduraP4New.svg ", model_svg_url: "https://www.digitaas.io/amat/beamplatform/dev/client-assets/EnduraP4New.svg ", facets_count: "10"},
    //   {id: "5", name: "Centura AP", svg_image: "CenturaAPNew.svg ", model_svg_url: "https://www.digitaas.io/amat/beamplatform/dev/client-assets/CenturaAPNew.svg ", facets_count: "0"},
    //   {id: "6", name: "Centura ACP 2X", svg_image: "CenturaACPNew.svg ", model_svg_url: "https://www.digitaas.io/amat/beamplatform/dev/client-assets/CenturaACPNew.svg ", facets_count: "4"},
    //   {id: "7", name: "300MM Charger 1 Link", svg_image: "Charger1LinkNew.svg", model_svg_url: "https://www.digitaas.io/amat/beamplatform/dev/client-assets/Charger1LinkNew.svg", facets_count: "3"},
    //   {id: "8", name: "Endura2 UHV", svg_image: "Endura2UHVNew.svg", model_svg_url: "https://www.digitaas.io/amat/beamplatform/dev/client-assets/Endura2UHVNew.svg", facets_count: "11"},
    //   {id: "9", name: "E2CC 300MM Endura", svg_image: "EnduraE2CCNew.svg", model_svg_url: "https://www.digitaas.io/amat/beamplatform/dev/client-assets/EnduraE2CCNew.svg", facets_count: "11"},
    //  {id: "14", name: "300MM Charger 2 Link", svg_image: "Charger2LinkNew.svg", model_svg_url: "https://www.digitaas.io/amat/beamplatform/dev/client-assets/Charger2LinkNew.svg", facets_count: "5"}
    // ];
    //  this.loadModelSvg();
  }

 

  loadModelSvg()
  {
    this.showSVGImage = false;

    setTimeout(()=>{  
      
      this.imageURL = this.service.form.get('model_svg_url').value;
        console.log(" imageURL: ", this.imageURL);
        if(this.imageURL)
        {
          this.iconRegistry.addSvgIcon('modelSvgIcon', this.sanitizer.bypassSecurityTrustResourceUrl(this.imageURL));
          this.showSVGImage = true;
        }
        else
        {
          this.showSVGImage = false;
        } 

    }, 0);

    
  }

  onPlatformtKeyPress(event:any) {

    this.platformDropDownPlatformList = [];

    for (var i = 0; i < this.platformList.length; i++) {

      if (this.platformList[i].name.toLowerCase().includes(event.target.value.toLowerCase())) {
        
        this.platformDropDownPlatformList.push(this.platformList[i]);
      }
    }
  }

  // getPlatformName(value) {

  //   console.log('getPlatformName value ', value);

  //   const results = this.platformList.filter(platform => platform.id == value);
  //   console.log('getBindWith',results);
  //   // this.service.form.value.id = parseInt(value);
  //   if (results.length) {
      
  //     return results[0].name;
  //   } else {
  //     return '';
  //   }
  // }

  platformClick(platform) {
    console.log('checking platform', platform);
    this.service.form.value.name = platform.name;
    this.service.form.value.id = parseInt(platform.id);
  }

  onFileChanged(event) {
    const selectedFile = event.target.files[0];
    console.log("selected file : ", selectedFile);

    this.uploadingFile = true;
    this.uploadService.uploadFile(selectedFile)
    .subscribe(event => {
      console.log(event); 
      if(event.type == HttpEventType.UploadProgress)
      {
          this.uploadedPercntValue =  (event.loaded / event.total) * 100;
      }
      else if(event.type == HttpEventType.Response)
      {

          const url = event.body["url"];
          const filename = event.body["filename"];
          console.log(`url = ${url}   filename = ${filename}`);
          this.service.form.get('model_svg_url').setValue(url);
          this.service.form.get('model_svg_filename').setValue(filename);
          
          this.uploadingFile = false;
          this.uploadedPercntValue = 0;

          this.loadModelSvg();
      }
      else if(event.type == HttpEventType.ResponseHeader)
      {
          this.uploadingFile = false;
          this.uploadedPercntValue = 0;
          console.log("headers : ", event.headers);
          if(event.status == 409)
          {
            this.notificationService.failure("model file needs to be an SVG");
          }
          
      }
      
    });
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
    // if(this.service.form.valid)
    // {
        if(this.service.form.get('id').value)
        {
          this.service.updatePlatform(this.service.form.value).subscribe(response => {

            console.log("Response - update platform : ", response);
            this.notificationService.success("Updated successfully");
            this.onClose('edited');
            
          }, error => {
    
            this.notificationService.failure(error.error);
          });
        }
        else
        {
          this.service.insertPlatform(this.service.form.value).subscribe(response => {

            console.log("Response - add new platform : ", response);
            this.notificationService.success("Saved successfully");
            this.onClose('created');
            
          }, error => {
    
            this.notificationService.failure(error.error);
          });
        }

     
    // }
  }

  onSubmitnAddNew()
  {
    if(this.service.form.valid)
    {
      this.service.insertPlatform(this.service.form.value).subscribe(response => {
        this.saveAndAddNewTapped = true;
        console.log("Response - add new platform : ", response);
        this.notificationService.success("Saved successfully");
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
