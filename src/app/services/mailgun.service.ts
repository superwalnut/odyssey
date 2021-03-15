import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MailgunService {
  constructor(private http: HttpClient) {
  }

  sendMail(email:string, subject:string, body:string) {
    const headers = new HttpHeaders({
      'enctype': 'multipart/form-data',
      'Authorization': 'Basic ' + btoa('api:520a91c49b5a694b32f640f22dd313af-29561299-804372a6')
    });

    const formData = new FormData();
    formData.append('from', 'HBC <postmaster@hbc666.club>');
    formData.append('to', email);
    formData.append('subject', subject);
    formData.append('text', body);

    this.http
      .post(
        'https://api.mailgun.net/v3/sandboxxxxxxxxxxxxxxxxxxxxxxxxxxb.mailgun.org/messages',
        formData,
        { headers }
      ).subscribe(
        res => { console.log('res : ', res); },
        err => { console.log('err : ', err); }
      );
  }
}

