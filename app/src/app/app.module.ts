import { HighlightSearch } from './HighlightSearchPipe';
import { AuthGuardService } from './Services/authguard.service';
import { HttpClientModule } from '@angular/common/http';
import { SubModule } from './Components/sub.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Requestor, FetchRequestor } from '@openid/appauth';
import { environment } from './../environments/environment.prod';
import { AuthorizationService } from './authorization.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { EnvServiceProvider } from './env.service.provider';

import {
  MatButtonModule, MatFormFieldModule, MatInputModule, MatRippleModule,
  MatSelectModule,
  MAT_CHIPS_DEFAULT_OPTIONS,
  MatToolbarModule,
  MatSidenavModule,
  MatListModule,
  MatGridListModule,
  MatSlideToggleModule,
  MatMenuModule,
  MatDialogModule,
  MatIconModule,
  MatChipsModule,
  MatCardModule,
  MatAutocompleteModule
} from '@angular/material';
import { OverlayModule } from '@angular/cdk/overlay';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { AccordionModule } from 'primeng/accordion';
import { TooltipModule } from 'primeng/tooltip';
import {MatTreeModule} from '@angular/material/tree';
import {CdkStepperModule} from '@angular/cdk/stepper';
import {CdkTableModule} from '@angular/cdk/table';
import {CdkTreeModule} from '@angular/cdk/tree';
import {MatProgressBarModule} from '@angular/material/progress-bar';

@NgModule({
  declarations: [
    AppComponent,
    HighlightSearch
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    SubModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatInputModule,
    OverlayModule, 
    OverlayPanelModule, 
    MatCardModule, 
    AccordionModule, 
    TooltipModule,
    MatRippleModule, 
    AccordionModule, 
    MatChipsModule, 
    MatIconModule, 
    Ng2SearchPipeModule, 
    MatMenuModule,
    MatDialogModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatGridListModule,
    MatTreeModule,
    CdkTreeModule,
    CdkStepperModule,
    CdkTableModule,
    MatProgressBarModule,
  ],
  providers: [
    AuthGuardService,
    EnvServiceProvider,
    AuthorizationService,
    { provide: Requestor, useValue: new FetchRequestor()},
    { provide: 'AuthorizationConfig', useValue: environment}

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }