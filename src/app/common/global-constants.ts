// Adding all global constants here
export class GlobalConstants {

    //BOOKING
    public static bookingOpenDay: string = "Monday";
    public static bookingOpenTime: string = "11:59AM";
    public static bookingWithdrawLHours: number = 3; //can't withdraw 3 hours before the session starts
    public static tueSeats: number = 16;
    public static friSeats: number = 42;
    public static satSeats: number = 34;
    public static autoBookingFee: number = 10; //$10 for setting up auto booking


    //Price, Rates
    public static casualRate: number = 15;
    public static creditRate: number = 13;

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