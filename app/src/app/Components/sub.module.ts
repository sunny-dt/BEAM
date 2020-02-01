import { BuilderNSODeltaReviewPageComponent, EMailTemplateDialog, EmailSentSuccessDialog } from './NSOBuilder/BuilderNSODeltaReviewPage/builder-nso-delta-review-page.component';
import { IgxExcelExporterService } from 'igniteui-angular';
import { CallbackComponent } from './../callback/callback.component';
import { AuthInterceptor } from './../Services/auth-interceptor';
import { AuthorizationService } from './../authorization.service';
import { AuthGuardService } from './../Services/authguard.service';
import { Requestor, FetchRequestor } from '@openid/appauth';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { SubRoutingModule } from './sub-routing.module';
import { ApiService } from 'src/app/Services/api.service';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatButtonModule, MatFormFieldModule, MatInputModule, MatRippleModule,
  MatSelectModule,
  MAT_CHIPS_DEFAULT_OPTIONS,
  MatToolbarModule,
  MatSidenavModule,
  MatListModule,
  MatGridListModule,
  MatExpansionModule,
  MatCheckboxModule,
  MatTabsModule,
  MatSortModule,
  MatSliderModule,
  MatProgressSpinnerModule,
  MatProgressBarModule
} from '@angular/material';
import { DashboardComponent, ExitDialog } from './dashboard/dashboard.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { SelectModule } from 'ng2-select';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import 'hammerjs';
import { PlatFormsComponent, PlatformHttpErrorDialog } from './platforms/platforms.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { MatMenuModule } from '@angular/material/menu';
import { AccordionModule } from 'primeng/accordion';
import { TooltipModule } from 'primeng/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { ChamberMainModule } from '../Components/Chambers/chamber.module';
import { Http, RequestOptions } from '@angular/http';
import { UnAuthorizedComponent } from './unAuthorized/unAuthorizedcomponent';
import { LaunchPageComponent } from './LaunchPage/launch-page.component';
import { ExplorerPageComponent } from './ExplorerPage/explorer-page.component';
import { ExplorerHomePageComponent } from './ExplorerHomePage/explorer-home-page.component';
import { ExplorerPlatformDetailsPageComponent } from './ExplorerPlatformDetailsPage/explorer-platform-details-page.component';
import { SwiperModule } from 'angular2-useful-swiper';
import { MatTreeModule} from '@angular/material/tree';
import { CdkStepperModule} from '@angular/cdk/stepper';
import { CdkTableModule} from '@angular/cdk/table';
import { CdkTreeModule} from '@angular/cdk/tree';
import { SearchpageComponent } from './searchpage/searchpage.component';
import { ExplorerProductComparePageComponent } from './ExplorerProductComparePage/explorer-product-compare-page.component';
import { ExplorerPlatformComparePageComponent } from './ExplorerPlatformComparePage/explorer-platform-compare-page.component';
import { ScrollDispatchModule } from '@angular/cdk/scrolling';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { MatVideoModule } from 'mat-video';
import { BuilderDashboardComponent } from './NSOBuilder/BuilderDashboardPage/builder-dashboard.component';
import { BuilderHomePageComponent } from './NSOBuilder/BuilderHomePage/builder-home-page.component';
import { BuilderConfigurationHomePageComponent, EntersyStemIdDialog, DeleteDialog, NoEmptyFacetsDialog } from './NSOBuilder/BuilderConfigurationHomePage/builder-configuration-home-page.component';
import { BuilderFindConfigurationPageComponent, NSOFlowDialog, DeleteConfigConfirmationDialog, ConfigTitleExitDialog} from './NSOBuilder/BuilderFindConfigurationPage/builder-find-configuration-page.component';
import { MatSnackBarModule} from '@angular/material/snack-bar';
import { MatTooltipModule} from '@angular/material/tooltip';
import { BuilderNSOConfigurationPageComponent, ReviewChangesDialog, ValidateMessageDialog } from './NSOBuilder/BuilderNSOConfigurationPage/builder-nso-configuration-page.component';
import { MatTableModule } from '@angular/material';
import { MatPaginatorModule} from '@angular/material/paginator';
import { LoginComponent } from './login/login.component';
import { AnalyticsDashboardComponent } from './Analytics/AnalyticsDashboardPage/analytics-dashboard.component';
import { AnalyticsHomePageComponent, AnalyticsHomeFilterDialog, NoFilterResultDialog } from './Analytics/AnalyticsHomePage/analytics-home-page.component';
import { ChartsModule } from 'ng2-charts';
import { ChartModule } from 'primeng/chart';
import { AnalyticsCustomersPageComponent, AnalyticsCustomerFilterDialog } from './Analytics/AnalyticsCustomersPage/analytics-customers-page.component';
import { AnalyticsFabPageComponent, UpgradeChamberSalesPriceDialog, NoUpgradeChamberDialog, AnalyticsFabFilterDialog } from './Analytics/AnalyticsFabPage/analytics-fab-page.component';
import {MatRadioModule} from '@angular/material/radio';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { AnalyticsOthersPageComponent, AnalyticsOthersFilterDialog } from './Analytics/AnalyticsOthersPage/analytics-others-page.component';
import { ExcelService } from '../Services/excel.service';

@NgModule({
  declarations: [

    DashboardComponent,
    PlatFormsComponent,
    ExitDialog,
    CallbackComponent,
    PlatformHttpErrorDialog,
    UnAuthorizedComponent,
    LaunchPageComponent,
    ExplorerPageComponent,
    ExplorerHomePageComponent,
    ExplorerPlatformDetailsPageComponent,
    SearchpageComponent,
    ExplorerProductComparePageComponent,
    ExplorerPlatformComparePageComponent,
    BuilderDashboardComponent,
    BuilderHomePageComponent,
    BuilderConfigurationHomePageComponent,
    BuilderFindConfigurationPageComponent,
    EntersyStemIdDialog,
    BuilderNSOConfigurationPageComponent,
    DeleteDialog,
    ReviewChangesDialog,
    BuilderNSODeltaReviewPageComponent,
    LoginComponent,
    AnalyticsDashboardComponent,
    AnalyticsHomePageComponent,
    AnalyticsCustomersPageComponent,
    AnalyticsFabPageComponent,
    UpgradeChamberSalesPriceDialog,
    NoUpgradeChamberDialog,
    AnalyticsHomeFilterDialog,
    AnalyticsCustomerFilterDialog,
    AnalyticsFabFilterDialog,
    AnalyticsOthersPageComponent,
    NSOFlowDialog,
    AnalyticsOthersFilterDialog,
    DeleteConfigConfirmationDialog,
    ConfigTitleExitDialog,
    EMailTemplateDialog,
    EmailSentSuccessDialog,
    NoFilterResultDialog,
    ValidateMessageDialog,
    NoEmptyFacetsDialog
  ],

  imports: [

    BrowserModule, 
    FormsModule, 
    SelectModule, 
    ReactiveFormsModule,
    SubRoutingModule, 
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
    ChamberMainModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatGridListModule,
    SwiperModule,
    MatTreeModule,
    CdkTreeModule,
    CdkStepperModule,
    CdkTableModule,
    MatExpansionModule,
    MatCheckboxModule,
    ScrollDispatchModule,
    NgxDocViewerModule,
    MatVideoModule,
    MatTabsModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    ChartsModule,
    ChartModule,
    MatRadioModule,
    MatButtonToggleModule,
    MatSliderModule,
    MatProgressSpinnerModule,
    MatProgressBarModule
  ],

  providers: [

    ApiService, 
    AuthGuardService,
    AuthorizationService,

  {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
  },
  IgxExcelExporterService,
  ExcelService
  ],

  entryComponents: [
    
    ExitDialog,
    PlatformHttpErrorDialog,
    EntersyStemIdDialog,
    DeleteDialog,
    ReviewChangesDialog,
    UpgradeChamberSalesPriceDialog,
    NoUpgradeChamberDialog,
    AnalyticsHomeFilterDialog,
    AnalyticsCustomerFilterDialog,
    AnalyticsFabFilterDialog,
    NSOFlowDialog,
    AnalyticsOthersFilterDialog,
    DeleteConfigConfirmationDialog,
    ConfigTitleExitDialog,
    EMailTemplateDialog,
    EmailSentSuccessDialog,
    NoFilterResultDialog,
    ValidateMessageDialog,
    NoEmptyFacetsDialog
  ],

  bootstrap: []
})

export class SubModule { }
