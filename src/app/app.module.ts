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
import { DesignDashboardComponent } from "./views/design/design-dashboard/design-dashboard.component";
import { HomeComponent } from "./views/home/home.component";
import { MatMenuModule } from "@angular/material/menu";
import { CarouselModule } from "ngx-bootstrap/carousel";
import { BookingComponent, DialogOverviewExampleDialog } from "./views/booking/booking.component";
import { HeaderComponent } from "./views/header/header.component";
import { TermsComponent } from "./views/terms/terms.component";
import { LogoutComponent } from "./views/logout/logout.component";
import { ResetpasswordComponent } from './views/resetpassword/resetpassword.component';
import { SharedModule } from "./views/shared/shared.module";
import { GroupsComponent } from './views/groups/groups.component';
import { HttpClientModule } from "@angular/common/http";

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
    DialogOverviewExampleDialog,
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
