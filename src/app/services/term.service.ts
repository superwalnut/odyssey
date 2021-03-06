import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { FirestoreBaseService } from './firestore-base.service';
import { map, concatMap, finalize } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { Term } from '../models/term';


@Injectable({
  providedIn: 'root'
})
export class TermService extends FirestoreBaseService<Term>{

  constructor(private firestore: AngularFirestore) { 
    super(firestore.collection('terms'));
  }

  createTerm(term:Term) {
    return this.create(term);
  }

  getTerms(){
    return super.getAll();

  }


}
