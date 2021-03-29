import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { TransactionListComponent } from "./transaction-list/transaction-list.component";
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
      TransactionListComponent,
      ManageFamilyComponent,
      ManageProfileComponent,
      ManagePasswordComponent
    ],
    exports: [
      TransactionListComponent,
      ManageFamilyComponent,
      ManageProfileComponent,
      ManagePasswordComponent
    ],
  })
  export class SharedModule {}
  