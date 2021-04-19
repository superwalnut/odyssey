import { Component, OnInit } from '@angular/core';
import { TriggersService } from "../../../services/triggers.service";
import { HelperService } from "../../../common/helper.service";
import { User } from "../../../models/user";
import { AccountService } from "../../../services/account.service";
import { UserImport } from "../../../models/custom-models";
import { MailgunService } from "../../../services/mailgun.service";



@Component({
  selector: 'app-triggers',
  templateUrl: './triggers.component.html',
  styleUrls: ['./triggers.component.scss']
})
export class TriggersComponent implements OnInit {

  vipList = ['Luc', 'Ting CA', '美丽Mannie', 'Shirley', 'KevinW', 'Josh Zhang', 'Canny', 'Frank']
  constructor(private triggerService: TriggersService, private accountService:AccountService, private mailgunService:MailgunService, private helperService: HelperService) { }

   userJson = [
    
      {
        "NewName": "Ada",
        "Mobile": "0413262488",
        "Email": "ada.zhu80@gmail.com",
        "Grade": "D",
        "GradePoints": 0,
        "IsCreditUser": "TRUE",
        "requireChangePassword": "TRUE",
        "OldName": "Ada",
        "FamilyUsers": "Justin G,Michael G",
        "CreditBalance": 91,
        "Gender": "Female"
      },
      {
        "NewName": "Alex Ge",
        "Mobile": "0430458688",
        "Email": "completege1@hotmail.com",
        "Grade": "C",
        "GradePoints": 0,
        "IsCreditUser": "TRUE",
        "requireChangePassword": "TRUE",
        "OldName": "Alex Ge",
        "FamilyUsers": "",
        "CreditBalance": 52,
        "Gender": "Male"
      },
      {
        "NewName": "AlexR",
        "Mobile": "0431391842",
        "Email": "raffier.alex@gmail.com",
        "Grade": "C",
        "GradePoints": 0,
        "IsCreditUser": "TRUE",
        "requireChangePassword": "TRUE",
        "OldName": "Alex Raffier",
        "FamilyUsers": "",
        "CreditBalance": 182,
        "Gender": "Male"
      },
      {
        "NewName": "80kg Alex Zhang",
        "Mobile": "0425432866",
        "Email": "alexlongma@gmail.com",
        "Grade": "E",
        "GradePoints": 0,
        "IsCreditUser": "TRUE",
        "requireChangePassword": "TRUE",
        "OldName": "Alex Zhang",
        "FamilyUsers": "",
        "CreditBalance": 117,
        "Gender": "Male"
      },
      {
        "NewName": "Andi",
        "Mobile": "0405828485",
        "Email": "andichow@gmail.com",
        "Grade": "C",
        "GradePoints": 0,
        "IsCreditUser": "TRUE",
        "requireChangePassword": "TRUE",
        "OldName": "Andi",
        "FamilyUsers": "",
        "CreditBalance": 65,
        "Gender": "Male"
      },
      {
        "NewName": "Anna Kan",
        "Mobile": "0424074803",
        "Email": "Ranekan@hotmail.com",
        "Grade": "E",
        "GradePoints": 0,
        "IsCreditUser": "TRUE",
        "requireChangePassword": "TRUE",
        "OldName": "Anna Kan",
        "FamilyUsers": "",
        "CreditBalance": 52,
        "Gender": "Female"
      },
      {
        "NewName": "Apple Yuan",
        "Mobile": "0404131309",
        "Email": "appleyuan@hotmail.com",
        "Grade": "E",
        "GradePoints": 0,
        "IsCreditUser": "TRUE",
        "requireChangePassword": "TRUE",
        "OldName": "Apple",
        "FamilyUsers": "Yongzhen",
        "CreditBalance": 208,
        "Gender": "Female"
      },
      {
        "NewName": "Audrey Chen",
        "Mobile": "0411037608",
        "Email": "audreychenyx@hotmail.com",
        "Grade": "E",
        "GradePoints": 0,
        "IsCreditUser": "TRUE",
        "requireChangePassword": "TRUE",
        "OldName": "Audrey",
        "FamilyUsers": "Kate Deng",
        "CreditBalance": 13,
        "Gender": "Female"
      },
      {
        "NewName": "Bella",
        "Mobile": "0415087758",
        "Email": "apriloz@hotmail.com",
        "Grade": "E",
        "GradePoints": 0,
        "IsCreditUser": "TRUE",
        "requireChangePassword": "TRUE",
        "OldName": "Bella",
        "FamilyUsers": "",
        "CreditBalance": 39,
        "Gender": "Female"
      },
      {
        "NewName": "Jennifer Xu",
        "Mobile": "0414360152",
        "Email": "jenniferwen00@gmail.com",
        "Grade": "D",
        "GradePoints": 0,
        "IsCreditUser": "TRUE",
        "requireChangePassword": "TRUE",
        "OldName": "Jennifer",
        "FamilyUsers": "Ben",
        "CreditBalance": 13,
        "Gender": "Male"
      },
      {
        "NewName": "Benson",
        "Mobile": "0416538984",
        "Email": "asfacas13@gmail.com",
        "Grade": "D",
        "GradePoints": 0,
        "IsCreditUser": "",
        "requireChangePassword": "TRUE",
        "OldName": "Benson",
        "FamilyUsers": "",
        "CreditBalance": 0,
        "Gender": "Male"
      },
      {
        "NewName": "Brendan",
        "Mobile": "0433034006",
        "Email": "brendanlow@gmail.com",
        "Grade": "E",
        "GradePoints": 0,
        "IsCreditUser": "TRUE",
        "requireChangePassword": "TRUE",
        "OldName": "Brendan",
        "FamilyUsers": "",
        "CreditBalance": 13,
        "Gender": "Male"
      },
      {
        "NewName": "Bryan",
        "Mobile": "0430858417",
        "Email": "henicoo@gmail.com",
        "Grade": "D",
        "GradePoints": 0,
        "IsCreditUser": "TRUE",
        "requireChangePassword": "TRUE",
        "OldName": "Bryan Wang(双鱼王）",
        "FamilyUsers": "",
        "CreditBalance": 52,
        "Gender": "Male"
      },
      {
        "NewName": "Canny",
        "Mobile": "0410673878",
        "Email": "cannyclk11@hotmail.com",
        "Grade": "D",
        "GradePoints": 0,
        "IsCreditUser": "TRUE",
        "requireChangePassword": "TRUE",
        "OldName": "Canny",
        "FamilyUsers": "Simon,Nick,Luke",
        "CreditBalance": 0,
        "Gender": "Female"
      },
      {
        "NewName": "CC",
        "Mobile": "0410988832",
        "Email": "cecilsiu428@yahoo.com.au",
        "Grade": "E",
        "GradePoints": 0,
        "IsCreditUser": "TRUE",
        "requireChangePassword": "TRUE",
        "OldName": "CC",
        "FamilyUsers": "",
        "CreditBalance": 65,
        "Gender": "Female"
      },
      {
        "NewName": "Charles Wang",
        "Mobile": "0413734993",
        "Email": "cwang1110@gmail.com",
        "Grade": "D",
        "GradePoints": 0,
        "IsCreditUser": "TRUE",
        "requireChangePassword": "TRUE",
        "OldName": "Charles",
        "FamilyUsers": "Zoe",
        "CreditBalance": 0,
        "Gender": "Male"
      },
      {
        "NewName": "Charles Song",
        "Mobile": "0416440603",
        "Email": "13467915@student.uts.edu.au",
        "Grade": "D",
        "GradePoints": 0,
        "IsCreditUser": "TRUE",
        "requireChangePassword": "TRUE",
        "OldName": "Charles Song",
        "FamilyUsers": "",
        "CreditBalance": 143,
        "Gender": "Male"
      },
      {
        "NewName": "Chins",
        "Mobile": "0412965086",
        "Email": "chinmay.rangras@gmail.com",
        "Grade": "D",
        "GradePoints": 0,
        "IsCreditUser": "TRUE",
        "requireChangePassword": "TRUE",
        "OldName": "Chins",
        "FamilyUsers": "",
        "CreditBalance": 39,
        "Gender": "Male"
      },
      {
        "NewName": "Chook",
        "Mobile": "0402504362",
        "Email": "kmchook@outlook.com",
        "Grade": "D",
        "GradePoints": 0,
        "IsCreditUser": "",
        "requireChangePassword": "TRUE",
        "OldName": "Chook",
        "FamilyUsers": "",
        "CreditBalance": 0,
        "Gender": "Male"
      },
      {
        "NewName": "Christina Lee",
        "Mobile": "0415415985",
        "Email": "christina3000@gmail.com",
        "Grade": "E",
        "GradePoints": 0,
        "IsCreditUser": "TRUE",
        "requireChangePassword": "TRUE",
        "OldName": "Christina Lee",
        "FamilyUsers": "",
        "CreditBalance": 117,
        "Gender": "Female"
      },
      {
        "NewName": "David Dong",
        "Mobile": "0428184056",
        "Email": "David.Iris1314@gmail.com",
        "Grade": "E",
        "GradePoints": 0,
        "IsCreditUser": "TRUE",
        "requireChangePassword": "TRUE",
        "OldName": "David Dong",
        "FamilyUsers": "",
        "CreditBalance": 39,
        "Gender": "Male"
      },
      {
        "NewName": "David He",
        "Mobile": "0435528870",
        "Email": "dzch961@gmail.com",
        "Grade": "E",
        "GradePoints": 0,
        "IsCreditUser": "",
        "requireChangePassword": "TRUE",
        "OldName": "David He",
        "FamilyUsers": "",
        "CreditBalance": 0,
        "Gender": "Male"
      },
      {
        "NewName": "David Wang",
        "Mobile": "0436658500",
        "Email": "jiabowang05@gmail.com",
        "Grade": "E",
        "GradePoints": 0,
        "IsCreditUser": "TRUE",
        "requireChangePassword": "TRUE",
        "OldName": "David W",
        "FamilyUsers": "",
        "CreditBalance": 39,
        "Gender": "Male"
      },
      {
        "NewName": "Edward D",
        "Mobile": "0403052102",
        "Email": "drd777@outlook.com",
        "Grade": "E",
        "GradePoints": 0,
        "IsCreditUser": "TRUE",
        "requireChangePassword": "TRUE",
        "OldName": "Edward",
        "FamilyUsers": "Christopher",
        "CreditBalance": 13,
        "Gender": "Male"
      },
      {
        "NewName": "Elaine Ho",
        "Mobile": "0452612565",
        "Email": "oikhei@gmail.com",
        "Grade": "D",
        "GradePoints": 0,
        "IsCreditUser": "TRUE",
        "requireChangePassword": "TRUE",
        "OldName": "Elaine Ho",
        "FamilyUsers": "",
        "CreditBalance": 117,
        "Gender": "Female"
      },
      {
        "NewName": "Elly赵欣",
        "Mobile": "0408642329",
        "Email": "ecnu_2000@163.com",
        "Grade": "D",
        "GradePoints": 0,
        "IsCreditUser": "TRUE",
        "requireChangePassword": "TRUE",
        "OldName": "Elly赵欣",
        "FamilyUsers": "",
        "CreditBalance": 65,
        "Gender": "Female"
      },
      {
        "NewName": "Ethan Jin",
        "Mobile": "0468512080",
        "Email": "yingwu.jin@hotmail.com",
        "Grade": "E",
        "GradePoints": 0,
        "IsCreditUser": "TRUE",
        "requireChangePassword": "TRUE",
        "OldName": "Ethan电工",
        "FamilyUsers": "",
        "CreditBalance": 0,
        "Gender": "Male"
      },
      {
        "NewName": "Feng",
        "Mobile": "0401599736",
        "Email": "marco_yufeng@hotmail.com",
        "Grade": "D",
        "GradePoints": 0,
        "IsCreditUser": "TRUE",
        "requireChangePassword": "TRUE",
        "OldName": "Feng",
        "FamilyUsers": "",
        "CreditBalance": 26,
        "Gender": "Male"
      },
      {
        "NewName": "Francis",
        "Mobile": "0434087284",
        "Email": "francishe2007@yahoo.com.au",
        "Grade": "E",
        "GradePoints": 0,
        "IsCreditUser": "TRUE",
        "requireChangePassword": "TRUE",
        "OldName": "Francis",
        "FamilyUsers": "",
        "CreditBalance": 117,
        "Gender": "Male"
      },
      {
        "NewName": "Frank",
        "Mobile": "0402155868",
        "Email": "frankyangtao@gmail.com",
        "Grade": "E",
        "GradePoints": 0,
        "IsCreditUser": "TRUE",
        "requireChangePassword": "TRUE",
        "OldName": "Frank",
        "FamilyUsers": "",
        "CreditBalance": 0,
        "Gender": "Male"
      },
      {
        "NewName": "Frank Z",
        "Mobile": "0415615698",
        "Email": "changle2012@yahoo.com.au",
        "Grade": "C",
        "GradePoints": 0,
        "IsCreditUser": "",
        "requireChangePassword": "TRUE",
        "OldName": "Frank Zhang",
        "FamilyUsers": "",
        "CreditBalance": 0,
        "Gender": "Male"
      },
      {
        "NewName": "Gary",
        "Mobile": "0478151916",
        "Email": "gychang2000@hotmail.com",
        "Grade": "C",
        "GradePoints": 4.6,
        "IsCreditUser": "TRUE",
        "requireChangePassword": "TRUE",
        "OldName": "Gary",
        "FamilyUsers": "EnochC",
        "CreditBalance": 0,
        "Gender": "Male"
      },
      {
        "NewName": "Glen",
        "Mobile": "0406436861",
        "Email": "wangxiao_ch@yahoo.com",
        "Grade": "D",
        "GradePoints": 0,
        "IsCreditUser": "TRUE",
        "requireChangePassword": "TRUE",
        "OldName": "Glen",
        "FamilyUsers": "",
        "CreditBalance": 91,
        "Gender": "Male"
      },
      {
        "NewName": "Hannah",
        "Mobile": "0403649446",
        "Email": "ka_zling@hotmail.com",
        "Grade": "E",
        "GradePoints": 0,
        "IsCreditUser": "TRUE",
        "requireChangePassword": "TRUE",
        "OldName": "Hannah",
        "FamilyUsers": "",
        "CreditBalance": 117,
        "Gender": "Female"
      },
      {
        "NewName": "Henry Su",
        "Mobile": "0423523823",
        "Email": "henrysuplus@yahoo.com.au",
        "Grade": "D",
        "GradePoints": 0,
        "IsCreditUser": "TRUE",
        "requireChangePassword": "TRUE",
        "OldName": "Henry",
        "FamilyUsers": "",
        "CreditBalance": 52,
        "Gender": "Male"
      },
      {
        "NewName": "Herbert",
        "Mobile": "0420572215",
        "Email": "herbertyuan22@gmail.com",
        "Grade": "D",
        "GradePoints": 0,
        "IsCreditUser": "TRUE",
        "requireChangePassword": "TRUE",
        "OldName": "Herbert",
        "FamilyUsers": "",
        "CreditBalance": 26,
        "Gender": "Male"
      },
      {
        "NewName": "Hugh",
        "Mobile": "0451668958",
        "Email": "huhe1969@hotmail.com",
        "Grade": "C",
        "GradePoints": 0,
        "IsCreditUser": "",
        "requireChangePassword": "TRUE",
        "OldName": "Hugh",
        "FamilyUsers": "Renee",
        "CreditBalance": 0,
        "Gender": "Male"
      },
      {
        "NewName": "Cream",
        "Mobile": "0431695247",
        "Email": "happyjane_crying@hotmail.com",
        "Grade": "D",
        "GradePoints": 0,
        "IsCreditUser": "TRUE",
        "requireChangePassword": "TRUE",
        "OldName": "Iris",
        "FamilyUsers": "Neil,Sean",
        "CreditBalance": 104,
        "Gender": "Female"
      },
      {
        "NewName": "Jack L",
        "Mobile": "0404139888",
        "Email": "nice_jack@live.cn",
        "Grade": "F",
        "GradePoints": 0,
        "IsCreditUser": "TRUE",
        "requireChangePassword": "TRUE",
        "OldName": "Jack(Helen)",
        "FamilyUsers": "Helen,Elma",
        "CreditBalance": 0,
        "Gender": "Male"
      },
      {
        "NewName": "Jacky Z",
        "Mobile": "0410138150",
        "Email": "jacky.zhang.au@gmail.com",
        "Grade": "D",
        "GradePoints": 0,
        "IsCreditUser": "TRUE",
        "requireChangePassword": "TRUE",
        "OldName": "Jacky Zhang",
        "FamilyUsers": "Megan,Bei,Evan",
        "CreditBalance": 260,
        "Gender": "Male"
      },
      {
        "NewName": "Jason Chin",
        "Mobile": "0405536604",
        "Email": "jasonchchin@gmail.com",
        "Grade": "C",
        "GradePoints": 0,
        "IsCreditUser": "TRUE",
        "requireChangePassword": "TRUE",
        "OldName": "Jason Chin",
        "FamilyUsers": "Kate(Jason)",
        "CreditBalance": 52,
        "Gender": "Male"
      },
      {
        "NewName": "Jason Cui",
        "Mobile": "0478958816",
        "Email": "great_jason@hotmail.com",
        "Grade": "",
        "GradePoints": 0,
        "IsCreditUser": "TRUE",
        "requireChangePassword": "TRUE",
        "OldName": "Jason Cui",
        "FamilyUsers": "",
        "CreditBalance": 117,
        "Gender": "Male"
      },
      {
        "NewName": "Jeff Wang",
        "Mobile": "0417009871",
        "Email": "wenoch@gmail.com",
        "Grade": "D",
        "GradePoints": 0,
        "IsCreditUser": "TRUE",
        "requireChangePassword": "TRUE",
        "OldName": "Jeff",
        "FamilyUsers": "Maggie,Maggie Yao",
        "CreditBalance": 91,
        "Gender": "Male"
      },
      {
        "NewName": "Jency",
        "Mobile": "0438680029",
        "Email": "adepttravels@gmail.com",
        "Grade": "D",
        "GradePoints": 0,
        "IsCreditUser": "TRUE",
        "requireChangePassword": "TRUE",
        "OldName": "Jency",
        "FamilyUsers": "Jason",
        "CreditBalance": 13,
        "Gender": "Female"
      },
      {
        "NewName": "JessicaW",
        "Mobile": "0452581109",
        "Email": "wang_j1122@hotmail.com",
        "Grade": "E",
        "GradePoints": 0,
        "IsCreditUser": "TRUE",
        "requireChangePassword": "TRUE",
        "OldName": "Jessica W",
        "FamilyUsers": "Jason Z",
        "CreditBalance": 13,
        "Gender": "Female"
      },
      {
        "NewName": "JessicaZ",
        "Mobile": "0415859799",
        "Email": "Yijie33@hotmail.com",
        "Grade": "E",
        "GradePoints": 0,
        "IsCreditUser": "TRUE",
        "requireChangePassword": "TRUE",
        "OldName": "Jessica Z",
        "FamilyUsers": "",
        "CreditBalance": 0,
        "Gender": "Female"
      },
      {
        "NewName": "Jim L",
        "Mobile": "0466475033",
        "Email": "topliu88@gmail.com",
        "Grade": "E",
        "GradePoints": 0,
        "IsCreditUser": "TRUE",
        "requireChangePassword": "TRUE",
        "OldName": "Jim L",
        "FamilyUsers": "Shirley Y",
        "CreditBalance": 260,
        "Gender": "Male"
      },
      {
        "NewName": "Jocelyn",
        "Mobile": "0433848970",
        "Email": "leunglksm@gmail.com",
        "Grade": "D",
        "GradePoints": 0,
        "IsCreditUser": "TRUE",
        "requireChangePassword": "TRUE",
        "OldName": "Joceyln",
        "FamilyUsers": "",
        "CreditBalance": 52,
        "Gender": "Female"
      },
      {
        "NewName": "Josh Zhang",
        "Mobile": "0433330987",
        "Email": "joshzhangjobs@gmail.com",
        "Grade": "D",
        "GradePoints": 0,
        "IsCreditUser": "TRUE",
        "requireChangePassword": "TRUE",
        "OldName": "Josh",
        "FamilyUsers": "",
        "CreditBalance": 0,
        "Gender": "Male"
      },
      {
        "NewName": "JZ",
        "Mobile": "0409979198",
        "Email": "jackeal_zhuj@hotmail.com",
        "Grade": "E",
        "GradePoints": 0,
        "IsCreditUser": "",
        "requireChangePassword": "TRUE",
        "OldName": "JZ",
        "FamilyUsers": "",
        "CreditBalance": 0,
        "Gender": "Male"
      },
      {
        "NewName": "Kai",
        "Mobile": "0402822228",
        "Email": "kaisquared90@gmail.com",
        "Grade": "C",
        "GradePoints": 0,
        "IsCreditUser": "TRUE",
        "requireChangePassword": "TRUE",
        "OldName": "Kai",
        "FamilyUsers": "",
        "CreditBalance": 91,
        "Gender": "Male"
      },
      {
        "NewName": "Karthik",
        "Mobile": "0469241444",
        "Email": "r.karthik@yahoo.com",
        "Grade": "E",
        "GradePoints": 0,
        "IsCreditUser": "TRUE",
        "requireChangePassword": "TRUE",
        "OldName": "Karthik",
        "FamilyUsers": "",
        "CreditBalance": 39,
        "Gender": "Male"
      },
      {
        "NewName": "Kathy",
        "Mobile": "0414266070",
        "Email": "Kathy0721@gmail.com",
        "Grade": "E",
        "GradePoints": 0,
        "IsCreditUser": "TRUE",
        "requireChangePassword": "TRUE",
        "OldName": "Kathy",
        "FamilyUsers": "",
        "CreditBalance": 65,
        "Gender": "Female"
      },
      {
        "NewName": "KevinW",
        "Mobile": "0433499901",
        "Email": "kevin.wangwei@gmail.com",
        "Grade": "E",
        "GradePoints": 0,
        "IsCreditUser": "TRUE",
        "requireChangePassword": "TRUE",
        "OldName": "Kevin Wang",
        "FamilyUsers": "",
        "CreditBalance": 0,
        "Gender": "Male"
      },
      {
        "NewName": "Lance",
        "Mobile": "0423432057",
        "Email": "truehoho@gmail.com",
        "Grade": "E",
        "GradePoints": 0,
        "IsCreditUser": "TRUE",
        "requireChangePassword": "TRUE",
        "OldName": "Lance",
        "FamilyUsers": "",
        "CreditBalance": 0,
        "Gender": "Male"
      },
      {
        "NewName": "Lenise",
        "Mobile": "0469915138",
        "Email": "lenise_yeoh@hotmail.com",
        "Grade": "D",
        "GradePoints": 0,
        "IsCreditUser": "TRUE",
        "requireChangePassword": "TRUE",
        "OldName": "Lenise",
        "FamilyUsers": "Jet,Say",
        "CreditBalance": 91,
        "Gender": "Female"
      },
      {
        "NewName": "Leon",
        "Mobile": "0433671656",
        "Email": "leonlai1997@hotmail.com",
        "Grade": "C",
        "GradePoints": 0,
        "IsCreditUser": "TRUE",
        "requireChangePassword": "TRUE",
        "OldName": "Leon",
        "FamilyUsers": "",
        "CreditBalance": 78,
        "Gender": "Male"
      },
      {
        "NewName": "Lionel",
        "Mobile": "0423080826",
        "Email": "lionelong@yahoo.com",
        "Grade": "D",
        "GradePoints": 0,
        "IsCreditUser": "TRUE",
        "requireChangePassword": "TRUE",
        "OldName": "Lionel",
        "FamilyUsers": "",
        "CreditBalance": 39,
        "Gender": "Male"
      },
      {
        "NewName": "Long",
        "Mobile": "0401021568",
        "Email": "h_lx@hotmail.com",
        "Grade": "E",
        "GradePoints": 0,
        "IsCreditUser": "TRUE",
        "requireChangePassword": "TRUE",
        "OldName": "Long",
        "FamilyUsers": "",
        "CreditBalance": 104,
        "Gender": "Male"
      },
      {
        "NewName": "Luc",
        "Mobile": "0413780136",
        "Email": "bei2004@gmail.com",
        "Grade": "C",
        "GradePoints": 5,
        "IsCreditUser": "TRUE",
        "requireChangePassword": "TRUE",
        "OldName": "Luc",
        "FamilyUsers": "Sydney,Kate",
        "CreditBalance": 130,
        "Gender": "Male"
      },
      {
        "NewName": "Magesh",
        "Mobile": "0424611007",
        "Email": "rymagesh@gmail.com",
        "Grade": "D",
        "GradePoints": 0,
        "IsCreditUser": "TRUE",
        "requireChangePassword": "TRUE",
        "OldName": "Magesh",
        "FamilyUsers": "",
        "CreditBalance": 78,
        "Gender": "Male"
      },
      {
        "NewName": "Maggie 瀚文",
        "Mobile": "0468488368",
        "Email": "mzhangau@outlook.com",
        "Grade": "D",
        "GradePoints": 0,
        "IsCreditUser": "TRUE",
        "requireChangePassword": "TRUE",
        "OldName": "Maggie瀚文书院",
        "FamilyUsers": "",
        "CreditBalance": 26,
        "Gender": "Female"
      },
      {
        "NewName": "Manny",
        "Mobile": "0406726588",
        "Email": "manny.gongz@gmail.com",
        "Grade": "D",
        "GradePoints": 0,
        "IsCreditUser": "TRUE",
        "requireChangePassword": "TRUE",
        "OldName": "Manny",
        "FamilyUsers": "",
        "CreditBalance": 39,
        "Gender": "Male"
      },
      {
        "NewName": "Mark Chen",
        "Mobile": "0466556068",
        "Email": "mloves.chen@gmail.com",
        "Grade": "",
        "GradePoints": 0,
        "IsCreditUser": "",
        "requireChangePassword": "TRUE",
        "OldName": "Mark Chen",
        "FamilyUsers": "",
        "CreditBalance": 0,
        "Gender": "Male"
      },
      {
        "NewName": "Matt",
        "Mobile": "0439116666",
        "Email": "mattshi81@hotmail.com",
        "Grade": "C",
        "GradePoints": 6,
        "IsCreditUser": "TRUE",
        "requireChangePassword": "TRUE",
        "OldName": "Matt",
        "FamilyUsers": "",
        "CreditBalance": 39,
        "Gender": "Male"
      },
      {
        "NewName": "Michael",
        "Mobile": "0425033441",
        "Email": "845524343@qq.com",
        "Grade": "D",
        "GradePoints": 0,
        "IsCreditUser": "TRUE",
        "requireChangePassword": "TRUE",
        "OldName": "Michael",
        "FamilyUsers": "Melody",
        "CreditBalance": 0,
        "Gender": "Male"
      },
      {
        "NewName": "Michael Xu",
        "Mobile": "0411652088",
        "Email": "michael202125@gmail.com",
        "Grade": "D",
        "GradePoints": 0,
        "IsCreditUser": "",
        "requireChangePassword": "TRUE",
        "OldName": "Michael Xu",
        "FamilyUsers": "Sarah",
        "CreditBalance": 0,
        "Gender": "Male"
      },
      {
        "NewName": "Michael Zhang",
        "Mobile": "0421437705",
        "Email": "mzhang668@gmail.com",
        "Grade": "E",
        "GradePoints": 0,
        "IsCreditUser": "TRUE",
        "requireChangePassword": "TRUE",
        "OldName": "Michael Z",
        "FamilyUsers": "MelodyZ",
        "CreditBalance": 91,
        "Gender": "Male"
      },
      {
        "NewName": "Owen",
        "Mobile": "0420518070",
        "Email": "zquake@hotmail.com",
        "Grade": "D",
        "GradePoints": 0,
        "IsCreditUser": "TRUE",
        "requireChangePassword": "TRUE",
        "OldName": "Owen",
        "FamilyUsers": "",
        "CreditBalance": 65,
        "Gender": "Male"
      },
      {
        "NewName": "Patrick H",
        "Mobile": "0432125002",
        "Email": "patrickhu26358787@gmail.com",
        "Grade": "D",
        "GradePoints": 0,
        "IsCreditUser": "",
        "requireChangePassword": "TRUE",
        "OldName": "Patrick Hu",
        "FamilyUsers": "",
        "CreditBalance": 0,
        "Gender": "Male"
      },
      {
        "NewName": "Peggy",
        "Mobile": "0479159678",
        "Email": "peggy.ling.au@gmail.com",
        "Grade": "",
        "GradePoints": 0,
        "IsCreditUser": "TRUE",
        "requireChangePassword": "TRUE",
        "OldName": "Peggy",
        "FamilyUsers": "Rylan,Lincoln,Mason",
        "CreditBalance": 26,
        "Gender": "Female"
      },
      {
        "NewName": "Peter wang",
        "Mobile": "0433007578",
        "Email": "qiudongw@gmail.com",
        "Grade": "E",
        "GradePoints": 0,
        "IsCreditUser": "TRUE",
        "requireChangePassword": "TRUE",
        "OldName": "Peter Wang",
        "FamilyUsers": "Jensen,Eva Wang",
        "CreditBalance": 0,
        "Gender": "Male"
      },
      {
        "NewName": "Poh",
        "Mobile": "0413228977",
        "Email": "bukit_chong@yahoo.com",
        "Grade": "D",
        "GradePoints": 0,
        "IsCreditUser": "TRUE",
        "requireChangePassword": "TRUE",
        "OldName": "POH",
        "FamilyUsers": "",
        "CreditBalance": 52,
        "Gender": "Male"
      },
      {
        "NewName": "hipolly",
        "Mobile": "0415885188",
        "Email": "topollykwok@yahoo.com",
        "Grade": "D",
        "GradePoints": 0,
        "IsCreditUser": "",
        "requireChangePassword": "TRUE",
        "OldName": "Polly",
        "FamilyUsers": "Andrew",
        "CreditBalance": 52,
        "Gender": "Female"
      },
      {
        "NewName": "Prakash",
        "Mobile": "0404371773",
        "Email": "Prakash.varu@yahoo.com.au",
        "Grade": "D",
        "GradePoints": 0,
        "IsCreditUser": "TRUE",
        "requireChangePassword": "TRUE",
        "OldName": "Prakash",
        "FamilyUsers": "",
        "CreditBalance": 0,
        "Gender": "Male"
      },
      {
        "NewName": "RobinZhang",
        "Mobile": "0407803979",
        "Email": "cs.zhanghong@gmail.com",
        "Grade": "D",
        "GradePoints": 0,
        "IsCreditUser": "TRUE",
        "requireChangePassword": "TRUE",
        "OldName": "Robin-Lazycat",
        "FamilyUsers": "Ryan",
        "CreditBalance": 130,
        "Gender": "Male"
      },
      {
        "NewName": "Scott Zhuo",
        "Mobile": "0406368287",
        "Email": "scott.z.zhuo@gmail.com",
        "Grade": "D",
        "GradePoints": 0,
        "IsCreditUser": "TRUE",
        "requireChangePassword": "TRUE",
        "OldName": "Scott Zuo",
        "FamilyUsers": "",
        "CreditBalance": 117,
        "Gender": "Male"
      },
      {
        "NewName": "Shirley",
        "Mobile": "0410638127",
        "Email": "shiroly@gmail.com",
        "Grade": "D",
        "GradePoints": 0,
        "IsCreditUser": "TRUE",
        "requireChangePassword": "TRUE",
        "OldName": "Shirley(Eric)",
        "FamilyUsers": "Angus,Marus,Venus",
        "CreditBalance": 0,
        "Gender": "Female"
      },
      {
        "NewName": "Simon T",
        "Mobile": "0421132308",
        "Email": "simonpt2000@gmail.com",
        "Grade": "D",
        "GradePoints": 0,
        "IsCreditUser": "TRUE",
        "requireChangePassword": "TRUE",
        "OldName": "Simon T",
        "FamilyUsers": "",
        "CreditBalance": 130,
        "Gender": "Male"
      },
      {
        "NewName": "Steven Liu",
        "Mobile": "0402505299",
        "Email": "2339297951@qq.com",
        "Grade": "",
        "GradePoints": 0,
        "IsCreditUser": "TRUE",
        "requireChangePassword": "TRUE",
        "OldName": "Steven Liu",
        "FamilyUsers": "",
        "CreditBalance": 156,
        "Gender": "Male"
      },
      {
        "NewName": "Tammy",
        "Mobile": "0431662310",
        "Email": "au.tammy@gmail.com",
        "Grade": "",
        "GradePoints": 0,
        "IsCreditUser": "TRUE",
        "requireChangePassword": "TRUE",
        "OldName": "Tammy",
        "FamilyUsers": "",
        "CreditBalance": 91,
        "Gender": "Female"
      },
      {
        "NewName": "Thomas",
        "Mobile": "0422945805",
        "Email": "thomastsang7388@gmail.com",
        "Grade": "D",
        "GradePoints": 0,
        "IsCreditUser": "TRUE",
        "requireChangePassword": "TRUE",
        "OldName": "Thomas",
        "FamilyUsers": "Iris T",
        "CreditBalance": 208,
        "Gender": "Male"
      },
      {
        "NewName": "Ting CA",
        "Mobile": "0415226713",
        "Email": "ququ1102@hotmail.com",
        "Grade": "D",
        "GradePoints": 0,
        "IsCreditUser": "TRUE",
        "requireChangePassword": "TRUE",
        "OldName": "Ting",
        "FamilyUsers": "Rain",
        "CreditBalance": 0,
        "Gender": "Female"
      },
      {
        "NewName": "Tom",
        "Mobile": "0418215888",
        "Email": "shihuaichen@gmail.com",
        "Grade": "D",
        "GradePoints": 0,
        "IsCreditUser": "TRUE",
        "requireChangePassword": "TRUE",
        "OldName": "Tom",
        "FamilyUsers": "",
        "CreditBalance": 91,
        "Gender": "Male"
      },
      {
        "NewName": "Tony C",
        "Mobile": "0430511668",
        "Email": "tony.cao77@gmail.com",
        "Grade": "E",
        "GradePoints": 0,
        "IsCreditUser": "TRUE",
        "requireChangePassword": "TRUE",
        "OldName": "Tony C",
        "FamilyUsers": "",
        "CreditBalance": 26,
        "Gender": "Male"
      },
      {
        "NewName": "Vincent",
        "Mobile": "0427392166",
        "Email": "vshc1@yahoo.com",
        "Grade": "D",
        "GradePoints": 0,
        "IsCreditUser": "TRUE",
        "requireChangePassword": "TRUE",
        "OldName": "Vincent",
        "FamilyUsers": "Enoch",
        "CreditBalance": 13,
        "Gender": "Male"
      },
      {
        "NewName": "Visitor",
        "Mobile": "0000000000",
        "Email": "visitor@gmail.com",
        "Grade": "",
        "GradePoints": 0,
        "IsCreditUser": "",
        "requireChangePassword": "TRUE",
        "OldName": "Visitor1",
        "FamilyUsers": "",
        "CreditBalance": 0,
        "Gender": "Male"
      },
      {
        "NewName": "Wei",
        "Mobile": "0449984324",
        "Email": "wei_lu@live.com.au",
        "Grade": "C",
        "GradePoints": 0,
        "IsCreditUser": "",
        "requireChangePassword": "TRUE",
        "OldName": "Wei",
        "FamilyUsers": "",
        "CreditBalance": 0,
        "Gender": "Male"
      },
      {
        "NewName": "Wilson Li",
        "Mobile": "0403608678",
        "Email": "mchdlw@gmail.com",
        "Grade": "E",
        "GradePoints": 0,
        "IsCreditUser": "TRUE",
        "requireChangePassword": "TRUE",
        "OldName": "Wilson",
        "FamilyUsers": "Annie",
        "CreditBalance": 104,
        "Gender": "Male"
      },
      {
        "NewName": "Wing",
        "Mobile": "0424125197",
        "Email": "wingyang502@gmail.com",
        "Grade": "D",
        "GradePoints": 0,
        "IsCreditUser": "TRUE",
        "requireChangePassword": "TRUE",
        "OldName": "Wing",
        "FamilyUsers": "",
        "CreditBalance": 65,
        "Gender": "Female"
      },
      {
        "NewName": "Xiao",
        "Mobile": "0434130413",
        "Email": "mailtohx@gmail.com",
        "Grade": "D",
        "GradePoints": 0,
        "IsCreditUser": "TRUE",
        "requireChangePassword": "TRUE",
        "OldName": "Xiao",
        "FamilyUsers": "Mindy,Qiandai,Villy",
        "CreditBalance": 52,
        "Gender": "Male"
      },
      {
        "NewName": "Yang",
        "Mobile": "0424907646",
        "Email": "yyl901015@126.com",
        "Grade": "",
        "GradePoints": 0,
        "IsCreditUser": "TRUE",
        "requireChangePassword": "TRUE",
        "OldName": "Yang",
        "FamilyUsers": "Claire",
        "CreditBalance": 20,
        "Gender": "Male"
      },
      {
        "NewName": "Zaka",
        "Mobile": "0433396668",
        "Email": "zaka.lei@gmail.com",
        "Grade": "A",
        "GradePoints": 8,
        "IsCreditUser": "",
        "requireChangePassword": "TRUE",
        "OldName": "Zakka",
        "FamilyUsers": "",
        "CreditBalance": 0,
        "Gender": "Male"
      },
      {
        "NewName": "何平He",
        "Mobile": "0420779229",
        "Email": "1171750071@qq.com",
        "Grade": "D",
        "GradePoints": 0,
        "IsCreditUser": "TRUE",
        "requireChangePassword": "TRUE",
        "OldName": "何平",
        "FamilyUsers": "Brandon",
        "CreditBalance": 104,
        "Gender": "Male"
      },
      {
        "NewName": "佳音Jia",
        "Mobile": "0421169787",
        "Email": "gloria_j_tan@hotmail.com",
        "Grade": "D",
        "GradePoints": 0,
        "IsCreditUser": "TRUE",
        "requireChangePassword": "TRUE",
        "OldName": "佳音jia",
        "FamilyUsers": "",
        "CreditBalance": 91,
        "Gender": "Female"
      },
      {
        "NewName": "凯Kai",
        "Mobile": "0421135679",
        "Email": "fgxr2583@gmail.com",
        "Grade": "C",
        "GradePoints": 0,
        "IsCreditUser": "TRUE",
        "requireChangePassword": "TRUE",
        "OldName": "凯Kai",
        "FamilyUsers": "",
        "CreditBalance": 104,
        "Gender": "Male"
      },
      {
        "NewName": "双鱼王yao",
        "Mobile": "0451496846",
        "Email": "wyaozu0220@163.com",
        "Grade": "D",
        "GradePoints": 0,
        "IsCreditUser": "TRUE",
        "requireChangePassword": "TRUE",
        "OldName": "双鱼王yao",
        "FamilyUsers": "",
        "CreditBalance": 26,
        "Gender": "Male"
      },
      {
        "NewName": "杜和成du",
        "Mobile": "0414336218",
        "Email": "chen@minchen.com.au",
        "Grade": "D",
        "GradePoints": 2,
        "IsCreditUser": "TRUE",
        "requireChangePassword": "TRUE",
        "OldName": "杜和成",
        "FamilyUsers": "",
        "CreditBalance": 26,
        "Gender": "Male"
      },
      {
        "NewName": "Lin Du",
        "Mobile": "0421440055",
        "Email": "dulin.du2@gmail.com",
        "Grade": "D",
        "GradePoints": 2.2,
        "IsCreditUser": "TRUE",
        "requireChangePassword": "TRUE",
        "OldName": "杜林du",
        "FamilyUsers": "",
        "CreditBalance": 13,
        "Gender": "Male"
      },
      {
        "NewName": "美丽Mannie",
        "Mobile": "0415518936",
        "Email": "mannieruan@hotmail.com",
        "Grade": "D",
        "GradePoints": 0,
        "IsCreditUser": "TRUE",
        "requireChangePassword": "TRUE",
        "OldName": "美丽Mannie",
        "FamilyUsers": "Chris,Eric",
        "CreditBalance": 0,
        "Gender": "Female"
      },
      {
        "NewName": "贝林Bei",
        "Mobile": "0415098898",
        "Email": "bluesky9989@outlook.com",
        "Grade": "D",
        "GradePoints": 0,
        "IsCreditUser": "TRUE",
        "requireChangePassword": "TRUE",
        "OldName": "贝林",
        "FamilyUsers": "",
        "CreditBalance": 13,
        "Gender": "Female"
      },
      {
        "NewName": "远方Yuan",
        "Mobile": "0415706307",
        "Email": "ruanfang816@gmail.com",
        "Grade": "D",
        "GradePoints": 0,
        "IsCreditUser": "TRUE",
        "requireChangePassword": "TRUE",
        "OldName": "远方",
        "FamilyUsers": "张扬zhang",
        "CreditBalance": 78,
        "Gender": "Female"
      },
      {
        "NewName": "阿布Bu",
        "Mobile": "0420330886",
        "Email": "deltazhang0886@gmail.com",
        "Grade": "E",
        "GradePoints": 0,
        "IsCreditUser": "TRUE",
        "requireChangePassword": "TRUE",
        "OldName": "阿布bu",
        "FamilyUsers": "",
        "CreditBalance": 39,
        "Gender": "Male"
      },
      {
        "NewName": "System",
        "Mobile": "0000000000",
        "Email": "hbc666.club@gmail.com",
        "Grade": "",
        "GradePoints": 0,
        "IsCreditUser": "",
        "requireChangePassword": "",
        "OldName": "",
        "FamilyUsers": "",
        "CreditBalance": 0,
        "Gender": "Male"
      },
      {
        "NewName": "Katy kakaka",
        "Mobile": "0451993908",
        "Email": "thesweetkitchenau@gmail.com",
        "Grade": "",
        "GradePoints": 0,
        "IsCreditUser": "",
        "requireChangePassword": "",
        "OldName": "",
        "FamilyUsers": "",
        "CreditBalance": 0,
        "Gender": "Female"
      },
      {
        "NewName": "Crystal香香",
        "Mobile": "0424060916",
        "Email": "crystalyuxiangyang@hotmail.com",
        "Grade": "",
        "GradePoints": 0,
        "IsCreditUser": "",
        "requireChangePassword": "",
        "OldName": "Crystal香香",
        "FamilyUsers": "",
        "CreditBalance": 0,
        "Gender": "Female"
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

  email() {
    
    this.accountService.getAllUsers().subscribe((users) => {
      //this.allUsersObject = x;
      users.forEach(u => {
        if (this.vipList.includes(u.name)) {
          console.log(u.name);
          var hashkey = this.helperService.encryptData(u.email);
          const encoded = encodeURIComponent(hashkey);

          this.mailgunService.sendRegistration(u.email, u.name, encoded).then(x=>{
            console.log(`sending email ${u.email}`,x);
          }).catch(e=>{
            console.log(`email error ${u.email}`,e);
          });
        }
      })
    });
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
        gradePoints: uj.GradePoints,
        isCreditUser: uj.IsCreditUser == 'TRUE'? true:false,
        requireChangePassword: true,
        password: this.helperService.generateRandomPassword(8),
        creditBalance: uj.CreditBalance,
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
