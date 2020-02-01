import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as Material from '@angular/material';
import {FlexLayoutModule} from "@angular/flex-layout";


import {MatTreeModule} from '@angular/material/tree';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    Material.MatToolbarModule,
    Material.MatGridListModule,
    Material.MatFormFieldModule,
    Material.MatInputModule,
    Material.MatButtonModule,
    Material.MatSnackBarModule,
    Material.MatTableModule,
    Material.MatSortModule,
    Material.MatIconModule,
    Material.MatPaginatorModule,
    Material.MatProgressSpinnerModule,
    Material.MatDialogModule,
    Material.MatMenuModule,
    FlexLayoutModule,
    Material.MatCardModule,
    Material.MatChipsModule,
    Material.MatOptionModule,
    Material.MatAutocompleteModule,
    Material.MatListModule,
    Material.MatSidenavModule,
    Material.MatTabsModule,
    MatTreeModule,
    Material.MatSelectModule

    
  ],
  exports:[
    Material.MatToolbarModule,
    Material.MatGridListModule,
    Material.MatFormFieldModule,
    Material.MatInputModule,
    Material.MatButtonModule,
    Material.MatSnackBarModule,
    Material.MatTableModule,
    Material.MatSortModule,
    Material.MatIconModule,
    Material.MatPaginatorModule,
    Material.MatProgressSpinnerModule,
    Material.MatDialogModule,
    Material.MatMenuModule,
    FlexLayoutModule,
    Material.MatCardModule,
    Material.MatChipsModule,
    Material.MatOptionModule,
    Material.MatAutocompleteModule,
    Material.MatListModule,
    Material.MatSidenavModule,
    Material.MatTabsModule,
    MatTreeModule,
    Material.MatSelectModule

    
  ]
})
export class MaterialModule { }
