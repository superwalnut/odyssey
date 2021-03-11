import { Component, OnDestroy, OnInit } from '@angular/core';
import firebase from 'firebase/app';
import { Subject } from 'rxjs';
import Timestamp = firebase.firestore.Timestamp;

@Component({
    selector: 'app-base',
    template: `
        <div>
            base works!!
        </div>
    `
  })
export class BaseComponent implements OnDestroy {
    ngUnsubscribe = new Subject<void>();

    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
      }
    
}