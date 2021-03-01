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
    name: "Password Reset",
    url: "/theme/colors",
    icon: "icon-drop",
  },
  {
    name: "Credit Balance",
    url: "/theme/typography",
    icon: "icon-pencil",
  },
  {
    name: "Attendance History",
    url: "/theme/typography",
    icon: "icon-pencil",
  },
  {
    name: "Family Members",
    url: "/theme/typography",
    icon: "icon-pencil",
  },

  //For Admin
  {
    divider: true,
  },
  {
    title: true,
    name: 'Components'
    name: "Admin Only",
  },
  {
    name: "Users",
    url: "/theme/colors",
    icon: "icon-drop",
  },
  {
    name: "Bookings",
    url: "/theme/typography",
    icon: "icon-pencil",
  },

  {
    name: "Reports",
    url: "/base",
    icon: "icon-puzzle",
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
  {
    name: "Download CoreUI",
    url: "http://coreui.io/angular/",
    icon: "icon-cloud-download",
    class: "mt-auto",
    variant: "success",
    attributes: { target: "_blank", rel: "noopener" },
  },
];
