// Adding all global constants here
export class GlobalConstants {

    public static hbCoinIcon:string = "monetization_on";
    public static cashIcon:string = "attach_money"
    public static bankIcon:string = "atm"


    //Common
    public static weekdays: string[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];


    //Group Expense
    public static groupExpenseTypes: string[] = ["Court", "Shuttle", "Donation", "Tech Subscription", "Other"];
    public static groupValidPeriodInYears: number = 3; // group default to 3 years



    //BOOKING
    public static bookingOpenDay: string = "Monday";
    public static bookingOpenTime: string = "6:00AM";
    public static bookingWithdrawHours: number = 5; //can't withdraw 5 hours before the session starts
    // public static tueSeats: number = 16;
    // public static friSeats: number = 42;
    // public static satSeats: number = 34;

    //public static autoBookingFee: number = 10; //$10 for setting up auto booking
    public static paymentCredit: string = "HBCoin";
    public static paymentCash: string = "Cash";
    public static paymentBank: string = "Bank";
    public static paymentAdjust: string = "Adjust"; //used by admin only, when make adjustment to group income
    public static paymentGroupAdjust: string = "Group adjust";


    //Auto Booking
    // public static autoBookingRates = [
    //     { name: '3 months ($5)', value: 91, price: 5, desc: '3 months auto booking for $5' },
    //     { name: '6 months ($9)', value: 182, price: 9, desc: '6 months auto booking for $9' },
    // ]
    public static autoBookingWeekUnitPrice = 0.5; //$0.5 per week per head
    public static autoBookingMiniumCreditRequired = 100;
    public static autoBookingDiscount = 2;



    //Price, Rates
    public static rateCash: number = 15;
    public static rateCredit: number = 13;
    public static rateFamily: number = 13; //1 person charge 15, the rest 14 each

    //EVENTS for Audit table
    public static eventbookingWithdraw: string = "booking withdraw";
    public static eventBooking: string = "booking";
    public static eventBookingForSale: string = "booking sale";
    public static eventBookingReconciliated: string = "booking reconciliated";

    public static eventTopupCredit: string = "credit topup";
    public static eventPasswordChange: string = "password change";
    public static eventProfileChange: string = "profile change";
    public static eventAutoBooking: string = "auto booking schedule";
    public static eventAutoBookingCancel: string = "auto booking schedule cancel";
    public static eventFamilyMember: string = "family member change";
    public static eventWebActivity: string = "login/web activity"; //for user is browsing the website
    public static eventDividend: string = "grouop devidend";









}