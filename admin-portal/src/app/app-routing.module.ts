import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BaseContainerComponent } from './base-container/base-container.component';
import { ChamberListComponent } from './mappings/platforms/chambers/chamber-list/chamber-list.component';
import { MappingsComponent } from './mappings/mappings.component';
import { OpportunitiesComponent } from './opportunities/opportunities.component';
import { FacetListComponent } from './mappings/platforms/facets/facet-list/facet-list.component';
import { PlatformListComponent } from './mappings/platforms/platform-list/platform-list.component';
import { PlatformsComponent } from './mappings/platforms/platforms.component';
import { G2ProductListComponent } from './mappings/platforms/g2-products/g2-product-list/g2-product-list.component';
import { G2ProductsComponent } from './mappings/platforms/g2-products/g2-products.component';
import { G3ProductComponent } from './mappings/platforms/g2-products/g3-products/g3-product/g3-product.component';
import { G3ProductsComponent } from './mappings/platforms/g2-products/g3-products/g3-products.component';
import { G3ProductListComponent } from './mappings/platforms/g2-products/g3-products/g3-product-list/g3-product-list.component';
import { ProductConfigsComponent } from './mappings/platforms/g2-products/g3-products/product-configs/product-configs.component';
import { ProductConfigListComponent } from './mappings/platforms/g2-products/g3-products/product-configs/product-config-list/product-config-list.component';
import { ProductConfigMappingsComponent } from './mappings/platforms/g2-products/g3-products/product-configs/product-config-mappings/product-config-mappings.component';
import { ProductConfigMappingListComponent } from './mappings/platforms/g2-products/g3-products/product-configs/product-config-mappings/product-config-mapping-list.component';
import { ProductConfigMappingComponent } from './mappings/platforms/g2-products/g3-products/product-configs/product-config-mappings/product-config-mapping.component';
import { OpportunityListComponent } from './opportunities/opportunity-list/opportunity-list.component';
import { AuthGuardService } from './shared/authServices/authguard.service';
import { CallbackComponent } from './callback/callback.component';
import { UnAuthorizedComponent } from './unAuthorized/unAuthorizedcomponent';
import { ManageExplorerComponent } from './manage-explorer/manage-explorer.component';
import { ManageHomeComponent } from './manage-explorer/manage-home/manage-home.component';
import { ManagePlatformComponent } from './manage-explorer/manage-platform/manage-platform.component';

import {ChildNodeListComponent} from './manage-explorer/manage-platform/child-node-list/child-node-list.component';
import { MenuNodeMetadataListComponent } from './manage-explorer/manage-platform/menu-node-metadata-list/menu-node-metadata-list.component';
import { MenunodeRecommendedListComponent } from './manage-explorer/manage-platform/menu-node-recommended-list/menu-node-recommended-list.component';
import { HomeFeaturedListComponent } from './manage-explorer/manage-home/home-featured-list/home-featured-list.component';
import { MenuNodeTypesComponent } from './manage-explorer/manage-home/menu-node-types/menu-node-types.component';
import { MenuNodeTypeListComponent } from './manage-explorer/manage-home/menu-node-types/menu-node-type-list/menu-node-type-list.component';
import { NodeTypeAttributeNameListComponent } from './manage-explorer/manage-home/menu-node-types/node-type-attribute-name-list/node-type-attribute-name-list.component';
import { ManageNSOComponent } from './manage-nso/manage-nso.component';
import { LoginComponent } from './login/login.component';
import { AnalyticsComponent } from './Analytics/analytics.component';
import { AnalyticsChambersComponent } from './Analytics/analytics-chambers/analytics-chambers.component';
import { AnalyticsCustomersComponent } from './Analytics/analytics-customers/analytics-customers.component';
import { UpgradeRulesListComponent } from './manage-nso/upgrade-rules/upgrade-rules-list.component';
import { ConfigChangeRulesListComponent } from './manage-nso/config-change-rules/config-change-rules-list.component';

import { CoreDataComponent } from './core-data/core-data.component';
import { CoreDataPlatformsComponent } from './core-data/core-data-platforms/core-data-platforms.component';
import { CoreDataPlatformsListComponent } from './core-data/core-data-platforms/core-data-platform-list/core-data-platforms-list.component';
import { CoreDataCustomerListComponent } from './core-data/core-data-customers/core-data-customers-list/core-data-customer-list.component';
import { CoreDataCustomersComponent } from './core-data/core-data-customers/core-data-customers.component';
import { CoreDataFabsComponent } from './core-data/core-data-customers/core-data-fabs/core-data-fabs.component';
import { CoreDataFabsListComponent } from './core-data/core-data-customers/core-data-fabs/core-data-fabs-list/core-data-fab-list.component';
import { CoreDataChamberFamiliesComponent } from './core-data/core-data-platforms/core-data-chamber-families/core-data-chamber-families.component';
import { CoreDataChambersComponent } from './core-data/core-data-platforms/core-data-chambers/core-data-chambers.component';
import { CoreDataChamberListComponent } from './core-data/core-data-platforms/core-data-chambers/core-data-chamber-list.component';
import { CoreDataChamberFamiliesListComponent } from './core-data/core-data-platforms/core-data-chamber-families/core-data-chamber-families-list.component';
import { CoreDataSystemIDsComponent } from './core-data/core-data-customers/core-data-systemID/core-data-systemIDs.component';
import { CoreDataSystemIDsListComponent } from './core-data/core-data-customers/core-data-systemID/core-data-systemIDs-list/core-data-systemIDs-list.component';
import { CoreDataFacetListComponent } from './core-data/core-data-platforms/core-data-facets/core-data-facet-list/core-data-facet-list.component';

const routes: Routes = [
  { path: 'callback',  component: CallbackComponent },
  { path: 'unauthorized', component: UnAuthorizedComponent },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'admin', pathMatch: 'full', canActivate: [AuthGuardService]},

  { path: 'admin', component: BaseContainerComponent, data :{breadcrumb : 'Admin'}, canActivate: [AuthGuardService],

    children: [

      {path: '', redirectTo: 'mappings', pathMatch: 'full'},
      // {path: 'chambers', component: ChambersComponent, data :{breadcrumb : 'Chambers'}},
      {path : 'mappings', component : MappingsComponent, data :{breadcrumb : 'Mappings'},
          children : [
            {path: '', redirectTo: 'platform', pathMatch: 'full'},
            {path: 'platform', component: PlatformsComponent, data :{breadcrumb : 'Platforms'},
              children : [
                {path: '', redirectTo:'list', pathMatch:'full'},
                {path : 'list', component : PlatformListComponent},
                {path : 'facets/:platform-id/:breadcrumb', component : FacetListComponent},
                {path : 'chambers/:platform-id/:breadcrumb', component : ChamberListComponent},
                {path : 'g2-products/:platform-id/:breadcrumb', component : G2ProductsComponent,
                  children : [
                    {path : '', redirectTo:'list', pathMatch:'full'},
                    {path : 'list', component : G2ProductListComponent},
                    {path : 'g3-products/:g2-product-id/:breadcrumb', component : G3ProductsComponent,
                      children : [
                        {path : '', redirectTo:'list', pathMatch : 'full'},
                        {path : 'list', component : G3ProductListComponent},
                        {path:'product-configs/:g3-product-id/:breadcrumb', component : ProductConfigsComponent,
                          children : [
                            {path : '', redirectTo:'list', pathMatch : 'full'},
                            {path : 'list', component : ProductConfigListComponent},
                            {path:'product-config-mappings/:product-config-id/:breadcrumb', component : ProductConfigMappingsComponent,
                              children : [
                                {path : '', redirectTo:'list', pathMatch : 'full'},
                                {path : 'list', component : ProductConfigMappingListComponent},
                                {path:'**', redirectTo:'list'}
                              ]},
                              {path:'**', redirectTo:'list'}
                          ]},
                          {path:'**', redirectTo:'list'}
                      ]},
                      {path:'**', redirectTo:'list'}
                  ]},
                  {path:'**', redirectTo:'list'}
              ]},
              {path : 'opportunities', component : OpportunitiesComponent, data :{breadcrumb : 'Opportunities'}, 
              children : [
                {path: '', redirectTo:'list', pathMatch:'full'},
                {path : 'list', component : OpportunityListComponent},
                {path:'**', redirectTo:'list'}
              ]
          },
        {path:'**', redirectTo:'platform'}
      ]},
      
      {path : 'manage-explorer', component : ManageExplorerComponent, data : {breadcrumb : 'Manage-Explorer'},
           children : [
             {path : '', redirectTo:'manage-home', pathMatch:'full'},
             {path : 'manage-home', component : ManageHomeComponent, data : {breadcrumb : 'Home'},
             runGuardsAndResolvers : 'always',
             children : [
                {path : 'featured', component : HomeFeaturedListComponent, data : {breadcrumb : 'Featured'}},
                {path : 'node-types', component : MenuNodeTypesComponent, data : {breadcrumb : 'Node Types'},
                  runGuardsAndResolvers : 'always',
                  children : [
                    {path: '', redirectTo:'list', pathMatch:'full'},
                    {path : 'list', component : MenuNodeTypeListComponent},
                    {path : 'attribute-names/:node-type-id/:breadcrumb', component : NodeTypeAttributeNameListComponent}

                  ]
                }

             ]},
             {path : 'manage-nodes/:node-id/:breadcrumb', 
             component : ManagePlatformComponent,
             runGuardsAndResolvers: 'always',
             children : [
              // {path: '', redirectTo:'list', pathMatch:'full'},
              {path : 'list/:node-id/:breadcrumb', component : ChildNodeListComponent},
              {path : 'metadata/:node-id/:breadcrumb', component : MenuNodeMetadataListComponent},
              {path : 'recommended/:node-id/:breadcrumb', component : MenunodeRecommendedListComponent}

            ]},
             {path:'**', redirectTo:'manage-home'}
           ]
      },
      {path : 'builder', component : ManageNSOComponent, data :{breadcrumb : 'Builder'},
        children : [
          {path: '', redirectTo: 'upgraderules', pathMatch: 'full'},
         
          {path: 'upgraderules', component: UpgradeRulesListComponent, data :{breadcrumb : 'Upgrade Rules'}},
          {path: 'configchangerules', component: ConfigChangeRulesListComponent, data :{breadcrumb : 'Config Change Rules'}},
      ]},
      {path : 'analytics', component : AnalyticsComponent, data :{breadcrumb : 'Analytics'},
        children : [
          {path: '', redirectTo: 'chambers', pathMatch: 'full'},
          {path: 'chambers', component: AnalyticsChambersComponent, data :{breadcrumb : 'Chambers'}},
          {path: 'customers', component: AnalyticsCustomersComponent, data :{breadcrumb : 'Customers'}},
      ]},


      // {path : 'core-data', component : MappingsComponent },
      {path : 'core-data', component : CoreDataComponent, data :{breadcrumb : 'Core Data Manager'},
      children : [
        
        {path: '', redirectTo: 'platform', pathMatch: 'full'},
        {path: 'platform', component: CoreDataPlatformsComponent, data :{breadcrumb : 'Platforms'},
          children : [
            {path: '', redirectTo:'list', pathMatch:'full'},
            {path : 'list', component : CoreDataPlatformsListComponent},
            {path : 'facets/:platform-id/:breadcrumb', component : CoreDataFacetListComponent},
            // {path : 'chambers/:platform-id/:breadcrumb', component : CoreDataChamberListComponent},
            {path : 'chamberfamilies/:platform-id/:breadcrumb', component : CoreDataChamberFamiliesComponent,
            children : [
              {path : '', redirectTo:'list', pathMatch:'full'},
              {path : 'list', component : CoreDataChamberFamiliesListComponent},
              {path : 'chambers/:platform-id/:chamber-family-id/:breadcrumb', component : CoreDataChambersComponent,
                children : [
                  {path : '', redirectTo:'list', pathMatch : 'full'},
                  {path : 'list', component : CoreDataChamberListComponent},
                {path:'**', redirectTo:'list'}
              ]},
              {path:'**', redirectTo:'list'}
            ]},
              {path:'**', redirectTo:'list'}
          ]},
          {path: 'customers', component: CoreDataCustomersComponent, data :{breadcrumb : 'Customers'},
          children : [
            {path: '', redirectTo:'list', pathMatch:'full'},
            {path : 'list', component : CoreDataCustomerListComponent},
            {path : 'fabs/:customer-id/:breadcrumb', component : CoreDataFabsComponent,
              children : [
                {path : '', redirectTo:'list', pathMatch:'full'},
                {path : 'list', component : CoreDataFabsListComponent},
                {path : 'systemID/:fab-id/:breadcrumb', component : CoreDataSystemIDsComponent,
                  children : [
                    {path : '', redirectTo:'list', pathMatch : 'full'},
                    {path : 'list', component : CoreDataSystemIDsListComponent},
                  {path:'**', redirectTo:'list'}
              ]},
                  {path:'**', redirectTo:'list'}
              ]},
              {path:'**', redirectTo:'list'}
          ]},
  ]},
    ]
  },
  {
    path:'**', redirectTo:'admin'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
