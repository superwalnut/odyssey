import { Injectable } from '@angular/core';
import firebase from 'firebase/app';
import Timestamp = firebase.firestore.Timestamp;

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor() { }

  //DateTime Helpers
  today() {
    return new Date();
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




  addDays(days: number, startDate = new Date()) {
    startDate.setDate(startDate.getDate() + days);
    console.log('addDays: ', startDate);
    this.convertToTimestamp(startDate);
    return startDate;

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

}
