import { AnalyticsFabPageComponent } from './Analytics/AnalyticsFabPage/analytics-fab-page.component';
import { BuilderNSODeltaReviewPageComponent } from './NSOBuilder/BuilderNSODeltaReviewPage/builder-nso-delta-review-page.component';
import { UnAuthorizedComponent } from './unAuthorized/unAuthorizedcomponent';
import { AuthGuardService } from './../Services/authguard.service';
import { NgModule, isDevMode } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PlatFormsComponent } from './platforms/platforms.component';
import { ChamberMainComponent } from '../Components/Chambers/chambermain.component';
import { CallbackComponent } from '../callback/callback.component';
import { LaunchPageComponent } from './LaunchPage/launch-page.component';
import { ExplorerPageComponent } from './ExplorerPage/explorer-page.component';
import { ExplorerHomePageComponent } from './ExplorerHomePage/explorer-home-page.component';
import { ExplorerPlatformDetailsPageComponent } from './ExplorerPlatformDetailsPage/explorer-platform-details-page.component';
import { SearchpageComponent } from './searchpage/searchpage.component';
import { ExplorerPlatformComparePageComponent } from './ExplorerPlatformComparePage/explorer-platform-compare-page.component';
import { BuilderDashboardComponent } from './NSOBuilder/BuilderDashboardPage/builder-dashboard.component';
import { BuilderHomePageComponent } from './NSOBuilder/BuilderHomePage/builder-home-page.component';
import { BuilderConfigurationHomePageComponent } from './NSOBuilder/BuilderConfigurationHomePage/builder-configuration-home-page.component';
import { BuilderFindConfigurationPageComponent } from './NSOBuilder/BuilderFindConfigurationPage/builder-find-configuration-page.component';
import { BuilderNSOConfigurationPageComponent } from './NSOBuilder/BuilderNSOConfigurationPage/builder-nso-configuration-page.component';
import { LoginComponent } from './login/login.component';
import { AnalyticsDashboardComponent } from './Analytics/AnalyticsDashboardPage/analytics-dashboard.component';
import { AnalyticsHomePageComponent } from './Analytics/AnalyticsHomePage/analytics-home-page.component';
import { AnalyticsCustomersPageComponent } from './Analytics/AnalyticsCustomersPage/analytics-customers-page.component';
import { AnalyticsOthersPageComponent } from './Analytics/AnalyticsOthersPage/analytics-others-page.component';

const routes: Routes = [

  { path: '', redirectTo: '/login', pathMatch: 'full'},
  { path: 'login',  component: LoginComponent },
  { path: 'launch',  component: LaunchPageComponent,canActivate: [AuthGuardService] },
  { path: 'explorer',  component: ExplorerPageComponent,canActivate: [AuthGuardService],

    children: [
      { path: '', component: ExplorerHomePageComponent,canActivate: [AuthGuardService] },
      { path: ':PlatformName', component: ExplorerPlatformDetailsPageComponent },
    ]
  },
  // { path: '', redirectTo: '/dashboard', pathMatch: 'full'},
  { path: 'callback',  component: CallbackComponent },
  { path: 'unauthorized', component: UnAuthorizedComponent },
  { path: 'g3mapper', component: DashboardComponent,canActivate: [AuthGuardService],

    children: [
      { path: '', component: PlatFormsComponent,canActivate: [AuthGuardService] },
      { path: 'platform/chambers', component: ChamberMainComponent,
      loadChildren:'../Components/Chambers/chamber.module#ChamberMainModule'},
    ]
  },
  { path: 'explorer:PlatformName', component: ExplorerPlatformDetailsPageComponent, canActivate: [AuthGuardService] },
  { path: 'explorer/:PlatformName/:LevelOne', component: ExplorerPlatformDetailsPageComponent, canActivate: [AuthGuardService] },
  { path: 'explorer/:PlatformName/:LevelOne/:LevelTwo', component: ExplorerPlatformDetailsPageComponent, canActivate: [AuthGuardService] },
  { path: 'explorer/:PlatformName/:LevelOne/:LevelTwo/:LevelThree', component: ExplorerPlatformDetailsPageComponent, canActivate: [AuthGuardService] },
  { path: 'explorer/:PlatformName/:LevelOne/:LevelTwo/:LevelThree/:LevelFour', component: ExplorerPlatformDetailsPageComponent, canActivate: [AuthGuardService] },
  { path: 'explorer/:PlatformName/:LevelOne/:LevelTwo/:LevelThree/:LevelFour/:LevelFive', component: ExplorerPlatformDetailsPageComponent, canActivate: [AuthGuardService] },
  { path: 'explorer/:PlatformName/:LevelOne/:LevelTwo/:LevelThree/:LevelFour/:LevelFive/:LevelSix', component: ExplorerPlatformDetailsPageComponent, canActivate: [AuthGuardService] },
  { path: 'explorer/:PlatformName/:LevelOne/:LevelTwo/:LevelThree/:LevelFour/:LevelFive/:LevelSix/:LevelSeven', component: ExplorerPlatformDetailsPageComponent, canActivate: [AuthGuardService] },
  
  { path: 'search', component:SearchpageComponent},
  { path: 'platformcompare', component:ExplorerPlatformComparePageComponent},

  { path: 'builder', component: BuilderDashboardComponent,canActivate: [AuthGuardService],

    children: [
      { path: '', component: BuilderHomePageComponent, canActivate: [AuthGuardService] },
      { path: 'configuration', component: BuilderConfigurationHomePageComponent, canActivate: [AuthGuardService] },
      { path: 'find-configuration', component: BuilderFindConfigurationPageComponent, canActivate: [AuthGuardService] },
      { path: 'nso-configuration', component: BuilderNSOConfigurationPageComponent, canActivate: [AuthGuardService] },
      { path: 'nso-deltapage', component: BuilderNSODeltaReviewPageComponent, canActivate: [AuthGuardService] },

    ]
  },

  { path: 'analytics', component: AnalyticsDashboardComponent,canActivate: [AuthGuardService],

    children: [
      { path: '', component: AnalyticsHomePageComponent,canActivate: [AuthGuardService] },
      { path: 'customers', component: AnalyticsCustomersPageComponent, canActivate: [AuthGuardService] },
      { path: 'fabs', component: AnalyticsFabPageComponent, canActivate: [AuthGuardService] },
      { path: 'others', component: AnalyticsOthersPageComponent, canActivate: [AuthGuardService] },
    ]
  },
];

@NgModule({

  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class SubRoutingModule { }