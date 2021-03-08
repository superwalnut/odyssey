import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { TransactionListComponent } from "./transaction-list/transaction-list.component";
import { AppMaterialModule } from "../../app-material.module";

@NgModule({
    imports: [
      FormsModule,
      CommonModule,
    ],
    declarations: [
      TransactionListComponent
    ],
    exports: [
      TransactionListComponent
    ],
  })
  export class SharedModule {}
  