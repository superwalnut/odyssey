import { Injectable } from '@angular/core';
import { AngularFirestore } from "@angular/fire/firestore";
import { FirestoreBaseService } from "./firestore-base.service";
import firebase from 'firebase/app';

import Timestamp = firebase.firestore.Timestamp;
import { Account } from '../models/account';

@Injectable({
  providedIn: 'root'
})
export class PromoAirtagService extends FirestoreBaseService<PromoAirtag>{

  constructor(private firestore: AngularFirestore) { 
    super(firestore.collection("promoAirtags"));
  }

  public createPromoAirtag(airtag: PromoAirtag, user:Account) {
    airtag.createdBy = user.docId;
    airtag.createdByDisplayName = user.name;
    airtag.createdOn = Timestamp.now();   
    return this.create(airtag);
  }

  public getPromoAirtags() {
    return super.getAll();
  }

  deletePromoAirtag(docId:string) {
    return this.delete(docId);
  }



}


export class PromoAirtag {
  docId: string;
  songTitle: string;
  songLine: string;
  createdBy: string;
  createdByDisplayName: string;
  createdOn: Timestamp;
}