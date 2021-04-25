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

    downloadFile(data:any, fileName:string) {
        const replacer = (key, value) => (value === null ? '' : value); // specify how you want to handle null values here
        const header = Object.keys(data[0]);
        const csv = data.map((row) =>
          header
            .map((fieldName) => JSON.stringify(row[fieldName], replacer))
            .join(',')
        );
        csv.unshift(header.join(','));
        const csvArray = csv.join('\r\n');
      
        const a = document.createElement('a');
        const blob = new Blob([csvArray], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
      
        a.href = url;
        a.download = `${fileName}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
      }
    
}