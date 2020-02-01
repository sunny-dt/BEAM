import { FormControl } from '@angular/forms';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { Component, OnInit, ElementRef, ViewChild, Inject } from '@angular/core';
import { MatAutocompleteSelectedEvent, MatChipInputEvent, MatAutocomplete, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Observable } from 'rxjs';
import { MenunodeRecommendedService } from 'src/app/shared/menu-node-recommended.service';
import { NotificationService } from 'src/app/shared/notification.service';

@Component({
  selector: 'app-menu-node-recommended-form',
  templateUrl: './menu-node-recommended-form.component.html',
  styleUrls: ['./menu-node-recommended-form.component.css']
})
export class MenunodeRecommendedComponent implements OnInit {

  nodesPartitionArray:any[] = [];
  selectedNodesList: any[] = [];
  nodesList: any[] = [];
  dropDownNodesList: any[] = [];

  showSelectedNodesClearButton: boolean = false;
  nodesSelectable = true;
  public term;
  removable = true;
  addOnBlur = true;
  nodesFormControl = new FormControl();


  separatorKeysCodes: number[] = [ENTER, COMMA];

  @ViewChild('nodeInput') nodeInput: ElementRef<HTMLInputElement>;
  @ViewChild('nodeauto') matNodeAutocomplete: MatAutocomplete;


  constructor( @Inject(MAT_DIALOG_DATA) public data: any, 
  public service : MenunodeRecommendedService,
    private notificationService : NotificationService,
    public dialogRef : MatDialogRef<MenunodeRecommendedComponent>
    )
     {

      this.nodesList = [];
    }

  ngOnInit(){

    console.log('passed product-config-id',this.data);

    this.service.getMenunodesDescendentDataNodes()
    .subscribe(nodes => {
      this.nodesList = nodes;

      this.service.getMenunodeRecommendeds()
      .subscribe(recommendeds => {
  
        const selectedNodes = nodes.filter(n => {

          const recNode =  recommendeds.find(r => {
              return r.recommended_node_id == n.id
           })
           return recNode != undefined
        })
        this.selectedNodesList = selectedNodes;
      });

    });

   
 
  }


  nodesRemove(node): void {

    const index = this.selectedNodesList.indexOf(node);
    this.selectedNodesList.splice(index, 1);
    this.nodesList.push(node);
    console.log("selectednodesList",this.selectedNodesList);
    if(this.selectedNodesList.length > 0) {

      this.showSelectedNodesClearButton = true;
    } else {

      this.showSelectedNodesClearButton = false;
    }

}



nodesOnClick(node) {

    console.log('nodesOnClick', node);
    this.selectedNodesList.push(node);
    // console.log('nodesOnClick--i', i);
    const index = this.nodesList.indexOf(node);

    this.nodesList.splice(index, 1);


    console.log("selectednodesList",this.selectedNodesList);
    
    if(this.selectedNodesList.length > 0) {

      this.showSelectedNodesClearButton = true;
    } else {

      this.showSelectedNodesClearButton = false;
    }

}


nodeOptionSelected(event){


  this.selectedNodesList.push(event.option.value);

  if(this.selectedNodesList.length > 0) {

    this.showSelectedNodesClearButton = true;
  } else {

    this.showSelectedNodesClearButton = false;
  }

    this.dropDownNodesList = [];
    this.nodeInput.nativeElement.value = '';
    this.nodesFormControl.setValue(null);

}

clearAllSelectednodes(){

  for(var i = 0; i < this.selectedNodesList.length; i++) {

    this.nodesList.push(this.selectedNodesList[i]);
  }

// this.nodesList = this.nodesList;

  this.selectedNodesList = [];
  if(this.selectedNodesList.length > 0) {

    this.showSelectedNodesClearButton = true;
    
  } else {

    this.showSelectedNodesClearButton = false;
  }
  console.log("clearAllSelectednodes",this.selectedNodesList);
}


onKeyPress(event:any){

    this.dropDownNodesList = [];

  for (var i = 0; i < this.nodesList.length; i++) {

    if (this.nodesList[i].name.toLowerCase().includes(event.target.value.toLowerCase())) {
      
      this.dropDownNodesList.push(this.nodesList[i]);
     
    }
  }
}


onSave()
{


    let nodesChambersGrouping = {recommended_nodes_list : this.selectedNodesList.map(n => n.id)};
    this.service.updateMenunodeRecommendedMappings(nodesChambersGrouping)
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
