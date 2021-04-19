import { Injectable } from '@angular/core';
import { formatCurrency } from '@angular/common';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MailgunService {
  mailUrl:string = `${environment.mail_url}/sendemail`;
  domain:string = environment.domain;

  constructor(private http: HttpClient) {
  }

  private sendMail(mail:any) : Promise<boolean>{
    let promise = new Promise<boolean>((resolve, reject) => {
      this.http.post(this.mailUrl, mail, { responseType: 'text' })
        .toPromise()
        .then(
          res => { // Success
            resolve(true);
          }
        ).catch(err=>{
          console.log(err);
          reject(err);
        });
    });
    return promise;
  }

  sendForgotPassword(email:string, hashKey:string) {
    const mail = {
      from: 'HBC <support@hbc666.club>',
      to: email,
      subject: 'HBC - Reset your password',
      template: "forgotpassword",
      'v:domain': this.domain,
      'v:hashkey': hashKey,
    };

    console.log('forgot', mail);
    console.log('url', this.mailUrl);
    return this.sendMail(mail);
  }

  sendImportUser(email:string, mobile:string, hashKey:string) {
    const mail = {
      from: 'HBC <support@hbc666.club>',
      to: email,
      subject: 'Your account at HBC is created',
      template: "import",
      'v:domain': this.domain,
      'v:mobile': mobile,
      'v:hashkey': hashKey,
    };
    return this.sendMail(mail);
  }

  sendRegistration(email:string, name:string, hashKey:string) {
    const mail = {
      from: 'HBC <support@hbc666.club>',
      to: email,
      subject: 'Welcome to the HBC',
      template: "registration",
      'v:domain': this.domain,
      'v:name': name,
    };
    return this.sendMail(mail);
  }

  sendCreditReminder(email:string, name:string, balance:number) {
    const mail = {
      from: 'HBC <support@hbc666.club>',
      to: email,
      subject: 'You credit is running low',
      template: "creditreminder",
      'v:domain': this.domain,
      'v:name': name,
      'v:balance': formatCurrency(balance,'en', '$'),
    };
    return this.sendMail(mail);
  }

  sendTopupSucceed(email:string, name:string, amount:number) {
    const mail = {
      from: 'HBC <support@hbc666.club>',
      to: email,
      subject: 'Your topup is successful',
      template: "topup",
      'v:domain': this.domain,
      'v:name': name,
      'v:amount': formatCurrency(amount,'en', '$'),
    };
    return this.sendMail(mail);
  }


}

