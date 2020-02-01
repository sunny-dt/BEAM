import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChambersComponent } from './mappings/platforms/chambers/chambers.component';
import { ChamberComponent } from './mappings/platforms/chambers/chamber/chamber.component';
import { MaterialModule } from './material/material.module';
import { ChamberService } from './shared/chamber.service';
import { EnvServiceProvider } from './env.service.provider';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NotificationService } from './shared/notification.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ChamberListComponent } from './mappings/platforms/chambers/chamber-list/chamber-list.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { BaseContainerComponent } from './base-container/base-container.component';
import { PlatformComponent } from './mappings/platforms/platform/platform.component';
import { MappingsComponent } from './mappings/mappings.component';
import { PlatformListComponent } from './mappings/platforms/platform-list/platform-list.component';
import { OpportunitiesComponent } from './opportunities/opportunities.component';
import { OpportunityListComponent } from './opportunities/opportunity-list/opportunity-list.component';
import { FacetComponent } from './mappings/platforms/facets/facet/facet.component';
import { FacetListComponent } from './mappings/platforms/facets/facet-list/facet-list.component';
import { PlatformsComponent } from './mappings/platforms/platforms.component';
import { G2ProductsComponent } from './mappings/platforms/g2-products/g2-products.component';
import { G2ProductComponent } from './mappings/platforms/g2-products/g2-product/g2-product.component';
import { G2ProductListComponent } from './mappings/platforms/g2-products/g2-product-list/g2-product-list.component';
import { G3ProductsComponent } from './mappings/platforms/g2-products/g3-products/g3-products.component';
import { G3ProductComponent } from './mappings/platforms/g2-products/g3-products/g3-product/g3-product.component';
import { G3ProductListComponent } from './mappings/platforms/g2-products/g3-products/g3-product-list/g3-product-list.component';
import { ProductConfigsComponent } from './mappings/platforms/g2-products/g3-products/product-configs/product-configs.component';
import { ProductConfigComponent } from './mappings/platforms/g2-products/g3-products/product-configs/product-config/product-config.component';
import { ProductConfigListComponent } from './mappings/platforms/g2-products/g3-products/product-configs/product-config-list/product-config-list.component';
import { G2ProductService } from './shared/g2-product.service';
import { PlatformService } from './shared/platform.service';
import { G3ProductService } from './shared/g3-product.service';
import { ProductConfigService } from './shared/product-config.service';
import { FacetService } from './shared/facet.service';

import {BreadcrumbsModule, BreadcrumbsService} from "ng6-breadcrumbs";
import { ProductConfigMappingsComponent } from './mappings/platforms/g2-products/g3-products/product-configs/product-config-mappings/product-config-mappings.component';
import { ProductConfigMappingListComponent } from './mappings/platforms/g2-products/g3-products/product-configs/product-config-mappings/product-config-mapping-list.component';
import { ProductConfigMappingComponent } from './mappings/platforms/g2-products/g3-products/product-configs/product-config-mappings/product-config-mapping.component';
import { ProductConfigMappingService } from './shared/product-config-mapping.service';
import { UploadService } from './shared/upload.service';
import { UserService } from './shared/user.service';

import { CacheInterceptor } from './shared/http-interceptors/cache-interceptor';
import { CallbackComponent } from './callback/callback.component';
import { AuthGuardService } from './shared/authServices/authguard.service';
import { AuthorizationService } from './shared/authServices/authorization.service';
import { Requestor, FetchRequestor } from '@openid/appauth';
import { environment } from 'src/environments/environment';
import { AuthInterceptor } from './shared/http-interceptors/auth-interceptor';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UnAuthorizedComponent } from './unAuthorized/unAuthorizedcomponent';
import { HttpErrorDialogComponent } from './http-error-dialog/http-error-dialog.component';
import { ManageExplorerComponent } from './manage-explorer/manage-explorer.component';
import { ManageHomeComponent } from './manage-explorer/manage-home/manage-home.component';
import { ManagePlatformComponent } from './manage-explorer/manage-platform/manage-platform.component';
import { HomeFeaturedListComponent } from './manage-explorer/manage-home/home-featured-list/home-featured-list.component';
import { HomeFeaturedFormComponent } from './manage-explorer/manage-home/home-featured-form/home-featured-form.component';
import {MatSelectModule} from '@angular/material/select';
import { HomeLatestFormComponent } from './manage-explorer/manage-home/home-latest-form/home-latest-form.component';
import { HomeLatestListComponent } from './manage-explorer/manage-home/home-latest-list/home-latest-list.component';
import { MenuNodeMetadataListComponent } from './manage-explorer/manage-platform/menu-node-metadata-list/menu-node-metadata-list.component';
import { MenuNodeMetadataFormComponent } from './manage-explorer/manage-platform/menu-node-metadata-form/menu-node-metadata-form.component';
import { ChildNodeListComponent } from './manage-explorer/manage-platform/child-node-list/child-node-list.component';
import { ChildNodeFormComponent } from './manage-explorer/manage-platform/child-node-form/child-node-form.component';
import { MenunodeRecommendedListComponent } from './manage-explorer/manage-platform/menu-node-recommended-list/menu-node-recommended-list.component';
import { MenunodeRecommendedComponent } from './manage-explorer/manage-platform/menu-node-recommended-form/menu-node-recommended-form.component';

import { MccColorPickerModule } from 'material-community-components';
import { MessageService } from './shared/global-message.service';
import { MenuNodeMetadataService } from './shared/menu-node-metadata.service';
import { MenuNodeService } from './shared/menu-node.service';
import { MetadataMediaFormComponent } from './manage-explorer/manage-platform/metadata-media-form/metadata-media-form.component';
import { MetadataMediaListComponent } from './manage-explorer/manage-platform/metadata-media-list/metadata-media-list.component';
import { MenuNodeTypeListComponent } from './manage-explorer/manage-home/menu-node-types/menu-node-type-list/menu-node-type-list.component';
import { MenuNodeTypeFormComponent } from './manage-explorer/manage-home/menu-node-types/menu-node-type-form/menu-node-type-form.component';
import { NodeTypeAttributeNameListComponent } from './manage-explorer/manage-home/menu-node-types/node-type-attribute-name-list/node-type-attribute-name-list.component';
import { MenuNodeTypesComponent } from './manage-explorer/manage-home/menu-node-types/menu-node-types.component';
import { NodeTypeAttributeNameFormComponent } from './manage-explorer/manage-home/menu-node-types/node-type-attribute-name-form/node-type-attribute-name-form.component';
import { MetadataAttrValueListComponent } from './manage-explorer/manage-platform/metadata-attr-value-list/metadata-attr-value-list.component';
import { MetadataAttrValueFormComponent } from './manage-explorer/manage-platform/metadata-attr-value-form/metadata-attr-value-form.component';
import { MetadataMediaService } from './shared/metadata-media.service';
import { MetadataAttrValueService } from './shared/metadata-attr-value.service';
import { MenunodeRecommendedService } from './shared/menu-node-recommended.service';
import { PlatformRecommendedListComponent } from './manage-explorer/manage-platform/platform-recommended-list/platform-recommended-list.component';
import { PlatformRecommendedFormComponent } from './manage-explorer/manage-platform/platform-recommended-form/platform-recommended-form.component';
import { PlatformLatestListComponent } from './manage-explorer/manage-platform/platform-latest-list/platform-latest-list.component';
import { PlatformLatestFormComponent } from './manage-explorer/manage-platform/platform-latest-form/platform-latest-form.component';
import { PlatformFeaturedFormComponent } from './manage-explorer/manage-platform/platform-featured-form/platform-featured-form.component';
import { ChartsModule } from 'ng2-charts';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { MatVideoModule } from 'mat-video';
import { ManageNSOComponent } from './manage-nso/manage-nso.component';
import { LoginComponent } from './login/login.component';
import { AnalyticsComponent } from './Analytics/analytics.component';
import { AnalyticsChambersComponent, ChambersSuccessDialog } from './Analytics/analytics-chambers/analytics-chambers.component';
import { AnalyticsCustomersComponent, CustomerSuccessDialog } from './Analytics/analytics-customers/analytics-customers.component';
import { MatTooltipModule, MatButtonToggleModule } from '@angular/material';
import { AnalyticsChambersService } from './shared/analytics-chambers.service';
import { AnalyticsCustomersService } from './shared/analytics-customers.service';
import { UpgradeRulesComponent } from './manage-nso/upgrade-rules/upgrade-rules.component';
import { UpgradeRulesListComponent } from './manage-nso/upgrade-rules/upgrade-rules-list.component';
import { BuilderUpgradeRulesService } from './shared/builder-upgrade-rules.service';
import { ConfigChangeRulesComponent } from './manage-nso/config-change-rules/config-change-rules.component';
import { ConfigChangeRulesListComponent } from './manage-nso/config-change-rules/config-change-rules-list.component';

import { CoreDataComponent } from './core-data/core-data.component';
import { CoreDataPlatformsComponent } from './core-data/core-data-platforms/core-data-platforms.component';
import { CoreDataPlatformsListComponent } from './core-data/core-data-platforms/core-data-platform-list/core-data-platforms-list.component';
import { CoreDataCustomersComponent } from './core-data/core-data-customers/core-data-customers.component';
import { CoreDataCustomerListComponent } from './core-data/core-data-customers/core-data-customers-list/core-data-customer-list.component';
import { CoreDataFabsComponent } from './core-data/core-data-customers/core-data-fabs/core-data-fabs.component';
import { CoreDataFabsListComponent } from './core-data/core-data-customers/core-data-fabs/core-data-fabs-list/core-data-fab-list.component';
import { CoreDataChambersComponent } from './core-data/core-data-platforms/core-data-chambers/core-data-chambers.component';
import { CoreDataChamberListComponent } from './core-data/core-data-platforms/core-data-chambers/core-data-chamber-list.component';
import { CoreDataChamberFamiliesComponent } from './core-data/core-data-platforms/core-data-chamber-families/core-data-chamber-families.component';
import { CoreDataChamberFamiliesListComponent } from './core-data/core-data-platforms/core-data-chamber-families/core-data-chamber-families-list.component';
import { CoreDataSystemIDsComponent } from './core-data/core-data-customers/core-data-systemID/core-data-systemIDs.component';
import { CoreDataSystemIDsListComponent } from './core-data/core-data-customers/core-data-systemID/core-data-systemIDs-list/core-data-systemIDs-list.component';
import { CoreDataSystemIDsConfigurationComponent } from './core-data/core-data-customers/core-data-systemID/core-data-systemIDs-list/core-data-systemIDs_configuration.component';
import { CoreDataPlatformComponent } from './core-data/core-data-platforms/core-data-platform/core-data-platform.component';
import { CoreDataPlatformService } from './shared/core-data-platform.service';
import { CoreDataChamberFamilyComponent } from './core-data/core-data-platforms/core-data-chamber-families/core-data-chamber-family/core-data-chamber-family.component';
import { CoreDataChamberComponent } from './core-data/core-data-platforms/core-data-chambers/core-data-chamber/core-data-chamber.component';
import { CoreDataFacetComponent } from './core-data/core-data-platforms/core-data-facets/core-data-facet/core-data-facet.component';
import { CoreDataFacetListComponent } from './core-data/core-data-platforms/core-data-facets/core-data-facet-list/core-data-facet-list.component';

@NgModule({
  declarations: [
    AppComponent,
    ChambersComponent,
    ChamberComponent,
    ChamberListComponent,
    ConfirmDialogComponent,
    BaseContainerComponent,
    PlatformComponent,
    MappingsComponent,
    PlatformListComponent,
    OpportunitiesComponent,
    OpportunityListComponent,
    FacetComponent,
    FacetListComponent,
    PlatformsComponent,
    G2ProductsComponent,
    G2ProductComponent,
    G2ProductListComponent,
    G3ProductsComponent,
    G3ProductComponent,
    G3ProductListComponent,
    ProductConfigsComponent,
    ProductConfigComponent,
    ProductConfigListComponent,
    ProductConfigMappingsComponent,
    ProductConfigMappingListComponent,
    ProductConfigMappingComponent,
    CallbackComponent,
    UnAuthorizedComponent,
    HttpErrorDialogComponent,
    ManageExplorerComponent,
    ManageHomeComponent,
    ManagePlatformComponent,
    HomeFeaturedListComponent,
    HomeFeaturedFormComponent,
    HomeLatestFormComponent,
    HomeLatestListComponent,
    MenuNodeMetadataListComponent,
    MenuNodeMetadataFormComponent,
    ChildNodeListComponent,
    ChildNodeFormComponent,
    MenunodeRecommendedListComponent,
    MenunodeRecommendedComponent,
    MetadataMediaFormComponent,
    MetadataMediaListComponent,
    MenuNodeTypeListComponent,
    MenuNodeTypeFormComponent,
    MenuNodeTypesComponent,
    NodeTypeAttributeNameListComponent,
    NodeTypeAttributeNameFormComponent,
    MetadataAttrValueListComponent,
    MetadataAttrValueFormComponent,

    PlatformLatestFormComponent,
    PlatformLatestListComponent,
    PlatformRecommendedFormComponent,
    PlatformRecommendedListComponent,
    PlatformFeaturedFormComponent,

    ManageNSOComponent,

    LoginComponent,

    AnalyticsComponent,
    AnalyticsChambersComponent,
    AnalyticsCustomersComponent,

    ChambersSuccessDialog,
    CustomerSuccessDialog,

    UpgradeRulesComponent,
    UpgradeRulesListComponent,
    ConfigChangeRulesComponent,
    ConfigChangeRulesListComponent,

    CoreDataComponent,
    CoreDataPlatformsComponent,
    CoreDataPlatformsListComponent,

    CoreDataChambersComponent,
    CoreDataChamberListComponent,

    CoreDataChamberFamiliesComponent,
    CoreDataChamberFamiliesListComponent,

    CoreDataCustomersComponent,
    CoreDataCustomerListComponent,

    CoreDataFabsComponent,
    CoreDataFabsListComponent,

    CoreDataSystemIDsComponent,
    CoreDataSystemIDsListComponent,

    CoreDataSystemIDsConfigurationComponent,

    CoreDataPlatformComponent,
    CoreDataFacetComponent,
    CoreDataFacetListComponent,
    CoreDataChamberFamilyComponent,
    CoreDataChamberComponent,


  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    BreadcrumbsModule,
    DragDropModule,

    MccColorPickerModule.forRoot({
      used_colors: ['#000000', '#123456', '#777666']
    }),
    NgxDocViewerModule,
    MatVideoModule,
    MatTooltipModule,
    MatButtonToggleModule,
    ChartsModule
  ],
  providers: [EnvServiceProvider, NotificationService, ChamberService,PlatformService, 
    G2ProductService, G3ProductService, ProductConfigService, FacetService, ProductConfigMappingService, 
    BreadcrumbsService, UploadService, UserService, AuthGuardService,
    { provide: HTTP_INTERCEPTORS, useClass: CacheInterceptor, multi: true },
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor,multi: true},
    AuthorizationService,
    { provide: Requestor, useValue: new FetchRequestor()},
    { provide: 'AuthorizationConfig', useValue: environment},
    MessageService, MenuNodeService, MenuNodeMetadataService,
    MetadataMediaService, MetadataAttrValueService, MenunodeRecommendedService,
    AnalyticsChambersService, AnalyticsCustomersService, BuilderUpgradeRulesService,
    CoreDataPlatformService
  ],
  bootstrap: [AppComponent],
  entryComponents : [ChamberComponent, ConfirmDialogComponent, PlatformComponent, FacetComponent,
    G2ProductComponent, G3ProductComponent, ProductConfigComponent, ProductConfigMappingComponent,
    HttpErrorDialogComponent, HomeFeaturedFormComponent, HomeLatestFormComponent, MenuNodeMetadataFormComponent, ChildNodeFormComponent,
    MenunodeRecommendedComponent, MetadataMediaFormComponent, MenuNodeTypeFormComponent,
    NodeTypeAttributeNameFormComponent, MetadataAttrValueFormComponent, LoginComponent,
    AnalyticsComponent, AnalyticsChambersComponent, AnalyticsCustomersComponent, ChambersSuccessDialog, CustomerSuccessDialog,
    UpgradeRulesComponent, ConfigChangeRulesComponent, CoreDataSystemIDsConfigurationComponent, CoreDataPlatformComponent,
      CoreDataFacetComponent,CoreDataChamberFamilyComponent, CoreDataChamberComponent ]
})
export class AppModule { }
