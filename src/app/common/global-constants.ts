// Adding all global constants here
export class GlobalConstants {

    //Common
    public static weekdays: string[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];


    //Group Expense
    public static groupExpenseTypes: string[] = ["Court", "Shuttle", "Donation", "Tech Subscription", "Other"];
    public static groupValidPeriodInYears: number = 3; // group default to 3 years



    //BOOKING
    public static bookingOpenDay: string = "Monday";
    public static bookingOpenTime: string = "6:00AM";
    public static bookingWithdrawHours: number = 4; //can't withdraw 3 hours before the session starts
    // public static tueSeats: number = 16;
    // public static friSeats: number = 42;
    // public static satSeats: number = 34;

    public static autoBookingFee: number = 10; //$10 for setting up auto booking
    public static paymentCredit: string = "Credit";
    public static paymentCash: string = "Cash";
    public static paymentBank: string = "Bank";


    //Price, Rates
    public static rateCash: number = 17;
    public static rateCredit: number = 15;
    public static rateFamily: number = 14; //1 person charge 15, the rest 14 each

    //EVENTS for Audit table
    public static eventbookingWithdraw: string = "social booking withdraw";
    public static eventBooking: string = "social booking";
    public static eventTopupCredit: string = "credit topup";
    public static eventPasswordChange: string = "password change";
    public static eventProfileChange: string = "profile change";
    public static eventAutoBooking: string = "auto booking schedule";
    public static eventAutoBookingCancel: string = "auto booking schedule cancel";
    public static eventFamilyMember: string = "family member change";
    public static eventWebActivity: string = "login/web activity"; //for user is browsing the website





}