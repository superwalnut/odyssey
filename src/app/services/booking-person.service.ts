import { Injectable } from '@angular/core';
import { AngularFirestore } from "@angular/fire/firestore";
import { FirestoreBaseService } from "./firestore-base.service";
import { map, concatMap, finalize, timestamp, take } from "rxjs/operators";
import { BookingPerson } from "../models/booking-person";
import { GroupTransaction } from "../models/group-transaction";

import firebase from 'firebase/app';
import Timestamp = firebase.firestore.Timestamp;
import { Booking } from '../models/booking';
import { CreditService } from './credit.service';
import { HelperService } from '../common/helper.service';

import { Credit } from '../models/credit';
import { LocalBookingUser } from '../models/custom-models';
import { User } from '../models/user';
import { Group } from '../models/group';
import { cifBg } from '@coreui/icons';
import { GlobalConstants } from '../common/global-constants';

@Injectable({
  providedIn: 'root'
})
export class BookingPersonService extends FirestoreBaseService<BookingPerson>{

  constructor(private firestore: AngularFirestore, private creditService: CreditService, private helperService: HelperService) {
    super(firestore.collection('bookingPersons'));
  }

  public createBookingPerson(bp: BookingPerson, booking:Booking) {
    var batch = this.firestore.firestore.batch();

    var ref = this.firestore.collection('bookingPersons').doc().ref;
    console.log('createBookingPerson: ', bp);
    batch.set(ref, bp);

    // var ref = this.firestore.collection('credits').doc().ref;
    // var credit = {
    //   amount: -bp.amount,
    //   userDocId: bp.parentUserId ? bp.parentUserId : bp.userId,
    //   userDisplayName: bp.userDisplayName,
    //   createdBy: bp.parentUserId ? bp.parentUserId : bp.userId,
    //   createdByDisplayName: bp.parentUserDisplayName ? bp.parentUserDisplayName : bp.userDisplayName,
    //   //note: bp.bookingDesc + ': ' + bp.userDisplayName + ",",
    //   note: 'Booking:' + booking.weekDay + ':' + this.helperService.getFormattedTimestamp(booking.eventStartDateTime) + ' ' + bp.userDisplayName + ",",
    //   created: Timestamp.now(),
    // } as Credit;
    // console.log('createBookingPerson service credit: ', credit);
    // batch.set(ref, credit);

    //for cash user booking, we don't add to Group transaction, untile we received the cash. then we mark them as paid, and add to grouptransaction
    // if (bp.paymentMethod == GlobalConstants.paymentCredit) {
    //   var ref = this.firestore.collection('groupTransactions').doc().ref;
    //   var trans = {
    //     amount: bp.amount,
    //     paymentMethod: bp.paymentMethod,
    //     groupDocId: bp.groupDocId,
    //     bookingDocId: bp.bookingDocId, //nullable
    //     referenceId: credit.userDocId, //nullable
    //     notes: credit.note,
    //     createdBy: credit.createdBy,
    //     createdByDisplayName: credit.createdByDisplayName,
    //     created: Timestamp.now(),
    //   } as GroupTransaction;
    //   console.log('createBookingPerson service groupTransaction: ', trans);
    //   batch.set(ref, trans);
    // }
    
    batch.commit();
  }

  public async createBookingPersonBatch(bookingPersons: BookingPerson[], booking:Booking) {
    var batch = this.firestore.firestore.batch();

    bookingPersons.forEach(bp => {
      var ref = this.firestore.collection('bookingPersons').doc().ref;
      console.log('createBookingPersonBatch booking person: ', bp);
      batch.set(ref, bp);

      // var ref = this.firestore.collection('credits').doc().ref;
      // var credit = {
      //   amount: -bp.amount,
      //   userDocId: bp.parentUserId ? bp.parentUserId : bp.userId,
      //   userDisplayName: bp.userDisplayName,
      //   createdBy: bp.parentUserId ? bp.parentUserId : bp.userId,
      //   createdByDisplayName: bp.parentUserDisplayName ? bp.parentUserDisplayName : bp.userDisplayName,
      //   note: 'Booking:' + booking.weekDay + ':' + this.helperService.getFormattedTimestamp(booking.eventStartDateTime) + ' ' + bp.userDisplayName + ",",
      //   created: Timestamp.now(),
      // } as Credit;
      // console.log('createBookingPersonBatch service: ', credit);
      // batch.set(ref, credit);

      // //for cash user booking, we don't add to Group transaction, untile we received the cash. then we mark them as paid, and add to grouptransaction
      // if (bp.paymentMethod == GlobalConstants.paymentCredit) {
      //   var ref = this.firestore.collection('groupTransactions').doc().ref;
      //   var trans = {
      //     amount: bp.amount,
      //     paymentMethod: bp.paymentMethod,
      //     groupDocId: bp.groupDocId,
      //     bookingDocId: bp.bookingDocId, //nullable
      //     referenceId: credit.userDocId, //nullable
      //     notes: credit.note,
      //     createdBy: credit.createdBy,
      //     createdByDisplayName: credit.createdByDisplayName,
      //     created: Timestamp.now(),
      //   } as GroupTransaction;
      //   console.log('createBookingPersonBatch service groupTransaction: ', trans);
      //   batch.set(ref, trans);
      // }
    
    });
    await batch.commit();
  }

  public getAllBookingPersons() {
    return this.firestore.collection('bookingPersons', q => q.orderBy('createdOn', 'desc').limit(1600)).snapshotChanges().pipe(
      map(actions => {
        var items = actions.map(p => {
          var data = p.payload.doc.data() as BookingPerson;
          return { ...data, docId: p.payload.doc.id } as BookingPerson;
        });
        return items;
      }), take(1)
    )
  }

  public getBookingPersonsByGroupDocId(groupDocId:string) {
    console.log("getBookingPersonsByGroupDocId")
    return this.firestore.collection('bookingPersons', q => q.where('groupDocId', '==', groupDocId).limit(2000)).snapshotChanges().pipe(
      map(actions => {
        var items = actions.map(p => {
          var data = p.payload.doc.data() as BookingPerson;
          return { ...data, docId: p.payload.doc.id } as BookingPerson;
        });
        return items;
      }), take(1)
    )
  }

  public get(bookingPersonDocId: string) {
    return super.getByDocId(bookingPersonDocId);
  }


  public getByUserDocId(userDocId: string) {
    return this.firestore.collection('bookingPersons', q => q.where('parentUserId', '==', userDocId).orderBy('createdOn', 'desc')).snapshotChanges().pipe(
      map(actions => {
        var items = actions.map(p => {
          var data = p.payload.doc.data() as BookingPerson;
          return { ...data, docId: p.payload.doc.id } as BookingPerson;
        });
        return items;
      })
    )
  }

  public getAllUnpaid() {
    return this.firestore.collection('bookingPersons', q => q.where('isPaid', '==', false).orderBy('createdOn', 'desc')).snapshotChanges().pipe(
      map(actions => {
        var items = actions.map(p => {
          var data = p.payload.doc.data() as BookingPerson;
          return { ...data, docId: p.payload.doc.id } as BookingPerson;
        });
        return items;
      })
    )
  }

  public getCurrentWeekByUserDocId(userDocId: string) {
    var dateRange = this.helperService.findDateRangeOfCurrentWeek(new Date());
    console.log('date range', dateRange)
    return this.firestore.collection('bookingPersons', q => q.where('parentUserId', '==', userDocId)).snapshotChanges().pipe(
      map(actions => {
        var items = actions.map(p => {
          var data = p.payload.doc.data() as BookingPerson;
          if (data.createdOn >= this.helperService.convertToTimestamp(dateRange.firstday) &&
            data.createdOn <= this.helperService.convertToTimestamp(dateRange.lastday)) {
            return { ...data, docId: p.payload.doc.id } as BookingPerson;
          }
          return null;

        });
        return items;
      })
    );

  }

  public getByBookingDocId(bookingDocId: string) {
    return this.firestore.collection('bookingPersons', q => q.where('bookingDocId', '==', bookingDocId).orderBy('createdOn', 'asc')).snapshotChanges().pipe(
      map(actions => {
        var items = actions.map(p => {
          var data = p.payload.doc.data() as BookingPerson;
          console.log('getByBookingDocId()', data);
          return { ...data, docId: p.payload.doc.id } as BookingPerson;
        });
        return items;
      })
    );
  }

  public getCustomByBookingDocId(bookingDocId: string, myUserDocId: string) {
    return this.firestore.collection('bookingPersons', q => q.where('bookingDocId', '==', bookingDocId).orderBy('createdOn', 'asc')).snapshotChanges().pipe(
      map(actions => {
        var items = actions.map(p => {
          var u = p.payload.doc.data() as BookingPerson;

          var user = {
            docId: u.docId,
            userDocId: u.userId,
            name: u.userDisplayName,
            parentUserId: u.parentUserId,
            parentUserDisplayName: u.parentUserDisplayName,
            amount: u.amount,
            note: u.notes,
            isPaid: u.isPaid,
            avatarUrl: (u.avatarUrl === undefined || u.avatarUrl == '') ? GlobalConstants.imageDefaultAvatar : u.avatarUrl,
            paymentMethod: u.paymentMethod,
            isMyBooking: u.userId == myUserDocId || u.parentUserId == myUserDocId,
            isFamily: u.parentUserId == myUserDocId || u.userId == myUserDocId,
            isForSale: u.isForSale,
            createdOn: u.createdOn,
          } as LocalBookingUser;

          console.log('getCustomByBookingDocId()', user);
          return { ...user, docId: p.payload.doc.id } as LocalBookingUser;
        });
        return items;
      })
    );
  }

  public withdraw(bookingPersonDocId: string, bookingPerson: BookingPerson, booking:Booking) {
    var batch = this.firestore.firestore.batch();
    var bpref = this.firestore.collection('bookingPersons').doc(bookingPersonDocId).ref;
    batch.delete(bpref);

    //refund
    // var cref = this.firestore.collection('credits').doc().ref;
    // var credit = {
    //   userDocId: bookingPerson.parentUserId, //refund to the parent user ID!
    //   userDisplayName: bookingPerson.userDisplayName,
    //   createdBy: bookingPerson.parentUserId,
    //   createdByDisplayName: bookingPerson.parentUserDisplayName,
    //   amount: bookingPerson.amount,
    //   created: Timestamp.now(),
    //   note: 'withdraw ' + bookingPerson.userDisplayName + ' from ' + booking.weekDay + ', refund to ' + bookingPerson.parentUserDisplayName,
    // } as Credit;
    // batch.set(cref, credit);

    // if (bookingPerson.paymentMethod == GlobalConstants.paymentCredit) {
    //   var ref = this.firestore.collection('groupTransactions').doc().ref;
    //   var trans = {
    //     amount: -credit.amount,
    //     paymentMethod: bookingPerson.paymentMethod,
    //     groupDocId: bookingPerson.groupDocId,
    //     bookingDocId: bookingPerson.bookingDocId, //nullable
    //     referenceId: credit.userDocId, //nullable
    //     notes: credit.note + ':' + bookingPerson.userDisplayName,
    //     createdBy: credit.createdBy,
    //     createdByDisplayName: credit.createdByDisplayName,
    //     created: Timestamp.now(),
    //   } as GroupTransaction;
    //   console.log('withdraw service groupTransaction: ', trans);
    //   batch.set(ref, trans);
    // }
    
    return batch.commit();
  }

  public markForSale(bookingPersonDocId: string, bookingPerson: BookingPerson) {
    bookingPerson.updatedOn = Timestamp.now();
    bookingPerson.isForSale = true;
    return this.update(bookingPersonDocId, bookingPerson);
  }

  public updateBookingPerson(bookingPerson: BookingPerson) {
    bookingPerson.updatedOn = Timestamp.now();
    return this.update(bookingPerson.docId, bookingPerson);
  }

  
  public updatePaymentStatus(bp: BookingPerson, bpFull: BookingPerson, updatedByUserDocId: string, updatedByUserName: string, booking:Booking) {
    var batch = this.firestore.firestore.batch();
    //apply to both booking-peson and group transaction table!
    var ref = this.firestore.collection('bookingPersons').doc(bp.docId).ref;
    batch.update(ref, bp);

    // var ref = this.firestore.collection('groupTransactions').doc().ref;
    // let paymentAmount = bpFull.isPaid ? bpFull.amount : -bpFull.amount;
    // let paymentNotes = bpFull.isPaid ? 'paid ' : 'unpaid ';
    // //add to group transaction table
    // var groupTransaction = {
    //   amount: paymentAmount,
    //   notes: paymentNotes + ':' + booking.weekDay +':' + bpFull.userDisplayName,
    //   paymentMethod: bpFull.paymentMethod,
    //   referenceId: bpFull.userId,
    //   groupDocId: bpFull.groupDocId,
    //   bookingDocId: bpFull.bookingDocId,
    //   createdBy: updatedByUserDocId,
    //   createdByDisplayName: updatedByUserName,
    //   created: Timestamp.now(),
    // } as GroupTransaction;
    // batch.set(ref, groupTransaction);


    // //refund and deduct
    // var ref = this.firestore.collection('credits').doc().ref;
    // var sellerCredit = {
    //   userDocId: bpFull.userId, //refund to parent user id
    //   userDisplayName: bpFull.userDisplayName,
    //   createdBy: updatedByUserDocId,
    //   createdByDisplayName: updatedByUserName,
    //   amount: paymentAmount,
    //   created: Timestamp.now(),
    //   note: paymentNotes + ':' + booking.weekDay,
    // } as Credit;

    // batch.set(ref, sellerCredit);
    // console.log('seller credit...', sellerCredit);

    return batch.commit();
  }

  public buySeat(seller: LocalBookingUser, buyer: BookingPerson) {

    //1. check is spot is still up for sale
    this.get(seller.docId).subscribe(result => {
      if (result && result.isForSale) {
        var batch = this.firestore.firestore.batch();
        //2. delete 
        var ref = this.firestore.collection('bookingPersons').doc(seller.docId).ref;
        batch.delete(ref);

        //3. buy 
        var ref = this.firestore.collection('bookingPersons').doc().ref;
        batch.set(ref, buyer);

        //refund and deduct
        // var ref = this.firestore.collection('credits').doc().ref;
        // var sellerCredit = {
        //   userDocId: seller.parentUserId, //refund to parent user id
        //   userDisplayName: result.userDisplayName,
        //   createdBy: result.parentUserId,
        //   createdByDisplayName: result.parentUserDisplayName,
        //   amount: result.amount,
        //   created: Timestamp.now(),
        //   note: 'seat sold to ' + buyer.userDisplayName,
        // } as Credit;

        // batch.set(ref, sellerCredit);
        // console.log('seller credit...', sellerCredit);

        // var ref = this.firestore.collection('groupTransactions').doc().ref;
        // var sellerTrans = {
        //   amount: -result.amount,
        //   paymentMethod: result.paymentMethod,
        //   groupDocId: result.groupDocId,
        //   bookingDocId: result.bookingDocId, //nullable
        //   referenceId: sellerCredit.userDocId, //nullable
        //   notes: sellerCredit.note,
        //   createdBy: sellerCredit.createdBy,
        //   createdByDisplayName: sellerCredit.createdByDisplayName,
        //   created: Timestamp.now(),
        // } as GroupTransaction;
        // console.log('createBookingPerson service buySeat Seller: ', sellerTrans);
        // batch.set(ref, sellerTrans);


        // var ref = this.firestore.collection('credits').doc().ref;
        // var buyerCredit = {
        //   userDocId: buyer.userId,
        //   userDisplayName: buyer.userDisplayName,
        //   createdBy: buyer.userId,
        //   createdByDisplayName: buyer.userDisplayName,
        //   amount: -buyer.amount,
        //   created: Timestamp.now(),
        //   note: 'purchased seat from ' + result.userDisplayName,
        // } as Credit;
        // batch.set(ref, buyerCredit);
        // console.log('buyer credit...', buyerCredit);

        // var ref = this.firestore.collection('groupTransactions').doc().ref;
        // var buyerTrans = {
        //   amount: buyerCredit.amount,
        //   paymentMethod: buyer.paymentMethod,
        //   groupDocId: result.groupDocId,
        //   bookingDocId: result.bookingDocId, //nullable
        //   referenceId: buyerCredit.userDocId, //nullable
        //   notes: buyerCredit.note,
        //   createdBy: buyerCredit.createdBy,
        //   createdByDisplayName: buyerCredit.createdByDisplayName,
        //   created: Timestamp.now(),
        // } as GroupTransaction;
        // console.log('createBookingPerson service buySeat buyer: ', buyerTrans);
        // batch.set(ref, buyerTrans);
        batch.commit();
      }
    })
  }

  public async deleteBatch(bookingPersons: BookingPerson[]) {
    var batch = this.firestore.firestore.batch();
    bookingPersons.forEach(bp => {
      //delete this bookingPerson
      batch.delete(this.firestore.collection('bookingPersons').doc(bp.docId).ref);

      console.log('delete batch, delete booking person: ', bp.docId);
      //refund credit back
    //   var ref = this.firestore.collection('credits').doc().ref;
    //   var credit = {
    //     amount: bp.amount,
    //     userDocId: bp.parentUserId, //refund back to the parent user ID
    //     userDisplayName: bp.userDisplayName,
    //     //note: bp.bookingDesc + ": withdraw : " + bp.userDisplayName,
    //     note: 'withdraw ' + bp.userDisplayName + ' from ' + bp.bookingDesc + ', refund to ' + bp.parentUserDisplayName,
    //     createdBy: bp.parentUserId,
    //     createdByDisplayName: bp.parentUserDisplayName,
    //     created: Timestamp.now()
    //   } as Credit;
    //   batch.set(ref, credit);

    //   if (bp.paymentMethod == GlobalConstants.paymentCredit) {
    //     //add to groupTransaction table
    //     var ref = this.firestore.collection('groupTransactions').doc().ref;
    //     var trans = {
    //       amount: -bp.amount,
    //       paymentMethod: bp.paymentMethod,
    //       groupDocId: bp.groupDocId,
    //       bookingDocId: bp.bookingDocId, //nullable
    //       referenceId: credit.userDocId, //nullable
    //       notes: credit.note,
    //       createdBy: credit.createdBy,
    //       createdByDisplayName: credit.createdByDisplayName,
    //       created: Timestamp.now(),
    //     } as GroupTransaction;
    //     console.log('deleteBatch service groupTransaction: ', trans);
    //     batch.set(ref, trans);
    //   }
    });
    batch.commit();
  }

  getByGroupId(groupId:string) {
    return this.firestore.collection('bookingPersons', q => q.where('groupDocId', '==', groupId).orderBy('createdOn', 'desc')).snapshotChanges().pipe(
      map(actions => {
        var items = actions.map(p => {
          var data = p.payload.doc.data() as BookingPerson;
          return { ...data, docId: p.payload.doc.id } as BookingPerson;
        });
        return items;
      })
    );
  }

  //Helper Methods
  // getRate(user: User, group: Group) {

  //   let committee = group.committees.find(x => x.docId === user.docId);
  //   if (committee != null) return 0;
  // }

}
