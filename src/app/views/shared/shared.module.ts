import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { UserCreditListComponent } from "./usercredit-list/usercredit-list.component";
import { AppMaterialModule } from "../../app-material.module";
import { ManageFamilyComponent, FamilyDialog, FamilyNewDialog } from './manage-family/manage-family.component';
import { ManageProfileComponent } from './manage-profile/manage-profile.component';
import { ManagePasswordComponent } from './manage-password/manage-password.component';
import { AttendanceListComponent } from './attendance-list/attendance-list.component';

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
      FamilyDialog,
      FamilyNewDialog,
      ManageProfileComponent,
      ManagePasswordComponent,
      AttendanceListComponent
    ],
    exports: [
      UserCreditListComponent,
      ManageFamilyComponent,
      FamilyDialog,
      FamilyNewDialog,
      ManageProfileComponent,
      ManagePasswordComponent,
      AttendanceListComponent
    ],
  })
  export class SharedModule {}
  