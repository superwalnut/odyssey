import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import {
  CommonModule,
  LocationStrategy,
  HashLocationStrategy,
} from "@angular/common";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { PERFECT_SCROLLBAR_CONFIG } from "ngx-perfect-scrollbar";
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import { AppMaterialModule } from "./app-material.module";

import {
  IconModule,
  IconSetModule,
  IconSetService,
} from "@coreui/icons-angular";

// import { MatInputModule } from "@angular/material/input";
// import { MatButtonModule } from "@angular/material/button";

// import { MatFormFieldModule } from "@angular/material/form-field";

// import { MatDialogModule } from "@angular/material/dialog";

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
};

import { AppComponent } from "./app.component";

// Import containers
import { DefaultLayoutComponent } from "./containers";

import { P404Component } from "./views/error/404.component";
import { P500Component } from "./views/error/500.component";
import { LoginComponent } from "./views/login/login.component";
import { RegisterComponent } from "./views/register/register.component";

const APP_CONTAINERS = [DefaultLayoutComponent];

import {
  AppAsideModule,
  AppBreadcrumbModule,
  AppHeaderModule,
  AppFooterModule,
  AppSidebarModule,
} from "@coreui/angular";

// Import routing module
import { AppRoutingModule } from "./app.routing";

// Import 3rd party components
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { TabsModule } from "ngx-bootstrap/tabs";
import { ChartsModule } from "ng2-charts";
import { FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AngularFireModule } from "@angular/fire";
import { environment } from "../environments/environment";
import { HomeComponent } from "./views/home/home.component";
import { MatMenuModule } from "@angular/material/menu";
import { CarouselModule } from "ngx-bootstrap/carousel";
import { BookingComponent, BookingDialog, WithdrawDialog } from "./views/booking/booking.component";
import { HeaderComponent } from "./views/header/header.component";
import { TermsComponent } from "./views/terms/terms.component";
import { LogoutComponent } from "./views/logout/logout.component";
import { ResetpasswordComponent } from './views/resetpassword/resetpassword.component';
import { SharedModule } from "./views/shared/shared.module";
import { GroupsComponent } from './views/groups/groups.component';
import { HttpClientModule } from "@angular/common/http";
import { CreateNewPasswordComponent } from "./views/create-new-password/create-new-password.component";
import { AirtagComponent } from './views/promo/airtag/airtag.component';
import { CompetitionComponent } from './views/competition/competition.component';
import { FooterComponent } from './views/footer/footer.component';
import { DevComponent } from './views/dev/dev.component';
import { OfflineComponent } from './views/offline/offline.component';
import { AngularFireAnalyticsModule } from '@angular/fire/analytics';
import { HbcCompetition2021Component } from './views/competition/hbc-competition2021/hbc-competition2021.component';
import { HbcOpenCompetition2022Component } from './views/competition/hbc-open-competition2022/hbc-open-competition2022.component';
import { HbcOpenCompetition2022DrawComponent } from './views/competition/hbc-open-competition2022-draw/hbc-open-competition2022-draw.component';
import { StoreComponent } from './views/store/store.component';
import { HbcOpen2023DrawComponent } from "./views/competition/hbc-open2023-draw/hbc-open2023-draw.component";
import { BookingRedirectComponent } from './views/booking-redirect/booking-redirect.component';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AppAsideModule,
    AppBreadcrumbModule.forRoot(),
    AppFooterModule,
    AppHeaderModule,
    AppSidebarModule,
    PerfectScrollbarModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    ChartsModule,
    IconModule,
    IconSetModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    AppMaterialModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAnalyticsModule,
    MatMenuModule,
    CarouselModule.forRoot(),
    SharedModule,
    HttpClientModule
  ],
  exports: [BrowserAnimationsModule],
  declarations: [
    AppComponent,
    ...APP_CONTAINERS,
    P404Component,
    P500Component,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    BookingComponent,
    HeaderComponent,
    TermsComponent,
    LogoutComponent,
    ResetpasswordComponent,
    GroupsComponent,
    BookingDialog,
    WithdrawDialog,
    CreateNewPasswordComponent,
    AirtagComponent,
    CompetitionComponent,
    FooterComponent,
    DevComponent,
    OfflineComponent,
    HbcCompetition2021Component,
    HbcOpenCompetition2022Component,
    HbcOpenCompetition2022DrawComponent,
    HbcOpen2023DrawComponent,
    StoreComponent,
    BookingRedirectComponent,
  ],
  providers: [
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy,
    },

    //MatDatepickerModule,
    //MatCheckboxModule,
    //MatInputModule,
    IconSetService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
