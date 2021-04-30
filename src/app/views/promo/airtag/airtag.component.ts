import { Component, OnInit } from '@angular/core';
import { environment } from "../../../../environments/environment";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PromoAirtag, PromoAirtagService } from '../../../services/promo-airtag.service';
import { Account } from '../../../models/account';
import { AccountService } from '../../../services/account.service';


@Component({
  selector: 'app-airtag',
  templateUrl: './airtag.component.html',
  styleUrls: ['./airtag.component.scss']
})
export class AirtagComponent implements OnInit {
  domain:string=environment.domain;
  form: FormGroup;
  user:Account;
  promos:PromoAirtag[];

  isLoggedIn:boolean;

  constructor(private fb: FormBuilder, private promoAirtagService:PromoAirtagService, private accountService:AccountService) { }

  ngOnInit(): void {
    this.user = this.accountService.getLoginAccount();
    
    this.isLoggedIn = this.user.name != null;

    this.form = this.fb.group({
      songTitle: ['', [Validators.required, Validators.maxLength(30)]],
      songLine: ['', [Validators.required, Validators.maxLength(500)]],
    });

    this.getAllPromoAirtags();
  }

  getAllPromoAirtags() {
    this.promoAirtagService.getPromoAirtags().subscribe(result=>{
      this.promos = result;

    })
  }

  onSubmit() {

    var airtag = {
      songTitle: this.form.value.songTitle,
      songLine: this.form.value.songLine,
    } as PromoAirtag;
    console.log(airtag);

    this.promoAirtagService.createPromoAirtag(airtag, this.user)
    .then(x=>{

    })


  }

  remove(promo:PromoAirtag) {

    if (confirm("Confirm to delete your submission?")) {
      this.promoAirtagService.deletePromoAirtag(promo.docId);
    }
    

  }

  get f() { return this.form.controls; }




}
