import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user';
import { FirestoreBaseService } from './firestore-base.service';
import { map, concatMap, finalize } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';

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

  getLoginUser() {
    var email = '';
    var user = this.getLocal();
    if(user){
      email = user.email;
    }

    const account = this.accountValue;
    if (account) {
        // logged in so return true
        email = account.email;
    }

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

  saveLocal(user:User) {
    console.log('local', user);
    var encripted = this.encryptData(JSON.stringify({ docId: user.docId, email : user.email}));
    localStorage.setItem("user", encripted);
  }

  getLocal() : User {
    var json = localStorage.getItem("user");
    if(json){
      var decripted = this.decryptData(json);
      var user = JSON.parse(decripted);
      return user;
    }
    return null;
  }

}
