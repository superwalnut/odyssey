import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from '../models/user';
import { FirestoreBaseService } from './firestore-base.service';

@Injectable({
  providedIn: 'root'
})
export class UserService extends FirestoreBaseService<User>{

  constructor(private firestore: AngularFirestore) {
    super(firestore.collection('users'));
  }
}
