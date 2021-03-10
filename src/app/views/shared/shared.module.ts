import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { TransactionListComponent } from "./transaction-list/transaction-list.component";
import { AppMaterialModule } from "../../app-material.module";
import { ManageFamilyComponent } from './manage-family/manage-family.component';

@NgModule({
    imports: [
      FormsModule,
      CommonModule,
      ReactiveFormsModule
    ],
    declarations: [
      TransactionListComponent,
      ManageFamilyComponent
    ],
    exports: [
      TransactionListComponent,
      ManageFamilyComponent
    ],
  })
  export class SharedModule {}
  