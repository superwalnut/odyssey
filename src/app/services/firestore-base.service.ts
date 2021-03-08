import { Injectable } from '@angular/core';
import { AngularFirestoreCollection } from '@angular/fire/firestore';
import * as CryptoJS from 'crypto-js';
import firebase from 'firebase/app';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import Timestamp = firebase.firestore.Timestamp;

@Injectable({
  providedIn: 'root'
})
export class FirestoreBaseService<T> {
  private encryptSecretKey = "5ed40d89-0194-47da-8e3f-04df8be154a6";

  constructor(private collection: AngularFirestoreCollection) { }

  //CREATE
  protected async create(data: T): Promise<string> {
    try {
      return await this.collection.add(data).then(docRef => {
        return Promise.resolve(docRef.id)
      });
    } catch (err) {
      Promise.reject(err);
    }
  }

  //UPDATE
  protected async update(docId: string, doc: T): Promise<string> {
    try {
      return await this.collection.doc(docId).set(doc, { merge: true }).then(docRef => {
        return Promise.resolve(docId);
      });
    } catch (err) {
      Promise.reject(err);
    }
  }

  //DELETE
  protected async delete(docId: string): Promise<void> {
    try {
      await this.collection.doc(docId).delete();
    } catch (err) {
      console.log(err);
    }
  }

  //Get All
  protected getAll() {
    return this.collection.snapshotChanges().pipe(
      map(actions => {
        const items = actions.map(p => {
          var data = p.payload.doc.data() as T;
          return {
            ...data,
            docId: p.payload.doc.id
          } as T;
        });
        return items;
      })
    );
  }

  // Get by docId
  protected getByDocId(docId: string) {
    return this.collection.doc(docId).snapshotChanges().pipe(map(actions => {
      const data = actions.payload.data() as T;
      return {
        ...data,
        docId: actions.payload.id
      } as T;
    }));
  }

  protected encryptData(data) {
    try {
      return CryptoJS.AES.encrypt(JSON.stringify(data), this.encryptSecretKey).toString();
    } catch (e) {
      console.log(e);
    }
  }

  protected decryptData(data) {
    try {
      const bytes = CryptoJS.AES.decrypt(data, this.encryptSecretKey);
      if (bytes.toString()) {
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      }
      return data;
    } catch (e) {
      console.log(e);
    }
  }

  protected convertToTimestamp(date: Date): Timestamp {
    const ts = Timestamp.fromDate(date);
    return ts;
  }

  protected convertToDate(ts: Timestamp): Date {
    return ts.toDate();
  }

  protected getTodayTimestamp() {
    return this.convertToTimestamp(new Date());
  }
}
