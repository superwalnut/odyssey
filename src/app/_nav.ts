import { INavData } from "@coreui/angular";

export const navItems: INavData[] = [
  {
    name: "Dashboard",
    url: "/dashboard",
    icon: "icon-speedometer",
    badge: {
      variant: "info",
      text: "NEW",
    },
  },
  //For Casuals
  {
    title: true,
    name: "Account",
  },
  {
    name: "Profile",
    url: "/settings/profile",
    icon: "icon-user",
  },
  {
    name: "Password",
    url: "/settings/password",
    icon: "icon-pencil",
  },
  {
    name: "Credit Statement",
    url: "/theme/typography",
    icon: "cil-dollar",
  },
  {
    name: "Attendance History",
    url: "/theme/typography",
    icon: "cil-check",
  },
  {
    name: "Family Members",
    url: "/settings/family",
    icon: "icon-people",
  },

  //For Admin
  {
    divider: true,
  },
  {
    title: true,
    //name: 'Components'，
    name: "Admin Only",
  },
  {
    name: "Users",
    url: "/admin/users",
    icon: "cil-group",
  },
  {
    name: "Bookings",
    url: "/theme/typography",
    icon: "cil-notes",
  },

  {
    name: "Reports",
    url: "/base",
    icon: "cil-chart",
    children: [
      {
        name: "Income",
        url: "/base/cards",
        icon: "icon-puzzle",
      },
      {
        name: "Attendance",
        url: "/base/cards",
        icon: "icon-puzzle",
      },
    ],
  },

  {
    divider: true,
  },
  {
    title: true,
    name: "Extras",
  },
  {
    name: "Pages",
    url: "/pages",
    icon: "icon-star",
    children: [
      {
        name: "Login",
        url: "/login",
        icon: "icon-star",
      },
      {
        name: "Register",
        url: "/register",
        icon: "icon-star",
      },
      {
        name: "Error 404",
        url: "/404",
        icon: "icon-star",
      },
      {
        name: "Error 500",
        url: "/500",
        icon: "icon-star",
      },
    ],
  },
  {
    name: "Disabled",
    url: "/dashboard",
    icon: "icon-ban",
    badge: {
      variant: "secondary",
      text: "NEW",
    },
    attributes: { disabled: true },
  },
];
