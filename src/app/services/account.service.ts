import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user';
import { FirestoreBaseService } from './firestore-base.service';
import { map, concatMap, finalize } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { Account } from '../models/account';

@Injectable({
  providedIn: 'root'
})
export class AccountService extends FirestoreBaseService<User>{
  private accountSubject: BehaviorSubject<User>;
  public account: Observable<User>;

  constructor(private firestore: AngularFirestore, private router: Router, private route: ActivatedRoute,) {
    super(firestore.collection('users'));
    this.accountSubject = new BehaviorSubject<User>(null);
    this.account = this.accountSubject.asObservable();
  }

  public get accountValue(): User {
    return this.accountSubject.value;
  }

  login(email:string, password:string) {
    // login with facebook then authenticate with the API to get a JWT auth token
    this.authenticate(email, password).subscribe(x=>{
      if(x){
        this.saveLocal(x);
        this.accountSubject.next(x);
        // get return url from query parameters or default to home page
        var returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
        console.log('returnUrl', returnUrl);
        if(returnUrl == '/login' || returnUrl == '/register')
            returnUrl = '/dashboard';
        this.router.navigateByUrl(returnUrl);
      } else {
        console.log('login failed');
      }
      
    });
  }

  authenticate(email:string, password:string) : Observable<User>{
    return this.firestore.collection('users', q => q.where("email", "==", email).where("password", "==", password).limit(1)).snapshotChanges().pipe(
      map(actions => {
          if(actions && actions.length > 0){
            var acc = actions[0].payload.doc.data() as User;
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
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
        return false;
    }
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['/login']);
  }

  createUser(user:User) {
    return this.create(user);
  }

  updateUser(docId:string, user:User) {
    return this.update(docId, user);
  }

  isAdmin() {
    const role = this.getLoginAccount()?.role??'';
    if(role == 'Admin' || role == 'God'){
      return true;
    }

    return false;
  }

  isGod() {
    const role = this.getLoginAccount()?.role??'';
    if(role == 'God'){
      return true;
    }

    return false;
  }

  getLoginAccount() {
    var account = this.getLocal();
    if(account){
      return account;
    }

    const user = this.accountValue;
    if (user) {
        // logged in so return true
        return { docId: user.docId, email: user.email, role: user.role } as Account;
    }

    return null;
  }

  public getLoginUser() {
    var email = this.getLoginAccount()?.email??'';
    
    return this.firestore.collection('users', q => q.where("email", "==", email).limit(1)).snapshotChanges().pipe(
      map(actions => {
          if(actions && actions.length > 0){
            var acc = actions[0].payload.doc.data() as User;
            return {
              ...acc,
              docId: actions[0].payload.doc.id
            };
          } else {
            return null;
          }
        }));
  }

  private saveLocal(user:User) {
    console.log('local', user);
    var encripted = this.encryptData(JSON.stringify({ docId: user.docId, email : user.email, role : user.role}));
    localStorage.setItem("user", encripted);
  }

  private getLocal() : Account {
    var json = localStorage.getItem("user");
    if(json){
      var decripted = this.decryptData(json);
      var user = JSON.parse(decripted);
      return user as Account;
    }
    return new Account();
  }

}
