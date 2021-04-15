import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject, forkJoin, Observable, of } from 'rxjs';
import { User } from '../models/user';
import { FirestoreBaseService } from './firestore-base.service';
import { map, concatMap, finalize, mergeMap } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { Account } from '../models/account';
import firebase from 'firebase/app';
import Timestamp = firebase.firestore.Timestamp;
import { resolve } from '@angular/compiler-cli/src/ngtsc/file_system';
import { MatSnackBar } from '@angular/material/snack-bar';
import { merge } from 'rxjs';
import { Runner } from 'protractor';
import { MailgunService } from './mailgun.service';
import { HelperService } from '../common/helper.service';


@Injectable({
  providedIn: 'root'
})
export class AccountService extends FirestoreBaseService<User>{
  private accountSubject: BehaviorSubject<User>;
  public account: Observable<User>;

  constructor(private firestore: AngularFirestore, private router: Router, private route: ActivatedRoute, private snackBar: MatSnackBar, private helpService: HelperService) {
    super(firestore.collection('users'));
    this.accountSubject = new BehaviorSubject<User>(null);
    this.account = this.accountSubject.asObservable();
  }

  public get accountValue(): User {
    return this.accountSubject.value;
  }

  login(mobile: string, password: string) {
    // login with facebook then authenticate with the API to get a JWT auth token
    this.authenticate(mobile, password).subscribe(x => {
      if (x) {
        this.saveLocal(x);
        this.accountSubject.next(x);
        // get return url from query parameters or default to home page
        var returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
        console.log('returnUrl', returnUrl);
        if (returnUrl == '/login' || returnUrl == '/register')
          returnUrl = '/dashboard';
        this.router.navigateByUrl(returnUrl);
      } else {
        this.snackBar.open(`Failed to login, your username/password is incorrect.`, null, {
          duration: 5000,
          verticalPosition: 'top'
        });
      }

    });
  }

  authenticate(mobile: string, password: string): Observable<User> {
    return this.firestore.collection('users', q => q.where("mobile", "==", mobile).where("password", "==", password).limit(1)).snapshotChanges().pipe(
      map(actions => {
        if (actions && actions.length > 0) {
          var acc = actions[0].payload.doc.data() as User;
          if (acc.disabled) { return null }
          return {
            ...acc,
            docId: actions[0].payload.doc.id
          };
        } else {
          return null;
        }
      }));
  }

  logout() {
    this.accountSubject.next(null);
    localStorage.removeItem('user');
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    }
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['/login']);
  }

  createUser(user: User) {
    user.created = this.getTodayTimestamp();
    user.updated = this.getTodayTimestamp();
    return this.create(user);
  }

  updateUser(docId: string, user: User) {
    user.updated = this.getTodayTimestamp();
    return this.update(docId, user);
  }

  isAdmin() {
    const role = this.getLoginAccount()?.role ?? [];
    if (role.indexOf('Admin') >= 0 || role.indexOf('God') >= 0) {
      return true;
    }

    return false;
  }

  isGod() {
    const role = this.getLoginAccount()?.role ?? '';
    if (role.indexOf('God') >= 0) {
      return true;
    }

    return false;
  }

  getLoginAccount() {
    var account = this.getLocal();
    if (account) {
      return account;
    }

    const user = this.accountValue;
    if (user) {
      // logged in so return true
      return { docId: user.docId, name: user.name, role: user.role, email: user.email } as Account;
    }

    return null;
  }

  isEmailExist(email: string) {
    return this.firestore.collection('users', q => q.where('email', '==', email)).snapshotChanges().pipe(
      map(actions => {
        return actions.map(x => {
          var acc = x.payload.doc.data() as User;
          return {
            ...acc,
            docId: x.payload.doc.id
          } as User;
        });
      }));
  }

  isMobileExist(mobile: string) {
    return this.firestore.collection('users', q => q.where('mobile', '==', mobile)).snapshotChanges().pipe(
      map(actions => {
        return actions.map(x => {
          var acc = x.payload.doc.data() as User;
          return {
            ...acc,
            docId: x.payload.doc.id
          } as User;
        });
      }));
  }

  isNameExist(name: string) {
    return this.firestore.collection('users', q => q.where('name', '==', name)).snapshotChanges().pipe(
      map(actions => {
        return actions.map(x => {
          var acc = x.payload.doc.data() as User;
          return {
            ...acc,
            docId: x.payload.doc.id
          } as User;
        });
      }));
  }

  public getFamilyUsers(parentUserDocId: string) {
    return this.firestore.collection('users', q => q.where('parentUserDocId', '==', parentUserDocId)).snapshotChanges().pipe(
      map(actions => {
        return actions.map(x => {
          var acc = x.payload.doc.data() as User;
          return {
            ...acc,
            docId: x.payload.doc.id
          } as User;
        });
      }));
  }

  public getLoginUser() {
    var name = this.getLoginAccount()?.name ?? '';

    return this.firestore.collection('users', q => q.where("name", "==", name).limit(1)).snapshotChanges().pipe(
      map(actions => {
        if (actions && actions.length > 0) {
          var acc = actions[0].payload.doc.data() as User;
          return {
            ...acc,
            docId: actions[0].payload.doc.id
          } as User;
        } else {
          return null;
        }
      }));
  }

  public getUserByEmail(email: string) {
    return this.firestore.collection('users', q => q.where("email", "==", email).limit(1)).snapshotChanges().pipe(
      map(actions => {
        if (actions && actions.length > 0) {
          var acc = actions[0].payload.doc.data() as User;
          return {
            ...acc,
            docId: actions[0].payload.doc.id
          } as User;
        } else {
          return null;
        }
      }));
  }

  public getUsersByUserDocIds(docIds: string[]) {
    //docIds = ['EzyLM1KrG0vdosRCZq0Y', 'Sao2W8mYPHsEPQ2Nx6mg', 'nuu6LConn2h2aHHacyJu'];
    console.log("getUsersByUserDocIds: ", docIds);
    return this.firestore.collection('users', q => q.where(firebase.firestore.FieldPath.documentId(), "in", docIds)).snapshotChanges().pipe(
      map(actions => {
        return actions.map(p => {
          var user = p.payload.doc.data() as User;
          user.password = '';
          console.log("getUsersByUserDocIds user: ", user);
          return { ...user, docId: p.payload.doc.id } as User;
        });
      }));
  }

  public getAllUsers() {
    return this.getAll();
  }

  public getUserByDocId(docId: string) {
    return this.getByDocId(docId);
  }



  private saveLocal(user: User) {
    console.log('local', user);
    var encripted = this.helpService.encryptData(JSON.stringify({ docId: user.docId, name: user.name, role: user.role, email: user.email }));
    localStorage.setItem("user", encripted);
  }

  private getLocal(): Account {
    var json = localStorage.getItem("user");
    if (json) {
      var decripted = this.helpService.decryptData(json);
      var user = JSON.parse(decripted);
      return user as Account;
    }
    return new Account();
  }

}
