import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor() { }

  //DateTime Helpers
  combinDateAndTime(day: string, time: string) {

    let datestring = '1968-11-16T10:30:00';
    let newDate = new Date(datestring);


  }
}
