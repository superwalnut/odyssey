// Adding all global constants here
export class GlobalConstants {
  public static showHeroQuotesAndButton = true;

  public static hbCoinIcon: string = "monetization_on";
  public static cashIcon: string = "payments";
  public static bankIcon: string = "atm";

  //Common
  public static weekdays: string[] = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  //Group Expense
  public static groupExpenseTypes: string[] = [
    "Court",
    "Shuttle",
    "Donation",
    "Badminton",
    "Other",
  ];
  public static groupValidPeriodInYears: number = 3; // group default to 3 years

  //Credit Category
  public static creditCategoryBadminton = "Badminton";
  public static creditCategoryCourt = "Court";
  public static creditCategoryShuttle = "Shuttle";
  public static creditCategoryDividend = "Dividend";
  public static creditCategoryProfitHolding = "Profit holding";
  public static creditCategoryTopup = "Topup";
  public static creditCategoryRefund = "Refund";
  public static creditCategoryReward = "Reward";
  public static creditCategoryPromo = "Promo";
  public static creditCategoryCashout = "Cashout";
  public static creditCategoryAdjustment = "Adjustment";
  public static creditCategoryUserTransfer = "User Transfer";
  public static creditCategoryOther = "Other";

  //BOOKING
  public static bookingOpenDay: string = "Monday";
  public static bookingOpenTime: string = "6:00AM";
  public static bookingWithdrawHours: number = 24; //can't withdraw 24 hours before the session starts
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
  public static autoBookingWeekUnitPrice = 0; //$0.5 per week per head
  public static autoBookingMiniumCreditRequired = 50;
  public static autoBookingDiscount = 0;

  //Price, Rates
  public static rateCash: number = 18;
  public static rateCredit: number = 15;
  public static rateFamily: number = 15;
  public static rateHappyHour: number = 15; //Saturday Happy hour rate for all HBCoin users

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
  public static eventDividend: string = "group distribution";
  public static eventCreditTransfer: string = "HBCoin transfer";

  //image upload
  public static imageFileTypes = [
    "image/apng",
    "image/gif",
    "image/jpeg",
    "image/png",
  ];
  public static imageMaxSizeInKb = 50;
  public static imageDefaultAvatar =
    "https://firebasestorage.googleapis.com/v0/b/hbclub-919aa.appspot.com/o/assets%2Favatars%2Favatar-mario.jpg?alt=media&token=42b4efea-6160-4757-85db-e376c0b7e24f";

  //Good bye lines
  public static goodByeLines = [
    "What we call the beginning is often the end. And to make an end is to make a beginning. The end is where we start from.",
    "The two hardest things to say in life are hello for the first time and goodbye for the last.",
    "There are no goodbyes for us. Wherever you are, you will always be in my heart!",
    "You have been my friend. That in itself is a tremendous thing.",
    "If you???re brave enough to say goodbye, life will reward you with a new hello.",
    "This is not a goodbye, my darling, this is a thank you.",
    "Don???t cry because it???s over, smile because it happened",
    "Man???s feelings are always purest and most glowing in the hour of meeting and of farewell.",
    "Great is the art of beginning, but greater is the art of ending.",
    "It???s time to say goodbye, but I think goodbyes are sad and I???d much rather say hello. Hello to a new adventure.",
    "Never say goodbye because goodbye means going away and going away means forgetting.",
    "We???ll meet again, Don???t know where,don???t know when, But I know we???ll meet again, some sunny day.",
    "Only in the agony of parting do we look into the depths of love.",
    "Remember me and smile, for it???s better to forget than to remember me and cry.",
    "So long as the memory of certain beloved friends lives in my heart, I shall say that life is good",
    "Yesterday brought the beginning, tomorrow brings the end, though somewhere in the middle we became the best of friends.",
    "Goodbyes make you think. They make you realize what you???ve had, what you???ve lost, and what you???ve taken for granted.",
    "Moving on, is a simple thing, what it leaves behind is hard.",
    "They must often change, who would be constant in happiness or wisdom.",
    "The pain of parting is nothing to the joy of meeting again.",
    "Life is a journey, not a destination.",
    "Goodbyes are not forever, Goodbyes are not the end. They simply mean I???ll miss you, Until we meet again.",
  ];

  public static badmintonLines = [
    {
      line: "Badminton is not only about winning. What is important to me is about playing hard, doing my best and putting up a good show for the spectators.",
      people: "Lin Dan",
    },
    {
      line: "There will be many obstacles in the pursuit of your dreams. I had long hours of training, balancing studies and badminton.",
      people: "Sindhu",
    },
    {
      line: "I love winning more than I love playing badminton. Winning is everything",
      people: "Saina Nehwal",
    },
    {
      line: "In badminton, they use a lot from the wrist. But I use a lot from the shoulder",
      people: "Li Na",
    },
    {
      line: "There's sketch, improv, writing, acting, music, and badminton. Those are the seven forms of comedy.",
      people: "T.J. Miller",
    },
    {
      line: "Discipline is the bridge between your badminton goals and badminton success.",
      people: "",
    },
    { line: "Keep calm and play badminton.", people: "" },
    {
      line: "There is no passion to be found playing small ??? in settling for a life that is less than the one you are capable of living.",
      people: "",
    },
    { line: "Champions keep playing until they get it right.", people: "" },
    {
      line: "It???s not the hours you put in???.it???s what you put in those hours.",
      people: "",
    },
    { line: "You only live once but you get to serve twice.", people: "" },
    {
      line: "Your dream will always defeat reality if you give it chance.",
      people: "",
    },
    {
      line: "My philosophy is to not be scared of anyone. If I play well, great; if I don't, I learn from the match and move on.",
      people: "Saina Nehwal",
    },
    {
      line: "Ability is what you???re capable of doing. Motivation determines what you do. Attitude determines how well you do it.",
      people: "",
    },
    { line: "Skills win you Medals..But Attitude wins Hearts", people: "" },
    {
      line: "The greatest asset is a strong mind. If I know someone is training harder than I am I have no execuses",
      people: "P.V. Sindhu",
    },
    {
      line: "To train hard is the best way to become the best of yourself.",
      people: "Chen Long",
    },
    {
      line: "The only way to prove that you???re a good sport is to lose.",
      people: "Ernie Banks",
    },
    {
      line: "Age is no barrier. It???s a limitation you put on your mind.",
      people: "Jackie Joyner-Kersee",
    },
    {
      line: "Only he who can see the invisible can do the impossible.",
      people: "Frank L. Gaines",
    },
    {
      line: "Number one is just to gain a passion for running. To love the morning, to love the trail, to love the pace on the track. And if some kid gets really good at it, that???s cool too.",
      people: "Pat Tyson",
    },
    {
      line: "Most people give up just when they???re about to achieve success. They quit on the one yard line. They give up at the last minute of the game one foot from a winning touchdown.",
      people: "Ross Perot",
    },
    {
      line: "You have to do something in your life that is honorable and not cowardly if you are to live in peace with yourself.",
      people: "Larry Brown",
    },
    {
      line: "There may be people that have more talent than you, but there's no excuse for anyone to work harder than you do.",
      people: "Derek Jeter",
    },
    {
      line: "An athlete cannot run with money in his pockets. He must run with hope in his heart and dreams in his head.",
      people: "Emil Zatopek",
    },
    {
      line: "When you've got something to prove, there's nothing greater than a challenge.",
      people: "Terry Bradshaw",
    },
    {
      line: "Never give up, never give in, and when the upper hand is ours, may we have the ability to handle the win with the dignity that we absorbed the loss.",
      people: "Doug Williams",
    },
    {
      line: "You were born to be a player. You were meant to be here. This moment is yours.",
      people: "Herb Brooks",
    },
    {
      line: "Everything negative - pressure, challenges - are all an opportunity for me to rise",
      people: "Kobe Bryant",
    },
    {
      line: "The moment you give up, is the moment you let someone else win.",
      people: "Kobe Bryant",
    },
  ];

  public static homepageQuotes = [
    { line: "??????????????????????????????!", people: "" },
    { line: "??????????????????????????????!", people: "" },
    { line: "???????????????????????????????????????????????????????????????", people: "" },
    { line: "?????????????????????????????????????????????", people: "" },
    { line: "?????????????????????????????????????????????", people: "" },
    {
      line: "?????????????????????????????????????????????????????????????????????????????????????????????????????????",
      people: "",
    },
    {
      line: "?????????????????????????????????????????????????????????????????????????????????",
      people: "",
    },
    { line: "?????????????????????????????????????????????????????????????????????", people: "" },
    {
      line: "?????????????????????????????????????????????????????????????????????????????????????????????",
      people: "",
    },
    {
      line: "?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????",
      people: "",
    },
    { line: "???????????????????????????????????????", people: "" },
    { line: "???????????????????????????", people: "" },
    { line: "?????????????????????????????????????????????????????????????????????", people: "" },
    { line: "?????????????????????????????????????????????", people: "" },
    { line: "????????????????????????????????????????????????????????????", people: "" },
    {
      line: "???????????????????????????????????????????????????????????????????????????????????????",
      people: "",
    },
    {
      line: "Have you seen Los Angeles at 4am? I see it often because that's when I start training",
      people: "",
    },
    { line: "Life is a game, Badminton is serious!", people: "Luc" },
    {
      line: "Discipline is the bridge between your badminton goals and badminton success.",
      people: "",
    },
    { line: "Keep calm and play badminton.", people: "" },
    { line: "Champions keep playing until they get it right.", people: "" },
    {
      line: "It???s not the hours you put in???.it???s what you put in those hours.",
      people: "",
    },
    {
      line: "Your dream will always defeat reality if you give it chance.",
      people: "",
    },
    {
      line: "Ability is what you???re capable of doing. Motivation determines what you do. Attitude determines how well you do it.",
      people: "",
    },
    { line: "Skills win you Medals..But Attitude wins Hearts", people: "" },
    {
      line: "To train hard is the best way to become the best of yourself.",
      people: "Chen Long",
    },
    {
      line: "The only way to prove that you???re a good sport is to lose.",
      people: "Ernie Banks",
    },
    {
      line: "Age is no barrier. It???s a limitation you put on your mind.",
      people: "Jackie Joyner-Kersee",
    },
    {
      line: "Only he who can see the invisible can do the impossible.",
      people: "Frank L. Gaines",
    },
    {
      line: "There may be people that have more talent than you, but there's no excuse for anyone to work harder than you do.",
      people: "Derek Jeter",
    },
    {
      line: "An athlete cannot run with money in his pockets. He must run with hope in his heart and dreams in his head.",
      people: "Emil Zatopek",
    },
    {
      line: "When you've got something to prove, there's nothing greater than a challenge.",
      people: "Terry Bradshaw",
    },
    {
      line: "You were born to be a player. You were meant to be here. This moment is yours.",
      people: "Herb Brooks",
    },
    {
      line: "Everything negative - pressure, challenges - are all an opportunity for me to rise",
      people: "Kobe Bryant",
    },
    {
      line: "The moment you give up, is the moment you let someone else win.",
      people: "Kobe Bryant",
    },
  ];
  public static lifeQuotes = [
    { line: "Get busy living or get busy dying", people: "Stephen King" },
    {
      line: "You only live once, but if you do it right, once is enough",
      people: "Mae West",
    },
    { line: "Live once, play more", people: "Luc" },
    {
      line: "Many of life???s failures are people who did not realize how close they were to success when they gave up",
      people: "Thomas A. Edison",
    },
    {
      line: "If you want to live a happy life, tie it to a goal, not to people or things",
      people: "Babe Ruth",
    },
    {
      line: "Money and success don???t change people; they merely amplify what is already there",
      people: "Will Smith",
    },
    {
      line: "Your time is limited, so don???t waste it living someone else???s life. Don't be trapped by dogma",
      people: "Steve Jobs",
    },
    {
      line: "Not how long, but how well you have lived is the main thing",
      people: "Seneca",
    },
    {
      line: "In order to write about life first you must live it.",
      people: "Ernest Hemingway",
    },
    {
      line: "The way I see it, if you want the rainbow, you gotta put up with the rain",
      people: "Dolly Parton",
    },
    {
      line: "Don???t settle for what life gives you; make life better and build something",
      people: "Ashton Kutcher",
    },
    { line: "I like criticism. It makes you strong", people: "LeBron James" },
    {
      line: "My mama always said, life is like a box of chocolates. You never know what you???re gonna get",
      people: "Forrest Gump",
    },
    {
      line: "A smile is the best makeup any girl can wear",
      people: "Marilyn Monroe",
    },
    {
      line: "Beauty begins the moment you decide to be yourself",
      people: "Coco Chanel",
    },
    {
      line: "If you wish to make an apple pie from scratch, you must first invent the universe",
      people: "Carl Sagan",
    },
    {
      line: "We are like butterflies who flutter for a day and think it is forever",
      people: "Carl Sagan",
    },
    {
      line: "There???s as many atoms in a single molecule of your DNA as there are stars in the typical galaxy. We are, each of us, a little universe",
      people: "Neil deGrasse Tyson",
    },
    {
      line: "Atoms are mainly empty space. Matter is composed chiefly of nothing",
      people: "Carl Sagan",
    },
    {
      line: "The beauty of a living thing is not the atoms that go into it, but the way those atoms are put together",
      people: "Carl Sagan",
    },
    {
      line: "The cosmos is within us. We are made of star stuff",
      people: "Carl Sagan",
    },
  ];

  public static starwarsQuotes = [
    { line: "Try not. Do or do not. There is no try", people: "Yoda" },
    { line: "Your eyes can deceive you; don???t trust them", people: "Obi-Wan" },
    { line: "Luminous beings we are, not this crude matter", people: "Yoda" },
    {
      line: "Who???s the more foolish: the fool or the fool who follows him?",
      people: "Yoda",
    },
    { line: "Your focus determines your reality", people: "Qui-Gon Jinn" },
    {
      line: "No longer certain that one ever does win a war, I am",
      people: "Yoda",
    },
    {
      line: "In a dark place we find ourselves and a little more knowledge lights our way",
      people: "Yoda",
    },
    {
      line: "Sometimes we must let go of our pride and do what is requested of us",
      people: "Anakin Skywalker",
    },
    {
      line: "We???ll always be with you. No one???s ever really gone. A thousand generations live in you now",
      people: "Luke Skywalker",
    },
    {
      line: "The ability to speak does not make you intelligent",
      people: "Qui-Gon Jinn",
    },
    {
      line: "Difficult to see; always in motion is the future",
      people: "Yoda",
    },
    {
      line: "I like firsts. Good or bad, they???re always memorable",
      people: "Ahsoka Tano",
    },
    {
      line: "Once you start down the dark path, forever will it dominate your destiny",
      people: "Yoda",
    },
    { line: "May the Force be with you", people: "Obi-Wan" },
    { line: "A long time ago in a galaxy far, far away....", people: "" },
  ];

  public static transformerQuotes = [
    {
      line: "We Can't Stand By And Watch The Destruction Of This Beautiful Planet",
      people: "",
    },
    { line: "Freedom Is The Right Of All Sentient Beings", people: "" },
    {
      line: "Fate Rarely Calls Upon Us At A Moment Of Our Choosing",
      people: "",
    },
    {
      line: "We???ve Witnessed Your Human Capacity For War. You Would Absolutely Bring More Harm Than Good",
      people: "",
    },
    { line: "I Will Never Stop Fighting For Our Freedom", people: "" },
    {
      line: "Remember This: You May Lose Your Faith In Us, But Never In Yourselves",
      people: "",
    },
    {
      line: "There's A Thin Line Between Being A Hero, And Being A Memory",
      people: "",
    },
    {
      line: "We Can Be Heroes In Our Own Lives, Every One Of Us. If We Only Have The Courage To Try",
      people: "",
    },
    { line: "One Shall Stand, One Shall Fall!", people: "" },
    { line: "Autobots, Transform And Roll Out!", people: "" },
  ];

  public static chinesePoemQuotes = [
    { line: "?????????????????????????????????", people: "" },
    { line: "?????????????????????????????????????????????", people: "" },
    { line: "?????????????????????????????????????????????", people: "" },
    { line: "?????????????????????????????????", people: "" },
    { line: "?????????????????????????????????", people: "" },
    { line: "?????????????????????????????????", people: "" },
    { line: "?????????????????????????????????????????????", people: "" },
    { line: "?????????????????????????????????????????????", people: "" },
    { line: "?????????????????????????????????????????????", people: "" },
    {
      line: "once upon a midnight dreary, While I pondered, weak and weary",
      people: "",
    },
    {
      line: "It was many and many a year ago, In a kingdom by the sea",
      people: "",
    },
    { line: "No man is an island, Entire of itself", people: "" },
    {
      line: "Because I could not stop for Death, He kindly stopped for me",
      people: "",
    },
    {
      line: "I wandered lonely as a cloud that floats on high o'er vales and hills",
      people: "",
    },
    {
      line: "Hope is the thing with feathers that perches in the soul",
      people: "",
    },
    {
      line: "The sea is calm tonight, the tide is full, the moon lies fair",
      people: "",
    },
  ];
}
