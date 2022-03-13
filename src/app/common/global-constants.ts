// Adding all global constants here
export class GlobalConstants {

    public static hbCoinIcon: string = "monetization_on";
    public static cashIcon: string = "payments"
    public static bankIcon: string = "atm"


    //Common
    public static weekdays: string[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];


    //Group Expense
    public static groupExpenseTypes: string[] = ["Court", "Shuttle", "Donation", "Tech Subscription", "Other"];
    public static groupValidPeriodInYears: number = 3; // group default to 3 years

    //Credit Category
    public static creditCategoryBadminton = 'Badminton';
    public static creditCategoryDividend = 'Dividend';
    public static creditCategoryProfitHolding = 'Profit holding';
    public static creditCategoryTopup = 'Topup';
    public static creditCategoryRefund = 'Refund';
    public static creditCategoryReward = 'Reward';
    public static creditCategoryPromo = 'Promo';
    public static creditCategoryCashout = 'Cashout';
    public static creditCategoryAdjustment = 'Adjustment';
    public static creditCategoryUserTransfer = 'User Transfer';
    public static creditCategoryOther = 'Other';



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
    public static paymentBookingIncome: string = "Booking income";



    //Auto Booking
    // public static autoBookingRates = [
    //     { name: '3 months ($5)', value: 91, price: 5, desc: '3 months auto booking for $5' },
    //     { name: '6 months ($9)', value: 182, price: 9, desc: '6 months auto booking for $9' },
    // ]
    public static autoBookingWeekUnitPrice = 0.5; //$0.5 per week per head
    public static autoBookingMiniumCreditRequired = 50;
    public static autoBookingDiscount = 0;



    //Price, Rates
    public static rateCash: number = 17;
    public static rateCredit: number = 15;
    public static rateFamily: number = 15; //1 person charge 15, the rest 14 each

    //EVENTS for Audit table
    public static eventbookingWithdraw: string = "booking withdraw";
    public static eventBooking: string = "booking";
    public static eventBookingForSale: string = "booking sale";
    public static eventBookingReconciliated: string = "booking reconciliated";

    public static eventTopupCredit: string = "credit topup";
    public static eventPasswordChange: string = "password change";
    public static eventProfileChange: string = "profile change";
    public static eventAutoBooking: string = "auto booking schedule";
    public static eventAutoBookingExtend: string = "auto booking extend";
    public static eventAutoBookingCancel: string = "auto booking schedule cancel";
    public static eventFamilyMember: string = "family member change";
    public static eventWebActivity: string = "login/web activity"; //for user is browsing the website
    public static eventDividend: string = "grouop devidend";
    public static eventCreditTransfer: string = "HBCoin transfer";



    //image upload
    public static imageFileTypes = [
        'image/apng', 'image/gif', 'image/jpeg', 'image/png'
    ];
    public static imageMaxSizeInKb = 50;
    public static imageDefaultAvatar = "/assets/img/avatars/avatar.jpg";


    //Good bye lines
    public static goodByeLines = [
        "What we call the beginning is often the end. And to make an end is to make a beginning. The end is where we start from.",
        "The two hardest things to say in life are hello for the first time and goodbye for the last.",
        "There are no goodbyes for us. Wherever you are, you will always be in my heart!",
        "You have been my friend. That in itself is a tremendous thing.",
        "If you’re brave enough to say goodbye, life will reward you with a new hello.",
        "This is not a goodbye, my darling, this is a thank you.",
        "Don’t cry because it’s over, smile because it happened",
        "Man’s feelings are always purest and most glowing in the hour of meeting and of farewell.",
        "Great is the art of beginning, but greater is the art of ending.",
        "Don’t be dismayed at goodbyes. A farewell is necessary before you can meet again. And meeting again, after moments or lifetimes, is certain for those who are friends.",
        "Why can’t we get all the people together in the world that we really like and then just stay together? I guess that wouldn’t work. Someone would leave. Someone always leaves. Then we would have to say good-bye. I hate good-byes. I know what I need. I need more hellos.",
        "It’s time to say goodbye, but I think goodbyes are sad and I’d much rather say hello. Hello to a new adventure.",
        "Never say goodbye because goodbye means going away and going away means forgetting.",
        "We’ll meet again, Don’t know where,don’t know when, But I know we’ll meet again, some sunny day.",
        "Only in the agony of parting do we look into the depths of love.",
        "What is that feeling when you’re driving away from people and they recede on the plain till you see their specks dispersing? – it’s the too-huge world vaulting us, and it’s good-bye. But we lean forward to the next crazy venture beneath the skies.",
        "Remember me and smile, for it’s better to forget than to remember me and cry.",
        "So long as the memory of certain beloved friends lives in my heart, I shall say that life is good",
        "Yesterday brought the beginning, tomorrow brings the end, though somewhere in the middle we became the best of friends.",
        "Goodbyes make you think. They make you realize what you’ve had, what you’ve lost, and what you’ve taken for granted.",
        "Moving on, is a simple thing, what it leaves behind is hard.",
        "They must often change, who would be constant in happiness or wisdom.",
        "The pain of parting is nothing to the joy of meeting again.",
        "Life is a journey, not a destination.",
        "To part is the lot of all mankind. The world is a scene of constant leave-taking, and the hands that grasp in cordial greeting today, are doomed ere long to unite for the the last time, when the quivering lips pronounce the word – Farewell.",
        "Goodbyes are not forever, Goodbyes are not the end. They simply mean I’ll miss you, Until we meet again.",
    ];




    public static badmintonLines = [
        { line: "Badminton is not only about winning. What is important to me is about playing hard, doing my best and putting up a good show for the spectators.", people: "Lin Dan" },
        { line: "There will be many obstacles in the pursuit of your dreams. I had long hours of training, balancing studies and badminton.", people: "Sindhu" },
        { line: "I love winning more than I love playing badminton. Winning is everything", people: "Saina Nehwal" },
        { line: "In badminton, they use a lot from the wrist. But I use a lot from the shoulder", people: "Li Na" },
        { line: "There's sketch, improv, writing, acting, music, and badminton. Those are the seven forms of comedy.", people: "T.J. Miller" },
        { line: "Discipline is the bridge between your badminton goals and badminton success.", people: "" },
        { line: "Keep calm and play badminton.", people: "" },
        { line: "There is no passion to be found playing small – in settling for a life that is less than the one you are capable of living.", people: "" },
        { line: "Champions keep playing until they get it right.", people: "" },
        { line: "It’s not the hours you put in….it’s what you put in those hours.", people: "" },
        { line: "You only live once but you get to serve twice.", people: "" },
        { line: "Your dream will always defeat reality if you give it chance.", people: "" },
        { line: "My philosophy is to not be scared of anyone. If I play well, great; if I don't, I learn from the match and move on.", people: "Saina Nehwal" },
        { line: "Ability is what you’re capable of doing. Motivation determines what you do. Attitude determines how well you do it.", people: "" },
        { line: "Skills win you Medals..But Attitude wins Hearts", people: "" },
        { line: "The greatest asset is a strong mind. If I know someone is training harder than I am I have no execuses", people: "P.V. Sindhu" },
        { line: "To train hard is the best way to become the best of yourself.", people: "Chen Long" },
        { line: "The only way to prove that you’re a good sport is to lose.", people: "Ernie Banks"},
        { line: "Age is no barrier. It’s a limitation you put on your mind.", people: "Jackie Joyner-Kersee"},
        { line: "Only he who can see the invisible can do the impossible.", people: "Frank L. Gaines"},
        { line: "Number one is just to gain a passion for running. To love the morning, to love the trail, to love the pace on the track. And if some kid gets really good at it, that’s cool too.", people: "Pat Tyson"},
        { line: "Most people give up just when they’re about to achieve success. They quit on the one yard line. They give up at the last minute of the game one foot from a winning touchdown.", people: "Ross Perot"},
        { line: "You have to do something in your life that is honorable and not cowardly if you are to live in peace with yourself.", people: "Larry Brown"},
        { line: "There may be people that have more talent than you, but there's no excuse for anyone to work harder than you do.", people: "Derek Jeter"},
        { line: "An athlete cannot run with money in his pockets. He must run with hope in his heart and dreams in his head.", people: "Emil Zatopek"},
        { line: "When you've got something to prove, there's nothing greater than a challenge.", people: "Terry Bradshaw"},
        { line: "Never give up, never give in, and when the upper hand is ours, may we have the ability to handle the win with the dignity that we absorbed the loss.", people: "Doug Williams"},
        { line: "You were born to be a player. You were meant to be here. This moment is yours.", people: "Herb Brooks"},
        { line: "Everything negative - pressure, challenges - are all an opportunity for me to rise", people: "Kobe Bryant"},
        { line: "The moment you give up, is the moment you let someone else win.", people: "Kobe Bryant"},
    ];


    public static homepageQuotes = [
        { line: "Life is a game, Badminton is serious!", people: "Luc" },
        { line: "Discipline is the bridge between your badminton goals and badminton success.", people: "" },
        { line: "Keep calm and play badminton.", people: "" },
        { line: "There is no passion to be found playing small – in settling for a life that is less than the one you are capable of living.", people: "" },
        { line: "Champions keep playing until they get it right.", people: "" },
        { line: "It’s not the hours you put in….it’s what you put in those hours.", people: "" },
        { line: "Your dream will always defeat reality if you give it chance.", people: "" },
        { line: "Ability is what you’re capable of doing. Motivation determines what you do. Attitude determines how well you do it.", people: "" },
        { line: "Skills win you Medals..But Attitude wins Hearts", people: "" },
        { line: "To train hard is the best way to become the best of yourself.", people: "Chen Long" },
        { line: "The only way to prove that you’re a good sport is to lose.", people: "Ernie Banks"},
        { line: "Age is no barrier. It’s a limitation you put on your mind.", people: "Jackie Joyner-Kersee"},
        { line: "Only he who can see the invisible can do the impossible.", people: "Frank L. Gaines"},
        { line: "You have to do something in your life that is honorable and not cowardly if you are to live in peace with yourself.", people: "Larry Brown"},
        { line: "There may be people that have more talent than you, but there's no excuse for anyone to work harder than you do.", people: "Derek Jeter"},
        { line: "An athlete cannot run with money in his pockets. He must run with hope in his heart and dreams in his head.", people: "Emil Zatopek"},
        { line: "When you've got something to prove, there's nothing greater than a challenge.", people: "Terry Bradshaw"},
        { line: "You were born to be a player. You were meant to be here. This moment is yours.", people: "Herb Brooks"},
        { line: "Everything negative - pressure, challenges - are all an opportunity for me to rise", people: "Kobe Bryant"},
        { line: "The moment you give up, is the moment you let someone else win.", people: "Kobe Bryant"},
    ];








}