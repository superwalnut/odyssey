import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Lines } from '../models/lines';
import { FirestoreBaseService } from './firestore-base.service';

@Injectable({
  providedIn: 'root'
})
export class LineService extends FirestoreBaseService<Lines>{

  constructor(private firestore: AngularFirestore) {
    super(firestore.collection('lines'));
  }
}
