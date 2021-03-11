import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { TransactionListComponent } from "./transaction-list/transaction-list.component";
import { AppMaterialModule } from "../../app-material.module";
import { ManageFamilyComponent } from './manage-family/manage-family.component';
import { ManageProfileComponent } from './manage-profile/manage-profile.component';

@NgModule({
    imports: [
      FormsModule,
      CommonModule,
      ReactiveFormsModule
    ],
    declarations: [
      TransactionListComponent,
      ManageFamilyComponent,
      ManageProfileComponent
    ],
    exports: [
      TransactionListComponent,
      ManageFamilyComponent
    ],
  })
  export class SharedModule {}
  