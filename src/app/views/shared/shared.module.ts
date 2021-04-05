import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { UserCreditListComponent } from "./usercredit-list/usercredit-list.component";
import { AppMaterialModule } from "../../app-material.module";
import { ManageFamilyComponent } from './manage-family/manage-family.component';
import { ManageProfileComponent } from './manage-profile/manage-profile.component';
import { ManagePasswordComponent } from './manage-password/manage-password.component';

@NgModule({
    imports: [
      FormsModule,
      CommonModule,
      ReactiveFormsModule,
      AppMaterialModule
    ],
    declarations: [
      UserCreditListComponent,
      ManageFamilyComponent,
      ManageProfileComponent,
      ManagePasswordComponent
    ],
    exports: [
      UserCreditListComponent,
      ManageFamilyComponent,
      ManageProfileComponent,
      ManagePasswordComponent
    ],
  })
  export class SharedModule {}
  