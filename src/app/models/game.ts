import firebase from "firebase/app";
import Timestamp = firebase.firestore.Timestamp;
import { User } from './user';

export class Game {
    docId: string;
    groupDocId: string;
    groupName: string;
    title: string;
    team1: Team;
    team2: Team;
    stake: number; 
    createdBy: string;
    createdByDisplanName: string;
    createdOn: Timestamp;
}

export class Team {
    score: number;
    user1: User;
    user2: User;
    scoreConfirmed: boolean;
}