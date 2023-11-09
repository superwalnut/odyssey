import { Injectable } from '@angular/core';
import firebase from 'firebase/app';
import Timestamp = firebase.firestore.Timestamp;
import * as CryptoJS from 'crypto-js';
import { Group } from '../models/group';
import { GlobalConstants } from '../common/global-constants';

@Injectable({
  providedIn: 'root'
})
export class HelperService {
  private encryptSecretKey = "5ed40d89-0194-47da-8e3f-04df8be154a6";

  constructor() { }

  //DateTime Helpers
  today() {
    return new Date();
  }

  calculateDiffFromToday(date:Date){
    let currentDate = new Date();
    return Math.floor((Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) - Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) ) /(1000 * 60 * 60 * 24));
  }

  compareDates(d1:Timestamp, d2:Timestamp) {
   
    //console.log(d1.toDate().setHours(0,0,0,0) == d2.toDate().setHours(0,0,0,0));
    return d1.toDate().setHours(0,0,0,0) == d2.toDate().setHours(0,0,0,0);
  }
  //DAY FORMAT: 2021-01-01, TIME format 20:00 (24hours)
  combinDateAndTime(day: string, time: string) {

    //let datestring = '1968-11-16T10:30:00';
    let datestring = day + 'T' + time;
    console.log("original date and time: ", datestring);
    let newDate = new Date(datestring);
    console.log('combinDateAndTime: ', newDate);
    return newDate;
  }

  combinDateTypeAndTime(date: Date, time: string) {

    //let datestring = '1968-11-16T10:30:00';
    console.log('xxxxx: ', time);

    var month = ('0' + (date.getMonth() + 1)).slice(-2);
    var day = ('0' + date.getDate()).slice(-2);
    var year = date.getFullYear();
    var newdate = year + "-" + month + "-" + day;

    console.log('combinDateTypeAndTime: ', newdate);
    console.log(this.combinDateAndTime(newdate, time));

    return this.combinDateAndTime(newdate, time);
  }

  getFormattedTimestamp(ts:Timestamp) {
    let dt = ts.toDate();
    let date = dt.getDate();
    let month = dt.getMonth() + 1;
    let year = dt.getFullYear();
    let hr = dt.getHours();
    let min = dt.getMinutes();

    return date + '/' + month + '/' + year + ' ' + hr + ':' + min;

  }

  getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
  }

  generateRandomPassword(length:number) {
    var charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
  }

  addDays(days: number, startDate = new Date()) {
    startDate.setDate(startDate.getDate() + days);
    console.log('addDays: ', startDate);
    this.convertToTimestamp(startDate);
    return startDate;

  }


  findDateRangeOfCurrentWeek(curr: Date) {
    //var curr = new Date('2014-10-01T00:00:00'); 
    var first = curr.getDate() - curr.getDay() + 1;
    var last = first + 6; // last day is the first day + 6   
    var firstday = new Date(curr.setDate(first));
    var lastday = new Date(curr.setDate(firstday.getDate() + 6));

    //return d1.toDate().setHours(0,0,0,0) == d2.toDate().setHours(0,0,0,0);
    firstday.setHours(0,0,0,0);
    lastday.setHours(23,59,59,0);

    console.log("findDateRangeOfCurrentWeek", { firstday, lastday })
    return { firstday, lastday };
  }

  //It returns next Week's day. ie. if today is Monday, it won't return THIS FRIDAY, but Next FRIDAY!
  findNextDayOfTheWeek(dayName: string, excludeToday: boolean = true, refDate = new Date()) {
    const dayOfWeek = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"].indexOf(dayName.slice(0, 3).toLowerCase());
    if (dayOfWeek < 0) return;

    refDate.setHours(0, 0, 0, 0);
    refDate.setDate(refDate.getDate() + +!!excludeToday +
      (dayOfWeek + 7 - refDate.getDay() - +!!excludeToday) % 7);
    return refDate;
  }

  findWeekdays(dayName: string, maxOccurence: number, refDate = new Date()) {
    var dateList: Date[] = [];
    var initDay = refDate;

    for (let i = 0; i < maxOccurence; i++) {
      var d = new Date();

      d = this.findNextDayOfTheWeek(dayName, true, initDay);
      initDay = d;
      dateList.push(new Date(+d));
      console.log("days: ", d)
    }

    console.log("days: ", dateList)
    return dateList;
  }

  extractHour(str: any) {
    var h = String(str).split(':')[0]
    console.log("new date: ", String(str).split(':'));
    return Number(h);
    //let newDate = str.toDate().toDateString();
    //console.log("new date: ", newDate);
    //return newDate;
  }
  convertToTimestamp(date: Date): Timestamp {
    const ts = Timestamp.fromDate(date);
    return ts;
  }

  convertToDate(ts: Timestamp): Date {
    return ts.toDate();
  }

  getTodayTimestamp() {
    return this.convertToTimestamp(new Date());
  }

  findTimeDifference(ts1: Timestamp, ts2: Timestamp = Timestamp.now()) {

    let seconds = ts1.seconds - ts2.seconds;
    return seconds;


  }

  encryptData(data) {
    try {
      return CryptoJS.AES.encrypt(JSON.stringify(data), this.encryptSecretKey).toString();
    } catch (e) {
      console.log(e);
    }
  }

  decryptData(data) {
    try {
      const bytes = CryptoJS.AES.decrypt(data, this.encryptSecretKey);
      if (bytes.toString()) {
        console.log('bytes', bytes.toString());
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      }
      return data;
    } catch (e) {
      console.log(e);
    }
  }

  //only used by saturday happy hour - HBCoin holder family has special price (only apply to more than 1 member)
  findRates(isCreditUser:boolean, isCommittee:boolean, isFriend:boolean, group: Group, familyCount:number) {
    var amount = 0;
    var isSaturdayTraining = group.groupName.toLowerCase().includes('training');
    if(isSaturdayTraining){
      if (isFriend || !isCreditUser) return GlobalConstants.rateTraining;

      if(isCommittee){
        return GlobalConstants.rateTrainingCommitte;  
      }
      return GlobalConstants.rateTraining;
    }

    if (isFriend || !isCreditUser) return GlobalConstants.rateCash; //friend or cash user, return cash rate straight away
    if (isCommittee) return 0;

    //HBCoin users
    amount = GlobalConstants.rateCredit;
    return amount;
  }
}
