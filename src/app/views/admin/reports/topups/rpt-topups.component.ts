import { Component, AfterViewInit, OnInit,Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { map, take, takeUntil } from 'rxjs/operators';
import { BaseComponent } from '../../../base-component';
import { CreditBalanceService } from '../../../../services/credit-balance.service';
import { MailgunService } from '../../../../services/mailgun.service';

import firebase from 'firebase/app';
import Timestamp = firebase.firestore.Timestamp;
import { combineLatest, Observable } from 'rxjs';
import { Credit } from '../../../../models/credit';
import { GlobalConstants } from '../../../../common/global-constants';
import { HelperService } from '../../../../common/helper.service';

@Component({
  selector: 'app-rpt-topups',
  templateUrl: './rpt-topups.component.html',
  styleUrls: ['./rpt-topups.component.scss']
})
export class RptTopupsComponent extends BaseComponent implements OnInit {
  credits:Credit[];
  form: FormGroup;
  isLoading: boolean;
  submitted = false;

  categories = [
    GlobalConstants.creditCategoryBadminton,
    GlobalConstants.creditCategoryCourt,
    GlobalConstants.creditCategoryShuttle,
    GlobalConstants.creditCategoryDividend,
    GlobalConstants.creditCategoryTopup,
    GlobalConstants.creditCategoryRefund,
    GlobalConstants.creditCategoryReward,
    GlobalConstants.creditCategoryPromo,
    GlobalConstants.creditCategoryCashout,
    GlobalConstants.creditCategoryAdjustment,
    GlobalConstants.creditCategoryOther,
  ];

  constructor(private fb: FormBuilder, private creditBalanceService:CreditBalanceService, private helper:HelperService) { 
    super();
  }

  get f() {
    return this.form.controls;
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      category: ["", [Validators.required]],
    });

    this.creditBalanceService.getLatestTopups().pipe(takeUntil(this.ngUnsubscribe)).subscribe(c=>{
      this.credits = c.sort((a, b) => this.helper.convertToDate(b.created).getTime() - this.helper.convertToDate(a.created).getTime());
      console.log(this.credits);
    });

  }

  daysDiff(created:Timestamp)
  {
    var date = this.helper.convertToDate(created);
    var days = this.helper.calculateDiffFromToday(date);
    if(days == 0){
      return "today";
    }
    if(days > 0 && days <=7){
      return "this week";
    }
    if(days > 7) {
      return "";
    }
  }

  onSubmit() {
    this.submitted = true;
    this.isLoading = true;
    if (this.form.invalid) {
      return;
    }

    console.log("register", this.form);


  }
}
