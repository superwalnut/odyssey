//a big table storing all user's activity on this web app.
//ie. changed password, top up credit, booking for social, withdraw from social
export class Audit {
    docId: string;
    event: string;
    value: number;//if there's number's involved
    userId: string;
    userDisplayName: string;
    createdOn: Date;

}
