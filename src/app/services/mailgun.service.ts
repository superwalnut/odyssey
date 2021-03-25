import { Injectable } from '@angular/core';
import { formatCurrency } from '@angular/common';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MailgunService {
  mailUrl:string = `${environment.api_url}/sendmail`;

  constructor(private http: HttpClient) {
  }

  private sendMail(mail:any) : Promise<boolean>{
    let promise = new Promise<boolean>((resolve, reject) => {
      this.http.post(this.mailUrl, mail)
        .toPromise()
        .then(
          res => { // Success
            console.log(res);
            resolve(true);
          }
        ).catch(err=>{
          reject(err);
        });
    });
    return promise;
  }

  sendForgotPassword(email:string, hashKey:string) {
    const mail = {
      from: 'HBC Support <support@hbc666.club>',
      to: email,
      subject: 'HBC - Reset your password',
      template: "forgotpassword",
      'v:hashkey': hashKey,
    };
    return this.sendMail(mail);
  }

  sendRegistration(email:string, name:string, hashKey:string) {
    const mail = {
      from: 'HBC Support <support@hbc666.club>',
      to: email,
      subject: 'Welcome to the HBC',
      template: "registration",
      'v:name': name,
      'v:hashkey': hashKey,
    };
    return this.sendMail(mail);
  }

  sendCreditReminder(email:string, name:string, balance:number) {
    const mail = {
      from: 'HBC Support <support@hbc666.club>',
      to: email,
      subject: 'You credit is running low',
      template: "creditreminder",
      'v:name': name,
      'v:balance': formatCurrency(balance,'en', '$'),
    };
    return this.sendMail(mail);
  }

  sendTopupSucceed(email:string, name:string, amount:number) {
    const mail = {
      from: 'HBC Support <support@hbc666.club>',
      to: email,
      subject: 'Your topup is successful',
      template: "topup",
      'v:name': name,
      'v:amount': formatCurrency(amount,'en', '$'),
    };
    return this.sendMail(mail);
  }


}

