import { Component, OnInit } from '@angular/core';
import { TriggersService } from "../../../services/triggers.service";
import { HelperService } from "../../../common/helper.service";
import { User } from "../../../models/user";
import { AccountService } from "../../../services/account.service";
import { UserImport } from "../../../models/custom-models";



@Component({
  selector: 'app-triggers',
  templateUrl: './triggers.component.html',
  styleUrls: ['./triggers.component.scss']
})
export class TriggersComponent implements OnInit {

  constructor(private triggerService: TriggersService, private accountService:AccountService, private helperService: HelperService) { }

   userJson = [
    {
      "NewName": "Ada",
      "Mobile": "0413262488",
      "Email": "ada.zhu80@gmail.com",
      "Grade": "D",
      "GradePoints": "0",
      "IsCreditUser": "TRUE",
      "requireChangePassword": "TRUE",
      "OldName": "Ada",
      "FamilyUsers": "Justin G,Michael G",
      "CreditBalance": "104.00",
      "Gender": "Female"
    },
    {
      "NewName": "Alex Ge",
      "Mobile": "0430458688",
      "Email": "completege1@hotmail.com",
      "Grade": "C",
      "GradePoints": "0",
      "IsCreditUser": "TRUE",
      "requireChangePassword": "TRUE",
      "OldName": "Alex Ge",
      "FamilyUsers": "",
      "CreditBalance": "65.00",
      "Gender": "Male"
    }
  ]

  ngOnInit(): void {
    this.helperService.generateRandomPassword(8);

  }

  onPrepopulateBookingClick() {
  }

  importMainAccount() {
    var userArray = this.readUserJsonFile();
    console.log(userArray);
    this.accountService.ImportMainAccounts(userArray);
  }

  importFamily() {
  }

getpassword() {
  var password = this.helperService.generateRandomPassword(8);
  console.log(password);
}
  readUserJsonFile() {
    var usersJson = this.userJson.filter(x=> x.NewName!="");
    var userObjects:UserImport[]=[];
    //main account import

    usersJson.forEach(uj => {
      var familyStr = uj.FamilyUsers;
      if (familyStr) {

      }
      var user = {
        name: uj.NewName,
        email: uj.Email,
        mobile: uj.Mobile,
        gender: uj.Gender,
        isMember: false,
        isChild: false,
        grade: uj.Grade,
        gradePoints: parseInt(uj.GradePoints),
        isCreditUser: uj.IsCreditUser == 'TRUE'? true:false,
        requireChangePassword: true,
        password: this.helperService.generateRandomPassword(8),
        creditBalance: 68,
        family:uj.FamilyUsers.split(',')
      } as UserImport;
      
      userObjects.push(user);

    }) //loop

    //console.log(userObjects);
    return userObjects;
  }


  //Test cases
  onCombineDatesClick() {
    const example = {a: 'a'} as Test;

    example?.a  // ["first", {b:3}, false]
    let x = example.b ? 'xxx':'yyy' // undefined

    console.log('print out x: ', x);

    const lastMonday = new Date('2021-03-08');
    console.log('last monday: ', lastMonday)
    const daysfromToday = this.helperService.addDays(5);


    this.helperService.addDays(5, daysfromToday);
    this.helperService.combinDateAndTime('2021-01-01', '20:00');
    this.helperService.findNextDayOfTheWeek('friday', true, lastMonday);

    var d1 = new Date('2021-02-26T00:00:00'); 
    var d2 = new Date('2021-03-31T00:00:00'); 
    var d3 = new Date('2022-01-01T00:00:00'); 

    this.helperService.findDateRangeOfCurrentWeek(d3);

    this.helperService.findWeekdays('tue', 10);

  }

}

export class Test {
  a:string;
  b:string;
}
