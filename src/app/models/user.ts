import firebase from 'firebase/app';
import Timestamp = firebase.firestore.Timestamp;

//TODO: isVIP,
export class User {
    docId:string;
    email:string;
    wechatId:string;
    password:string;
    mobile:string;
    family:string[];
    role:string;
    isVip:boolean;
    isMember:boolean;
    created:Timestamp;
    updated:Timestamp;
    status:string;
    balance:number;
}
