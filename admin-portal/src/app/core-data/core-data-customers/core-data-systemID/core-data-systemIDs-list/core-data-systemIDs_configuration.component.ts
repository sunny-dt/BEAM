import { FormControl } from '@angular/forms';
import { Component, OnInit, ElementRef, ViewChild, Inject } from '@angular/core';
import { MatIconRegistry,MatAutocompleteSelectedEvent, MatChipInputEvent, MatAutocomplete, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { NotificationService } from 'src/app/shared/notification.service';
import { BuilderUpgradeRulesService } from 'src/app/shared/builder-upgrade-rules.service';
import { SystemIDConfigService } from 'src/app/shared/systemID-Config.service';

@Component({
  selector: 'app-core-data-systemIDs_configuration',
  templateUrl: './core-data-systemIDs_configuration.component.html',
  styleUrls: ['./core-data-systemIDs_configuration.component.css']
})

export class CoreDataSystemIDsConfigurationComponent implements OnInit {

  disabledSaveButton = true;
  coreDataConfigurationFecets: any = [];
  imageURL: string = '';
 

  constructor( @Inject(MAT_DIALOG_DATA) public data: any,
    public systemIDConfigService : SystemIDConfigService,
    private notificationService : NotificationService,public iconRegistry: MatIconRegistry, public sanitizer: DomSanitizer, private elem: ElementRef,
    public dialogRef : MatDialogRef<CoreDataSystemIDsConfigurationComponent>) {

      this.imageURL = 'https://www.digitaas.io/amat/beamplatform/dev/client-assets/Endura2New.svg';
      this.iconRegistry.addSvgIcon('productImageIcon', this.sanitizer.bypassSecurityTrustResourceUrl(this.imageURL));
   
  }

  ngOnInit() {

    console.log('ngOnInit data ', this.data);

    this.systemIDConfigService.getMasterSystemIDConfig(this.data.customerID, this.data.fabID, this.data.systemID).subscribe(response => {

      console.log('getMasterSystemIDConfig response ', response);
      let configuration = JSON.parse(JSON.stringify(response));

      this.coreDataConfigurationFecets = configuration.configuration;
    });
  } 
  

  public displayGotCode(gotCode) {

    if (typeof gotCode!='undefined' && gotCode) {

      let gotCodeValue = "(" + gotCode + ")";
      return gotCodeValue;
    } else {
       
      return "";
    }
  }
  
  onSave() {

      
  }

  onClose(data) {

    this.dialogRef.close(data);
  }
}